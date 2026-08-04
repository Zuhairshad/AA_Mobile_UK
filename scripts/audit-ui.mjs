import fs from 'node:fs'
import { chromium } from 'playwright'

/**
 * UI audit. Run the production build (`npm run build && npm run preview`), then:
 *   BASE=http://127.0.0.1:4173 node scripts/audit-ui.mjs
 *
 * Checks representative routes at 320/768/1440 for duplicate ids, heading-level
 * skips, controls with no accessible name, unlabelled fields, colour contrast,
 * target sizes, horizontal overflow, dead scroll space below the footer, dead
 * hrefs, and keyboard behaviour
 * (skip link, focus visibility, modal focus trap, full-screen overlays really
 * covering the viewport, dead scroll space after navigation and resize).
 * Exits non-zero on findings.
 *
 * Exempted from contrast: text inside an aria-hidden subtree that conveys no
 * information — currently only the measuring rails' tick numbers, which are a
 * drafting artefact. WCAG 1.4.3 exempts decorative text; everything a user can
 * actually read is still measured.
 *
 * Two things it deliberately does NOT guess at: colours are resolved through a
 * canvas because Tailwind v4 emits oklch() that a regex will silently miss, and
 * text on a gradient or photo is skipped rather than measured against an
 * invented background — both produced large numbers of false positives before.
 */
const BASE = process.env.BASE || 'http://127.0.0.1:4210'
const OUT = process.env.OUT || '.'

const ROUTES = [
  '/', '/phones', '/parts', '/parts/screens', '/tools', '/accessories',
  '/product/iphone-13-screen', '/product/bench-pro-toolkit', '/product/iphone-15-pro-max',
  '/devices', '/device/iphone-13', '/brand/apple',
  '/guides', '/guide/iphone-screen-replacement',
  '/repairs', '/repairs/screen-replacement',
  '/sell', '/about', '/cart', '/search?q=battery', '/sitemap', '/nonsense',
]
const WIDTHS = [320, 768, 1440]

