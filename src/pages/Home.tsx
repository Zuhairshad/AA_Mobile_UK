import { bestsellers, products } from "../data/catalogue"
import { splitBlocks, homeFaqs } from "../data/content"
import Accordion from "../components/ui/Accordion"
import Banner from "../components/sections/Banner"
import CategoryGrid from "../components/sections/CategoryGrid"
import FeaturedProducts from "../components/sections/FeaturedProducts"
import HeroSearch from "../components/sections/HeroSearch"
import PressStrip from "../components/sections/PressStrip"
import RepairServices from "../components/sections/RepairServices"
import SocialGallery from "../components/sections/SocialGallery"
import SplitWithImage from "../components/sections/SplitWithImage"
import StatsBand from "../components/sections/StatsBand"
import ValueProps from "../components/sections/ValueProps"

const refurbished = products.filter((p) => p.condition === "refurbished")

export default function Home() {
  return (
    <>
      <HeroSearch />
      <CategoryGrid />
      <StatsBand />

      <SplitWithImage {...splitBlocks[0]} />
      <SplitWithImage {...splitBlocks[1]} />

      <ValueProps />

      <FeaturedProducts
        heading="Bestsellers this month"
        lede="What our customers and our own technicians reach for most."
        products={bestsellers}
      />

      <SplitWithImage {...splitBlocks[2]} />

      <RepairServices limit={3} />

      <Banner
        heading="Trade in. Trade up."
        body="Send us the phone in the drawer. Any condition, cracked or dead, and we will value it in ninety seconds — then put it against something newer or pay you the same day."
        ctaLabel="Get a valuation"
        ctaTo="/sell"
      />

      {refurbished.length > 0 ? (
        <FeaturedProducts
          heading="Refurbished, graded honestly"
          lede="Battery verified, cosmetically graded, and covered for twelve months."
          products={refurbished}
        />
      ) : null}

      <PressStrip />
      <SocialGallery />

      <section className="section-y">
        <div className="content-boundary max-w-3xl">
          <h2 className="section-heading mb-8 text-center">Common questions</h2>
          <Accordion items={homeFaqs} />
        </div>
      </section>
    </>
  )
}
