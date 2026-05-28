#!/usr/bin/env bash
# Deploy nechmerust.org → Forpsi FTP
# Použití: ./deploy.sh
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
source "$SCRIPT_DIR/.env.deploy"

echo "==> Build (PHP → HTML)..."
python3 "$SCRIPT_DIR/build.py"

echo "==> Upload na Forpsi ($FTP_HOST)..."
lftp -u "$FTP_USER","$FTP_PASS" "$FTP_HOST" <<LFTP
set ftp:ssl-allow yes
set ssl:verify-certificate no
mirror --reverse --delete --verbose \
  --exclude='^\.env$' \
  --exclude='^vendor/' \
  --exclude='\.php~$' \
  --exclude='^\.env\.deploy$' \
  $SCRIPT_DIR/www/ $FTP_REMOTE
bye
LFTP

echo "==> Hotovo! Zkontroluj https://nechmerust.org"