/** Runs in the page. Returns structured findings, no judgement calls. */
const collect = () => {
  const vis = el => {
    const r = el.getBoundingClientRect()
    const cs = getComputedStyle(el)
    return r.width > 0 && r.height > 0 && cs.visibility !== 'hidden' && cs.display !== 'none' && cs.opacity !== '0'
  }
  const name = el =>
    (el.getAttribute('aria-label') ||
      el.getAttribute('title') ||
      (el.getAttribute('aria-labelledby')
        ? (document.getElementById(el.getAttribute('aria-labelledby'))?.innerText ?? '')
        : '') ||
      el.innerText ||
      el.value ||
      (el.querySelector('img[alt]')?.getAttribute('alt') ?? '') ||
      (el.querySelector('svg title')?.textContent ?? '')
    ).trim()

  // --- contrast helpers -----------------------------------------------------
  const _c = document.createElement('canvas')
  _c.width = _c.height = 1
  const _ctx = _c.getContext('2d', { willReadFrequently: true })
  const parse = css => {
    if (!css || css === 'transparent' || css === 'none') return null
    _ctx.clearRect(0, 0, 1, 1)
    _ctx.fillStyle = '#000000'
    const before = _ctx.fillStyle
    _ctx.fillStyle = css
    if (_ctx.fillStyle === before && !/^#0{3,8}$|^black$|^rgb\(0, 0, 0\)$/i.test(css)) return null
    _ctx.fillRect(0, 0, 1, 1)
    const d = _ctx.getImageData(0, 0, 1, 1).data
    const a = d[3] / 255
    return a === 0 ? { r: 0, g: 0, b: 0, a: 0 } : { r: d[0], g: d[1], b: d[2], a }
  }
  const lum = ({ r, g, b }) => {
    const f = v => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4) }
    return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b)
  }
  const over = (fg, bg) => ({
    r: fg.r * fg.a + bg.r * (1 - fg.a),
    g: fg.g * fg.a + bg.g * (1 - fg.a),
    b: fg.b * fg.a + bg.b * (1 - fg.a),
    a: 1,
  })
  /**
   * True when an absolutely-positioned gradient scrim overlaps the element.
   *
   * The ancestor walk alone cannot see this: a caption laid over a banner image
   * sits in a plain div whose *sibling* is the scrim, so walking up finds the
   * frame's own flat colour and measures white text against it. That reported
   * every product page as a 1.05:1 failure while the painted pixels were 11:1.
   * Text in this situation is unresolvable statically, so it is skipped — same
   * rule as text directly on a gradient.
   */
  const scrimmedBy = el => {
    const r = el.getBoundingClientRect()
    for (let n = el.parentElement; n && n !== document.documentElement; n = n.parentElement) {
      for (const sib of n.children) {
        if (sib === el || sib.contains(el)) continue
        const scs = getComputedStyle(sib)
        if (scs.backgroundImage === 'none' || scs.position === 'static') continue
        const s = sib.getBoundingClientRect()
        const overlaps =
          s.left <= r.left && s.right >= r.right && s.top <= r.top && s.bottom >= r.bottom
        if (overlaps) return true
      }
    }
    return false
  }
  const effectiveBg = el => {
    if (scrimmedBy(el)) return null
    for (let n = el; n && n !== document.documentElement; n = n.parentElement) {
      const ncs = getComputedStyle(n)
      if (ncs.backgroundImage !== 'none') return null // gradient or photo
      const c = parse(ncs.backgroundColor)
      if (c && c.a > 0.15) return c.a >= 1 ? c : over(c, { r: 255, g: 255, b: 255, a: 1 })
    }
    return { r: 255, g: 255, b: 255, a: 1 }
  }
  const ratio = (a, b) => {
    const [hi, lo] = [lum(a), lum(b)].sort((x, y) => y - x)
    return (hi + 0.05) / (lo + 0.05)
  }

  const f = { duplicateIds: [], headings: [], noName: [], unlabelled: [], contrast: [], tapTargets: [], overflow: [], deadSpace: [], offViewport: [], placeholderHref: [], imgNoAlt: [] }

  // --- duplicate ids --------------------------------------------------------
  const byId = new Map()
  for (const el of document.querySelectorAll('[id]')) {
    const id = el.id
    if (!id) continue
    byId.set(id, (byId.get(id) || 0) + 1)
  }
  for (const [id, n] of byId) if (n > 1) f.duplicateIds.push({ id, count: n })

  // --- heading order --------------------------------------------------------
  const hs = [...document.querySelectorAll('h1,h2,h3,h4,h5,h6')].filter(vis)
  const h1s = hs.filter(h => h.tagName === 'H1').length
  if (h1s !== 1) f.headings.push({ issue: `${h1s} h1 elements`, expected: 1 })
  let prev = 0
  for (const h of hs) {
    const lvl = +h.tagName[1]
    if (prev && lvl > prev + 1) {
      f.headings.push({ issue: `h${prev} followed by h${lvl}`, text: h.innerText.trim().slice(0, 50) })
    }
    prev = lvl
  }

  // --- interactive elements without an accessible name ----------------------
  for (const el of document.querySelectorAll('a[href],button,[role="button"],input,select,textarea')) {
    if (!vis(el)) continue
    if (el.tagName === 'INPUT' || el.tagName === 'SELECT' || el.tagName === 'TEXTAREA') {
      const labelled =
        !!el.closest('label') ||
        (el.id && document.querySelector(`label[for="${CSS.escape(el.id)}"]`)) ||
        el.getAttribute('aria-label') ||
        el.getAttribute('aria-labelledby')
      if (!labelled) f.unlabelled.push({ tag: el.tagName, type: el.type ?? null, cls: String(el.className).slice(0, 40) })
      continue
    }
    if (!name(el)) f.noName.push({ tag: el.tagName, href: el.getAttribute('href'), cls: String(el.className).slice(0, 50) })
  }

  // --- placeholder / dead hrefs --------------------------------------------
  for (const a of document.querySelectorAll('a[href]')) {
    if (!vis(a)) continue
    const href = a.getAttribute('href')
    if (href === '#' || href === '' || (href === '/' && !/home/i.test(a.getAttribute('aria-label') || '') && !a.closest('header,footer nav'))) {
      const label = name(a) || a.getAttribute('aria-label') || ''
      if (!/home|back to|shop|aa mobile/i.test(label)) {
        f.placeholderHref.push({ href, label: label.slice(0, 40) })
      }
    }
  }

  // --- images without alt ---------------------------------------------------
  for (const img of document.querySelectorAll('img')) {
    if (!vis(img)) continue
    if (!img.hasAttribute('alt')) f.imgNoAlt.push({ src: (img.currentSrc || img.src).slice(-40) })
  }

  // --- contrast on visible leaf text ---------------------------------------
  const seenContrast = new Set()
  for (const el of document.querySelectorAll('body *')) {
    if (el.children.length || !vis(el)) continue
    const text = el.textContent?.trim()
    if (!text) continue
    // Decorative text is exempt under WCAG 1.4.3. The only such text on the site
    // is the measuring rails' tick numbers, which sit in an aria-hidden subtree
    // and carry no information a user needs.
    if (el.closest('[aria-hidden="true"]')) continue
    const cs = getComputedStyle(el)
    let fg = parse(cs.color)
    if (!fg) continue
    const bg = effectiveBg(el)
    if (!bg) continue
    if (fg.a < 1) fg = over(fg, bg)
    const size = parseFloat(cs.fontSize)
    const bold = +cs.fontWeight >= 700
    const large = size >= 24 || (size >= 18.66 && bold)
    const need = large ? 3 : 4.5
    const got = ratio(fg, bg)
    if (got < need) {
      const key = cs.color + '|' + size + '|' + Math.round(got * 10)
      if (seenContrast.has(key)) continue
      seenContrast.add(key)
      f.contrast.push({
        text: text.slice(0, 34), ratio: +got.toFixed(2), need,
        color: cs.color, bg: `rgb(${Math.round(bg.r)}, ${Math.round(bg.g)}, ${Math.round(bg.b)})`,
        size: Math.round(size), bold,
      })
    }
  }

  // --- tap targets (WCAG 2.2 target size minimum is 24x24) -----------------
  const seenTargets = new Set()
  for (const el of document.querySelectorAll('a[href],button,input[type=checkbox],input[type=radio],[role="button"]')) {
    if (!vis(el)) continue
    const r = el.getBoundingClientRect()
    if (r.width < 24 || r.height < 24) {
      // Exemptions, in the spirit of the WCAG target-size rule:
      if (el.classList.contains('stretched-link')) continue // card is the target
      if (el.closest('.sr-only')) continue // offscreen until focused
      if (el.className && /\bsr-only\b/.test(String(el.className))) continue
      if (el.tagName === 'A' && el.closest('p, li, dd, figcaption, td, th')) continue
      const lbl = el.closest('label')
      if (lbl) {
        const lr = lbl.getBoundingClientRect()
        if (lr.width >= 24 && lr.height >= 24) continue // label is the target
      }
      const key = `${el.tagName}|${Math.round(r.width)}x${Math.round(r.height)}|${String(el.className).slice(0, 20)}`
      if (seenTargets.has(key)) continue
      seenTargets.add(key)
      f.tapTargets.push({ tag: el.tagName, size: `${Math.round(r.width)}x${Math.round(r.height)}`, label: name(el).slice(0, 30), cls: String(el.className).slice(0, 40) })
    }
  }

  // --- dead vertical space below the footer ---------------------------------
  /**
   * Scrollable page left under the footer. Decorative overlays are the usual
   * cause: an absolutely positioned box contributes to scrollHeight, so anything
   * sized from a measurement of the document feeds back into its own height and
   * ratchets upward, leaving thousands of pixels of empty scroll after a
   * client-side navigation from a tall page to a short one.
   */
  const footEl = document.querySelector('footer')
  if (footEl) {
    const footBottom = footEl.getBoundingClientRect().bottom + window.scrollY
    const dead = document.documentElement.scrollHeight - footBottom
    if (dead > 4) {
      const culprits = []
      for (const el of document.querySelectorAll('body *')) {
        const r = el.getBoundingClientRect()
        if (!r.width && !r.height) continue
        if (r.bottom + window.scrollY > footBottom + 1) {
          culprits.push({ tag: el.tagName, cls: String(el.className).slice(0, 50), bottom: Math.round(r.bottom + window.scrollY) })
          if (culprits.length > 3) break
        }
      }
      f.deadSpace.push({ pixels: Math.round(dead), footerBottom: Math.round(footBottom), culprits })
    }
  }

  // --- layout overflow ------------------------------------------------------
  if (document.documentElement.scrollWidth > window.innerWidth + 1) {
    f.overflow.push({ scrollWidth: document.documentElement.scrollWidth, innerWidth: window.innerWidth })
    for (const el of document.querySelectorAll('body *')) {
      if (!vis(el)) continue
      const r = el.getBoundingClientRect()
      if (r.right > window.innerWidth + 2 && r.width <= window.innerWidth * 1.6 && r.width > 40) {
        f.offViewport.push({ tag: el.tagName, cls: String(el.className).slice(0, 50), right: Math.round(r.right) })
        if (f.offViewport.length > 4) break
      }
    }
  }

  return f
}

