import "server-only";
import { getStore } from "@netlify/blobs";

const STORE = "product-images";

// On Netlify (prod + `netlify dev`) getStore(name) works with no creds. From a plain Node
// script (the migration) it needs the site id + a personal access token.
export function imageStore() {
  const siteID = process.env.NETLIFY_SITE_ID;
  const token = process.env.NETLIFY_AUTH_TOKEN;
  return siteID && token ? getStore({ name: STORE, siteID, token }) : getStore(STORE);
}

const safe = (s: string) => s.replace(/[^a-zA-Z0-9._-]/g, "_");

// Store bytes; return the same-origin path stored as image_url and served by the /img route.
export async function saveImage(filename: string, data: ArrayBuffer, contentType: string): Promise<string> {
  const key = `${Date.now()}-${safe(filename)}`;
  await imageStore().set(key, data, { metadata: { contentType } });
  return `/img/${key}`;
}
