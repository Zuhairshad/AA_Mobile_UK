import manifest from "./partPhotos.generated.json"
import { devices, type PartKind } from "./devices"

/**
 * Photographs for the parts catalogue.
 *
 * iFixit sells parts for the models a UK shop sees most, and not for the rest, so
 * this resolves in tiers rather than all-or-nothing. 401 parts, of which roughly
 * three quarters end up with a photograph and the remainder keep their drawing —
 * OnePlus, Xiaomi, Nothing and Motorola almost entirely, because there is no
 * photography to be had for them.
 *
 *   exact   this model, this part
 *   family  same generation, e.g. an iPhone 13 mini battery shown as the 13's
 *   brand   same maker and form factor, a generation or two apart
 *
 * `brand` is deliberately closed to screens and back glass. A battery or a
 * charging flex is the same object across four years of one maker's phones, but a
 * screen assembly is a specific size with a specific cutout and a back panel has
 * the camera bump moulded into it — showing last year's would be wrong in a way
 * a customer can see. Those two stay exact-or-family, and fall back to the
 * drawing, which never claims to be the specific item.
 */

/** Kinds whose appearance holds still across one maker's range. */
const BRAND_TIER_KINDS = new Set<PartKind>([
  "battery",
  "charging",
  "speaker",
  "rear-camera",
  "front-camera",
])

const files = import.meta.glob("../assets/products/parts/*.jpg", {
  eager: true,
  import: "default",
}) as Record<string, string>

/** iFixit's image hash → the bundled asset URL. */
const byHash: Record<string, string> = Object.fromEntries(
  Object.entries(files).map(([p, url]) => [
    p.split("/").pop()!.replace(/\.jpg$/, ""),
    url,
  ]),
)

const deviceBySlug = new Map(devices.map((d) => [d.slug, d]))

const exact = new Map<string, string>()
const family = new Map<string, string>()
const brand = new Map<string, string>()

for (const [key, hash] of Object.entries(manifest.byDeviceKind)) {
  if (!byHash[hash]) continue
  exact.set(key, hash)
  const [slug, kind] = key.split("|")
  const device = deviceBySlug.get(slug)
  if (!device) continue
  const fk = `${device.brand}|${device.family}|${kind}`
  if (!family.has(fk)) family.set(fk, hash)
  const bk = `${device.brand}|${device.kind}|${kind}`
  if (!brand.has(bk)) brand.set(bk, hash)
}

export type PartPhoto = {
  src: string
  /** How close the match is. Anything but `exact` is a stand-in. */
  match: "exact" | "family" | "brand"
  /** What the photographed part is called, for the alt text and the caption. */
  name: string
}

export function partPhotoFor(
  deviceSlug: string,
  kind: PartKind,
): PartPhoto | undefined {
  const device = deviceBySlug.get(deviceSlug)
  if (!device) return undefined

  const tiers: [PartPhoto["match"], string | undefined][] = [
    ["exact", exact.get(`${deviceSlug}|${kind}`)],
    ["family", family.get(`${device.brand}|${device.family}|${kind}`)],
    [
      "brand",
      BRAND_TIER_KINDS.has(kind)
        ? brand.get(`${device.brand}|${device.kind}|${kind}`)
        : undefined,
    ],
  ]

  for (const [match, hash] of tiers) {
    if (!hash) continue
    const src = byHash[hash]
    if (!src) continue
    const name = (manifest.images as Record<string, { name: string }>)[hash]?.name
    return { src, match, name: name ?? "" }
  }
  return undefined
}
