import { bestsellers, products } from "../data/catalogue"
import { homeFaqs } from "../data/content"
import Accordion from "../components/ui/Accordion"
import Banner from "../components/sections/Banner"
import CategoryTiles from "../components/sections/CategoryTiles"
import FeatureBand from "../components/sections/FeatureBand"
import FeaturedProducts from "../components/sections/FeaturedProducts"
import Hero from "../components/sections/Hero"
import PressStrip from "../components/sections/PressStrip"
import SectionHead from "../components/sections/SectionHead"
import StatsBand from "../components/sections/StatsBand"

const refurbished = products.filter((p) => p.condition === "refurbished")

/**
 * Nine sections, one dark band, and every heading through the same component.
 *
 * The previous version stacked fourteen full-bleed bands in alternating white,
 * pale blue and navy, each with a centred heading of identical weight — so
 * nothing was more important than anything else and the page read as five
 * different sites glued together. Three of those sections rendered as visibly
 * broken placeholders (an empty navy panel, a grid of empty social tiles, and
 * two cards in a four-column carousel), and they are gone rather than restyled.
 */
export default function Home() {
  return (
    <>
      <Hero />
      <CategoryTiles />

      <FeaturedProducts
        label="Bestsellers"
        heading="What people actually buy"
        lede="What our customers and our own technicians reach for most."
        products={bestsellers}
        moreTo="/parts"
        moreLabel="Shop all parts"
      />

      <FeatureBand />

      <StatsBand />

      {/* Only worth a section of its own once there is a row to fill. */}
      {refurbished.length >= 3 ? (
        <FeaturedProducts
          label="Refurbished"
          heading="Graded honestly"
          lede="Battery verified, cosmetically graded, and covered for twelve months."
          products={refurbished}
          moreTo="/phones?condition=refurbished"
          moreLabel="All refurbished stock"
        />
      ) : null}

      <Banner
        label="Trade in"
        heading="Trade in. Trade up."
        body="Send us the phone in the drawer. Any condition, cracked or dead, and we will value it in ninety seconds — then put it against something newer or pay you the same day."
        ctaLabel="Get a valuation"
        ctaTo="/sell"
      />

      <PressStrip />

      <section className="section-y">
        <div className="content-boundary flex max-w-3xl flex-col gap-10">
          <SectionHead label="FAQ" heading="Common questions" />
          <Accordion items={homeFaqs} />
        </div>
      </section>
    </>
  )
}
