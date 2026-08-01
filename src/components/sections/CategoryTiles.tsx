import { Link } from "react-router-dom"
import { categories } from "../../data/taxonomy"
import { products } from "../../data/catalogue"
import ProductImage from "../product/ProductImage"

/**
 * One big media tile per branch of the shop, image first.
 *
 * The old grid was fourteen text-and-icon rows, which gave a shop that sells
 * physical objects almost no imagery above the fold. Each tile now shows a real
 * product at a size you can actually see, with the label underneath — the
 * pattern the reference template uses for its collection grid.
 */
export default function CategoryTiles() {
  return (
    <section className="content-boundary pb-14 md:pb-20">
      {/* The tiles are h3s; without this the page jumps h1 -> h3. */}
      <h2 className="sr-only">Browse by category</h2>

      <div className="grid grid-cols-2 gap-x-4 gap-y-8 lg:grid-cols-4">
        {categories.map((category) => {
          const count = products.filter(
            (p) => p.category === category.slug,
          ).length
          // The tile's own face: a bestseller if the branch has one, otherwise
          // the highest-rated item. Rating alone put a charging port on the
          // parts tile — accurate, but not what the branch is known for.
          const inBranch = products.filter((p) => p.category === category.slug)
          const face =
            [...inBranch]
              .filter((p) => p.bestseller !== undefined)
              .sort((a, b) => (a.bestseller ?? 0) - (b.bestseller ?? 0))[0] ??
            [...inBranch].sort((a, b) => b.rating - a.rating)[0]

          return (
            <article key={category.slug} className="group product-card">
              <div className="product-card-well">
                {face ? <ProductImage product={face} /> : null}
              </div>

              <div className="flex flex-col gap-1.5">
                <h3 className="section-heading-sm">
                  <Link to={`/${category.slug}`} className="stretched-link">
                    {category.name}
                  </Link>
                </h3>
                <p className="micro-label">{count} products</p>
                <p className="mt-1 text-sm text-ink-500">
                  {category.cardBlurb}
                </p>
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}
