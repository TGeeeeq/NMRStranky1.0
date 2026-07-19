---
name: setrny-mod
description: Šetřicí režim orchestrace — hlavní model jen napíše kompletní zadání a implementaci provede nejlevnější agent (Haiku), kontroly jen minimální. Použij, když uživatel chce šetřit kredity ("šetříme", "šetřivej/šetrný mód", "levně") nebo úkol explicitně zadá v tomto režimu.
---

# Šetrný mód (orchestrace levným modelem)

Cíl: minimum tokenů drahého modelu, kvalitní výsledek. Hlavní model NIKDY
neimplementuje sám — jen zkoumá, specifikuje, deleguje a minimálně kontroluje.

## Postup

1. **Průzkum (hlavní model, levně):** Grep/Read jen souborů, kterých se úkol
   týká. Žádné průzkumné agenty navíc.
2. **Kompletní zadání:** Napiš pro agenta zadání tak přesné, že ho nelze
   zkazit — seznam souborů (absolutní cesty), očíslované edity, u záludných
   míst rovnou hotové úryvky kódu (přesné className, CSS, typy), texty
   v češtině doslova. Přidej pravidla: „needituj nic jiného, nespouštěj
   příkazy, necommituj, žádné nové závislosti, zachovej formátování a české
   komentáře" a na závěr chtěj krátké shrnutí editů.
3. **Delegace:** Jeden agent přes Agent tool s `model: "haiku"`,
   `run_in_background: false`. Neposílej víc agentů na jeden úkol, žádné
   review/verify agenty.
4. **Minimální kontrola (hlavní model):** projdi `git diff`, případný grep na
   zapomenuté reference a `npx tsc --noEmit` ve `web/`. Lint, testy, build ani
   /verify NEspouštěj, pokud si je uživatel výslovně nevyžádá. Drobné opravy
   (1–2 řádky) udělej sám, neposílej je zpět agentovi.
5. **Doručení:** commit + push podle git workflow v CLAUDE.md (vše končí
   v `main`). Stručné česky psané shrnutí uživateli.

## Kdy delegaci přeskočit

Je-li změna menší než samotné zadání (pár řádků, jeden soubor), udělej ji
rovnou sám — delegace by byla dražší. Cíl je nejnižší celková útrata, ne
delegace za každou cenu.
