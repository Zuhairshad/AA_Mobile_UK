import { Link } from "react-router-dom"
import { badgeMeta, badgesFor, type Product } from "../../data/catalogue"
import { useCart } from "../../lib/cart"
import { useToast } from "../../lib/toast"
import { cx } from "../../lib/cx"
import Badge from "../ui/Badge"
import Button from "../ui/Button"
import PriceTag from "../ui/PriceTag"
import Rating from "../ui/Rating"
import ProductImage from "./ProductImage"

type Props = {
  product: Product
  /** Fixed width for carousel use; grid cells stretch instead. */
  fixedWidth?: boolean
  priority?: boolean
}

/**
 * The image is the card. It fills its cell edge-to-edge at a large aspect and
 * the name, price and action sit below it flush left.
 *
 * The previous version nested a padded white well inside a padded grey card,
 * which left the actual photograph occupying about a third of the cell and
 * showed two backgrounds behind every lifestyle shot. Removing both layers of
 * padding roughly doubles the rendered image at the same grid width.
 */
export default function ProductCard({ product, fixedWidth, priority }: Props) {
  const { add } = useCart()
  const { push } = useToast()
  const badges = badgesFor(product)
  const lead = badges[0]
  const soldOut = product.stock === "out"

  return (
    <article
      className={cx(
        "group product-card",
        fixedWidth && "w-[280px] md:w-[340px]",
      )}
    >
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
        <p className="micro-label">{product.brand}</p>

        <Link to={`/product/${product.id}`} className="stretched-link">
          <h3 className="section-heading-sm line-clamp-2 text-base md:text-lg">
            {product.name}
          </h3>
        </Link>

        <Rating value={product.rating} reviews={product.reviews} />

        <div className="mt-auto flex flex-col gap-3 pt-1">
          <PriceTag price={product.price} compareAt={product.compareAt} />

          {/* Sits above the stretched link so it stays clickable. */}
          <Button
            variant={soldOut ? "outline" : "primary"}
            size="sm"
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
            className="relative z-10 w-full"
          >
            {soldOut ? "Out of stock" : "Add to basket"}
          </Button>
        </div>
      </div>
    </article>
  )
}
