import fs from 'node:fs'
import path from 'node:path'

/**
 * Fetches product photography for the parts catalogue from iFixit.
 *
 *   node --experimental-strip-types scripts/fetch-ifixit-photos.mjs
 *
 * The route to a usable photo is not obvious, so it is worth writing down. There
 * is no public store API — /api/2.0/store/* redirects to the Next.js storefront —
 * but every repair guide carries a `parts` array, and each entry links the store
 * product it needs. So: device name -> category wiki -> replacement guides ->
 * guide detail -> parts[] -> store product.
 *
 * The thumbnail the guide API hands back is NOT the one to use. Most parts are
 * sold in two variants, "Part Only" and "Fix Kit", and the guide points at the
 * kit — so the picture is the part surrounded by tweezers, opening picks and a
 * sheet of adhesive. On a listing of bare parts that is simply the wrong photo,
 * and every kit shot looks like every other kit shot.
 *
 * The variant images are on the product page, each swatch labelled with its
 * option name, which makes picking the bare part deterministic rather than a
 * guess. og:image is not a shortcut: it is the kit shot too.
 *
 * Responses are cached under .cache/ifixit so re-runs are free and the API only
 * sees each URL once. Delete that directory to refetch.
 *
 * Writes:
 *   src/assets/products/parts/<hash>.jpg     the images
 *   src/data/partPhotos.generated.json       device+kind -> file, with sources
 */

const API = 'https://www.ifixit.com/api/2.0'
const CACHE = '.cache/ifixit'
const OUT_DIR = 'src/assets/products/parts'
const MANIFEST = 'src/data/partPhotos.generated.json'
const CONCURRENCY = 4

/**
 * Part names as the iFixit store writes them, mapped to our own part kinds.
 * `not` exists because "iPhone 13 Display Assembly Adhesive" and "Battery
 * Adhesive Strips" both sit in the parts list next to the thing they stick down,
 * and an adhesive strip photographs as a bag of tape.
 */
const KIND_PATTERNS = [
  { kind: 'screen', re: /\b(screen|display assembly|lcd|oled)\b/i, not: /adhesive|protector|bezel|cover glass only/i },
  { kind: 'battery', re: /\bbattery\b/i, not: /adhesive|tester|case|bank/i },
  // "USB-C Charge Port", "Charging Daughter Board", "Lightning Connector
  // Assembly", "USB Connector" — four different names for the same shelf.
  { kind: 'charging', re: /charg(e|ing) (port|assembly|flex|coil|daughter board)|lightning connector|dock connector|usb-?c? (charge )?(port|connector)|usb connector/i, not: /adhesive|cable$|charger\b/i },
  { kind: 'rear-camera', re: /\brear[- ]?(facing )?camera\b/i, not: /adhesive|lens (protector|cover)/i },
  { kind: 'front-camera', re: /\bfront[- ]?(facing )?camera\b|selfie camera/i, not: /adhesive/i },
  { kind: 'back-glass', re: /\b(back|rear) (glass|cover|panel|housing)\b/i, not: /adhesive|protector/i },
  { kind: 'speaker', re: /loudspeaker|earpiece speaker|\bspeaker\b/i, not: /adhesive|mesh|grille/i },
]

/**
 * Products to refuse, because the photograph carries iFixit's own branding.
 *
 * Their own-brand replacement batteries have "iFixit" printed on the cell, so the
 * picture shows their product rather than whatever the shop stocks. Every other
 * part they list — screens, cameras, flex boards, back covers — is an OEM or
 * aftermarket component with no mark on it, which is why this is a narrow rule
 * and not a whole-catalogue problem.
 *
 * Established by running tesseract over all 191 images for the wordmark and then
 * looking at contact sheets of every one for logo-only cases. OCR alone missed
 * two Samsung cells where the mark is small; the URL alone would have been enough
 * for all of them, so that is what the rule keys on. Anything excluded here falls
 * back to an unbranded photo of the same component or to the drawing.
 */
const OWN_BRAND = /replacement-battery|\/ifixit-/