const browser = await chromium.launch({
  ...(process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {}),
  args: ['--no-sandbox', '--disable-dev-shm-usage', '--no-proxy-server'],
})

const report = {}
for (const width of WIDTHS) {
  const page = await browser.newPage({ viewport: { width, height: 900 } })
  for (const route of ROUTES) {
    await page.goto(BASE + route, { waitUntil: 'networkidle', timeout: 40000 })
    await page.waitForTimeout(150)
    const found = await page.evaluate(collect)
    for (const [kind, items] of Object.entries(found)) {
      if (!items.length) continue
      report[kind] ??= []
      for (const item of items) report[kind].push({ route, width, ...item })
    }
  }
  await page.close()
}

// --- keyboard: skip link, focus visibility, drawer focus handling -----------
const kb = {}
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
await page.goto(BASE + '/parts', { waitUntil: 'networkidle' })
await page.keyboard.press('Tab')
kb.firstTabStop = await page.evaluate(() => {
  const a = document.activeElement
  return a ? `${a.tagName}: ${(a.innerText || a.getAttribute('aria-label') || '').trim().slice(0, 40)}` : null
})
await page.keyboard.press('Enter')
await page.waitForTimeout(400)
kb.skipLinkMovesFocus = await page.evaluate(() => location.hash === '#main' || document.activeElement?.id === 'main')

