-- =====================================================================
-- Nech mě růst – e-shop schema
-- Spustit v phpMyAdmin (Forpsi) v databázi f193818.
-- Bezpečné spustit opakovaně (CREATE TABLE IF NOT EXISTS).
-- =====================================================================

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 1;

-- ---------------------------------------------------------------------
-- Adminové (přihlášení do /admin/)
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS admins (
    id              INT AUTO_INCREMENT PRIMARY KEY,
    username        VARCHAR(50)  NOT NULL UNIQUE,
    password_hash   VARCHAR(255) NOT NULL,
    email           VARCHAR(190) NOT NULL,
    created_at      TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
    last_login_at   TIMESTAMP    NULL DEFAULT NULL,
    last_login_ip   VARCHAR(45)  NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- Kategorie produktů
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS categories (
    id              INT AUTO_INCREMENT PRIMARY KEY,
    name            VARCHAR(100) NOT NULL,
    slug            VARCHAR(100) NOT NULL UNIQUE,
    description     TEXT NULL,
    display_order   INT DEFAULT 0,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- Produkty
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS products (
    id              INT AUTO_INCREMENT PRIMARY KEY,
    name            VARCHAR(200)   NOT NULL,
    slug            VARCHAR(200)   NOT NULL UNIQUE,
    description     TEXT NULL,
    price           DECIMAL(10, 2) NOT NULL,
    stock_quantity  INT DEFAULT 0,
    category_id     INT NULL,
    image_url       VARCHAR(500) NULL,
    is_active       TINYINT(1) NOT NULL DEFAULT 1,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_products_category
        FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Indexy pro výpis/filtrování
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_active   ON products(is_active);

-- ---------------------------------------------------------------------
-- Galerie produktů (více obrázků na produkt)
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS product_images (
    id              INT AUTO_INCREMENT PRIMARY KEY,
    product_id      INT NOT NULL,
    image_url       VARCHAR(500) NOT NULL,
    display_order   INT DEFAULT 0,
    CONSTRAINT fk_images_product
        FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX idx_product_images_product ON product_images(product_id);

-- ---------------------------------------------------------------------
-- Objednávky
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS orders (
    id                INT AUTO_INCREMENT PRIMARY KEY,
    order_number      VARCHAR(50)  NOT NULL UNIQUE,
    variable_symbol   VARCHAR(20)  NOT NULL,
    customer_name     VARCHAR(100) NOT NULL,
    customer_email    VARCHAR(190) NOT NULL,
    customer_phone    VARCHAR(30)  NULL,
    shipping_address  TEXT NOT NULL,
    total_amount      DECIMAL(10, 2) NOT NULL,
    status            ENUM('pending','paid','processing','shipped','completed','cancelled')
                      NOT NULL DEFAULT 'pending',
    payment_method    VARCHAR(50) NOT NULL DEFAULT 'bank_transfer',
    payment_status    ENUM('pending','completed','failed','refunded')
                      NOT NULL DEFAULT 'pending',
    notes             TEXT NULL,
    customer_ip       VARCHAR(45) NULL,
    created_at        TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at        TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX idx_orders_status  ON orders(status);
CREATE INDEX idx_orders_number  ON orders(order_number);
CREATE INDEX idx_orders_email   ON orders(customer_email);

-- ---------------------------------------------------------------------
-- Položky objednávek
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS order_items (
    id            INT AUTO_INCREMENT PRIMARY KEY,
    order_id      INT NOT NULL,
    product_id    INT NULL,
    product_name  VARCHAR(200)   NOT NULL,
    quantity      INT NOT NULL,
    unit_price    DECIMAL(10, 2) NOT NULL,
    total_price   DECIMAL(10, 2) NOT NULL,
    CONSTRAINT fk_items_order
        FOREIGN KEY (order_id)   REFERENCES orders(id)   ON DELETE CASCADE,
    CONSTRAINT fk_items_product
        FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX idx_order_items_order ON order_items(order_id);

-- ---------------------------------------------------------------------
-- Výchozí kategorie
-- (INSERT IGNORE = bezpečné spustit i opakovaně, duplicitní slugy přeskočí)
-- ---------------------------------------------------------------------
INSERT IGNORE INTO categories (name, slug, description, display_order) VALUES
    ('Dřevovýroba',             'drevovyroba',             'Ručně vyráběné dřevěné výrobky z místních zdrojů',     1),
    ('Bylinkárna',              'bylinkarna',              'Bylinkové produkty a přírodní přípravky',              2),
    ('Šperky',                  'sperky',                  'Náramky, náušnice a přívěsky',                          3),
    ('Plakáty',                 'plakaty',                 'Plakáty s motivy z Louky',                              4),
    ('Textil',                  'textil',                  'Tašky, batohy a textilní výrobky',                      5),
    ('Výrobky našich přátel',   'vyrobky-nasich-pratel',   'Produkty od místních výrobců a přátel',                 6);

-- =====================================================================
-- HOTOVO. Admin uživatel se vytvoří přes /scripts/setup-admin.php
-- (skript po dokončení smažte ze serveru).
-- =====================================================================
