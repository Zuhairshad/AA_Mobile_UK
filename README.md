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

## Structure

```
src/
  data/          catalogue, taxonomy, repair services, page copy, nav
  lib/           cart (localStorage), faceting, search, formatting
  components/
    ui/          Button, Badge, Icon, Rating, PriceTag, Carousel, Accordion, …
    layout/      Header (menubar + instant search), Footer, Layout
    sections/    the landing-page section types
    product/     ProductCard, ProductGrid, ProductImage, FacetSidebar
  pages/         Home, Category, Product, Search, Cart, Repairs, Sell, About
```

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

## Notes

Cart state persists to `localStorage` and drops any line whose product no longer
exists in the catalogue. Checkout, the repair booking form and the trade-in quote
are front-end only — nothing is submitted and no payment is taken.
