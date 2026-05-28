-- =====================================================================
-- Seed produktů pro eshop Nech mě růst
--
-- 31 produktů s vazbou na obrázky v /www/images/products/.
-- Všechno se zakládá jako DRAFT:
--     is_active = 0       -> produkt se NEZOBRAZÍ v /obchod/
--     price = 0.00        -> doplňte v /admin/products.php
--     description = ''    -> doplňte v /admin/products.php
--     stock_quantity = 0  -> doplňte v /admin/products.php
--
-- POSTUP:
--   1. Spusťte tento soubor v phpMyAdmin (Forpsi -> DB -> Import).
--      INSERT IGNORE -> opakované spuštění je bezpečné, duplicitní
--      slugy se přeskočí, takže nic nepřepíšete.
--   2. Otevřete /admin/products.php a u každého produktu vyplňte
--      cenu, popis, sklad a (u Koloděje/Královna/Lišák) kategorii.
--   3. Stiskněte "Zveřejnit" -> is_active přepne na 1 a produkt se
--      objeví v /obchod/.
--
-- Kategorie se hledá podselectem podle slugu, takže nevadí, když se
-- ID kategorií v 01-create-tables.sql v budoucnu změní.
-- =====================================================================

-- --- Textil --------------------------------------------------------
INSERT IGNORE INTO products
    (name, slug, description, price, stock_quantity, image_url, category_id, is_active)
VALUES
    ('Batoh',        'batoh',        '', 0.00, 0,
     '/images/products/batoh.webp',
     (SELECT id FROM categories WHERE slug='textil'), 0),
    ('Taška Karel',  'taska-karel',  '', 0.00, 0,
     '/images/products/taska-karel.webp',
     (SELECT id FROM categories WHERE slug='textil'), 0);

-- --- Šperky --------------------------------------------------------
INSERT IGNORE INTO products
    (name, slug, description, price, stock_quantity, image_url, category_id, is_active)
VALUES
    ('Náramek',  'naramek',  '', 0.00, 0,
     '/images/products/naramek.webp',
     (SELECT id FROM categories WHERE slug='sperky'), 0),
    ('Náušnice', 'nausnice', '', 0.00, 0,
     '/images/products/nausnice.webp',
     (SELECT id FROM categories WHERE slug='sperky'), 0);

INSERT IGNORE INTO products
    (name, slug, description, price, stock_quantity, image_url, category_id, is_active)
VALUES
    ('Přívěšek #1', 'privesek-1', '', 0.00, 0,
     '/images/products/privesek1.webp',
     (SELECT id FROM categories WHERE slug='sperky'), 0),
    ('Přívěšek #2', 'privesek-2', '', 0.00, 0,
     '/images/products/privesek2.webp',
     (SELECT id FROM categories WHERE slug='sperky'), 0),
    ('Přívěšek #3', 'privesek-3', '', 0.00, 0,
     '/images/products/privesek3.webp',
     (SELECT id FROM categories WHERE slug='sperky'), 0),
    ('Přívěšek #4', 'privesek-4', '', 0.00, 0,
     '/images/products/privesek4.webp',
     (SELECT id FROM categories WHERE slug='sperky'), 0),
    ('Přívěšek #5', 'privesek-5', '', 0.00, 0,
     '/images/products/privesek5.webp',
     (SELECT id FROM categories WHERE slug='sperky'), 0),
    ('Přívěšek #6', 'privesek-6', '', 0.00, 0,
     '/images/products/privesek6.webp',
     (SELECT id FROM categories WHERE slug='sperky'), 0),
    ('Přívěšek #7', 'privesek-7', '', 0.00, 0,
     '/images/products/privesek7.webp',
     (SELECT id FROM categories WHERE slug='sperky'), 0),
    ('Přívěšek #8', 'privesek-8', '', 0.00, 0,
     '/images/products/privesek8.webp',
     (SELECT id FROM categories WHERE slug='sperky'), 0),
    ('Přívěšek #9', 'privesek-9', '', 0.00, 0,
     '/images/products/privesek9.webp',
     (SELECT id FROM categories WHERE slug='sperky'), 0);

-- --- Plakáty -------------------------------------------------------
INSERT IGNORE INTO products
    (name, slug, description, price, stock_quantity, image_url, category_id, is_active)
