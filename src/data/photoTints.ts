/**
 * Tile colour per product photo, sampled from the median colour of each
 * image's own border.
 *
 * The catalogue mixes drawn artwork on white with photographs that carry
 * their own backdrops. Letterboxing a photo inside a white well shows two
 * nested backgrounds, which is what made the grid look unfinished. Tinting
 * the tile to the photo's edge makes photo and tile read as one block, the
 * way an illustration sits on its own field — and unlike a cover-crop it
 * cannot cut the product out of frame.
 *
 * Generated from the images; regenerate if the photography changes.
 */
export const photoTints: Record<string, string> = {
  "25w-fast-charger": "#1f241e",
  "clear-case-15": "#dfdadf",
  "galaxy-a55": "#c8c1c8",
  "galaxy-s24-ultra": "#012138",
  "galaxy-s24": "#6e6f83",
  "galaxy-tab-s9": "#b5b8bd",
  "galaxy-z-flip-5": "#9aa3a5",
  "ipad-mini": "#d8cbc5",
  "iphone-15-pro-max-cutout": "#bbb2aa",
  "iphone-15-pro-max": "#adb6bf",
  "iphone-15": "#f0dbb0",
  "iphone-se": "#6b8a9c",
  "magsafe-charger": "#d9dde8",
  "motorola-edge-50": "#161c1b",
  "nothing-phone-2": "#765743",
  "oneplus-12": "#adc9d4",
  "pixel-8-pro": "#3e3e3e",
  "pixel-8": "#060606",
  "pixel-8a": "#776e8f",
  "power-bank-20000": "#e1e1e6",
  "screen-protector": "#e6dfdb",
  "wireless-earbuds-pro": "#cfcccd",
  "xiaomi-14": "#a6a6a5",
}
