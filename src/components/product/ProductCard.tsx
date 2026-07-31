import { Link } from "react-router-dom"
import { badgeMeta, badgesFor, type Product } from "../../data/catalogue"
import { subcategoryName } from "../../data/taxonomy"
import { useCart } from "../../lib/cart"
import { useToast } from "../../lib/toast"
import { cx } from "../../lib/cx"
import Badge from "../ui/Badge"
import PriceTag from "../ui/PriceTag"
import Rating from "../ui/Rating"
import ProductImage from "./ProductImage"

type Props = {
  product: Product
  /** Fixed width for carousel use; grid cells stretch instead. */
  fixedWidth?: boolean
  priority?: boolean
  /** `wide` is the promoted first item of a collection grid. */
  aspect?: "square" | "wide"
}

/**
 * The image is the card. It fills its cell edge-to-edge at a large aspect and
 * the name, price and action sit below it flush left.
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
 */
export default function ProductCard({
  product,
  fixedWidth,
  priority,
  aspect = "square",
}: Props) {
  const { add } = useCart()
  const { push } = useToast()
  const badges = badgesFor(product)
  const lead = badges[0]
  const soldOut = product.stock === "out"
  const kicker =
    subcategoryName(product.category, product.subcategory) ?? product.brand
  const wide = aspect === "wide"

  return (
    <article
      className={cx(
        "group product-card",
        fixedWidth && "w-[280px] md:w-[340px]",
        wide && "md:grid md:grid-cols-[2fr_1fr] md:items-end md:gap-8",
      )}
    >
      <div
        className={cx(
          "product-card-well",
          wide && "aspect-[16/10] md:aspect-[21/9]",
        )}
      >
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
          <h3
            className={cx(
              "section-heading-sm line-clamp-2",
              wide ? "text-lg md:text-2xl" : "text-base md:text-lg",
            )}
          >
            {product.name}
          </h3>
        </Link>

        {wide ? (
          <p className="mt-1 line-clamp-2 text-sm text-ink-500">{product.blurb}</p>
        ) : null}

        {/* Rating only on the promoted card. A row of stars under every tile
            gave three ornaments per cell competing with the image, and the
            reference's collection cards carry a label, a title and a date and
            nothing else. The full figure is still on the product page. */}
        {wide ? <Rating value={product.rating} reviews={product.reviews} /> : null}

        <div className="mt-auto flex flex-col items-start gap-2 pt-1">
          <PriceTag
            price={product.price}
            compareAt={product.compareAt}
            size={wide ? "lg" : "md"}
          />

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
