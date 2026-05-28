#!/usr/bin/env python3
"""
Local-only dev server that renders a constrained subset of the PHP partials.

Production runs real PHP on Forpsi (Apache + .htaccess). This server exists
ONLY so we can preview the converted *.php files locally without installing
PHP in the sandbox. The renderer supports exactly the features used by our
partials/*.php files:

  - <?php $var = 'value'; ?>           variable assignment
  - $var ?? 'default'                    null-coalescing default
  - <?= expr ?>                          short-echo
  - <?php echo expr; ?>                  long-echo
  - <?php require __DIR__ . '/x.php'; ?> include (resolved relative to file)
  - <?php if (cond): ?> / endif          if blocks
  - <?php foreach ($arr as $item): ?>    foreach blocks
  - htmlspecialchars($x, ENT_QUOTES, 'UTF-8'), date('Y'), ltrim, strpos
  - string concatenation with '.'

Anything else throws so we notice instead of silently misrendering.
"""

import http.server
import os
import re
import sys
from urllib.parse import urlparse, unquote
import html
import datetime

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'www')
PORT = int(os.environ.get('PORT', '8767'))


# ---------- Expression evaluator ----------

def _resolve(expr, scope):
    expr = expr.strip().rstrip(';').strip()

    # String concatenation: split on top-level "."
    if '.' in expr and not re.fullmatch(r"[\d.]+", expr):
        parts = _split_concat(expr)
        if len(parts) > 1:
            return ''.join(_resolve(p, scope) for p in parts)

    # Null-coalescing: a ?? b
    if '??' in expr:
        left, right = expr.split('??', 1)
        try:
            v = _resolve(left, scope)
            if v is None or v == '':
                return _resolve(right, scope)
            return v
        except KeyError:
            return _resolve(right, scope)

    # Ternary: cond ? a : b
    m = re.match(r'(.+?)\s*\?\s*(.+?)\s*:\s*(.+)$', expr)
    if m and '??' not in m.group(1):
        cond, t, f = m.group(1), m.group(2), m.group(3)
        return _resolve(t, scope) if _truthy(_resolve(cond, scope)) else _resolve(f, scope)

    # String literal
    if expr.startswith("'") and expr.endswith("'"):
        return expr[1:-1]
    if expr.startswith('"') and expr.endswith('"'):
        return expr[1:-1]

    # Numeric
    if re.fullmatch(r'-?\d+', expr):
        return int(expr)
    if re.fullmatch(r'-?\d+\.\d+', expr):
        return float(expr)

    # Array literal: [expr, expr, ...] or ['k' => v, ...]
    if expr.startswith('[') and expr.endswith(']'):
        inner = expr[1:-1].strip()
        if inner == '':
            return []
        items = _split_args(inner)
        result = []
        as_dict = False
        for it in items:
            it = it.strip()
            if not it:
                continue
            # Only treat as key=>value if => is at top level (not inside nested brackets/strings)
            has_top_kv = _has_top_level_arrow(it)
            if has_top_kv:
                k, v = _split_kv(it)
                if not as_dict:
                    if result:
                        # Mixed array — convert existing to dict with int keys
                        result = {i: x for i, x in enumerate(result)}
                    else:
                        result = {}
                    as_dict = True
                result[_resolve(k, scope)] = _resolve(v, scope)
            else:
                if as_dict:
                    result[len(result)] = _resolve(it, scope)
                else:
                    result.append(_resolve(it, scope))
        return result

    # __DIR__ constant
    if expr == '__DIR__':
        return scope.get('__DIR__', ROOT)

    # PHP keywords / constants we ignore or map
    if expr in ('null', 'NULL'): return None
    if expr in ('true', 'TRUE'): return True
    if expr in ('false', 'FALSE'): return False
    # htmlspecialchars flag constants — we always treat as quote=True UTF-8, so accept any value.
    if expr in ('ENT_QUOTES', 'ENT_HTML5', 'ENT_HTML401', 'ENT_COMPAT'): return 3
    if re.fullmatch(r"'[^']*'", expr) is None and re.fullmatch(r'[A-Z][A-Z0-9_]*', expr):
        # Unknown ALL_CAPS constant — return name as harmless placeholder.
        return expr

    # Variable
    m = re.fullmatch(r'\$(\w+)(?:\[(.+)\])?', expr)
    if m:
        name = m.group(1)
        if name not in scope:
            raise KeyError(name)
        val = scope[name]
        if m.group(2):
            key = _resolve(m.group(2), scope)
            return val[key]
        return val

    # Object/array key with bracket: $arr['key']
    m = re.fullmatch(r"\$(\w+)\[(\d+|'[^']*'|\"[^\"]*\")\]", expr)
    if m:
        val = scope[m.group(1)]
        key = _resolve(m.group(2), scope)
        return val[key]

    # Function calls
    m = re.fullmatch(r'(\w+)\((.*)\)', expr, re.DOTALL)
    if m:
        fn = m.group(1)
        args_raw = m.group(2).strip()
        args = _split_args(args_raw) if args_raw else []
        args = [_resolve(a, scope) for a in args]
        return _call(fn, args)

    # Comparison
    for op in ['===', '!==', '==', '!=', '<=', '>=', '<', '>']:
        if op in expr:
            l, r = expr.split(op, 1)
            lv = _resolve(l, scope); rv = _resolve(r, scope)
            if op in ('==', '==='): return lv == rv
            if op in ('!=', '!=='): return lv != rv
            if op == '<=': return lv <= rv
            if op == '>=': return lv >= rv
            if op == '<': return lv < rv
            if op == '>': return lv > rv

    raise ValueError(f"Cannot evaluate PHP expression: {expr!r}")


