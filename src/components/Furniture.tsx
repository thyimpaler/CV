/**
 * Small persistent fixed elements.
 *
 * Both reference sites keep a couple of these running in the margins — a
 * rotating circular badge, a floating pill. They read as a brand system
 * operating around the content rather than more content. Two is the limit;
 * a third starts to feel like clutter.
 */

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
