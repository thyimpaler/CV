/**
 * Fixed atmosphere layer.
 *
 * Deliberately almost nothing: film grain plus one very soft vignette.
 *
 * The previous version stacked glowing neon edges, three drifting colour orbs
 * and a cursor-tracking light. Each effect is fine alone; together they read
 * as decoration applied to a page rather than a page that was designed. The
 * premium references use flat near-black and let type and space carry the
 * work, so the accent colour stays meaningful when it does appear.
 */
export function Backdrop() {
  return (
    <>
      <div className="grain-bg" />
      <div
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          background:
            "radial-gradient(120% 80% at 50% -10%, rgba(255,196,0,0.045), transparent 55%)",
        }}
      />
    </>
  )
}