def _split_concat(expr):
    parts = []
    buf = ''
    depth_p = depth_b = 0
    in_s = in_d = False
    i = 0
    while i < len(expr):
        c = expr[i]
        if in_s:
            buf += c
            if c == "'": in_s = False
        elif in_d:
            buf += c
            if c == '"': in_d = False
        elif c == "'": buf += c; in_s = True
        elif c == '"': buf += c; in_d = True
        elif c == '(': depth_p += 1; buf += c
        elif c == ')': depth_p -= 1; buf += c
        elif c == '[': depth_b += 1; buf += c
        elif c == ']': depth_b -= 1; buf += c
        elif c == '.' and depth_p == 0 and depth_b == 0:
            # check it's a string concat dot (surrounded by spaces or operands), not in a number
            if buf.strip() and i + 1 < len(expr):
                parts.append(buf); buf = ''
            else:
                buf += c
        else:
            buf += c
        i += 1
    parts.append(buf)
    return [p.strip() for p in parts if p.strip()]


def _split_args(s):
    out, buf, depth_p, depth_b = [], '', 0, 0
    in_s = in_d = False
    for c in s:
        if in_s: buf += c; in_s = c != "'" or buf.endswith("\\'")
        elif in_d: buf += c; in_d = c != '"'
        elif c == "'": in_s = True; buf += c
        elif c == '"': in_d = True; buf += c
        elif c == '(': depth_p += 1; buf += c
        elif c == ')': depth_p -= 1; buf += c
        elif c == '[': depth_b += 1; buf += c
        elif c == ']': depth_b -= 1; buf += c
        elif c == ',' and depth_p == 0 and depth_b == 0:
            out.append(buf); buf = ''
        else:
            buf += c
    if buf.strip(): out.append(buf)
    return out


def _has_top_level_arrow(s):
    depth_p = depth_b = 0
    in_s = in_d = False
    for i in range(len(s) - 1):
        c, n = s[i], s[i + 1]
        if in_s: in_s = c != "'"
        elif in_d: in_d = c != '"'
        elif c == "'": in_s = True
        elif c == '"': in_d = True
        elif c == '(': depth_p += 1
        elif c == ')': depth_p -= 1
        elif c == '[': depth_b += 1
        elif c == ']': depth_b -= 1
        elif c == '=' and n == '>' and depth_p == 0 and depth_b == 0:
            return True
    return False


