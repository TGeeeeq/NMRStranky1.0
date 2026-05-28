#!/usr/bin/env python3
"""Render www/*.php to www/*.html for static deployment to Forpsi.

PHP partials in www/partials/ are the source of truth for navbar / footer /
head. This script processes every *.php file at the www/ root, expands all
partial includes, and writes plain *.html files alongside.

Run before each deploy:
    python3 build.py

The generated *.html files are what gets rsynced to Forpsi. The *.php sources
stay in the repo so future edits remain DRY.
"""

import os
import sys

# Reuse the renderer that powers dev_server.py
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from dev_server import render_php  # type: ignore

WWW = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'www')

# Partials are templates, not standalone pages — never build them.
SKIP_PHP = {
    # PHP backend files; never have a HTML counterpart.
    'config.php', 'newsletter_signup_api.php', 'nechmerust_api.php',
}


def find_pages():
    out = []
    for entry in sorted(os.listdir(WWW)):
        if not entry.endswith('.php'):
            continue
        if entry in SKIP_PHP:
            continue
        if entry == 'router.php':
            continue
        path = os.path.join(WWW, entry)
        # Skip if it doesn't look like a top-level page (e.g. has <!DOCTYPE> hint via require head.php)
        with open(path, 'r', encoding='utf-8') as f:
            src = f.read()
        if "partials/head.php" not in src:
            continue
        out.append(path)
    return out


def main():
    pages = find_pages()
    if not pages:
        print('No pages found to build.')
        return
    print(f'Building {len(pages)} pages…')
    for path in pages:
        rel = os.path.relpath(path, WWW)
        slug = rel[:-4]  # strip .php
        out_path = os.path.join(WWW, slug + '.html')
        try:
            html = render_php(path)
        except Exception as e:
            print(f'  FAILED {rel}: {e}')
            continue
        with open(out_path, 'w', encoding='utf-8') as f:
            f.write(html)
        print(f'  {rel}  →  {slug}.html  ({len(html)} bytes)')
    print('\nDone. Now rsync www/ to Forpsi (skip *.php sources if you prefer).')


if __name__ == '__main__':
    main()