// tab through and count anything focusable with no visible focus indicator
await page.goto(BASE + '/parts', { waitUntil: 'networkidle' })
let noRing = []
for (let i = 0; i < 45; i++) {
  await page.keyboard.press('Tab')
  const r = await page.evaluate(() => {
    const a = document.activeElement
    if (!a || a === document.body) return null
    const cs = getComputedStyle(a)
    const card = a.closest('article.product-card, article.resource-card')
    const cardCs = card ? getComputedStyle(card) : null
    const hasRing =
      (cs.outlineStyle !== 'none' && parseFloat(cs.outlineWidth) > 0) ||
      cs.boxShadow !== 'none' ||
      (cardCs && cardCs.outlineStyle !== 'none' && parseFloat(cardCs.outlineWidth) > 0)
    return { tag: a.tagName, label: (a.getAttribute('aria-label') || a.innerText || '').trim().slice(0, 30), hasRing }
  })
  if (r && !r.hasRing) noRing.push(r)
}
kb.focusableWithoutVisibleRing = [...new Map(noRing.map(x => [x.tag + x.label, x])).values()]

// drawer: focus moves in, Escape returns control
await page.goto(BASE + '/parts', { waitUntil: 'networkidle' })
await page.getByRole('button', { name: 'Add to basket' }).first().click()
await page.getByRole('button', { name: /Open basket/ }).click()
await page.waitForTimeout(400)
kb.drawerFocusInside = await page.evaluate(() => {
  const dlg = document.querySelector('[role=dialog]')
  return !!dlg && dlg.contains(document.activeElement)
})
// Tab a few times inside and see whether focus escapes the dialog
let escaped = false
for (let i = 0; i < 12; i++) {
  await page.keyboard.press('Tab')
  const inside = await page.evaluate(() => {
    const dlg = document.querySelector('[role=dialog]')
    return !!dlg && dlg.contains(document.activeElement)
  })
  if (!inside) { escaped = true; break }
}
kb.focusEscapesOpenDrawer = escaped

/**
 * Full-screen overlays must actually cover the viewport.
 *
 * `position: fixed` is resolved against the nearest ancestor that establishes a
 * containing block for fixed descendants — which `transform`, `filter` and
 * `backdrop-filter` all do. The sticky header carries `backdrop-filter`, so the
 * mobile menu and search sheet, both `inset-0` inside it, were being clipped to
 * the header's 106px box and rendering as small panels over the page. Nothing in
 * the CSS or the markup looks wrong; only the measured rect shows it.
 */
/**
 * Dead scroll space after a client-side navigation and after a resize.
 *
 * The per-route deadSpace check only ever sees a fresh page load, and the bug it
 * was written for needed neither: it needed a tall page followed by a short one
 * in the same document, or a resize. The pre-fix build measured 5,906px on
 * /sitemap -> /cart and 8,110px on a resize while every fresh load read clean,
 * which is why it reached a reviewer.
 */
