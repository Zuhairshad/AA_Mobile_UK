# Where the product images came from

Kept so that every image on the storefront can be traced to a source, and so the
ones that need replacing before launch are obvious rather than forgotten.

## `parts/` — 191 images

iFixit store product photography, fetched by `scripts/fetch-ifixit-photos.mjs`.
Re-run that script to refresh; it is idempotent and prunes anything no longer
referenced.

Every image is the **bare part** variant, not the Fix Kit — the kit shots show
the part surrounded by tweezers, picks and adhesive, which is not what a customer
buying a screen receives. 109 came from a product's explicit "Part Only" option
and 82 from single-variant products.

`src/data/partPhotos.generated.json` records, for each image, the store product
page it came from, which variant was chosen, and the exact source URL. That file
is the audit trail — start there.

Coverage: 188 of 401 parts match a photograph of that exact model and component.
`src/data/partPhotos.ts` widens that to roughly three quarters by allowing a
near-neighbour photo for components that do not change across a maker's range,
and the product page labels those "Representative image". Screens and back glass
are excluded from that widening because the difference is visible. The rest —
OnePlus, Xiaomi, Nothing, Motorola almost entirely — keep their drawn artwork,
because iFixit sells no parts for them.

**Permission**: used on the basis of an arrangement with iFixit reported by the
shop. Nobody on the build side has seen the terms. If that arrangement does not
cover a public storefront, these are the files to replace, and the fetch script
plus `partPhotos.ts` mean swapping the source is a contained change rather than a
rebuild. Two things to be aware of either way:

- Some parts are iFixit-branded and the logo is visible in the photograph, so
  the picture shows *their* part rather than whatever the shop actually stocks.
- The images are hosted here, not hotlinked, so they will not break if iFixit
  moves them — and equally they will not update if iFixit changes a photo.

## Everything else in this folder — 23 images

18 phone and tablet shots plus 5 accessory shots, added before the image pipeline
existed. **Source unrecorded.** These have no traceable provenance and no licence
on file; they should be replaced with the shop's own photographs or licensed
stock before launch. They are the weakest link in this folder, not the iFixit set.
