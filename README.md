# AA Mobile UK

Storefront for a UK phone shop that does three things under one roof: sells
handsets, sells the repair parts and tools it uses on the bench, and books
repairs. Catalogue-first architecture modelled on the iFixit store.

Built with React 19, TypeScript, Vite and Tailwind CSS v4.

## Development

```bash
npm install
npm run dev      # dev server
npm run build    # tsc -b && vite build
npm run lint     # oxlint
npm run preview  # serve the production build
```

## Design system

`src/index.css` holds the whole token layer. One brand scale (`--color-brand-50`
… `--color-brand-950`) drives everything, with semantic aliases on top —
`background`, `foreground`, `card`, `muted`, `primary`, `line`. Components
reference a brand step or an alias, never a raw hex, so a rebrand is a single
edit.

Component primitives are real CSS classes in the same file rather than long
utility strings repeated across components: `btn` + `btn-{variant}` +
`btn-{size}`, `badge-{tone}`, `product-card`, `resource-card`, `field`,
`content-boundary`, `section-y`, `section-heading`.

Two patterns worth knowing:

- **`stretched-link`** — an `::after` overlay makes a whole card clickable from
  a single anchor, so there is no nested-interactive accessibility problem.
- **`bleed-x`** — a carousel viewport that runs to the window edges while its
  items stay aligned to the page gutter. No carousel library.

## Pages

575 routes, all generated from data rather than hand-built. `/sitemap` lists
every one and is generated from the same source, so an orphaned page type shows
up there immediately.

| Route | Count | What it is |
| --- | --- | --- |
| `/` | 1 | Home |
| `/:category` | 4 | Phones, parts, tools, accessories |
| `/:category/:subcategory` | 19 | Canonical page per part type |
| `/product/:id` | 443 | One per product |
| `/device/:slug` | 73 | Every part, repair price and guide for one model |
| `/devices`, `/brand/:slug` | 8 | Device index and per-brand pages |
| `/guide/:slug`, `/guides` | 15 | Repair guides |
| `/repairs`, `/repairs/:service` | 7 | Repairs hub and a page per service |
| `/sell`, `/about`, `/cart`, `/search`, `/sitemap` | 5 | Everything else |

## Structure

```
src/
  data/          devices, parts (derived), catalogue, taxonomy, guides,
                 services, page copy, nav
  lib/           cart (localStorage), faceting, search, formatting
  components/
    ui/          Button, Badge, Icon, Rating, PriceTag, Carousel, Accordion, …
    layout/      Header (menubar + instant search), Footer, Layout
    sections/    the landing-page section types
    product/     ProductCard, ProductGrid, ProductImage, FacetSidebar
  pages/         Home, Category, Product, Device, Devices, Brand, Guide,
                 Guides, Repairs, ServiceDetail, Sell, About, Cart, Search,
                 Sitemap, NotFound
```

### Devices drive the catalogue

`src/data/devices.ts` holds 73 real models. Model names and release years come
from the public iFixit device taxonomy
(`https://www.ifixit.com/api/2.0/categories`), filtered to the ranges a UK
high-street shop actually sees — those are facts. All descriptive copy, guides
and pricing are our own; none of iFixit's text or photography is reproduced.

`src/data/parts.ts` then derives the 401-part catalogue from that roster. A
shop's parts list is the cross product of "devices we service" and "things that
break on them", so writing it by hand guarantees the two drift apart. Each
device declares which parts exist for it, and price follows from part kind,
panel type, tier and age:

```
part price  = base(kind, panel) x tier x (1 + (year - 2019) x 0.13)
fitted price = part price + bench labour(kind)
```

Add a device to the roster and it gains parts, a device page, repair prices,
guides and search entries with no further edits. Ratings, review counts, stock
state and clearance discounts come from a deterministic hash of the product id,
so they are stable across reloads instead of reshuffling on every render.

### Catalogue

`src/data/catalogue.ts` is one `Product` model across four branches — phones,
parts, tools, accessories — keyed by `category` and faceted on `subcategory`,
`brand`, `compatibility`, `condition` and price band. Parts are generated from a
`part()` template because they genuinely share a shape; phones and tools are
written out individually because they do not.

Products we have photography for use it. Parts and tools fall back to a drawn
SVG glyph (`ProductImage`), so a listing of mixed stock still reads as one
deliberate set instead of a wall of grey placeholders.

### Faceted listing

One `Category` page serves all four branches. Filter state lives entirely in the
URL (`/parts?type=screens&fits=iPhone+13&sort=price-asc`), so any filtered view
is linkable and shareable.

Facet counts are computed against the set filtered by every *other* facet, so
selecting one option leaves its siblings showing real counts rather than
collapsing them to zero. Selected options are always rendered, even when a group
would otherwise be collapsed or hidden — a filter you cannot see is a filter you
cannot remove.

### Guides

`src/data/guides.ts` holds 14 guides written from our own bench process. A guide
matches devices by brand, family or kind rather than listing models, so the
roster and the guides stay in step. Each carries difficulty, time, per-step
safety warnings, and the tool product ids it needs — the guide page turns those
into an "add all tools" button.

## Notes

Cart state persists to `localStorage` and drops any line whose product no longer
exists in the catalogue. Checkout, the repair booking form and the trade-in quote
are front-end only — nothing is submitted and no payment is taken.

Product prices, ratings, review counts, the press quotes and the company and VAT
numbers in the footer are placeholders. Replace them with real figures before
this is used commercially.
