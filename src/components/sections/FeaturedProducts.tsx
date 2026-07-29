import { useId } from "react"
import type { Product } from "../../data/catalogue"
import Carousel, { CarouselItem } from "../ui/Carousel"
import ProductCard from "../product/ProductCard"

type Props = {
  heading: string
  lede?: string
  products: Product[]
}

export default function FeaturedProducts({ heading, lede, products }: Props) {
  const headingId = useId()

  if (products.length === 0) return null

  return (
    <section className="section-y">
      <div className="content-boundary flex flex-col gap-6 md:gap-8">
        <div className="mx-auto max-w-3xl text-center">
          <h2 id={headingId} className="section-heading">
            {heading}
          </h2>
          {lede ? <p className="section-lede mt-4">{lede}</p> : null}
        </div>

        <Carousel labelledBy={headingId}>
          {products.map((product) => (
            <CarouselItem key={product.id}>
              <ProductCard product={product} fixedWidth />
            </CarouselItem>
          ))}
        </Carousel>
      </div>
    </section>
  )
}
