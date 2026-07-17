"use server";

import { readFile } from "node:fs/promises";
import path from "node:path";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth";
import { env } from "@/lib/env";

const inputSchema = z.object({
  theme: z.string().trim().min(3, "Popiš téma události (aspoň pár slov).").max(600),
  format: z.enum(["post", "story"]),
});

export type GenerateBackgroundResult =
  | { ok: true; image: string }
  | { ok: false; error: string };

// Fixní stylový blok — popisuje kreslený „storybook" styl referenčních plakátů.
// Téma události se doplňuje na konec; reference se posílají jako obrázky.
const STYLE_PROMPT = `You are given reference poster illustrations from a Czech animal sanctuary ("Nech mě růst"). Create ONE new vertical background illustration in EXACTLY the same hand-drawn storybook style as the references: dense pen-and-ink linework with a warm watercolor wash, sepia + moss-green + terracotta palette, golden late-summer light, aged-paper texture, a whimsical countryside meadow sanctuary with trees, wildflowers and happy farm animals (spotted pigs, cow, big black dog, sheep, owl, chickens), a small smiling sun in the sky.

CRITICAL RULES:
- Absolutely NO text, NO letters, NO words, NO numbers and NO writing of any kind anywhere in the image (no signs with writing, no banners with words). Blank wooden signs or blank ribbons are fine.
- Composition must leave calmer, less busy areas near the top centre and in the lower third, where text panels will be overlaid later.
- Keep the drawing style, colours and mood of the references exactly; only the depicted activity changes.

The illustration must depict this specific event theme (written in Czech): `;

/**
 * Vygeneruje ilustrované pozadí pozvánky přes Gemini API (obrazový model).
 * Vrací data URL (base64) — nic se neukládá, stažení řeší klient.
 */
export async function generateBackground(raw: unknown): Promise<GenerateBackgroundResult> {
  await requireAdmin();

  const parsed = inputSchema.safeParse(raw);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Neplatný vstup." };
  }
  const { theme, format } = parsed.data;

  let apiKey: string, model: string;
  try {
    ({ apiKey, model } = env.gemini());
  } catch {
    return { ok: false, error: "Chybí GEMINI_API_KEY — přidej ho do proměnných prostředí (Vercel → Settings → Environment Variables)." };
  }

  let refs: Buffer[];
  try {
    refs = await Promise.all(
      ["ref-loukada.jpg", "ref-udalosti.jpg"].map((f) =>
        readFile(path.join(process.cwd(), "data", "pozvanky", f)),
      ),
    );
  } catch {
    return { ok: false, error: "Referenční plakáty (data/pozvanky) se nepodařilo načíst." };
  }

  const body = {
    contents: [
      {
        parts: [
          ...refs.map((b) => ({
            inlineData: { mimeType: "image/jpeg", data: b.toString("base64") },
          })),
          { text: STYLE_PROMPT + theme },
        ],
      },
    ],
    generationConfig: {
      responseModalities: ["TEXT", "IMAGE"],
      imageConfig: { aspectRatio: format === "post" ? "4:5" : "9:16" },
    },
  };

  let res: Response;
  try {
    res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
      {
        method: "POST",
        headers: { "x-goog-api-key": apiKey, "Content-Type": "application/json" },
        body: JSON.stringify(body),
        signal: AbortSignal.timeout(55_000),
      },
    );
  } catch (e) {
    const timeout = e instanceof Error && e.name === "TimeoutError";
    return {
      ok: false,
      error: timeout
        ? "Generování trvalo příliš dlouho — zkus to znovu."
        : "Nepodařilo se spojit s Gemini API — zkus to znovu.",
    };
  }

  if (!res.ok) {
    if (res.status === 429) {
      return { ok: false, error: "Vyčerpaný limit Gemini API (free tier) — zkus to za chvíli, nebo zítra." };
    }
    if (res.status === 400 || res.status === 401 || res.status === 403) {
      return { ok: false, error: `Gemini API odmítlo požadavek (HTTP ${res.status}) — zkontroluj GEMINI_API_KEY a model „${model}".` };
    }
    return { ok: false, error: `Gemini API vrátilo chybu (HTTP ${res.status}) — zkus to znovu.` };
  }

  type GeminiResponse = {
    candidates?: Array<{
      content?: { parts?: Array<{ inlineData?: { mimeType?: string; data?: string }; text?: string }> };
      finishReason?: string;
    }>;
    promptFeedback?: { blockReason?: string };
  };

  let json: GeminiResponse;
  try {
    json = (await res.json()) as GeminiResponse;
  } catch {
    return { ok: false, error: "Nečitelná odpověď Gemini API." };
  }

  if (json.promptFeedback?.blockReason) {
    return { ok: false, error: `Gemini požadavek zablokovalo (${json.promptFeedback.blockReason}) — zkus téma přeformulovat.` };
  }

  const parts = json.candidates?.[0]?.content?.parts ?? [];
  const imagePart = parts.find((p) => p.inlineData?.data);
  if (!imagePart?.inlineData?.data) {
    const text = parts.find((p) => p.text)?.text?.slice(0, 200);
    return {
      ok: false,
      error: text
        ? `Model nevrátil obrázek: „${text}"`
        : "Model nevrátil obrázek — zkus to znovu nebo uprav téma.",
    };
  }

  const mime = imagePart.inlineData.mimeType || "image/png";
  return { ok: true, image: `data:${mime};base64,${imagePart.inlineData.data}` };
}
