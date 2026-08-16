#!/usr/bin/env python3
"""
Violet Pool Card – brand asset generator.

Renders the card's icon and logo into the PNG sizes Home Assistant, HACS and
the repository README expect. Everything is drawn from code so the assets can
be regenerated reproducibly:

    pip install pillow
    python3 scripts/generate-brand-assets.py

Outputs
-------
brand/icon.png            256x256   light-mode icon
brand/icon@2x.png         512x512
brand/dark_icon.png       256x256   dark-mode icon
brand/dark_icon@2x.png    512x512
brand/logo.png            h=256     light-mode logo (dark wordmark)
brand/logo@2x.png         h=512
brand/dark_logo.png       h=256     dark-mode logo (light wordmark)
brand/dark_logo@2x.png    h=512
icon.png                  256x256   repository icon (HACS / GitHub)
logo.png                  h=256     repository logo (README header)

The card mark: a violet rounded square holding a white water drop above two
waves – readable down to 32 px, which is the size HACS renders.
"""

from __future__ import annotations

import math
import os
from PIL import Image, ImageDraw, ImageFont

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BRAND_DIR = os.path.join(ROOT, "brand")

# Supersampling factor – everything is drawn large and downscaled for AA.
SS = 4

# Violet palette, matching the card's `--vpc-primary` accent family.
VIOLET_TOP = (139, 46, 199)
VIOLET_BOTTOM = (74, 13, 122)
VIOLET_TOP_DARK = (167, 87, 219)
VIOLET_BOTTOM_DARK = (95, 25, 150)

WORDMARK_LIGHT = (255, 255, 255)
WORDMARK_DARK = (46, 11, 87)
SUBMARK_LIGHT = (214, 190, 235)
SUBMARK_DARK = (109, 76, 148)

FONT_CANDIDATES = [
    "/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf",
    "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
    "/usr/share/fonts/truetype/freefont/FreeSansBold.ttf",
]


def load_font(size: int) -> ImageFont.FreeTypeFont:
    for path in FONT_CANDIDATES:
        if os.path.exists(path):
            return ImageFont.truetype(path, size)
    raise SystemExit("No bold sans-serif font found; install fonts-liberation.")


def vertical_gradient(size: tuple[int, int], top: tuple[int, int, int],
                      bottom: tuple[int, int, int]) -> Image.Image:
    """Vertical linear gradient as an RGBA image."""
    width, height = size
    gradient = Image.new("RGBA", (1, height))
    pixels = gradient.load()
    for y in range(height):
        t = y / max(height - 1, 1)
        pixels[0, y] = (
            round(top[0] + (bottom[0] - top[0]) * t),
            round(top[1] + (bottom[1] - top[1]) * t),
            round(top[2] + (bottom[2] - top[2]) * t),
            255,
        )
    return gradient.resize((width, height), Image.NEAREST)


