/** Pixel gap between tick marks on the rail. */
const TICK_STEP = 48

/** Every Nth tick gets its measurement printed beside it. */
const LABEL_EVERY = 4

/**
 * The measuring rails: hairline rules bounding the content column with tick
 * marks and small mono numbers running down the left one.
 *
 * This is the reference design's signature and the thing that makes the whole
 * layout read as drawn to a plan rather than typed into a page. It is purely
 * decorative — aria-hidden, no text in the accessibility tree, no hit targets —
 * and it sits behind the content in its own fixed layer so it spans the full
 * document height without every section having to opt in.
 *
 * Hidden below `lg`: at tablet width and under, the gutters the rails would live
 * in do not exist, and drawing them over the content is just noise.
 */
export default function Rails({ height }: { height: number }) {
  const ticks = Math.max(0, Math.floor(height / TICK_STEP))

  return (
    <div
      aria-hidden="true"
      /**
       * inset-0, not an explicit measured height. Sizing this element from a
       * measurement of the document was a ratchet: an absolutely positioned box
       * contributes to scrollHeight, so the rails were part of the number they
       * were sized by and the height could only ever grow. Navigating from a
       * tall page to a short one left thousands of pixels of dead scroll below
       * the footer until a reload cleared the state.
       *
       * Taking the length from the page wrapper instead means the rails cannot
       * influence it. `height` now only decides how many ticks to draw.
       */
      /**
       * overflow-hidden so nothing decorative can extend the page. The last tick
       * label sits on a 48px multiple and is shifted up by half its own height,
       * so its box could end a pixel or two past the content and scrollHeight
       * rounded that up into real scrollable space. Clipping is the general fix;
       * trimming the tick count would only have patched this one case.
       */
      className="pointer-events-none absolute inset-0 -z-10 hidden overflow-hidden lg:block"
    >
      <div className="content-boundary relative h-full">
        {/* The two bounding rules. */}
        <span className="absolute inset-y-0 left-4 w-px bg-line md:left-6 lg:left-8" />
        <span className="absolute inset-y-0 right-4 w-px bg-line md:right-6 lg:right-8" />

        {/* Ticks and their measurements, outside the left rule so they never
            collide with content. */}
        <div className="absolute inset-y-0 left-8">
          {Array.from({ length: ticks }, (_, i) => {
            const top = (i + 1) * TICK_STEP
            const labelled = (i + 1) % LABEL_EVERY === 0
            return (
              <span key={i} className="absolute left-0" style={{ top }}>
                <span
                  className={
                    "absolute top-0 block h-px bg-line " +
                    (labelled ? "-left-2 w-2" : "-left-1 w-1")
                  }
                />
                {labelled ? (
                  <span className="absolute top-0 -left-3 block -translate-x-full -translate-y-1/2 font-mono text-[8px] leading-none text-ink-400">
                    {top}
                  </span>
                ) : null}
              </span>
            )
          })}
        </div>
      </div>
    </div>
  )
}
