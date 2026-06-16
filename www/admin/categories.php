<?php
/**
 * Správa kategorií produktů.
 *
 * Bezpečnost:
 *   - requireAdmin() vynucuje přihlášení
 *   - Všechny mutace přes POST + CSRF token
 *   - PDO prepared statements
 *   - Slug validace serverside (přesto co dělá JS)
 *   - Mazání kategorie nemaže produkty (FK ON DELETE SET NULL)
 */

declare(strict_types=1);

require_once __DIR__ . '/../config.php';
requireAdmin();

$pdo = getDbConnection();
$error = '';
$success = '';

// ---------- akce ----------------------------------------------------------
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $action = (string)($_POST['action'] ?? '');

    if (!verify_csrf_token($_POST['csrf_token'] ?? null)) {
        $error = 'Neplatný bezpečnostní token. Načtěte stránku znovu.';
    } else {
        try {
            if ($action === 'create' || $action === 'update') {
                $id    = (int)($_POST['id'] ?? 0);
                $name  = trim((string)($_POST['name'] ?? ''));
                $slug  = trim((string)($_POST['slug'] ?? ''));
                $desc  = trim((string)($_POST['description'] ?? ''));
                $order = (int)($_POST['display_order'] ?? 0);

                if ($name === '' || $slug === '') {
                    throw new RuntimeException('Vyplňte název i slug.');
                }
                if (!preg_match('/^[a-z0-9-]{2,100}$/', $slug)) {
                    throw new RuntimeException('Slug smí obsahovat pouze a-z, 0-9 a pomlčky.');
                }

                if ($action === 'create') {
                    $stmt = $pdo->prepare(
                        "INSERT INTO categories (name, slug, description, display_order)
                         VALUES (?, ?, ?, ?)"
                    );
                    $stmt->execute([$name, $slug, $desc, $order]);
                    $success = 'Kategorie vytvořena.';
                } else {
                    if ($id <= 0) throw new RuntimeException('Chybí ID kategorie.');
                    $stmt = $pdo->prepare(
                        "UPDATE categories SET name=?, slug=?, description=?, display_order=?
                         WHERE id=?"
                    );
                    $stmt->execute([$name, $slug, $desc, $order, $id]);
                    $success = 'Kategorie upravena.';
                }

            } elseif ($action === 'delete') {
                $id = (int)($_POST['id'] ?? 0);
                if ($id <= 0) throw new RuntimeException('Chybí ID.');
                $stmt = $pdo->prepare("DELETE FROM categories WHERE id = ?");
                $stmt->execute([$id]);
                $success = 'Kategorie smazána (produkty zůstaly bez kategorie).';
            }
        } catch (PDOException $e) {
            if ($e->getCode() === '23000') {
                $error = 'Tento slug už existuje. Zvolte jiný.';
            } else {
                error_log('[admin/categories] ' . $e->getMessage());
                $error = 'Chyba při uložení.';
            }
        } catch (Throwable $e) {
            $error = $e->getMessage();
        }
    }
}

