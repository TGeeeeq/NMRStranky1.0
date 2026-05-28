<?php
/**
 * Seznam produktů + mazání.
 *
 * Bezpečnost:
 *   - requireAdmin()
 *   - Mazání pouze přes POST + CSRF (nikoli GET — vyhneme se CSRF přes <img>)
 *   - PDO prepared statements
 *   - Smazaný produkt nesmaže existující objednávky (FK ON DELETE SET NULL)
 */

declare(strict_types=1);

require_once __DIR__ . '/../config.php';
requireAdmin();

$pdo = getDbConnection();
$success = '';
$error   = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (!verify_csrf_token($_POST['csrf_token'] ?? null)) {
        $error = 'Neplatný bezpečnostní token.';
    } else {
        $action = $_POST['action'] ?? '';
        $id = (int)($_POST['id'] ?? 0);

        if ($id > 0 && $action === 'delete') {
            try {
                $stmt = $pdo->prepare("DELETE FROM products WHERE id = ?");
                $stmt->execute([$id]);
                $success = 'Produkt smazán.';
            } catch (Throwable $e) {
                error_log('[products delete] ' . $e->getMessage());
                $error = 'Chyba při mazání.';
            }
        } elseif ($id > 0 && ($action === 'publish' || $action === 'hide')) {
            $newState = $action === 'publish' ? 1 : 0;
            try {
                $stmt = $pdo->prepare("UPDATE products SET is_active = ? WHERE id = ?");
                $stmt->execute([$newState, $id]);
                $success = $newState ? 'Produkt zveřejněn.' : 'Produkt skryt.';
            } catch (Throwable $e) {
                error_log('[products toggle] ' . $e->getMessage());
                $error = 'Chyba při změně stavu.';
            }
        }
    }
}

$products = $pdo->query("
    SELECT p.*, c.name AS category_name
    FROM products p
    LEFT JOIN categories c ON p.category_id = c.id
    ORDER BY p.created_at DESC
")->fetchAll();
?>
<!DOCTYPE html>
<html lang="cs">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Produkty – Administrace</title>
    <link rel="stylesheet" href="/css/admin.css">
    <style>
        .inline-form { display: inline; }
        tr.is-hidden { background: #f5f5f5; color: #666; }
        tr.is-hidden td { font-style: italic; }
        tr.is-hidden .table-img { opacity: 0.5; }
        .badge-secondary::before { content: "👁️‍🗨️ "; }
    </style>
</head>
<body>
    <?php include 'includes/header.php'; ?>
    <div class="admin-container">
        <?php include 'includes/sidebar.php'; ?>
        <main class="admin-content">
            <div class="page-header">
                <h1>Produkty</h1>
                <a href="/admin/product-edit.php" class="btn btn-primary">+ Přidat produkt</a>
            </div>

            <?php if ($error):   ?><div class="alert alert-error"><?= htmlspecialchars($error) ?></div><?php endif; ?>
            <?php if ($success): ?><div class="alert alert-success"><?= htmlspecialchars($success) ?></div><?php endif; ?>

            <div class="table-container">
                <table class="data-table">
                    <thead><tr>
                        <th>Obrázek</th><th>Název</th><th>Kategorie</th>
                        <th>Cena</th><th>Sklad</th><th>Stav</th><th>Akce</th>
                    </tr></thead>
                    <tbody>
                        <?php if (empty($products)): ?>
                            <tr><td colspan="7" style="text-align:center;padding:24px;">
                                Zatím žádné produkty. <a href="/admin/product-edit.php">Přidat první →</a>
                            </td></tr>
                        <?php endif; ?>
                        <?php foreach ($products as $p): ?>
                        <tr<?= $p['is_active'] ? '' : ' class="is-hidden"' ?>>
                            <td>
                                <?php if ($p['image_url']): ?>
                                    <img src="<?= htmlspecialchars($p['image_url']) ?>" alt="" class="table-img">
                                <?php else: ?>
                                    <div class="table-img-placeholder">—</div>
                                <?php endif; ?>
                            </td>
                            <td><?= htmlspecialchars($p['name']) ?></td>
                            <td><?= htmlspecialchars($p['category_name'] ?? 'Bez kategorie') ?></td>
                            <td><?= number_format((float)$p['price'], 0, ',', ' ') ?> Kč</td>
                            <td><?= (int)$p['stock_quantity'] ?> ks</td>
                            <td>
                                <span class="badge badge-<?= $p['is_active'] ? 'success' : 'secondary' ?>">
                                    <?= $p['is_active'] ? 'Aktivní' : 'Skrytý' ?>
                                </span>
                            </td>
                            <td class="table-actions">
                                <a href="/admin/product-edit.php?id=<?= (int)$p['id'] ?>" class="btn btn-sm">Upravit</a>
                                <form method="POST" class="inline-form">
                                    <?= csrf_field() ?>
                                    <input type="hidden" name="action" value="<?= $p['is_active'] ? 'hide' : 'publish' ?>">
                                    <input type="hidden" name="id" value="<?= (int)$p['id'] ?>">
                                    <button type="submit" class="btn btn-sm">
                                        <?= $p['is_active'] ? 'Skrýt' : 'Zveřejnit' ?>
                                    </button>
                                </form>
                                <form method="POST" class="inline-form"
                                      onsubmit="return confirm('Opravdu smazat „<?= htmlspecialchars($p['name'], ENT_QUOTES) ?>“?');">
                                    <?= csrf_field() ?>
                                    <input type="hidden" name="action" value="delete">
                                    <input type="hidden" name="id" value="<?= (int)$p['id'] ?>">
                                    <button type="submit" class="btn btn-sm btn-danger">Smazat</button>
                                </form>
                            </td>
                        </tr>
                        <?php endforeach; ?>
                    </tbody>
                </table>
            </div>
        </main>
    </div>
</body>
</html>