def water_mask(size: int, baseline: float, amplitude: float, phase: float,
               waves: float = 1.6) -> Image.Image:
    """
    Everything below a sine surface, as an L-mode mask.

    Filling the body of the water (rather than stroking a thin line) keeps the
    edges clean once the supersampled canvas is downscaled.
    """
    mask = Image.new("L", (size, size), 0)
    points = [(0, size), (0, baseline * size)]
    for step in range(0, size + 1, max(size // 400, 1)):
        y = baseline * size + math.sin(phase + (step / size) * waves * 2 * math.pi) * amplitude * size
        points.append((step, y))
    points.append((size, size))
    ImageDraw.Draw(mask).polygon(points, fill=255)
    return mask


def wave_band_mask(size: int, baseline: float, amplitude: float, phase: float,
                   thickness: float, waves: float = 1.5) -> Image.Image:
    """
    A wave-shaped ribbon between two parallel sine curves.

    Drawn as a filled polygon rather than a thick stroke – `ImageDraw.line`
    with a large width leaves serrated joins that survive the downscale.
    """
    mask = Image.new("L", (size, size), 0)
    step = max(size // 400, 1)

    def surface(x: float, offset: float) -> float:
        return (baseline + offset) * size + math.sin(
            phase + (x / size) * waves * 2 * math.pi
        ) * amplitude * size

    top_edge = [(x, surface(x, 0)) for x in range(0, size + 1, step)]
    bottom_edge = [(x, surface(x, thickness)) for x in range(size, -1, -step)]
    ImageDraw.Draw(mask).polygon(top_edge + bottom_edge, fill=255)
    return mask


def droplet_mask(size: int, cx: float, cy: float, radius: float) -> Image.Image:
    """
    Classic teardrop: a circle with a tangent cone on top.

    `cx`/`cy`/`radius` are fractions of `size`; `cy` is the circle's centre.
    """
    mask = Image.new("L", (size, size), 0)
    draw = ImageDraw.Draw(mask)
    x, y, r = cx * size, cy * size, radius * size
    tip_y = y - r * 2.55

    draw.ellipse((x - r, y - r, x + r, y + r), fill=255)

    # Tangent points from the tip onto the circle, so the cone meets the sphere
    # without a visible seam: cos(theta) = r / distance.
    distance = y - tip_y
    cos_theta = r / distance
    sin_theta = math.sqrt(max(1 - cos_theta * cos_theta, 0.0))
    offset_x = r * sin_theta
    offset_y = r * cos_theta

    draw.polygon(
        [(x, tip_y), (x - offset_x, y - offset_y), (x + offset_x, y - offset_y)],
        fill=255,
    )
    return mask


def rounded_rect_mask(size: int, radius_ratio: float) -> Image.Image:
    mask = Image.new("L", (size, size), 0)
    ImageDraw.Draw(mask).rounded_rectangle(
        (0, 0, size - 1, size - 1), radius=int(size * radius_ratio), fill=255
    )
    return mask


def overlay(base: Image.Image, mask: Image.Image, alpha: int) -> Image.Image:
    """Composite flat white at `alpha` through `mask` onto `base`."""
    layer = Image.new("RGBA", base.size, (255, 255, 255, alpha))
    return Image.alpha_composite(base, Image.composite(
        layer, Image.new("RGBA", base.size, (255, 255, 255, 0)), mask
    ))


def render_icon(size: int, dark: bool) -> Image.Image:
    canvas = size * SS
    top = VIOLET_TOP_DARK if dark else VIOLET_TOP
    bottom = VIOLET_BOTTOM_DARK if dark else VIOLET_BOTTOM

    icon = vertical_gradient((canvas, canvas), top, bottom)

    # Soft highlight in the upper left so the tile does not look flat.
    highlight = Image.new("RGBA", (canvas, canvas), (255, 255, 255, 0))
    ImageDraw.Draw(highlight).ellipse(
        (-canvas * 0.35, -canvas * 0.55, canvas * 0.85, canvas * 0.42),
        fill=(255, 255, 255, 26),
    )
    icon = Image.alpha_composite(icon, highlight)

    # Two wave bands rather than a solid water body – keeps the violet tile
    # dominant so the mark still reads as violet at 32 px.
    icon = overlay(icon, wave_band_mask(canvas, 0.700, 0.032, 0.0, 0.062, waves=1.4), 255)
    icon = overlay(icon, wave_band_mask(canvas, 0.845, 0.028, 2.3, 0.052, waves=1.4), 150)

    # The drop sits clear of the water line so both shapes stay readable.
    icon = overlay(icon, droplet_mask(canvas, 0.5, 0.375, 0.140), 255)

    # Clip to the rounded square.
    icon.putalpha(rounded_rect_mask(canvas, 0.225))
    return icon.resize((size, size), Image.LANCZOS)


def render_logo(height: int, dark: bool) -> Image.Image:
    """Mark + wordmark on a transparent background; width follows the text."""
    canvas_h = height * SS

    title_font = load_font(int(canvas_h * 0.34))
    sub_font = load_font(int(canvas_h * 0.155))
    title = "VIOLET"
    subtitle = "P O O L   C A R D"

    ruler = ImageDraw.Draw(Image.new("RGBA", (1, 1)))
    title_w = ruler.textlength(title, font=title_font)
    sub_w = ruler.textlength(subtitle, font=sub_font)

    mark_size = int(canvas_h * 0.84)
    pad = int(canvas_h * 0.09)
    gap = int(canvas_h * 0.20)
    canvas_w = int(pad + mark_size + gap + max(title_w, sub_w) + pad)

    logo = Image.new("RGBA", (canvas_w, canvas_h), (255, 255, 255, 0))
    logo.alpha_composite(render_icon(mark_size, dark), (pad, (canvas_h - mark_size) // 2))

    draw = ImageDraw.Draw(logo)
    text_x = pad + mark_size + gap
    title_color = WORDMARK_LIGHT if dark else WORDMARK_DARK
    sub_color = SUBMARK_LIGHT if dark else SUBMARK_DARK

    # Baselines chosen so the two lines sit optically centred in the canvas.
    draw.text((text_x, canvas_h * 0.475), title, font=title_font, fill=title_color, anchor="ls")
    draw.text((text_x, canvas_h * 0.755), subtitle, font=sub_font, fill=sub_color, anchor="ls")

    return logo.resize((canvas_w // SS, height), Image.LANCZOS)


def save(image: Image.Image, *path_parts: str) -> None:
    path = os.path.join(ROOT, *path_parts)
    os.makedirs(os.path.dirname(path), exist_ok=True)
    image.save(path, "PNG", optimize=True)
    print(f"  {os.path.relpath(path, ROOT)}  {image.width}x{image.height}")


def main() -> None:
    print("Generating brand assets…")

    save(render_icon(256, dark=False), "brand", "icon.png")
    save(render_icon(512, dark=False), "brand", "icon@2x.png")
    save(render_icon(256, dark=True), "brand", "dark_icon.png")
    save(render_icon(512, dark=True), "brand", "dark_icon@2x.png")

    save(render_logo(256, dark=False), "brand", "logo.png")
    save(render_logo(512, dark=False), "brand", "logo@2x.png")
    save(render_logo(256, dark=True), "brand", "dark_logo.png")
    save(render_logo(512, dark=True), "brand", "dark_logo@2x.png")

    # Repository-level assets used by HACS and the README header.
    save(render_icon(256, dark=False), "icon.png")
    save(render_logo(256, dark=False), "logo.png")

    print("Done.")


if __name__ == "__main__":
    main()
