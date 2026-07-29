import { Link } from "react-router-dom"
import { badgeMeta, badgesFor, type Product } from "../../data/catalogue"
import { useCart } from "../../lib/cart"
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

export default function ProductCard({ product, fixedWidth, priority }: Props) {
  const { add } = useCart()
  const badges = badgesFor(product)
  const lead = badges[0]
  const soldOut = product.stock === "out"

  return (
    <article className={cx("group product-card", fixedWidth && "w-64 md:w-[286px]")}>
      <div className="product-card-well">
        <div className="relative aspect-square">
          <ProductImage product={product} priority={priority} />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Link to={`/product/${product.id}`} className="stretched-link">
          <h3 className="line-clamp-2 text-base font-semibold text-gray-900 group-hover:text-primary">
            {product.name}
          </h3>
        </Link>
        <p className="line-clamp-2 text-xs text-gray-600">{product.blurb}</p>
        <Rating value={product.rating} reviews={product.reviews} />
      </div>

      <PriceTag price={product.price} compareAt={product.compareAt} />

      <div className="mt-auto flex flex-col gap-3">
        {lead ? (
          <Badge tone={badgeMeta[lead].tone} icon={badgeMeta[lead].icon} size="sm">
            {badgeMeta[lead].label}
          </Badge>
        ) : null}

        {/* Sits above the stretched link so it stays clickable. */}
        <Button
          variant={soldOut ? "outline" : "primary"}
          size="sm"
          disabled={soldOut}
          onClick={() => add(product.id)}
          className="relative z-10"
        >
          {soldOut ? "Out of stock" : "Add to basket"}
        </Button>
      </div>
    </article>
  )
}
