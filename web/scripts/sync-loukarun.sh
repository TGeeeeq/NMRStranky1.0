#!/usr/bin/env bash
# Sync the Louka Run game (static PWA) from its repo into public/loukarun/app/.
# Run from web/: bash scripts/sync-loukarun.sh [path-to-loukarun-repo]
set -euo pipefail

SRC="${1:-$HOME/Desktop/projekty/loukarun}"
DEST="$(cd "$(dirname "$0")/.." && pwd)/public/loukarun/app"

[ -f "$SRC/index.html" ] || { echo "Game not found at $SRC" >&2; exit 1; }

rm -rf "$DEST"
mkdir -p "$DEST"
cp "$SRC/style.css" "$SRC/manifest.webmanifest" "$SRC/sw.js" "$SRC/soukromi.html" "$DEST/"
cp -r "$SRC/js" "$SRC/assets" "$DEST/"

# tester guide belongs to the public testing build; it isn't synced here, so drop its menu link
sed 's|<a class="privacy-link" href="jak-testovat.html"[^>]*>[^<]*</a> \&nbsp;·\&nbsp; ||' "$SRC/index.html" > "$DEST/index.html"
grep -q 'jak-testovat' "$DEST/index.html" && { echo 'ERROR: tester link still present — index.html changed?' >&2; exit 1; }

echo "Synced $(du -sh "$DEST" | cut -f1) → $DEST"