/** Guides worth opening, most likely to yield a part first. */
const GUIDE_PATTERNS = [
  /screen|display/i,
  /battery/i,
  /charging|lightning|usb-?c|dock/i,
  /rear[- ]?facing camera|rear camera/i,
  /front[- ]?facing camera|front camera/i,
  /back glass|rear glass|rear cover|back cover/i,
  /loudspeaker|speaker|earpiece/i,
]

fs.mkdirSync(CACHE, { recursive: true })
fs.mkdirSync(OUT_DIR, { recursive: true })

const slugCache = (url) =>
  path.join(CACHE, url.replace(/[^a-z0-9]+/gi, '_').slice(-180) + '.json')

async function getJson(url) {
  const file = slugCache(url)
  if (fs.existsSync(file)) return JSON.parse(fs.readFileSync(file, 'utf8'))
  const res = await fetch(url)
  if (!res.ok) {
    fs.writeFileSync(file, 'null')
    return null
  }
  const body = await res.json()
  fs.writeFileSync(file, JSON.stringify(body))
  return body
}

/**
 * The bare-part image for a store product.
 *
 * Reads the variant swatches, which look like
 *   <img ... src="<image url>"> … <span>Option</span>Part Only<span>
 * and returns the one whose option is not a kit. Single-variant products have no
 * swatches at all, and there og:image is the part, so it is the right fallback.
 *
 * The whole image URL is captured rather than an id under an assumed path. Their
 * store serves two shapes — /files/<hash>.jpg for newer products and
 * /products/<hash>_<uuid>.jpg for older ones — and a pattern that only knew the
 * first silently dropped 88 of 179 products back to the kit shot.
 *
 * Only the extracted result is cached — the pages are 440KB each and there is no
 * reason to keep 170 of them on disk.
 */
async function bareVariant(productUrl) {
  const file = slugCache('variant_' + productUrl)
  if (fs.existsSync(file)) return JSON.parse(fs.readFileSync(file, 'utf8'))

  let out = null
  try {
    // A bare fetch() gets refused often enough that half the catalogue silently
    // fell back to kit shots on the first run. A named user agent and a couple of
    // retries fixed it; nulls are not cached, so a rerun retries them.
    let res
    for (const wait of [0, 1500, 4000]) {
      if (wait) await new Promise((r) => setTimeout(r, wait))
      res = await fetch(productUrl, {
        headers: { 'user-agent': 'aa-mobile-uk-asset-fetch/1.0 (+storefront imagery)' },
      })
      if (res.ok) break
    }
    if (res?.ok) {
      const html = (await res.text()).replace(/&amp;/g, '&')
      const swatches = []
      const re =
        /\ssrc="(https:\/\/cdn\.shopify\.com\/[^"]+\.(?:jpg|jpeg|png|webp)[^"]*)"\s*\/?>[\s\S]{0,400}?Option<\/span>([^<]+)</g
      for (const m of html.matchAll(re)) {
        swatches.push({ url: m[1], option: m[2].trim() })
      }

      const bare =
        swatches.find((s) => /^part only$/i.test(s.option)) ??
        swatches.find((s) => !/kit/i.test(s.option))
      if (bare) {
        out = { url: bare.url, variant: bare.option }
      } else {
        const og = /property="og:image" content="(https:\/\/cdn\.shopify\.com\/[^"]+)"/.exec(html)
        if (og) out = { url: og[1], variant: swatches.length ? 'kit only' : 'single' }
      }
    }
  } catch {
    out = null
  }
  // Only successes are cached: a cached failure would be permanent.
  if (out) fs.writeFileSync(file, JSON.stringify(out))
  return out
}

