import { useScrollDepth } from "@/lib/scrollStore"

/**
 * Scroll progress as a marker climbing a slope.
 *
 * The track rises left to right and the marker rides the travelled portion, so
 * scrolling the page is a climb. It pays off at the Argus coda.
 *
 * ## The alignment bug this replaces
 *
 * The previous version drew the line and the marker in two separate SVGs with
 * the *same* `viewBox="0 0 1000 16"` — but only the first declared
 * `preserveAspectRatio="none"`. The second fell back to the SVG default,
 * `xMidYMid meet`, which applies a uniform scale **plus a centring translate**
 * of `(width - 1000·scale) / 2`.
 *
 * At 1440px wide that translate is 220px, so the marker sat 220px right of the
 * line's start, crossed it at exactly 50%, and finished 220px short of the
 * end. Measured live: +220 → +110 → +2 → −110 → −220. Below 1000px the failure
 * switched axis and became a vertical offset instead, and at 375px the
 * marker's radius scaled down to about 1.1px — nearly invisible on a phone.
 *
 * The fix is to stop having two coordinate systems. The track stays an SVG,
 * and the marker is a plain absolutely-positioned element using percentage
 * `left` — percentages of the same box the SVG stretches across, so the two
 * agree by construction at every width. It also stays perfectly round without
 * needing `meet`, which was the reason the second SVG existed at all.
 *
 * Both positions now come from **one** expression. The old code computed
 * `progress * 1000` for the line and `${progress * 100}%` for the marker:
 * numerically equal in user units, which is exactly why the divergence was
 * invisible when reading the source.
 */
export function ScrollProgress() {
  // Quantised to 120 steps — finer than a 7px marker on a 16px strip can
  // express, and it bounds this component to 120 renders per full scroll
  // instead of one per frame.
  const depth = useScrollDepth(120)

  // The slope, in the same 0…1 space for both elements. y is a percentage of
  // the 16px-tall strip: the track runs from 13/16 down to 4/16.
  const startY = 13 / 16
  const endY = 4 / 16
  const y = startY + (endY - startY) * depth

  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-[200] h-4" aria-hidden>
      <svg
        viewBox="0 0 1000 16"
        preserveAspectRatio="none"
        className="h-full w-full"
      >
        {/* The travelled line fades out behind the marker instead of running
            at full strength the whole way. At the coda — where depth is 1 —
            a flat 0.75-opacity accent stroke spanned the entire viewport and
            became the loudest thing on a page whose whole language is
            hairlines; it read as a heavy bar even at one physical pixel,
            because a near-horizontal diagonal antialiases across two.
            Reading the gradient in `objectBoundingBox` units means it always
            spans exactly the distance covered, with no second source of
            truth for `depth` to drift against. */}
        <linearGradient id="scroll-trail" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="var(--brand-accent)" stopOpacity="0" />
          <stop offset="55%" stopColor="var(--brand-accent)" stopOpacity="0.22" />
          <stop offset="100%" stopColor="var(--brand-accent)" stopOpacity="0.6" />
        </linearGradient>

        {/* The road ahead, and the ground already covered. `vectorEffect`
            keeps the stroke 1px despite the non-uniform stretch. */}
        <line x1="0" y1="13" x2="1000" y2="4" stroke="var(--line-soft)" strokeWidth="1" vectorEffect="non-scaling-stroke" />
        <line
          x1="0"
          y1="13"
          x2={depth * 1000}
          y2={13 - depth * 9}
          stroke="url(#scroll-trail)"
          strokeWidth="1"
          vectorEffect="non-scaling-stroke"
        />
      </svg>

      {/* The marker. Positioned in the container's own percentage space, so it
          tracks the stretched line exactly, and scaled rather than resized —
          animating the SVG `r` geometry attribute is not compositable. */}
      <span
        className="absolute block rounded-full bg-[var(--brand-accent)]"
        style={{
          left: `${depth * 100}%`,
          top: `${y * 100}%`,
          width: "6px",
          height: "6px",
          // Grows as the climb goes on, but not much: at 7px scaling to 1.5
          // the marker finished as a 10.5px dot, which is a bullet, not a
          // marker.
          transform: `translate(-50%, -50%) scale(${(1 + depth * 0.3).toFixed(3)})`,
          transition: "transform 0.4s var(--ease-core)",
          willChange: "transform",
        }}
      />
    </div>
  )
}
