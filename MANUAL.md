# 📖 Manuál k webu nechmerust.org

Návod pro každého, kdo má za úkol **upravit texty, fotky nebo jiný obsah webu** — a nemusí být programátor. Postupujte krok za krokem, nic se nemůže pokazit nenávratně (každá změna se dá vrátit).

> Technický přehled webu (pro programátory) je v souboru [README.md](README.md).

---

## Obsah

1. [Jak celý web funguje](#1-jak-celý-web-funguje)
2. [Zlaté pravidlo: `main` = ostrý web](#2-zlaté-pravidlo-main--ostrý-web)
3. [Co budete potřebovat](#3-co-budete-potřebovat)
4. [Základní postup: úprava textu (tužtička)](#4-základní-postup-úprava-textu-tužtička)
5. [Co se stane po uložení](#5-co-se-stane-po-uložení)
6. [Mapa webu — kde co najdu](#6-mapa-webu--kde-co-najdu)
7. [Pravidla bezpečné úpravy — co je text a co kód](#7-pravidla-bezpečné-úpravy--co-je-text-a-co-kód)
8. [Kuchařka — hotové postupy](#8-kuchařka--hotové-postupy)
9. [Když se něco pokazí](#9-když-se-něco-pokazí)
10. [Čeho se nedotýkat](#10-čeho-se-nedotýkat)
11. [Jak dát dalším lidem možnost upravovat web](#11-jak-dát-dalším-lidem-možnost-upravovat-web)
12. [Slovníček pojmů](#12-slovníček-pojmů)

---

## 1. Jak celý web funguje

Web **nechmerust.org** se skládá ze tří částí, které do sebe zapadají:

```
  GitHub (tento repozitář)  ──►  Vercel (hosting)  ──►  nechmerust.org
  „šuplík se soubory webu“      „stroj, co web staví     „co vidí návštěvníci“
                                 a provozuje“
```

1. **GitHub** — tady jste teď. Je to úložiště všech souborů webu (textů, fotek, kódu). Když tu něco změníte a uložíte, GitHub si změnu zapamatuje včetně toho, kdo ji udělal a kdy — a všechno se dá kdykoli vrátit zpět.
2. **Vercel** — služba, která si každé uložení na GitHubu sama všimne, web z aktuálních souborů znovu „postaví“ a nasadí. Nemusíte dělat vůbec nic — žádné nahrávání přes FTP, žádné tlačítko „publikovat“.
3. **nechmerust.org** — doména je vedená u Forpsi a míří na Vercel. Návštěvníci vždy vidí poslední úspěšně postavenou verzi.

Mimo GitHub stojí dvě věci:

- **E-shop (obchůdek)** — produkty, ceny, sklad a objednávky **nejsou v souborech na GitHubu**, ale v databázi. Upravují se v administraci na adrese `nechmerust.org/admin` (přihlašovací údaje má správce webu). Fotky produktů se nahrávají tamtéž.
- **Hra Louka Run** — má vlastní repozitář (`TGeeeeq/loukarun`) a sem se jen kopíruje. Soubory hry na tomto GitHubu **neupravujte** (viz [kapitola 10](#10-čeho-se-nedotýkat)).

## 2. Zlaté pravidlo: `main` = ostrý web

Repozitář má hlavní „větev“ (branch) jménem **`main`**. Platí:

> **Cokoli uložíte do větve `main`, je zhruba do 2 minut vidět na nechmerust.org.**

Žádné mezikroky, žádné schvalování. To je pohodlné, ale znamená to: **před uložením si změnu po sobě přečtěte.** Pokud si nejste jistí, použijte bezpečnější cestu přes „návrh změny“ (pull request) — popsanou v [kapitole 11](#11-jak-dát-dalším-lidem-možnost-upravovat-web), funguje i pro vás.

## 3. Co budete potřebovat

- **Účet na GitHubu** — zdarma na [github.com/signup](https://github.com/signup). Stačí e-mail.
- **Oprávnění k úpravám** — buď vás správce přidal jako spolupracovníka (pak upravujete přímo), nebo úpravy navrhujete ze svého účtu (viz kapitola 11). Repozitář je veřejný, takže **prohlížet** ho může kdokoli i bez účtu.
- Nic dalšího. Vše jde udělat v internetovém prohlížeči, i na mobilu (na počítači je to pohodlnější).

## 4. Základní postup: úprava textu (tužtička)

Ukážeme si to na úpravě textu — postup je stejný pro jakýkoli soubor.

1. **Otevřete správný soubor.** Na stránce repozitáře (github.com/TGeeeeq/NMRStranky1.0) se proklikejte složkami k souboru — který soubor patří ke které stránce webu, najdete v [mapě webu](#6-mapa-webu--kde-co-najdu). Např. domovská stránka = složka `web`, pak `app`, pak soubor `page.tsx`.
2. **Klikněte na tužtičku** ✏️ — ikona vpravo nahoře nad obsahem souboru (po najetí ukáže „Edit this file“). Soubor se otevře v editoru přímo v prohlížeči.
3. **Upravte text.** Najděte větu, kterou chcete změnit (funguje Ctrl+F / Cmd+F), a přepište ji. Držte se [pravidel z kapitoly 7](#7-pravidla-bezpečné-úpravy--co-je-text-a-co-kód) — měňte jen text, ne značky okolo.
4. **Klikněte na zelené tlačítko „Commit changes...“** vpravo nahoře.
5. **Vyplňte okno, které vyskočí:**
   - Do pole **„Commit message“** napište stručně, co jste změnili — česky, např. `Oprava textu na domovské stránce`. Podle toho se pak ve výpisu změn pozná, co se kdy dělo.
   - Nechte vybranou volbu **„Commit directly to the `main` branch“** (změna půjde rovnou na web) — nebo zvolte druhou volbu „Create a new branch…“, pokud chcete změnu nejdřív nechat zkontrolovat (viz kapitola 11).
6. **Klikněte na „Commit changes“.** Hotovo — uloženo. Co se děje dál, popisuje další kapitola.

## 5. Co se stane po uložení

1. Vercel si změny všimne během pár sekund a začne web stavět.
2. Stavba trvá **zhruba 1–3 minuty**.
3. Pak je nová verze živá na **nechmerust.org**. Otevřete stránku a zkontrolujte výsledek (pokud vidíte starou verzi, obnovte stránku, případně vydržte minutku).

Kdyby změna obsahovala chybu, kvůli které web nejde postavit (třeba omylem smazaná závorka), **web nespadne** — Vercel prostě nechá běžet předchozí funkční verzi a novou nenasadí. Na stránce pak změnu neuvidíte; co s tím, popisuje [kapitola 9](#9-když-se-něco-pokazí).

## 6. Mapa webu — kde co najdu

Všechny soubory webu jsou ve složce `web/`. Texty stránek jsou psané česky přímo v souborech — najdete je snadno přes Ctrl+F.

| Co chci upravit | Adresa na webu | Soubor v repozitáři |
|---|---|---|
| **Domovská stránka** | nechmerust.org | `web/app/page.tsx` |
| **O nás** | /o-nas | `web/app/o-nas/page.tsx` |
| **Jak se zapojit** | /jak-se-zapojit | `web/app/jak-se-zapojit/page.tsx` |
| **Novinky** (články) | /novinky | `web/app/novinky/page.tsx` |
| **Zvířecí obyvatelé** (jména, popisy, fotky) | /zvireci-obyvatele | `web/lib/animals.ts` |
| **Galerie** (fotky a videa) | /galerie | `web/lib/animals.ts` |
| **Události** | /udalosti | `web/app/udalosti/page.tsx` |
| **Kontakt** (text stránky) | /kontakt | `web/app/kontakt/page.tsx` |
| **Kontaktní údaje** — e-mail, adresa, IČ, číslo účtu (propíšou se všude) | — | `web/lib/site.ts` |
| **Výroční zpráva 2025** | /vyrocni-zprava-2025 | `web/app/vyrocni-zprava-2025/page.tsx` |
| **Virtuální adopce** | /virtualni-adopce | `web/app/virtualni-adopce/page.tsx` |
| **Sbírka Seno pro Louku** (nyní skrytá) | /seno | `web/app/seno/page.tsx` + částky v `web/lib/campaign.ts` |
| **Obchodní podmínky / GDPR** | /vop, /gdpr | `web/app/vop/page.tsx`, `web/app/gdpr/page.tsx` |
| **Menu (horní navigace)** | všude | `web/lib/nav.ts` |
| **Patička** (spodní lišta) | všude | `web/components/Footer.tsx` |
| **Fotky** (všechny obrázky webu) | — | složka `web/public/assets/` |
| **E-shop** — produkty, ceny, sklad, objednávky | /obchod | ❗ **ne na GitHubu** — administrace na `nechmerust.org/admin` |

## 7. Pravidla bezpečné úpravy — co je text a co kód

Soubory obsahují směs textu (ten smíte měnit) a kódu (ten neměňte). Poznají se takto:

**✅ Toto je text — klidně přepište:**

- Věty **mezi značkami** `>` a `<`:
  ```
  <p>Na Louce žijí zvířata, která jsme přijali do péče…</p>
     └──────────── tohle můžete přepsat ────────────┘
  ```
- Věty **v uvozovkách** za dvojtečkou:
  ```
  title: "Péče o zvířata",
  text: "Poskytování bezpečného a láskyplného domova pro zvířata.",
         └───────────── tohle můžete přepsat ─────────────┘
  ```

**❌ Toto je kód — nechte beze změny:**

- Vše ve špičatých závorkách: `<Container>`, `<Reveal delay={0.1}>`, `className="…"`
- Názvy před dvojtečkou (`title:`, `text:`, `date:`) a řádky začínající `import` nebo `export`
- Závorky všeho druhu: `{ }`, `[ ]`, `( )` — jejich počet musí zůstat stejný
- Uvozovky `"…"` kolem textů — přepisujte jen obsah **mezi** nimi, uvozovky samotné nechte

**Další zásady:**

- **Do textu nepište rovné uvozovky `"`** — rozbily by kód. Použijte české „oblé“ uvozovky (`„takhle“`) nebo apostrof (`’`). Háčky, čárky a emoji jsou naprosto v pořádku.
- Měňte **co nejméně** — jen tu větu, o kterou jde.
- Před uložením zkontrolujte záložku **„Preview“** (nahoře v editoru) — GitHub barevně ukáže, co přesně jste změnili: červeně smazané, zeleně přidané. Když vidíte změněné jen ty řádky, které jste chtěli, je to dobře.

## 8. Kuchařka — hotové postupy

### 8.1 Změnit text na domovské stránce

1. Otevřete `web/app/page.tsx` a klikněte na tužtičku.
2. Ctrl+F → napište kousek věty, kterou chcete změnit → přepište ji.
3. „Commit changes…“ → popis → „Commit changes“. Za pár minut je změna živě.

### 8.2 Přidat novinku

1. Otevřete `web/app/novinky/page.tsx` → tužtička.
2. Najděte řádek `const articles: Article[] = [` — hned **pod něj** vložte nový článek (novinky jsou řazené od nejnovější). Použijte šablonu:

   ```
   {
     title: "Nadpis novinky",
     date: "17. 7. 2026",
     image: "/assets/nazev-fotky.webp",
     imageAlt: "Co je na fotce (popis pro nevidomé)",
     blocks: [
       { type: "p", text: "První odstavec novinky." },
       { type: "p", text: "Druhý odstavec novinky." },
     ],
   },
   ```

3. Řádky `image` a `imageAlt` můžete smazat, pokud novinka fotku nemá. Novou fotku nejdřív nahrajte podle [postupu 8.6](#86-nahrát-novou-fotku).
4. Pozor na **čárku za uzavírací závorkou** `},` — musí tam být, odděluje články.
5. Uložte přes „Commit changes…“.

### 8.3 Změnit kontaktní údaje, adresu nebo číslo účtu

1. Otevřete `web/lib/site.ts` → tužtička.
2. Přepište příslušnou hodnotu v uvozovkách (e-mail, adresa, IČ, účet…). Změna se automaticky propíše na všechna místa webu, kde se údaj zobrazuje.
3. Uložte.

### 8.4 Přidat nebo upravit zvíře

1. Otevřete `web/lib/animals.ts` → tužtička.
2. V seznamu `residents` upravte jméno/popis, nebo přidejte nový řádek podle vzoru:

   ```
   { name: "Jméno", image: "/assets/jmeno.webp", description: "Krátký popis zvířete." },
   ```

3. Fotku zvířete nejdřív nahrajte podle [postupu 8.6](#86-nahrát-novou-fotku). Ve stejném souboru níže (`galleryAnimals`) se dají přidat i fotky do Galerie.
4. Uložte.

### 8.5 Přidat nebo upravit událost

1. Otevřete `web/app/udalosti/page.tsx` → tužtička.
2. V seznamu `const events` upravte texty stávající události (název, termín v `date`, popis), nebo zkopírujte celý blok `{ … },` jedné události a upravte ho.
3. Uložte.

### 8.6 Nahrát novou fotku

1. V repozitáři se proklikejte do složky `web/public/assets`.
2. Vpravo nahoře klikněte na **„Add file“ → „Upload files“**.
3. Přetáhněte fotku do okna. **Název souboru:** malá písmena, bez diakritiky a mezer (např. `nova-ovecka.webp`).
4. Dole klikněte na **„Commit changes“**.
5. Na fotku se pak v souborech odkazuje adresou `/assets/nazev-souboru.webp` (bez `web/public`).

> 💡 Web používá úsporný formát **.webp**. Fotku z mobilu (JPG/PNG) převedete zdarma např. na [squoosh.app](https://squoosh.app) — zmenšete ji tam zároveň na šířku ~1600 px, ať se stránka rychle načítá. Obyčejné `.jpg` bude fungovat taky, jen je větší.

### 8.7 Přidat / přejmenovat položku v menu

1. Otevřete `web/lib/nav.ts` → tužtička — každá položka menu je jeden řádek (`href` = adresa, `label` = zobrazený název).
2. Uložte. (Novou **stránku** samotnou musí vytvořit programátor — tady se mění jen menu.)

### 8.8 E-shop: produkty, ceny, objednávky

E-shop se **neupravuje přes GitHub**. Přihlaste se do administrace na **nechmerust.org/admin** — tam se přidávají produkty, mění ceny, hlídá sklad a odbavují objednávky, včetně nahrávání fotek produktů.

### 8.9 Sbírka Seno pro Louku (nyní skrytá)

Stránka `/seno` je dočasně stažená z webu (přesměrovává na úvod) a odkazy na ni jsou schované. Až bude čas ji vrátit:

- **Vybraná částka** se ručně aktualizuje v `web/lib/campaign.ts` (hodnoty `raised` a `updatedAt`).
- **Návod na znovuzapnutí stránky** je napsaný přímo v souboru `web/app/seno/page.tsx` v komentáři nahoře (smazat řádek `redirect("/")` a vrátit odkazy). To už je spíš práce pro technického člověka.

## 9. Když se něco pokazí

**Změna se na webu neukázala ani po 5 minutách?** Nejspíš se web kvůli chybě nepodařilo postavit (stará verze běží dál, nic není rozbité). Typická příčina: omylem smazaná závorka, čárka nebo uvozovka.

1. Otevřete soubor, který jste měnili, a klikněte nahoře na **„History“** — uvidíte seznam všech uložení.
2. Porovnejte svou změnu (kliknutím na ni) — červené/zelené řádky ukážou, co přesně se změnilo. Většinou chybu hned uvidíte (chybějící `"`, `,` nebo `}`).
3. Chybu opravte tužtičkou a znovu uložte — Vercel to automaticky zkusí znovu.
4. Když si nevíte rady, **napište správci webu** — pošlete mu odkaz na soubor a co jste měnili. Každá změna jde vrátit, nic není ztraceno.

**Chci vrátit změnu, která se mi nelíbí:** v „History“ otevřete verzi před vaší změnou, zkopírujte původní text a tužtičkou ho vraťte. (Správce to umí i jedním kliknutím.)

## 10. Čeho se nedotýkat

Tyto věci nechte vždy na programátorovi — jejich změna může rozbít web, platby nebo hru:

- ❌ **`web/public/loukarun/`** — hra Louka Run. Kopíruje se z jiného repozitáře, ruční úpravy se při další synchronizaci přepíšou.
- ❌ **`web/app/admin/`, `web/app/obchod/`, `web/app/studio/`** — administrace, logika e-shopu a interní nástroje.
- ❌ **`web/lib/`** kromě tří souborů, které upravovat smíte: `site.ts` (kontakty), `animals.ts` (zvířata), `nav.ts` (menu), příp. `campaign.ts` (sbírka).
- ❌ Soubory **`package.json`, `package-lock.json`**, složky `web/drizzle/`, `web/tests/`, `web/scripts/` a všechny soubory s koncovkou `.config.*`.
- ❌ Soubory `CLAUDE.md`, `AGENTS.md` (pokyny pro AI asistenta) a staré skripty v kořenu repozitáře (`build.py`, `deploy.sh`, …) — jsou to pozůstatky z dřívějška.
- ❌ Nikdy do souborů nevkládejte **hesla ani přihlašovací údaje** — repozitář je veřejně čitelný.

## 11. Jak dát dalším lidem možnost upravovat web

Tři cesty, od nejbezpečnější po nejpřímější. **Nikdy nikomu nedávejte heslo ke svému GitHub účtu** — není to potřeba ani v jedné z nich.

### Cesta A — návrhy změn (fork + pull request) · ✅ doporučeno pro většinu lidí

Repozitář je veřejný, takže **kdokoli s vlastním (i čerstvě založeným) GitHub účtem** může navrhnout změnu, aniž byste mu dávali jakýkoli přístup. Vy každou změnu před zveřejněním schválíte.

**Postup pro toho, kdo upravuje** (pošlete mu tenhle odstavec + odkaz na repozitář):

1. Založte si účet na github.com a přihlaste se.
2. Otevřete soubor podle [mapy webu](#6-mapa-webu--kde-co-najdu) a klikněte na tužtičku ✏️. GitHub automaticky nabídne vytvoření vlastní kopie („fork“) — potvrďte zeleným tlačítkem **„Fork this repository“**.
3. Upravte text a klikněte na **„Commit changes…“** → popište změnu → potvrďte.
4. Na další obrazovce klikněte na zelené **„Create pull request“** — tím změnu odešlete majiteli ke schválení. Hotovo.

**Postup pro vás (majitele):**

1. Přijde vám e-mail / na GitHubu v záložce **„Pull requests“** přibude návrh.
2. Otevřete ho a v záložce **„Files changed“** zkontrolujte červeno-zelený rozdíl. Vercel k návrhu automaticky přidá i **náhledovou adresu** (komentář „Preview“), kde změnu uvidíte živě na zkušební verzi webu — ostrý web zatím beze změny.
3. Je to v pořádku? Klikněte **„Merge pull request“ → „Confirm merge“** — a změna jde na ostrý web. Není? Napište komentář nebo návrh zavřete („Close“).

*Výhody:* nikdo nemá přímý přístup, vše schvalujete, u každé změny je náhled předem. *Nevýhoda:* každá změna čeká na vaše kliknutí.

### Cesta B — spolupracovník (collaborator) · pro 1–2 nejdůvěryhodnější lidi

Můžete konkrétnímu člověku dát právo upravovat **jen tento repozitář** (ne váš účet, ne ostatní repozitáře, ne nastavení domény):

1. Na stránce repozitáře: **Settings → Collaborators → Add people** → zadejte jeho GitHub jméno → **Add**.
2. Dotyčný potvrdí pozvánku z e-mailu a od té chvíle může upravovat rovnou tužtičkou podle [kapitoly 4](#4-základní-postup-úprava-textu-tužtička) — bez schvalování, změny jdou hned na web.

*Výhoda:* nejrychlejší úpravy. *Nevýhoda:* dotyčný může (i omylem) změnit cokoli — dávejte jen lidem, kterým věříte, a ideálně zkombinujte s cestou C. Odebrání přístupu: tamtéž, tlačítko „Remove“.

### Cesta C — pojistka na `main` (branch protection) · doporučený doplněk

Pokud přidáte spolupracovníky, můžete si zapnout pojistku, že **ani oni nemůžou ukládat rovnou na ostrý web** — každá změna musí projít schválením jako v cestě A:

1. **Settings → Branches → Add branch ruleset** (nebo „Add rule“), jméno větve: `main`.
2. Zaškrtněte **„Require a pull request before merging“** a uložte.

Od té chvíle GitHub každému (volitelně i vám) při ukládání sám nabídne vytvoření návrhu ke schválení místo přímého zápisu.

### Shrnutí — co komu dát

| Situace | Doporučení |
|---|---|
| Kamarád/dobrovolník má jednorázově opravit text | **Cesta A** — jen mu pošlete odkaz na repozitář a tento manuál |
| Kolega bude web upravovat pravidelně | **Cesta B + C** — spolupracovník, ale změny přes schvalované návrhy |
| Někdo má spravovat e-shop | GitHub vůbec nepotřebuje — založte mu účet v administraci `nechmerust.org/admin` |
| Hodně netechnických redaktorů | zvládnou cestu A s tímto manuálem; kdyby to bylo těžkopádné, nechte si od programátora připojit redakční systém (CMS) — větší zásah, ale úpravy pak vypadají jako ve Wordu |

## 12. Slovníček pojmů

| Pojem | Co to znamená |
|---|---|
| **Repozitář (repo)** | Složka se všemi soubory webu + pamětí všech změn. Tenhle web = repozitář `TGeeeeq/NMRStranky1.0`. |
| **Commit** | Jedno „uložení“ změn s popiskem. Skládá se z nich historie webu. |
| **Branch (větev)** | Pojmenovaná linie změn. `main` je ta hlavní — z ní se staví ostrý web. |
| **Pull request (PR)** | Návrh změny čekající na schválení. Po schválení („merge“) se přelije do `main`. |
| **Fork** | Vlastní kopie cizího repozitáře na vašem účtu — z ní se posílají pull requesty. |
| **Build / deploy** | „Postavení“ webu ze souborů a jeho nasazení na internet. Dělá automaticky Vercel po každém commitu. |
| **Vercel** | Hostingová služba, na které web běží. |
| **Merge** | Schválení a začlenění pull requestu — změna tím jde na ostrý web. |