/** iFixit's own title for a device, or null if it does not have one. */
async function resolveWiki(device) {
  const direct = device.name.replace(/ /g, '_')
  const hit = await getJson(`${API}/wikis/CATEGORY/${encodeURIComponent(direct)}`)
  if (hit?.title) return hit

  // Their titles do not always match ours — "iPad Pro 11" 4th Gen" and
  // "Nothing Phone (2a)" both miss. Search resolves the rest.
  const found = await getJson(
    `${API}/search/${encodeURIComponent(device.name)}?filter=category&limit=5`,
  )
  const first = (found?.results || []).find((r) => r.dataType === 'wiki' && r.title)
  if (!first) return null
  return await getJson(`${API}/wikis/CATEGORY/${encodeURIComponent(first.title)}`)
}

function kindOf(text) {
  for (const { kind, re, not } of KIND_PATTERNS) {
    if (re.test(text) && !not.test(text)) return kind
  }
  return null
}

/** cart-products URL -> the stable hash iFixit files it under. */
function hashOf(url) {
  const m = /cart-products\/([A-Za-z0-9]+)\./.exec(url)
  return m ? m[1] : null
}

const { devices } = await import('../src/data/devices.ts')

const found = new Map() // `${slug}|${kind}` -> { hash, part, productUrl, guide }
const images = new Map() // hash -> { name, productUrl }
const unresolved = []
let done = 0

async function harvest(device) {
  const wiki = await resolveWiki(device)
  if (!wiki) {
    unresolved.push(device.slug)
    return
  }

  const wanted = new Set(device.parts)
  const guides = (wiki.guides || [])
    .filter((g) => GUIDE_PATTERNS.some((re) => re.test(g.title || '')))
    // Replacement guides carry the part being fitted; techniques often do not.
    .sort((a, b) => (b.type === 'replacement') - (a.type === 'replacement'))

  for (const g of guides) {
    if (wanted.size === 0) break
    const detail = await getJson(`${API}/guides/${g.guideid}`)
    for (const part of detail?.parts || []) {
      const kind = kindOf(part.text || '')
      if (!kind || !wanted.has(kind)) continue
      if (OWN_BRAND.test(part.url || '')) continue
      const hash = hashOf(part.thumbnail || '')
      if (!hash) continue
      found.set(`${device.slug}|${kind}`, {
        hash,
        part: part.text,
        productUrl: part.url,
        guide: detail.url,
      })
      images.set(hash, { name: part.text, productUrl: part.url })
      wanted.delete(kind)
    }
  }

  done++
  if (done % 10 === 0) console.log(`  ${done}/${devices.length} devices, ${found.size} part photos`)
}

console.log(`Resolving ${devices.length} devices…`)
let cursor = 0
await Promise.all(
  Array.from({ length: CONCURRENCY }, async () => {
    while (cursor < devices.length) await harvest(devices[cursor++])
  }),
)

console.log(`\n${found.size} device/part matches across ${images.size} products`)
if (unresolved.length) console.log(`no iFixit page for: ${unresolved.join(', ')}`)

// --- resolve each product to its bare-part variant --------------------------
const productUrls = [...new Set([...images.values()].map((v) => v.productUrl))].filter(Boolean)
console.log(`\nResolving bare-part variants for ${productUrls.length} products…`)
const variantFor = new Map() // productUrl -> { hash, variant }
let resolved = 0
cursor = 0
await Promise.all(
  Array.from({ length: CONCURRENCY }, async () => {
    while (cursor < productUrls.length) {
      const url = productUrls[cursor++]
      const v = await bareVariant(url)
      if (v) variantFor.set(url, v)
      if (++resolved % 25 === 0) console.log(`  ${resolved}/${productUrls.length}`)
    }
  }),
)
const kinds = {}
for (const v of variantFor.values()) kinds[v.variant] = (kinds[v.variant] ?? 0) + 1
console.log('variants chosen:', kinds)

/** Stable, traceable filename for an image URL. */
function idFor(url) {
  const base = decodeURIComponent(new URL(url).pathname.split('/').pop() ?? '')
    .replace(/\.(jpg|jpeg|png|webp)$/i, '')
    .replace(/[^A-Za-z0-9]/g, '')
  return base.slice(0, 24) || 'img'
}

/**
 * Point every device/part at its product's bare-part image, keeping the guide
 * thumbnail only where the page could not be read at all.
 */
