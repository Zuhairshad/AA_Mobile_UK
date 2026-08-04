import { Link } from "react-router-dom"
import { badgeMeta, badgesFor, type Product } from "../../data/catalogue"
import { subcategoryName } from "../../data/taxonomy"
import { useCart } from "../../lib/cart"
import { useToast } from "../../lib/toast"
import Badge from "../ui/Badge"
import PriceTag from "../ui/PriceTag"
import ProductImage from "./ProductImage"

type Props = {
  product: Product
  priority?: boolean
}

/**
 * The image is the card. It fills its cell edge-to-edge and square, and the
 * name, price and action sit below it flush left.
 *
 * The previous version nested a padded white well inside a padded grey card,
 * which left the actual photograph occupying about a third of the cell and
 * showed two backgrounds behind every lifestyle shot. Removing both layers of
 * padding roughly doubles the rendered image at the same grid width.
 *
 * The label above the title is the part type in the accent colour — the one
 * place the reference template uses colour on a collection card, and it does
 * more work than the brand did: on a listing of 401 parts, "Screens & Displays"
 * distinguishes rows where "AA Mobile" repeated 401 times does not.
 *
 * One shape, no variants. The promoted full-width version is gone: it gave the
 * first product half the fold and left the other half empty, and a wide frame
 * around square artwork is grey space rather than a bigger picture.
 */
export default function ProductCard({ product, priority }: Props) {
  const { add } = useCart()
  const { push } = useToast()
  const badges = badgesFor(product)
  const lead = badges[0]
  const soldOut = product.stock === "out"
  const kicker =
    subcategoryName(product.category, product.subcategory) ?? product.brand

  return (
    <article className="group product-card">
      <div className="product-card-well">
        <ProductImage product={product} priority={priority} />

        {/* Over the image rather than under the price: the badge is about the
            product, and on a large frame there is room for it. */}
        {lead ? (
          <div className="pointer-events-none absolute top-3 left-3">
            <Badge
              tone={badgeMeta[lead].tone}
              icon={badgeMeta[lead].icon}
              size="sm"
            >
              {badgeMeta[lead].label}
            </Badge>
          </div>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col gap-2">
        <p className="micro-label text-primary">{kicker}</p>

        <Link to={`/product/${product.id}`} className="stretched-link">
          <h3 className="section-heading-sm line-clamp-2 text-base md:text-lg">
            {product.name}
          </h3>
        </Link>

        {/* No rating row. A row of stars under every tile gave three ornaments
            per cell competing with the image, and the reference's collection
            cards carry a label, a title and a price and nothing else. The full
            figure is still on the product page. */}

        <div className="mt-auto flex flex-col items-start gap-2 pt-1">
          <PriceTag price={product.price} compareAt={product.compareAt} />

          {/* A quiet mono action rather than a full-width black slab. Twelve
              filled pills down a grid drew the eye before any product did.
              Still a real always-visible button, not a hover-only affordance —
              those are unreachable by keyboard and touch. */}
          <button
            type="button"
            disabled={soldOut}
            onClick={() => {
              add(product.id)
              // A toast rather than opening the drawer: adding from a listing
              // shouldn't cover the grid you are still working through.
              push({
                title: "Added to basket",
                detail: product.name,
                action: { label: "View basket", to: "/cart" },
              })
            }}
            className="micro-label relative z-10 -mx-1 flex items-center gap-1.5 px-1 py-2 text-ink-950 transition-colors hover:text-primary disabled:pointer-events-none disabled:text-ink-500"
          >
            {soldOut ? "Out of stock" : "Add to basket"}
            {soldOut ? null : <span aria-hidden="true">+</span>}
          </button>
        </div>
      </div>
    </article>
  )
}