// ---------- načtení dat ---------------------------------------------------
$categories = $pdo->query("
    SELECT c.*, (SELECT COUNT(*) FROM products p WHERE p.category_id = c.id) AS product_count
    FROM categories c
    ORDER BY c.display_order, c.name
")->fetchAll();

$editing = null;
if (isset($_GET['edit'])) {
    $stmt = $pdo->prepare("SELECT * FROM categories WHERE id = ?");
    $stmt->execute([(int)$_GET['edit']]);
    $editing = $stmt->fetch() ?: null;
}
?>
<!DOCTYPE html>
<html lang="cs">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Kategorie – Administrace</title>
    <link rel="stylesheet" href="/css/admin.css">
    <style>
        .cat-grid { display: grid; grid-template-columns: 1fr 380px; gap: 24px; }
        @media (max-width: 900px) { .cat-grid { grid-template-columns: 1fr; } }
        .form-card { background:#fff; padding:20px; border-radius:10px; border:1px solid #e0e0e0; }
        .inline-form { display: inline; }
    </style>
</head>
<body>
    <?php include 'includes/header.php'; ?>
    <div class="admin-container">
        <?php include 'includes/sidebar.php'; ?>
        <main class="admin-content">
            <div class="page-header"><h1>Kategorie</h1></div>

            <?php if ($error):   ?><div class="alert alert-error"><?= htmlspecialchars($error) ?></div><?php endif; ?>
            <?php if ($success): ?><div class="alert alert-success"><?= htmlspecialchars($success) ?></div><?php endif; ?>

            <div class="cat-grid">
                <!-- seznam -->
                <div class="table-container">
                    <table class="data-table">
                        <thead><tr>
                            <th>Pořadí</th><th>Název</th><th>Slug</th><th>Produktů</th><th>Akce</th>
                        </tr></thead>
                        <tbody>
                        <?php foreach ($categories as $c): ?>
                        <tr>
                            <td><?= (int)$c['display_order'] ?></td>
                            <td><?= htmlspecialchars($c['name']) ?></td>
                            <td><code><?= htmlspecialchars($c['slug']) ?></code></td>
                            <td><?= (int)$c['product_count'] ?></td>
                            <td class="table-actions">
                                <a href="?edit=<?= (int)$c['id'] ?>" class="btn btn-sm">Upravit</a>
                                <form method="POST" class="inline-form"
                                      onsubmit="return confirm('Opravdu smazat kategorii „<?= htmlspecialchars($c['name'], ENT_QUOTES) ?>“? Produkty zůstanou (bez kategorie).');">
                                    <?= csrf_field() ?>
                                    <input type="hidden" name="action" value="delete">
                                    <input type="hidden" name="id" value="<?= (int)$c['id'] ?>">
                                    <button class="btn btn-sm btn-danger" type="submit">Smazat</button>
                                </form>
                            </td>
                        </tr>
                        <?php endforeach; ?>
                        </tbody>
                    </table>
                </div>

                <!-- formulář -->
                <div class="form-card">
                    <h2 style="margin-top:0;">
                        <?= $editing ? 'Upravit kategorii' : 'Nová kategorie' ?>
                    </h2>
                    <form method="POST">
                        <?= csrf_field() ?>
                        <input type="hidden" name="action" value="<?= $editing ? 'update' : 'create' ?>">
                        <?php if ($editing): ?>
                            <input type="hidden" name="id" value="<?= (int)$editing['id'] ?>">
                        <?php endif; ?>

                        <div class="form-group">
                            <label for="name">Název *</label>
                            <input id="name" name="name" required maxlength="100"
                                   value="<?= htmlspecialchars($editing['name'] ?? '') ?>">
                        </div>

                        <div class="form-group">
                            <label for="slug">Slug (URL) *</label>
                            <input id="slug" name="slug" required maxlength="100"
                                   pattern="[a-z0-9-]+"
                                   value="<?= htmlspecialchars($editing['slug'] ?? '') ?>">
                            <small>Jen malá písmena bez diakritiky, číslice, pomlčky.</small>
                        </div>

                        <div class="form-group">
                            <label for="description">Popis</label>
                            <textarea id="description" name="description" rows="3"><?= htmlspecialchars($editing['description'] ?? '') ?></textarea>
                        </div>

                        <div class="form-group">
                            <label for="display_order">Pořadí (menší = výš)</label>
                            <input id="display_order" name="display_order" type="number"
                                   value="<?= (int)($editing['display_order'] ?? 0) ?>">
                        </div>

                        <div class="form-actions">
                            <button type="submit" class="btn btn-primary">
                                <?= $editing ? 'Uložit změny' : 'Vytvořit kategorii' ?>
                            </button>
                            <?php if ($editing): ?>
                                <a href="categories.php" class="btn btn-secondary">Zrušit úpravu</a>
                            <?php endif; ?>
                        </div>
                    </form>
                </div>
            </div>
        </main>
    </div>

    <script>
        // Auto-slug z názvu při vytváření
        (function() {
            const name = document.getElementById('name');
            const slug = document.getElementById('slug');
            if (!name || !slug) return;
            <?php if (!$editing): ?>
            name.addEventListener('input', () => {
                slug.value = name.value
                    .toLowerCase()
                    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
                    .replace(/[^a-z0-9]+/g, '-')
                    .replace(/^-+|-+$/g, '');
            });
            <?php endif; ?>
        })();
    </script>
</body>
</html>
