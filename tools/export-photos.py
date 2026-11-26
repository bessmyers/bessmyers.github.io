"""Export the Chaos About photo at 2x (640x1000, the photo's 16:25 display ratio).

usage: python3 tools/export-photos.py PARTHENON_SRC

Crop boxes are fractions of the source size, so a higher-resolution
original of the same shot gives the same framing. Each export is resized
to 640x1000 with Lanczos and, if it was actually resized, lightly sharpened
(unsharp mask: radius 1, amount 60%). A 1:1 crop is left unsharpened.
Saved as WebP plus a JPG fallback.
"""
import sys
from PIL import Image, ImageFilter

OUT = (640, 1000)
CROPS = {
    # waist up, centred on Bess
    'bess-parthenon': (205 / 768, 252 / 1024, 575 / 768, 830 / 1024),
}

def export(name, src):
    im = Image.open(src).convert('RGB')
    w, h = im.size
    l, t, r, b = CROPS[name]
    box = (round(l * w), round(t * h), round(r * w), round(b * h))
    crop = im.crop(box)
    scale = OUT[0] / crop.width
    out = crop.resize(OUT, Image.LANCZOS) if crop.size != OUT else crop
    if crop.size != OUT:
        out = out.filter(ImageFilter.UnsharpMask(radius=1, percent=60, threshold=0))
    out.save(f'images/{name}.jpg', quality=82, optimize=True, progressive=True)
    out.save(f'images/{name}.webp', quality=80, method=6)
    print(f'{name}: source {w}x{h}, crop {crop.width}x{crop.height}, scale x{scale:.2f}'
          + (', sharpened' if crop.size != OUT else ', not resized or sharpened'))

if __name__ == '__main__':
    export('bess-parthenon', sys.argv[1])
