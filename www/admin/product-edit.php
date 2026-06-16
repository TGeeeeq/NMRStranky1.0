<?php
/**
 * Vytvoření / úprava produktu.
 *
 * Bezpečnost:
 *   - requireAdmin()
 *   - CSRF token na POST
 *   - PDO prepared statements
 *   - Slug validace serverside (přesto co dělá JS)
 *   - Upload obrázku přes /api/admin-upload-image.php (oddělené)
 *
 * Pro načítání / mazání galerie volá:
 *   GET  /api/product-images.php?product_id=X
 *   POST /api/product-images-add.php
 *   POST /api/product-images-delete.php
 */

declare(strict_types=1);

require_once __DIR__ . '/../config.php';
requireAdmin();

$pdo     = getDbConnection();
$error   = '';
$success = '';
$product = null;

$categories = $pdo->query("SELECT id, name FROM categories ORDER BY display_order, name")->fetchAll();

// ---- načti existující produkt ----
if (isset($_GET['id'])) {
    $stmt = $pdo->prepare("SELECT * FROM products WHERE id = ?");
    $stmt->execute([(int)$_GET['id']]);
    $product = $stmt->fetch() ?: null;
    if (!$product) {
        header('Location: /admin/products.php'); exit;
    }
}

// ---- zpracování POSTu ----
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (!verify_csrf_token($_POST['csrf_token'] ?? null)) {
        $error = 'Neplatný bezpečnostní token. Načtěte stránku znovu.';
    } else {
        $name           = trim((string)($_POST['name'] ?? ''));
        $slug           = trim((string)($_POST['slug'] ?? ''));
        $description    = trim((string)($_POST['description'] ?? ''));
        $price          = (float)str_replace(',', '.', (string)($_POST['price'] ?? '0'));
        $stock_quantity = max(0, (int)($_POST['stock_quantity'] ?? 0));
        $category_id    = !empty($_POST['category_id']) ? (int)$_POST['category_id'] : null;
        $image_url      = trim((string)($_POST['image_url'] ?? ''));
        // Při vytváření nového produktu defaultujeme na publikovaný, pokud klient
        // hodnotu vůbec neposlal (curl, scripted POST, rozbitý formulář). Klasický
        // HTML formulář vždy pošle 0 nebo 1 díky hidden inputu před checkboxem.
        if ($product === null && !array_key_exists('is_active', $_POST)) {
            $is_active = 1;
        } else {
            $is_active = !empty($_POST['is_active']) ? 1 : 0;
        }

        if ($name === '' || $slug === '' || $price <= 0) {
            $error = 'Vyplňte název, slug a cenu (větší než 0).';
        } elseif (!preg_match('/^[a-z0-9-]{2,200}$/', $slug)) {
            $error = 'Slug smí obsahovat pouze a-z, 0-9 a pomlčky.';
        } elseif ($image_url !== '' && !preg_match('#^/(?:images|assets)/[\w\-./]+\.(?:jpg|jpeg|png|webp)$#i', $image_url)) {
            $error = 'URL obrázku musí být cesta v /images/ nebo /assets/ a končit .jpg/.png/.webp.';
        } else {
            try {
                if ($product) {
                    $stmt = $pdo->prepare("
                        UPDATE products
                        SET name=?, slug=?, description=?, price=?, stock_quantity=?,
                            category_id=?, image_url=?, is_active=?
                        WHERE id=?
                    ");
                    $stmt->execute([
                        $name, $slug, $description, $price, $stock_quantity,
                        $category_id, $image_url, $is_active, (int)$product['id'],
                    ]);
                    $success = 'Produkt byl úspěšně aktualizován.';
                    // refresh
                    $stmt = $pdo->prepare("SELECT * FROM products WHERE id = ?");
                    $stmt->execute([(int)$product['id']]);
                    $product = $stmt->fetch();
                } else {
                    $stmt = $pdo->prepare("
                        INSERT INTO products
                            (name, slug, description, price, stock_quantity, category_id, image_url, is_active)
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                    ");
                    $stmt->execute([$name, $slug, $description, $price, $stock_quantity, $category_id, $image_url, $is_active]);
                    $newId = (int)$pdo->lastInsertId();
                    header('Location: /admin/product-edit.php?id=' . $newId . '&created=' . $is_active);
                    exit;
                }
            } catch (PDOException $e) {
                if ($e->getCode() === '23000') {
                    $error = 'Tento slug už existuje, zvolte jiný.';
                } else {
                    error_log('[product-edit] ' . $e->getMessage());
                    $error = 'Chyba při uložení.';
                }
            }
        }
    }
}

// Kontextová flash zpráva po vytvoření – rozlišujeme publikovaný vs. skrytý.
$createdFlash = null;
if (isset($_GET['created'])) {
    $createdFlash = $_GET['created'] === '1' ? 'active' : 'hidden';
}
?>
<!DOCTYPE html>
<html lang="cs">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?= $product ? 'Upravit' : 'Přidat' ?> produkt – Administrace</title>
    <link rel="stylesheet" href="/css/admin.css">
    <style>
        .upload-zone {
            border: 2px dashed #ccc; border-radius: 8px; padding: 16px;
            text-align: center; margin: 8px 0 16px;
        }
        .upload-zone.dragover { border-color: #2a7f3e; background: #f0fbef; }
        .preview { display:flex; gap:8px; align-items:center; margin-top:8px; }
        .preview img { width: 80px; height: 80px; object-fit: cover; border-radius:6px; }
        .product-images-container { display: flex; flex-direction: column; gap: 8px; }
        .image-item { display:flex; gap:10px; align-items:center; padding:8px; background:#f5f5f5; border-radius:6px; }
        .image-item img { width: 60px; height: 60px; object-fit: cover; border-radius: 4px; }
    </style>
</head>
<body>
    <?php include 'includes/header.php'; ?>
    <div class="admin-container">
        <?php include 'includes/sidebar.php'; ?>
        <main class="admin-content">
            <div class="page-header">
                <h1><?= $product ? 'Upravit produkt' : 'Přidat produkt' ?></h1>
            </div>

            <?php if ($error): ?><div class="alert alert-error"><?= htmlspecialchars($error) ?></div><?php endif; ?>
            <?php if ($createdFlash === 'active'): ?>
                <div class="alert alert-success">
                    Produkt byl vytvořen a <strong>je viditelný v obchodě</strong>.
                    <a href="/obchod/" target="_blank" rel="noopener" style="margin-left:8px;">Otevřít obchod →</a>
                    Nyní můžete přidat další fotografie.
                </div>
            <?php elseif ($createdFlash === 'hidden'): ?>
                <div class="alert alert-warning" style="background:#fff8e1;border:1px solid #f0c040;color:#7a5b00;padding:10px 12px;border-radius:6px;">
                    Produkt byl vytvořen jako <strong>skrytý koncept</strong>. Zaškrtněte „Aktivní produkt" níže a uložte, aby se zobrazil v obchodě.
                </div>
            <?php elseif ($success): ?>
                <div class="alert alert-success"><?= htmlspecialchars($success) ?></div>
            <?php endif; ?>

            <form method="POST" class="form-horizontal" id="productForm">
                <?= csrf_field() ?>

                <div class="form-group">
                    <label for="name">Název produktu *</label>
                    <input type="text" id="name" name="name" required maxlength="200"
                           value="<?= htmlspecialchars($product['name'] ?? '') ?>">
                </div>

                <div class="form-group">
                    <label for="slug">URL slug *</label>
                    <input type="text" id="slug" name="slug" required maxlength="200"
                           pattern="[a-z0-9-]+"
                           value="<?= htmlspecialchars($product['slug'] ?? '') ?>">
                    <small>Pouze malá písmena bez diakritiky, číslice, pomlčky.</small>
                </div>

                <div class="form-group">
                    <label for="category_id">Kategorie</label>
                    <select id="category_id" name="category_id">
                        <option value="">— Bez kategorie —</option>
                        <?php foreach ($categories as $cat): ?>
                            <option value="<?= (int)$cat['id'] ?>"
                                <?= ($product['category_id'] ?? '') == $cat['id'] ? 'selected' : '' ?>>
                                <?= htmlspecialchars($cat['name']) ?>
                            </option>
                        <?php endforeach; ?>
                    </select>
                </div>

                <div class="form-group">
                    <label for="description">Popis</label>
                    <textarea id="description" name="description" rows="6"><?= htmlspecialchars($product['description'] ?? '') ?></textarea>
                </div>

                <div class="form-row">
                    <div class="form-group">
                        <label for="price">Cena (Kč) *</label>
                        <input type="number" id="price" name="price" step="1" min="1" required
                               value="<?= htmlspecialchars($product['price'] ?? '') ?>">
                    </div>
                    <div class="form-group">
                        <label for="stock_quantity">Skladem (ks)</label>
                        <input type="number" id="stock_quantity" name="stock_quantity" min="0"
                               value="<?= htmlspecialchars((string)($product['stock_quantity'] ?? 0)) ?>">
                    </div>
                </div>

                <div class="form-group">
                    <label for="image_url">Hlavní obrázek</label>
                    <input type="text" id="image_url" name="image_url"
                           placeholder="/images/products/nazev-souboru.webp"
                           value="<?= htmlspecialchars($product['image_url'] ?? '') ?>">
                    <small>Můžete vybrat existující soubor v <code>/images/products/</code> nebo nahrát nový níže.</small>
                    <div class="upload-zone" id="mainUpload">
                        <p>Přetáhněte sem obrázek nebo <label for="mainImageFile" style="color:#2a7f3e;cursor:pointer;text-decoration:underline;">vyberte soubor</label>.</p>
                        <input type="file" id="mainImageFile" accept="image/jpeg,image/png,image/webp" hidden>
                        <small>JPG, PNG nebo WebP, max 5 MB.</small>
                        <div class="preview" id="mainPreview" style="display:none;">
                            <img id="mainPreviewImg" alt="">
                            <span id="mainPreviewName"></span>
                        </div>
                    </div>
                </div>

                <?php if ($product): ?>
                <div class="form-group">
                    <label>Další fotografie produktu</label>
                    <div id="productImagesContainer" class="product-images-container">
                        <em>Načítám…</em>
                    </div>
                    <div class="upload-zone" id="extraUpload" style="margin-top:12px;">
                        <p>Nahrát další fotografii: <label for="extraImageFile" style="color:#2a7f3e;cursor:pointer;text-decoration:underline;">vybrat soubor</label></p>
                        <input type="file" id="extraImageFile" accept="image/jpeg,image/png,image/webp" hidden>
                    </div>
                </div>
                <?php endif; ?>

                <div class="form-group">
                    <!-- Hidden default zajistí, že is_active=0 dorazí, i když je checkbox odznačený. -->
                    <input type="hidden" name="is_active" value="0">
                    <label class="checkbox-label">
                        <input type="checkbox" name="is_active" value="1" <?= ($product['is_active'] ?? 1) ? 'checked' : '' ?>>
                        Aktivní produkt (zobrazit v obchodě)
                    </label>
                    <?php if ($product && empty($product['is_active'])): ?>
                        <p style="color:#c92a2a;margin:4px 0 0 24px;font-size:0.9rem;">
                            ⚠ Tento produkt se v obchodě nezobrazí, dokud nezaškrtnete „Aktivní" a neuložíte.
                        </p>
                    <?php endif; ?>
                </div>

                <div class="form-actions">
                    <button type="submit" class="btn btn-primary">
                        <?= $product ? 'Uložit změny' : 'Vytvořit produkt' ?>
                    </button>
                    <a href="/admin/products.php" class="btn btn-secondary">Zrušit</a>
                </div>
            </form>
        </main>
    </div>

    <script>
        const CSRF = <?= json_encode(csrf_token()) ?>;
        const PRODUCT_ID = <?= json_encode($product ? (int)$product['id'] : null) ?>;

        // Auto-slug z názvu (jen při vytváření)
        <?php if (!$product): ?>
        document.getElementById('name').addEventListener('input', e => {
            document.getElementById('slug').value = e.target.value
                .toLowerCase()
                .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/^-+|-+$/g, '');
        });
        <?php endif; ?>

        // ---------- upload hlavního obrázku ----------
        const mainFile  = document.getElementById('mainImageFile');
        const mainZone  = document.getElementById('mainUpload');
        const mainInput = document.getElementById('image_url');
        const mainPreview = document.getElementById('mainPreview');
        const mainPreviewImg = document.getElementById('mainPreviewImg');
        const mainPreviewName = document.getElementById('mainPreviewName');

        ['dragenter','dragover'].forEach(ev => mainZone.addEventListener(ev, e => {
            e.preventDefault(); mainZone.classList.add('dragover');
        }));
        ['dragleave','drop'].forEach(ev => mainZone.addEventListener(ev, e => {
            e.preventDefault(); mainZone.classList.remove('dragover');
        }));
        mainZone.addEventListener('drop', e => {
            const f = e.dataTransfer.files[0];
            if (f) uploadMain(f);
        });
        mainFile.addEventListener('change', e => {
            const f = e.target.files[0];
            if (f) uploadMain(f);
        });

        async function uploadMain(file) {
            const url = await uploadImage(file);
            if (url) {
                mainInput.value = url;
                mainPreviewImg.src = url;
                mainPreviewName.textContent = url;
                mainPreview.style.display = 'flex';
            }
        }

        // ---------- společný uploader ----------
        async function uploadImage(file) {
            if (file.size > 5 * 1024 * 1024) {
                alert('Soubor je větší než 5 MB.');
                return null;
            }
            const fd = new FormData();
            fd.append('csrf_token', CSRF);
            fd.append('image', file);
            try {
                const r = await fetch('/api/admin-upload-image.php', { method:'POST', body: fd });
                const data = await r.json();
                if (!data.success) {
                    alert('Chyba uploadu: ' + (data.error || 'neznámá'));
                    return null;
                }
                return data.image_url;
            } catch (e) {
                console.error(e);
                alert('Síťová chyba při uploadu.');
                return null;
            }
        }

        // ---------- správa galerie ----------
        <?php if ($product): ?>
        loadProductImages();
        document.getElementById('extraImageFile').addEventListener('change', async e => {
            const f = e.target.files[0];
            if (!f) return;
            const url = await uploadImage(f);
            if (!url) return;
            // přidat do DB
            const r = await fetch('/api/product-images-add.php', {
                method:'POST',
                headers:{'Content-Type':'application/json'},
                body: JSON.stringify({ product_id: PRODUCT_ID, image_url: url, csrf_token: CSRF })
            });
            const data = await r.json();
            if (data.success) loadProductImages();
            else alert('Chyba: ' + (data.error || ''));
        });

        async function loadProductImages() {
            const c = document.getElementById('productImagesContainer');
            try {
                const r = await fetch(`/api/product-images.php?product_id=${PRODUCT_ID}`);
                const data = await r.json();
                if (!data.success || !data.images.length) {
                    c.innerHTML = '<em>Žádné další fotografie.</em>';
                    return;
                }
                c.innerHTML = data.images.map(img => `
                    <div class="image-item">
                        <img src="${escapeAttr(img.image_url)}" alt="">
                        <span style="flex:1;">${escapeHtml(img.image_url)}</span>
                        <button type="button" class="btn btn-danger btn-sm"
                                data-id="${img.id}" data-action="del">Smazat</button>
                    </div>`).join('');
                c.querySelectorAll('[data-action="del"]').forEach(b =>
                    b.addEventListener('click', () => deleteImage(parseInt(b.dataset.id, 10))));
            } catch (e) {
                c.innerHTML = '<em>Chyba načítání.</em>';
            }
        }
        async function deleteImage(id) {
            if (!confirm('Smazat tuto fotografii?')) return;
            const r = await fetch('/api/product-images-delete.php', {
                method:'POST',
                headers:{'Content-Type':'application/json'},
                body: JSON.stringify({ image_id: id, csrf_token: CSRF })
            });
            const data = await r.json();
            if (data.success) loadProductImages();
            else alert('Chyba: ' + (data.error || ''));
        }
        <?php endif; ?>

        function escapeHtml(s){return String(s??'').replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[c]);}
        function escapeAttr(s){return escapeHtml(s);}
    </script>
</body>
</html>
