import { useEffect, useRef, useState } from "react"
import { usePointerOffset } from "@/lib/interactions"

/**
 * Argus Panoptes — the hundred-eyed watchman who never closed every eye at
 * once. The closing scene of the page, and the figure the whole site sits on:
 * the hero says "The market never closes", this answers "Neither do I."
 *
 * Drawn rather than sourced. A field of eyes is pure geometry, so there is no
 * artwork to license, no watermark, nothing to load, and it inherits the
 * accent colour for free — which a GIF never would.
 *
 * The motion is reactive on both axes, never ambient:
 *  - Lids open in sequence as the section is reached, so the figure wakes up
 *    because the reader arrived.
 *  - Pupils track the cursor. Standing still, it is a static illustration;
 *    move, and it is watching you. That is the entire idea of Argus, and it
 *    costs one pointer listener that already exists for the hero parallax.
 *
 * Myth note: when Argus was finally killed his eyes were set into the
 * peacock's tail — the watching outlives the watchman.
 *
 * Lids reopen and reclose as the section enters and leaves, matching the rest
 * of the page's reveals, which run in both scroll directions.
 *
 * `WatchingEye` exports a single eye for placing in section margins, so the
 * figure watches the whole scroll rather than only appearing at the end.
 */

type Eye = { x: number; y: number; r: number; delay: number }

// Deterministic constellation. Hand-placed rather than random so the cluster
// reads as composed — a scatter function put eyes in the corners and left the
// centre empty, which is the opposite of what a face-like field needs.
const EYES: Eye[] = [
  { x: 200, y: 196, r: 46, delay: 0 }, // the one that holds the centre
  { x: 108, y: 128, r: 22, delay: 0.5 },
  { x: 292, y: 132, r: 24, delay: 0.35 },
  { x: 82, y: 232, r: 18, delay: 0.8 },
  { x: 318, y: 236, r: 19, delay: 0.65 },
  { x: 150, y: 300, r: 16, delay: 1.0 },
  { x: 252, y: 302, r: 17, delay: 0.9 },
  { x: 200, y: 84, r: 15, delay: 1.15 },
  { x: 46, y: 172, r: 13, delay: 1.3 },
  { x: 354, y: 176, r: 13, delay: 1.25 },
  { x: 200, y: 350, r: 12, delay: 1.45 },
]

let clipSeq = 0

function ArgusEye({
  eye,
  open,
  px,
  py,
}: {
  eye: Eye
  open: boolean
  px: number
  py: number
}) {
  const { x, y, r } = eye
  // Unique per mounted eye. Keying the clipPath id off coordinates alone
  // collided once margin eyes reused the field's positions, and a duplicate
  // id silently clips the wrong element.
  const uid = useRef<number>(0)
  if (uid.current === 0) uid.current = ++clipSeq
  // Almond built from two quadratic arcs. Width 2r, height ~0.72r, which is
  // the ratio that stops it reading as a lemon.
  const h = r * 0.72
  const lid = `M ${x - r} ${y} Q ${x} ${y - h} ${x + r} ${y} Q ${x} ${y + h} ${x - r} ${y} Z`
  const clipId = `argus-clip-${uid.current}`

  // Pupil travel is capped so it never leaves the white.
  const travel = r * 0.3
  const ix = x + px * travel * 2
  const iy = y + py * travel * 1.4

  return (
    <g>
      <defs>
        <clipPath id={clipId}>
          <path d={lid} />
        </clipPath>
      </defs>

      {/* Sclera */}
      <path
        d={lid}
        className="fill-[var(--ink-strong)]"
        style={{
          transformOrigin: `${x}px ${y}px`,
          transform: open ? "scaleY(1)" : "scaleY(0.04)",
          transition: `transform 0.9s var(--ease-core) ${eye.delay}s`,
        }}
      />

      {/* Iris + pupil, clipped by the lid so they vanish when it closes */}
      <g
        clipPath={`url(#${clipId})`}
        style={{
          opacity: open ? 1 : 0,
          transition: `opacity 0.5s var(--ease-core) ${eye.delay + 0.25}s`,
        }}
      >
        <circle cx={ix} cy={iy} r={r * 0.44} className="fill-[var(--brand-accent)]" />
        <circle cx={ix} cy={iy} r={r * 0.2} fill="#0A0708" />
        {/* Catchlight — the one detail that makes an eye read as wet rather
            than as a printed circle. */}
        <circle
          cx={ix - r * 0.16}
          cy={iy - r * 0.16}
          r={r * 0.08}
          fill="#FFFFFF"
          opacity="0.85"
        />
      </g>

      {/* Rim, drawn over everything so the lid edge stays crisp */}
      <path d={lid} fill="none" stroke="var(--line)" strokeWidth="1" />
    </g>
  )
}

export function ArgusEyes({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const [open, setOpen] = useState(false)
  const pointer = usePointerOffset()

  useEffect(() => {
    const el = ref.current
    if (!el) return
    // Eyes close again when the section leaves and reopen on return.
    const io = new IntersectionObserver(
      ([entry]) => setOpen(entry.isIntersecting),
      { threshold: 0.25 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <div ref={ref} className={className}>
      <svg viewBox="0 0 400 400" className="h-full w-full overflow-visible" aria-hidden>
        {EYES.map((eye) => (
          <ArgusEye
            key={`${eye.x}-${eye.y}`}
            eye={eye}
            open={open}
            px={pointer.x}
            py={pointer.y}
          />
        ))}
      </svg>
    </div>
  )
}

/**
 * A single eye, for placing in the margin of a section.
 *
 * Same lid-opens-on-arrival and pupil-follows-cursor behaviour as the field,
 * at a size meant to sit at the edge of vision rather than command it. Marked
 * aria-hidden and pointer-events-none throughout: it is atmosphere, and it
 * must never intercept a click or announce itself to a screen reader.
 */
export function WatchingEye({
  className = "",
  size = 34,
}: {
  className?: string
  size?: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [open, setOpen] = useState(false)
  const pointer = usePointerOffset()

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => setOpen(entry.isIntersecting),
      { threshold: 0.4 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <div ref={ref} className={`pointer-events-none ${className}`} aria-hidden>
      <svg viewBox="0 0 100 100" width={size} height={size} className="overflow-visible">
        <ArgusEye
          eye={{ x: 50, y: 50, r: 42, delay: 0 }}
          open={open}
          px={pointer.x}
          py={pointer.y}
        />
      </svg>
    </div>
  )
}
