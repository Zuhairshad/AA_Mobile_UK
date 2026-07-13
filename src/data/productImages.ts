const modules = import.meta.glob("../assets/products/*.jpg", {
  eager: true,
  import: "default",
}) as Record<string, string>

export const productImages: Record<string, string> = Object.fromEntries(
  Object.entries(modules).map(([path, url]) => {
    const id = path.split("/").pop()!.replace(".jpg", "")
    return [id, url]
  }),
)