def _split_kv(s):
    # Split "key => value" at top-level =>
    depth_p = depth_b = 0
    in_s = in_d = False
    for i in range(len(s) - 1):
        c, n = s[i], s[i + 1]
        if in_s: in_s = c != "'"
        elif in_d: in_d = c != '"'
        elif c == "'": in_s = True
        elif c == '"': in_d = True
        elif c == '(': depth_p += 1
        elif c == ')': depth_p -= 1
        elif c == '[': depth_b += 1
        elif c == ']': depth_b -= 1
        elif c == '=' and n == '>' and depth_p == 0 and depth_b == 0:
            return s[:i].strip(), s[i + 2:].strip()
    raise ValueError(f'No => found in {s!r}')


def _truthy(v):
    if v is None: return False
    if v is False: return False
    if v == '' or v == 0: return False
    return True


def _call(fn, args):
    if fn == 'htmlspecialchars':
        s = args[0] if args else ''
        return html.escape(str(s), quote=True)
    if fn == 'ltrim':
        s = str(args[0])
        chars = args[1] if len(args) > 1 else None
        return s.lstrip(chars) if chars else s.lstrip()
    if fn == 'rtrim':
        s = str(args[0])
        chars = args[1] if len(args) > 1 else None
        return s.rstrip(chars) if chars else s.rstrip()
    if fn == 'strpos':
        s = str(args[0]); needle = str(args[1])
        i = s.find(needle)
        return i if i >= 0 else False
    if fn == 'date':
        fmt = args[0]
        now = datetime.datetime.now()
        if fmt == 'Y': return now.strftime('%Y')
        if fmt == 'Y-m-d': return now.strftime('%Y-%m-%d')
        return now.strftime(fmt)
    if fn == 'isset':
        return args[0] is not None
    if fn == 'empty':
        return not _truthy(args[0])
    raise ValueError(f'Unknown PHP function: {fn}')


# ---------- Renderer ----------

PHP_BLOCK_RE = re.compile(r'<\?(?:php|=)([\s\S]*?)\?>', re.MULTILINE)


def render_php(path, scope=None):
    if scope is None:
        scope = {}
    scope['__DIR__'] = os.path.dirname(os.path.abspath(path))
    with open(path, 'r', encoding='utf-8') as f:
        src = f.read()

    # Tokenize into alternating literal / php-code segments.
    out = []
    pos = 0
    tokens = []
    for m in re.finditer(r'<\?(php|=)([\s\S]*?)\?>', src):
        tokens.append(('lit', src[pos:m.start()]))
        kind = 'echo' if m.group(1) == '=' else 'php'
        tokens.append((kind, m.group(2)))
        pos = m.end()
    tokens.append(('lit', src[pos:]))

    i = 0
    while i < len(tokens):
        kind, content = tokens[i]
        if kind == 'lit':
            out.append(content)
            i += 1
            continue
        if kind == 'echo':
            out.append(str(_resolve(content.strip().rstrip(';'), scope)))
            i += 1
            continue
        # kind == 'php'
        block = content.strip()
        # Special structures: if/foreach with HTML body, terminated by another <?php ... endif/endforeach ?>
        m = re.match(r'if\s*\((.+)\):\s*$', block, re.DOTALL)
        if m:
            cond = m.group(1)
            # Find matching endif token in this token stream
            depth = 1
            j = i + 1
            body_tokens = []
            else_tokens = None
            while j < len(tokens):
                k2, c2 = tokens[j]
                if k2 == 'php':
                    b2 = c2.strip()
                    if re.match(r'if\s*\(.+\):\s*$', b2): depth += 1
                    elif re.match(r'endif;?\s*$', b2):
                        depth -= 1
                        if depth == 0: break
                    elif b2.startswith('else:') and depth == 1:
                        else_tokens = []
                        j += 1
                        continue
                if else_tokens is not None:
                    else_tokens.append(tokens[j])
                else:
                    body_tokens.append(tokens[j])
                j += 1
            chosen = body_tokens if _truthy(_resolve(cond, scope)) else (else_tokens or [])
            out.append(_render_token_stream(chosen, scope, path))
            i = j + 1
            continue

        m = re.match(r'foreach\s*\((.+)\s+as\s+(\$\w+(?:\s*=>\s*\$\w+)?)\s*\):\s*$', block)
        if m:
            arr_expr, as_clause = m.group(1), m.group(2)
            # Find endforeach
            depth = 1
            j = i + 1
            body_tokens = []
            while j < len(tokens):
                k2, c2 = tokens[j]
                if k2 == 'php':
                    b2 = c2.strip()
                    if re.match(r'foreach\s*\(.+\)\s*:\s*$', b2): depth += 1
                    elif re.match(r'endforeach;?\s*$', b2):
                        depth -= 1
                        if depth == 0: break
                body_tokens.append(tokens[j])
                j += 1
            arr = _resolve(arr_expr, scope)
            for item in arr:
                local_scope = dict(scope)
                if '=>' in as_clause:
                    kvar, vvar = [x.strip().lstrip('$') for x in as_clause.split('=>')]
                    raise NotImplementedError('foreach with key not used in our partials')
                else:
                    var_name = as_clause.strip().lstrip('$')
                    local_scope[var_name] = item
                out.append(_render_token_stream(body_tokens, local_scope, path))
            i = j + 1
            continue

        # Plain PHP block — execute statements
        _exec_block(block, scope, path, out)
        i += 1
    return ''.join(out)


