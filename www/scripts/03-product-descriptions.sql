-- =====================================================================
-- Nech mě růst – popisky výrobků + odkazy na výrobce
-- Spustit v phpMyAdmin (Forpsi) v databázi e-shopu.
-- Bezpečné: UPDATE podle id, lze spustit opakovaně.
--
-- Odkazy se vkládají přímo do popisu jako <a href> – na DETAILU produktu
-- jsou klikací, na KARTĚ v seznamu se díky úpravě shop.js zobrazí jen text.
--
-- Výrobci:
--   @marie.justic = Markéta Kvizdalská (tašky, batoh, váček)
--   @zuzozanova   = Zuzana Ožanová     (plakáty / obrázky)
--   Kolodějové    = kolodejove.cz      (ilustrace, „tři díly")
-- =====================================================================

SET NAMES utf8mb4;

-- ---------------------------------------------------------------------
-- Textil – Markéta Kvizdalská (@marie.justic)
-- ---------------------------------------------------------------------
UPDATE products SET description =
'Ručně malovaný plátěný batoh – originální kousek od výtvarnice Markéty Kvizdalské. Každý motiv vzniká ručně, takže žádné dva nejsou úplně stejné.<br>Vyrobila: <a href="https://www.instagram.com/marie.justic/" target="_blank" rel="noopener">@marie.justic</a>'
WHERE id = 5;   -- Batoh

UPDATE products SET description =
'Plátěná taška „Karel" s originálním ručně malovaným motivem od výtvarnice Markéty Kvizdalské.<br>Vyrobila: <a href="https://www.instagram.com/marie.justic/" target="_blank" rel="noopener">@marie.justic</a>'
WHERE id = 6;   -- Taška Karel

UPDATE products SET description =
'Plátěná taška „Královna" s originálním ručně malovaným motivem od výtvarnice Markéty Kvizdalské.<br>Vyrobila: <a href="https://www.instagram.com/marie.justic/" target="_blank" rel="noopener">@marie.justic</a>'
WHERE id = 34;  -- Taška Královna

UPDATE products SET description =
'Malý, ručně malovaný váček od výtvarnice Markéty Kvizdalské.<br>Vyrobila: <a href="https://www.instagram.com/marie.justic/" target="_blank" rel="noopener">@marie.justic</a>'
WHERE id = 35;  -- Lišák

-- ---------------------------------------------------------------------
-- Plakáty / obrázky – Zuzana Ožanová (@zuzozanova)
-- ---------------------------------------------------------------------
UPDATE products SET description =
'Autorský plakát od výtvarnice Zuzany Ožanové – výrazná barevná malba plná energie.<br>Autorka: <a href="https://www.instagram.com/zuzozanova/" target="_blank" rel="noopener">@zuzozanova</a>'
WHERE id IN (18, 19, 20, 21, 22, 23, 24, 25);  -- Plakát #1–#8

-- ---------------------------------------------------------------------
-- Kolodějové – kolodejove.cz (tři díly; #1 a #2 jsou zatím neaktivní)
-- ---------------------------------------------------------------------
UPDATE products SET description =
'Originální ilustrace od tvůrců projektu Kolodějové.<br>Více o autorech: <a href="https://kolodejove.cz" target="_blank" rel="noopener">kolodejove.cz</a>'
WHERE id IN (2, 31, 32);  -- kolodejove, Koloděje #1, Koloděje #2

-- ---------------------------------------------------------------------
-- Šperky (bez odkazu na výrobce)
-- ---------------------------------------------------------------------
UPDATE products SET description =
'Ručně vyráběný přívěsek – originální kousek, žádný není úplně stejný.'
WHERE id IN (3, 9, 12, 13, 14, 15, 16, 17);  -- Přívěsek + Přívěšek #1, #4–#9

UPDATE products SET description =
'Ručně vyráběný náramek – originální ruční práce.'
WHERE id = 7;   -- Náramek

UPDATE products SET description =
'Ručně vyráběné náušnice – originální ruční práce.'
WHERE id = 8;   -- Náušnice

-- ---------------------------------------------------------------------
-- Dřevovýroba
-- ---------------------------------------------------------------------
UPDATE products SET description =
'Ručně vyrobený dřevěný věšák – praktický originál do předsíně i dílny.'
WHERE id = 1;   -- věšák

UPDATE products SET description =
'Dřevěný věšák z březového dřeva. Ruční výroba, každý kus je originál.'
WHERE id = 26;  -- Věšák — bříza

UPDATE products SET description =
'Dřevěný věšák v tmavém provedení. Ruční výroba, každý kus je originál.'
WHERE id = 28;  -- Věšák — tmavý

-- =====================================================================
-- Kontrola výsledku
-- =====================================================================
SELECT id, name, description FROM products ORDER BY category_id, name;