kb.deadSpaceAfterInteraction = []
{
  const page2 = await browser.newPage({ viewport: { width: 1024, height: 768 } })
  const dead = () => page2.evaluate(() => {
    const f = document.querySelector('footer')
    if (!f) return 0
    return document.documentElement.scrollHeight - Math.round(f.getBoundingClientRect().bottom + window.scrollY)
  })
  // Tallest page in the site, then the shortest thing linked from it.
  await page2.goto(`${BASE}/sitemap`, { waitUntil: 'networkidle' })
  await page2.waitForTimeout(600)
  for (const to of ['/cart', '/guides', '/about']) {
    const link = page2.locator(`a[href="${to}"]`).first()
    if (await link.count() === 0) continue
    await link.click().catch(() => {})
    await page2.waitForTimeout(600)
    const v = await dead()
    if (v > 4) kb.deadSpaceAfterInteraction.push({ after: `navigate to ${to}`, pixels: v })
    await page2.goto(`${BASE}/sitemap`, { waitUntil: 'networkidle' })
    await page2.waitForTimeout(300)
  }
  // Resizes across the lg breakpoint, where the rails appear and disappear.
  for (const [w, h] of [[1440, 900], [1023, 800], [1024, 800], [390, 844]]) {
    await page2.setViewportSize({ width: w, height: h })
    await page2.waitForTimeout(500)
    const v = await dead()
    if (v > 4) kb.deadSpaceAfterInteraction.push({ after: `resize to ${w}x${h}`, pixels: v })
  }
  await page2.close()
}

kb.overlaysCoverViewport = []
{
  const mobile = await browser.newPage({ viewport: { width: 412, height: 915 } })
  await mobile.goto(`${BASE}/phones`, { waitUntil: 'networkidle' })
  const overlays = [
    { name: 'mobile menu', open: p => p.getByRole('button', { name: 'Open navigation menu' }).click() },
    { name: 'search sheet', open: p => p.keyboard.press('/') },
  ]
  for (const o of overlays) {
    await o.open(mobile).catch(() => {})
    await mobile.waitForTimeout(400)
    const r = await mobile.evaluate(() => {
      const el = [...document.querySelectorAll('.fixed')]
        .find(e => getComputedStyle(e).position === 'fixed' && e.getBoundingClientRect().width > 0)
      const b = el?.getBoundingClientRect()
      return b ? { w: Math.round(b.width), h: Math.round(b.height), vw: innerWidth, vh: innerHeight } : null
    })
    if (!r) kb.overlaysCoverViewport.push({ overlay: o.name, problem: 'no fixed overlay found' })
    else if (r.w < r.vw - 2 || r.h < r.vh - 2) {
      kb.overlaysCoverViewport.push({ overlay: o.name, ...r, problem: 'clipped — check for a containing block on an ancestor' })
    }
    await mobile.keyboard.press('Escape')
    await mobile.waitForTimeout(250)
  }
  await mobile.close()
}

fs.writeFileSync(`${OUT}/ui-audit.json`, JSON.stringify({ report, kb }, null, 1))

console.log('=== KEYBOARD ===')
console.log(JSON.stringify(kb, null, 1))
console.log('\n=== FINDINGS BY KIND ===')
for (const [kind, items] of Object.entries(report)) {
  console.log(`\n## ${kind} (${items.length})`)
  const seen = new Set()
  for (const it of items) {
    const key = JSON.stringify({ ...it, route: undefined, width: undefined })
    if (seen.has(key)) continue
    seen.add(key)
    console.log('  ' + JSON.stringify(it))
    if (seen.size >= 12) { console.log(`  … ${items.length - 12}+ more occurrences`); break }
  }
}
await browser.close()

const total = Object.values(report).reduce((n, items) => n + items.length, 0)
const kbFails =
  (kb.skipLinkMovesFocus ? 0 : 1) +
  kb.focusableWithoutVisibleRing.length +
  (kb.drawerFocusInside ? 0 : 1) +
  (kb.focusEscapesOpenDrawer ? 1 : 0) +
  kb.overlaysCoverViewport.length +
  kb.deadSpaceAfterInteraction.length
console.log(`\n${total} layout/a11y findings, ${kbFails} keyboard findings`)
process.exitCode = total + kbFails > 0 ? 1 : 0
