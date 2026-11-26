"""Brighten the About portrait (images/bess.jpg) into a new 2x export.

usage: python3 tools/brighten-portrait.py [OUT_NAME]   (default: bess-bright)

Writes images/OUT_NAME.jpg and .webp at 640x1000 (2x the 320x500 display
size, cropped like object-position: center 18%). The original is untouched.

Adjustments, gentle by design:
- exposure: +0.25 EV (linear gain)
- shadows: lifted with a curve that peaks around the lower-mid tones and
  leaves highlights alone
- white balance: a touch warmer (red up, blue down, in linear light)
- background: dark, bluish pixels (the backdrop and sweater, not hair,
  glasses or skin) get an extra lift and keep their blue, so the backdrop
  reads as navy instead of near-black
- light unsharp mask after the resize (radius 1, amount 60%)
"""
import sys
import numpy as np
from PIL import Image, ImageFilter

EXPOSURE_EV = 0.25
SHADOW_LIFT = 0.10
WARM = (1.03, 1.0, 0.965)      # linear-light RGB gains
BG_LIFT = 0.30                 # extra linear gain for the masked backdrop
OUT = (640, 1000)

def to_lin(x): return np.where(x <= 0.04045, x / 12.92, ((x + 0.055) / 1.055) ** 2.4)
def to_srgb(x): return np.where(x <= 0.0031308, x * 12.92, 1.055 * np.clip(x, 0, None) ** (1 / 2.4) - 0.055)
def smooth(e0, e1, x): t = np.clip((x - e0) / (e1 - e0), 0, 1); return t * t * (3 - 2 * t)

def main(name='bess-bright'):
    im = Image.open('images/bess.jpg').convert('RGB')
    w, h = im.size
    cw = round(h * OUT[0] / OUT[1])                  # 16:25 crop width
    x0 = (w - cw) // 2
    im = im.crop((x0, 0, x0 + cw, h)).resize(OUT, Image.LANCZOS)

    s = np.asarray(im).astype(np.float64) / 255
    lin = to_lin(s)

    # Backdrop mask: bluish and dark, feathered so there are no edges
    r, g, b = s[..., 0], s[..., 1], s[..., 2]
    luma = 0.2126 * r + 0.7152 * g + 0.0722 * b
    mask = smooth(0.02, 0.08, b - r) * (1 - smooth(0.25, 0.42, luma))
    # grow the mask up to the hair/shoulder edge before feathering, so the
    # backdrop right beside the subject is lifted too (no dark rim)
    mask_img = (Image.fromarray((mask * 255).astype(np.uint8))
                .filter(ImageFilter.MaxFilter(7)).filter(ImageFilter.GaussianBlur(3)))
    mask = (np.asarray(mask_img).astype(np.float64) / 255)[..., None]

    lin = lin * 2 ** EXPOSURE_EV
    warm = np.array(WARM)
    lin = lin * (warm * (1 - mask) + 1.0 * mask)      # keep the backdrop's blue
    lin = lin * (1 + BG_LIFT * mask)

    out = to_srgb(np.clip(lin, 0, 1))
    out = out + SHADOW_LIFT * 4 * out * (1 - out) ** 2   # +~0.06 near 1/3, 0 at ends
    out = Image.fromarray((np.clip(out, 0, 1) * 255 + 0.5).astype(np.uint8))
    out = out.filter(ImageFilter.UnsharpMask(radius=1, percent=60, threshold=0))
    out.save(f'images/{name}.jpg', quality=82, optimize=True, progressive=True)
    out.save(f'images/{name}.webp', quality=80, method=6)
    print(f'images/{name}.jpg / .webp  {OUT[0]}x{OUT[1]}')

if __name__ == '__main__':
    main(*sys.argv[1:])
