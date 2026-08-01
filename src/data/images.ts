const photos = import.meta.glob("../assets/products/*.{jpg,webp}", {
  eager: true,
  import: "default",
}) as Record<string, string>

/** Basename without extension → resolved asset URL. */
export const productPhotos: Record<string, string> = Object.fromEntries(
  Object.entries(photos).map(([path, url]) => {
    const file = path.split("/").pop()!
    return [file.replace(/\.(jpg|webp)$/, ""), url]
  }),
)

/** Cut-out hero render, used on the home page above the fold. */
export const heroCutout = productPhotos["iphone-15-pro-max-cutout"]
