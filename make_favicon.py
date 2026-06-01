#!/usr/bin/env python3
"""Generate www/favicon.ico from www/assets/logo.png using only stdlib (zlib/struct).
Decodes an 8-bit RGBA non-interlaced PNG, nearest-neighbour downscales to 64x64,
re-encodes as PNG and wraps it in an ICO container (PNG-in-ICO, supported since Vista)."""
import struct, zlib, sys

SRC = "www/assets/logo.png"
OUT = "www/favicon.ico"
SIZE = 64

def read_png(path):
    data = open(path, "rb").read()
    assert data[:8] == b"\x89PNG\r\n\x1a\n", "not a PNG"
    pos = 8
    width = height = bit_depth = color_type = None
    idat = b""
    while pos < len(data):
        length = struct.unpack(">I", data[pos:pos+4])[0]
        ctype = data[pos+4:pos+8]
        chunk = data[pos+8:pos+8+length]
        if ctype == b"IHDR":
            width, height, bit_depth, color_type = struct.unpack(">IIBB", chunk[:10])
        elif ctype == b"IDAT":
            idat += chunk
        elif ctype == b"IEND":
            break
        pos += 12 + length
    assert bit_depth == 8 and color_type == 6, f"need 8-bit RGBA, got depth={bit_depth} ctype={color_type}"
    raw = zlib.decompress(idat)
    return width, height, raw

def unfilter(width, height, raw):
    bpp = 4
    stride = width * bpp
    out = bytearray()
    prev = bytearray(stride)
    pos = 0
    def paeth(a, b, c):
        p = a + b - c
        pa, pb, pc = abs(p-a), abs(p-b), abs(p-c)
        if pa <= pb and pa <= pc: return a
        if pb <= pc: return b
        return c
    for _ in range(height):
        ft = raw[pos]; pos += 1
        line = bytearray(raw[pos:pos+stride]); pos += stride
        for i in range(stride):
            a = line[i-bpp] if i >= bpp else 0
            b = prev[i]
            c = prev[i-bpp] if i >= bpp else 0
            if ft == 1: line[i] = (line[i] + a) & 255
            elif ft == 2: line[i] = (line[i] + b) & 255
            elif ft == 3: line[i] = (line[i] + ((a+b)>>1)) & 255
            elif ft == 4: line[i] = (line[i] + paeth(a,b,c)) & 255
        out += line
        prev = line
    return out

def downscale(px, w, h, size):
    out = bytearray(size*size*4)
    for y in range(size):
        sy = y * h // size
        for x in range(size):
            sx = x * w // size
            si = (sy*w + sx)*4
            di = (y*size + x)*4
            out[di:di+4] = px[si:si+4]
    return out

def encode_png(px, size):
    raw = bytearray()
    stride = size*4
    for y in range(size):
        raw.append(0)  # filter none
        raw += px[y*stride:(y+1)*stride]
    comp = zlib.compress(bytes(raw), 9)
    def chunk(t, d):
        return struct.pack(">I", len(d)) + t + d + struct.pack(">I", zlib.crc32(t+d) & 0xffffffff)
    ihdr = struct.pack(">IIBBBBB", size, size, 8, 6, 0, 0, 0)
    return b"\x89PNG\r\n\x1a\n" + chunk(b"IHDR", ihdr) + chunk(b"IDAT", comp) + chunk(b"IEND", b"")

def wrap_ico(png, size):
    # ICONDIR + one ICONDIRENTRY pointing to a PNG payload
    header = struct.pack("<HHH", 0, 1, 1)
    b = size if size < 256 else 0
    entry = struct.pack("<BBBBHHII", b, b, 0, 0, 1, 32, len(png), 6 + 16)
    return header + entry + png

def main():
    w, h, raw = read_png(SRC)
    px = unfilter(w, h, raw)
    small = downscale(px, w, h, SIZE)
    png = encode_png(small, SIZE)
    ico = wrap_ico(png, SIZE)
    open(OUT, "wb").write(ico)
    print(f"wrote {OUT}: {len(ico)} bytes ({SIZE}x{SIZE} from {w}x{h})")

if __name__ == "__main__":
    main()