def _render_token_stream(tokens, scope, parent_path):
    out = []
    i = 0
    while i < len(tokens):
        kind, content = tokens[i]
        if kind == 'lit':
            out.append(content); i += 1; continue
        if kind == 'echo':
            out.append(str(_resolve(content.strip().rstrip(';'), scope))); i += 1; continue
        block = content.strip()
        m = re.match(r'if\s*\((.+)\):\s*$', block, re.DOTALL)
        if m:
            cond = m.group(1)
            depth = 1
            j = i + 1
            body, else_body = [], None
            while j < len(tokens):
                k2, c2 = tokens[j]
                if k2 == 'php':
                    b2 = c2.strip()
                    if re.match(r'if\s*\(.+\):\s*$', b2): depth += 1
                    elif re.match(r'endif;?\s*$', b2):
                        depth -= 1
                        if depth == 0: break
                    elif b2.startswith('else:') and depth == 1:
                        else_body = []; j += 1; continue
                if else_body is not None: else_body.append(tokens[j])
                else: body.append(tokens[j])
                j += 1
            chosen = body if _truthy(_resolve(cond, scope)) else (else_body or [])
            out.append(_render_token_stream(chosen, scope, parent_path))
            i = j + 1; continue
        m = re.match(r'foreach\s*\((.+)\s+as\s+(\$\w+)\s*\):\s*$', block)
        if m:
            arr_expr, as_var = m.group(1), m.group(2).lstrip('$')
            depth = 1; j = i + 1; body = []
            while j < len(tokens):
                k2, c2 = tokens[j]
                if k2 == 'php':
                    b2 = c2.strip()
                    if re.match(r'foreach\s*\(.+\)\s*:\s*$', b2): depth += 1
                    elif re.match(r'endforeach;?\s*$', b2):
                        depth -= 1
                        if depth == 0: break
                body.append(tokens[j]); j += 1
            arr = _resolve(arr_expr, scope)
            for item in arr:
                ls = dict(scope); ls[as_var] = item
                out.append(_render_token_stream(body, ls, parent_path))
            i = j + 1; continue
        _exec_block(block, scope, parent_path, out)
        i += 1
    return ''.join(out)


