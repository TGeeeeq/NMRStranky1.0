#!/usr/bin/env bash
# Sync the Louka Run game (static PWA) from its repo into public/loukarun/app/.
# Run from web/: bash scripts/sync-loukarun.sh [path-to-loukarun-repo]
set -euo pipefail

SRC="${1:-$HOME/Desktop/projekty/loukarun}"
DEST="$(cd "$(dirname "$0")/.." && pwd)/public/loukarun/app"

[ -f "$SRC/index.html" ] || { echo "Game not found at $SRC" >&2; exit 1; }

rm -rf "$DEST"
mkdir -p "$DEST"
cp "$SRC/index.html" "$SRC/style.css" "$SRC/manifest.webmanifest" "$SRC/sw.js" "$SRC/soukromi.html" "$DEST/"
cp -r "$SRC/js" "$SRC/assets" "$DEST/"

echo "Synced $(du -sh "$DEST" | cut -f1) → $DEST"