VALUES
    ('Plakát #1', 'plakat-1', '', 0.00, 0,
     '/images/products/plakat1.webp',
     (SELECT id FROM categories WHERE slug='plakaty'), 0),
    ('Plakát #2', 'plakat-2', '', 0.00, 0,
     '/images/products/plakat2.webp',
     (SELECT id FROM categories WHERE slug='plakaty'), 0),
    ('Plakát #3', 'plakat-3', '', 0.00, 0,
     '/images/products/plakat3.webp',
     (SELECT id FROM categories WHERE slug='plakaty'), 0),
    ('Plakát #4', 'plakat-4', '', 0.00, 0,
     '/images/products/plakat4.webp',
     (SELECT id FROM categories WHERE slug='plakaty'), 0),
    ('Plakát #5', 'plakat-5', '', 0.00, 0,
     '/images/products/plakat5.webp',
     (SELECT id FROM categories WHERE slug='plakaty'), 0),
    ('Plakát #6', 'plakat-6', '', 0.00, 0,
     '/images/products/plakat6.webp',
     (SELECT id FROM categories WHERE slug='plakaty'), 0),
    ('Plakát #7', 'plakat-7', '', 0.00, 0,
     '/images/products/plakat7.webp',
     (SELECT id FROM categories WHERE slug='plakaty'), 0),
    ('Plakát #8', 'plakat-8', '', 0.00, 0,
     '/images/products/plakat8.webp',
     (SELECT id FROM categories WHERE slug='plakaty'), 0);

-- --- Dřevovýroba ---------------------------------------------------
INSERT IGNORE INTO products
    (name, slug, description, price, stock_quantity, image_url, category_id, is_active)
VALUES
    ('Věšák — bříza',   'vesak-briza',   '', 0.00, 0,
     '/images/products/vesak-briza.webp',
     (SELECT id FROM categories WHERE slug='drevovyroba'), 0),
    ('Věšák — světlý',  'vesak-svetly',  '', 0.00, 0,
     '/images/products/vesak-svetly.webp',
     (SELECT id FROM categories WHERE slug='drevovyroba'), 0),
    ('Věšák — tmavý',   'vesak-tmavy',   '', 0.00, 0,
     '/images/products/vesak-tmavy.webp',
     (SELECT id FROM categories WHERE slug='drevovyroba'), 0);

-- --- Bylinkárna ----------------------------------------------------
INSERT IGNORE INTO products
    (name, slug, description, price, stock_quantity, image_url, category_id, is_active)
VALUES
    ('Řebříčková mast', 'rebrickova-mast', '', 0.00, 0,
     '/images/products/rebrickova-mast.webp',
     (SELECT id FROM categories WHERE slug='bylinkarna'), 0),
    ('Gomasio',         'gomasio',         '', 0.00, 0,
     '/images/products/gomasio.webp',
     (SELECT id FROM categories WHERE slug='bylinkarna'), 0);

-- --- Bez kategorie (doplníte v adminu) -----------------------------
-- "Koloděje" / "Královna" / "Lišák" -- nejisté zařazení; necháváme
-- category_id = NULL a vy je v admin panelu zvolíte z dropdownu.
INSERT IGNORE INTO products
    (name, slug, description, price, stock_quantity, image_url, category_id, is_active)
VALUES
    ('Koloděje #1', 'kolodeje-1', '', 0.00, 0,
     '/images/products/kolodejove.webp',  NULL, 0),
    ('Koloděje #2', 'kolodeje-2', '', 0.00, 0,
     '/images/products/kolodejove2.webp', NULL, 0),
    ('Koloděje #3', 'kolodeje-3', '', 0.00, 0,
     '/images/products/kolodejove3.webp', NULL, 0),
    ('Královna',    'kralovna',   '', 0.00, 0,
     '/images/products/kralovna.webp',    NULL, 0),
    ('Lišák',       'lisak',      '', 0.00, 0,
     '/images/products/lisak.webp',       NULL, 0);

-- =====================================================================
-- HOTOVO. 31 produktů jako drafty. Doplňte data v /admin/products.php
-- a stiskněte "Zveřejnit".
-- =====================================================================
