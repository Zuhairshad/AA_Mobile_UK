# Where the product images came from

Kept so that every image on the storefront can be traced to a source, and so the
ones that need replacing before launch are obvious rather than forgotten.

## `parts/` — 169 images

iFixit store product photography, fetched by `scripts/fetch-ifixit-photos.mjs`.
Re-run that script to refresh; it is idempotent and prunes anything no longer
referenced.

Every image is the **bare part** variant, not the Fix Kit — the kit shots show the
part surrounded by tweezers, picks and adhesive, which is not what a customer
buying a screen receives. 99 came from a product's explicit "Part Only" option and
70 from single-variant products.

`src/data/partPhotos.generated.json` records, for each image, the store product
page it came from, which variant was chosen, and the exact source URL. That file
is the audit trail — start there.

### No iFixit branding

The fetch script refuses any product whose URL matches `replacement-battery` or
`/ifixit-`: those are iFixit's own-brand line and the mark is printed on the part
itself. Everything it keeps is an OEM or aftermarket component with no mark on it,
which is why this is a narrow rule rather than a whole-catalogue problem.

How that was established, and how it is checked:

- Tesseract over all 191 images of the original set found the wordmark on 10.
- The URL rule caught 11, including two Samsung cells whose mark was too small
  for OCR — so the URL is the rule and OCR is the check.
- Contact sheets of all 191 were reviewed by eye for logo-only cases with no
  wordmark. Every one was either an own-brand battery or a tool.
- After the exclusion: **169 images, 0 wordmark hits.** The 169 are a strict
  subset of the 191 already reviewed, so nothing unexamined was introduced.

Re-running OCR needs `tesseract-ocr`, which is not a project dependency — it was
installed for the audit and is not needed to build.

**Tools are drawn, not photographed.** A stage that matched our fourteen tools to
their store equivalents was removed. The reason is not the logo, though several
were visibly branded: every one of those photographs is of an iFixit product, so a
listing selling "Bench Pro Toolkit" illustrated with their Pro Tech Toolkit shows a
different item to the one in the box. Parts are OEM components any supplier ships;
a tool kit is somebody's product.

### Coverage

177 of 401 parts match a photograph of that exact model and component.
`src/data/partPhotos.ts` widens that to 292 — roughly three quarters — by allowing
a near-neighbour photo for components that do not change across a maker's range,
and the product page labels those "Representative image". Screens and back glass
are excluded from that widening because the difference is visible. The rest — 109
parts, OnePlus, Xiaomi, Nothing and Motorola almost entirely — keep their drawn
artwork, because iFixit sells no parts for them.

**Permission**: used on the basis of an arrangement with iFixit reported by the
shop. Nobody on the build side has seen the terms. If that arrangement does not
cover a public storefront, these are the files to replace, and the fetch script
plus `partPhotos.ts` mean swapping the source is a contained change rather than a
rebuild. Note also that the images are hosted here rather than hotlinked, so they
will not break if iFixit moves them — and equally will not update if iFixit
changes a photo.

## Everything else in this folder — 23 images

18 phone and tablet shots plus 5 accessory shots, added before the image pipeline
existed. **Source unrecorded.** These have no traceable provenance and no licence
on file; they should be replaced with the shop's own photographs or licensed stock
before launch. They are the weakest link in this folder, not the iFixit set.
