/**
 * Small persistent fixed elements.
 *
 * Both reference sites keep a couple of these running in the margins — a
 * rotating circular badge, a floating pill. They read as a brand system
 * operating around the content rather than more content. Two is the limit;
 * a third starts to feel like clutter.
 */

/** Rotating circular wordmark, bottom-left. */
export function RotatingBadge() {
  const text = "THYIMPALER · WEB3 OPS · 2026 · "

  return (
    // Sized and inset to sit inside the page gutter (--section-edge reaches
    // 76px at 1280 and 92px beyond), so it never collides with content that
    // starts at the left margin. Shown only where that gutter exists.
    <div className="pointer-events-none fixed bottom-4 left-4 z-40 hidden h-[56px] w-[56px] opacity-70 xl:block">
      <svg viewBox="0 0 100 100" className="badge-spin h-full w-full">
        <defs>
          <path
            id="badge-arc"
            d="M50,50 m-36,0 a36,36 0 1,1 72,0 a36,36 0 1,1 -72,0"
            fill="none"
          />
        </defs>
        <text
          className="fill-[var(--ink-mute)] font-mono-ui"
          style={{ fontSize: "9.5px", letterSpacing: "0.14em" }}
        >
          <textPath href="#badge-arc">{text}</textPath>
        </text>
      </svg>
      {/* Centre dot — gives the ring something to orbit. */}
      <span className="absolute left-1/2 top-1/2 h-1 w-1 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--brand-gold)]" />
    </div>
  )
}

/** Four-point star used as a separator glyph, echoing Kaos's mark. */
export function Star({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={className}>
      <path
        d="M12 0 C12.6 7.4 16.6 11.4 24 12 C16.6 12.6 12.6 16.6 12 24 C11.4 16.6 7.4 12.6 0 12 C7.4 11.4 11.4 7.4 12 0 Z"
        fill="currentColor"
      />
    </svg>
  )
}