def _exec_block(block, scope, path, out):
    # Split by ; but respect strings.
    stmts = _split_stmts(block)
    for stmt in stmts:
        s = stmt.strip()
        if not s or s.startswith('//') or s.startswith('#'):
            continue
        if s.startswith('/*'):
            continue
        # require __DIR__ . '/partials/X.php'
        m = re.match(r'require(?:_once)?\s+(.+)$', s, re.DOTALL)
        if m:
            target = _resolve(m.group(1), scope)
            out.append(render_php(target, dict(scope)))
            continue
        # Assignment
        m = re.match(r'\$(\w+)\s*=\s*(.+)$', s, re.DOTALL)
        if m:
            scope[m.group(1)] = _resolve(m.group(2), scope)
            continue
        # echo
        m = re.match(r'echo\s+(.+)$', s, re.DOTALL)
        if m:
            out.append(str(_resolve(m.group(1), scope)))
            continue
        # if/else without colon syntax (single-line inline if(...) echo ...)
        m = re.match(r'if\s*\((.+?)\)\s+echo\s+(.+)$', s, re.DOTALL)
        if m:
            if _truthy(_resolve(m.group(1), scope)):
                out.append(str(_resolve(m.group(2), scope)))
            continue
        raise ValueError(f'Unsupported PHP statement: {s!r}')


def _split_stmts(block):
    # Strip /* ... */ block comments first.
    block = re.sub(r'/\*[\s\S]*?\*/', '', block)
    # Strip // ... and # ... line comments.
    block = re.sub(r'(?m)^\s*//.*$', '', block)
    block = re.sub(r'(?m)^\s*#.*$', '', block)
    out, buf, depth = [], '', 0
    in_s = in_d = False
    for c in block:
        if in_s: buf += c; in_s = c != "'"
        elif in_d: buf += c; in_d = c != '"'
        elif c == "'": buf += c; in_s = True
        elif c == '"': buf += c; in_d = True
        elif c == '(': depth += 1; buf += c
        elif c == ')': depth -= 1; buf += c
        elif c == ';' and depth == 0:
            out.append(buf); buf = ''
        else:
            buf += c
    if buf.strip(): out.append(buf)
    return out


# ---------- HTTP server ----------

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *a, **kw):
        super().__init__(*a, directory=ROOT, **kw)

    def do_GET(self):
        parsed = urlparse(self.path)
        path = unquote(parsed.path)
        # Resolve to a file/dir within ROOT
        candidate = os.path.normpath(os.path.join(ROOT, path.lstrip('/')))
        if not candidate.startswith(ROOT):
            self.send_error(403); return

        # Directory → index.php / index.html
        if os.path.isdir(candidate):
            for idx in ('index.php', 'index.html'):
                p = os.path.join(candidate, idx)
                if os.path.isfile(p): return self._serve(p)
            self.send_error(404); return
        if os.path.isfile(candidate):
            return self._serve(candidate)
        # Try with .php / .html extension
        for ext in ('.php', '.html'):
            if os.path.isfile(candidate + ext):
                return self._serve(candidate + ext)
        self.send_error(404)

    def _serve(self, path):
        if path.endswith('.php'):
            try:
                body = render_php(path).encode('utf-8')
            except Exception as e:
                self.send_response(500)
                self.send_header('Content-Type', 'text/plain; charset=utf-8')
                self.end_headers()
                self.wfile.write(f'PHP render error in {path}:\n{e}'.encode('utf-8'))
                return
            self.send_response(200)
            self.send_header('Content-Type', 'text/html; charset=utf-8')
            self.send_header('Content-Length', str(len(body)))
            self.end_headers()
            self.wfile.write(body)
        else:
            return super().do_GET() if False else self._serve_static(path)

    def _serve_static(self, path):
        # Default handler with directory=ROOT
        rel = os.path.relpath(path, ROOT)
        self.path = '/' + rel.replace(os.sep, '/')
        return http.server.SimpleHTTPRequestHandler.do_GET(self)


if __name__ == '__main__':
    httpd = http.server.HTTPServer(('localhost', PORT), Handler)
    print(f'Dev server on http://localhost:{PORT}  (ROOT={ROOT})')
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        sys.exit(0)