const finalImages = new Map() // id -> { url, name, productUrl, variant }
for (const entry of found.values()) {
  const v = variantFor.get(entry.productUrl)
  const url =
    v?.url ??
    `https://cart-products.cdn.ifixit.com/cart-products/${entry.hash}.medium`
  entry.id = idFor(url)
  entry.variant = v?.variant ?? 'guide thumbnail'
  finalImages.set(entry.id, {
    url,
    name: entry.part,
    productUrl: entry.productUrl,
    variant: entry.variant,
  })
}

// --- download ---------------------------------------------------------------
const ids = [...finalImages.keys()]
let fetched = 0
cursor = 0
await Promise.all(
  Array.from({ length: CONCURRENCY }, async () => {
    while (cursor < ids.length) {
      const id = ids[cursor++]
      const { url } = finalImages.get(id)
      const dest = path.join(OUT_DIR, `${id}.jpg`)
      if (fs.existsSync(dest)) continue
      // 600px: the widest a product card renders is 448, and the detail page
      // scales a square to about 525. Their CDN resizes on request, so ask for
      // that rather than shipping the 2000px original.
      const sized = url.includes('cdn.shopify.com')
        ? url.replace(/([?&])width=\d+/, '$1width=600') +
          (/[?&]width=/.test(url) ? '' : (url.includes('?') ? '&' : '?') + 'width=600')
        : url
      const res = await fetch(sized, {
        headers: { 'user-agent': 'aa-mobile-uk-asset-fetch/1.0 (+storefront imagery)' },
      })
      if (!res.ok) {
        console.log(`  ! ${id} HTTP ${res.status}`)
        finalImages.delete(id)
        continue
      }
      fs.writeFileSync(dest, Buffer.from(await res.arrayBuffer()))
      if (++fetched % 25 === 0) console.log(`  downloaded ${fetched}`)
    }
  }),
)
console.log(`downloaded ${fetched} new images`)

// --- manifest ---------------------------------------------------------------
const manifest = {
  note: 'Generated by scripts/fetch-ifixit-photos.mjs. Do not edit by hand.',
  source: 'iFixit store product photography, reached through the public guide API.',
  fetched: new Date().toISOString().slice(0, 10),
  byDeviceKind: Object.fromEntries(
    [...found]
      .filter(([, v]) => finalImages.has(v.id))
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, v]) => [key, v.id]),
  ),
  images: Object.fromEntries(
    [...finalImages].sort(([a], [b]) => a.localeCompare(b)).map(([id, v]) => [
      id,
      { name: v.name, product: v.productUrl, variant: v.variant, source: v.url },
    ]),
  ),
}
/*
 * No tool photography.
 *
 * There was a stage here that matched our fourteen tools to their store
 * equivalents — Pro Tech Toolkit for the bench kit, iOpener for the heat pad, and
 * so on. It is gone, and the tools keep their drawings.
 *
 * The reason is not the logo, though several are visibly branded. It is that
 * every one of those photographs is of an iFixit product, so a listing selling
 * "Bench Pro Toolkit" illustrated with their Pro Tech Toolkit is showing a
 * different item to the one in the box. Parts are OEM components that any
 * supplier ships; a tool kit is somebody's product. Cropping the logo out would
 * hide the problem rather than fix it.
 */

/**
 * Drop images nothing references, so switching variants does not leave the
 * superseded kit shots behind to be bundled. Runs last, against the finished
 * manifest — an earlier version pruned before the tools were fetched, which
 * deleted every tool photo on the following run.
 */
let pruned = 0
for (const file of fs.readdirSync(OUT_DIR)) {
  if (!manifest.images[file.replace(/\.jpg$/, '')]) {
    fs.unlinkSync(path.join(OUT_DIR, file))
    pruned++
  }
}
console.log(`pruned ${pruned} unreferenced images`)

fs.writeFileSync(MANIFEST, JSON.stringify(manifest, null, 2) + '\n')
console.log(`wrote ${MANIFEST}`)
