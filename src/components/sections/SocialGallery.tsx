import { socialPosts } from "../../data/content"
import { productPhotos } from "../../data/images"
import { cx } from "../../lib/cx"
import Icon from "../ui/Icon"

/** Photos stand in for user posts; the first tile takes a 2x2 cell. */
const tilePhotos = [
  "galaxy-z-flip-5",
  "iphone-15",
  "pixel-8a",
  "nothing-phone-2",
  "galaxy-tab-s9",
  "clear-case-15",
]

export default function SocialGallery() {
  return (
    <section className="section-y">
      <div className="content-boundary">
        <div className="mx-auto mb-10 max-w-3xl text-center">
          <h2 className="section-heading">Show us your fix</h2>
          <p className="section-lede mt-4">
            Taking your own phone apart is a good feeling. Tag us at{" "}
            <span className="font-semibold text-primary">@aamobileuk</span> and we
            will share it.
          </p>
        </div>

        <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5 md:gap-5">
          {socialPosts.map((post, i) => (
            <li
              key={`${post.handle}-${i}`}
              className={cx(i === 0 && "col-span-2 row-span-2")}
            >
              <article className="relative h-full overflow-hidden rounded-xl bg-brand-900">
                <div className="relative aspect-square h-full w-full">
                  <img
                    src={productPhotos[tilePhotos[i] ?? tilePhotos[0]]}
                    alt=""
                    aria-hidden="true"
                    loading="lazy"
                    className="h-full w-full object-cover"
                  />
                </div>
                {/* Brand-tinted scrim: pulls a set of light product photos into
                    one deliberate-looking wall and keeps the handles legible. */}
                <div className="absolute inset-0 flex flex-col justify-end gap-0.5 bg-gradient-to-t from-brand-950/95 via-brand-900/45 to-brand-800/25 p-3">
                  <p className="truncate text-xs text-white/80">{post.caption}</p>
                  <p className="flex items-center gap-1 truncate text-sm font-medium text-white">
                    <Icon name="instagram" className="size-3.5" />
                    {post.handle}
                  </p>
                </div>
              </article>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
