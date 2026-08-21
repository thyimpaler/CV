import { useCallback, useEffect, useRef, useState } from "react"
import { usePointerWriter } from "@/lib/pointerVars"

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
 *  - Pupils track the cursor through the shared pointer loop, which writes
 *    each iris group's transform directly. Zero React renders, and — unlike
 *    the custom-property version this replaced — the style invalidation is
 *    scoped to the eyes rather than the whole document.
 *
 * ## Why the eye is built the way it is
 *
 * The first pass was a symmetric lens with a flat disc inside it, and it read
 * as an emoji: two identical arcs make a lemon, and a solid circle of accent
 * has no inside. Four things fix that, in descending order of how much each
 * one buys:
 *
 *  1. **The upper-lid shade.** A real eye is lit from above and the lid hangs
 *     over the iris, so the top of the eyeball is always darker. Without it
 *     nothing else reads as spherical, whatever you do to the iris.
 *  2. **An asymmetric lid.** The upper lid is taller (0.46r) and peaks inside
 *     of centre; the lower is shallower (0.34r) and dips outside of centre.
 *     The corners sit at different heights, so the eye carries a tilt.
 *  3. **A limbal ring and a graded iris.** The rim of a real iris is markedly
 *     darker than its centre, and that ring is what separates iris from
 *     sclera without resorting to an outline.
 *  4. **Two catchlights**, a large one opposite the shade and a faint bounce
 *     from below — the detail that makes an eye read as wet.
 *
 * Every one of those is painted with the existing palette at partial opacity
 * over the page ground, so the illustration still owns exactly two colours
 * (`--ink-strong`, `--brand-accent`) and picks up any change to either.
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

export type Eye = {
  x: number
  y: number
  r: number
  delay: number
  rot?: number
  /** Force iris fibres on or off. Defaults to a size test on `r`. */
  detail?: boolean
}

// Deterministic constellation. Hand-placed rather than random so the cluster
// reads as composed — a scatter function put eyes in the corners and left the
// centre empty, which is the opposite of what a face-like field needs.
//
// `rot` tilts each eye a few degrees. A field where every eye is axis-aligned
// reads as one stamp repeated; the tilts are what make it a crowd.
const EYES: Eye[] = [
  { x: 200, y: 196, r: 46, delay: 0 }, // the one that holds the centre
  { x: 108, y: 128, r: 22, delay: 0.5, rot: -9 },
  { x: 292, y: 132, r: 24, delay: 0.35, rot: 8 },
  { x: 82, y: 232, r: 18, delay: 0.8, rot: 6 },
  { x: 318, y: 236, r: 19, delay: 0.65, rot: -7 },
  { x: 150, y: 300, r: 17, delay: 1.0, rot: 5 },
  { x: 252, y: 302, r: 18, delay: 0.9, rot: -6 },
  { x: 200, y: 84, r: 16, delay: 1.15 },
  { x: 46, y: 172, r: 15, delay: 1.3, rot: -11 },
  { x: 354, y: 176, r: 15, delay: 1.25, rot: 10 },
  { x: 200, y: 350, r: 14, delay: 1.45 },
]

/**
 * Shared paint. Every gradient is declared in `objectBoundingBox` units — the
 * SVG default — so one definition serves all eleven eyes at whatever size
 * each happens to be, instead of eleven near-identical copies.
 *
 * The ids are namespaced per mounted SVG, and that is not decoration. Fixed
 * ids looked safe — every copy of this block is byte-identical, so a duplicate
 * should be inert — but `url(#id)` resolves to the *first* match in document
 * order, and the first one on this page belongs to a `WatchingEye` in an
 * earlier section. Those margin eyes are `hidden` below `lg`, so on a phone
 * the winning definitions sat inside a `display:none` subtree and every
 * gradient resolved to nothing: the coda rendered as bare outlines with no
 * sclera and no iris, while the solid fills beside them were fine.
 */
function ArgusDefs({ p }: { p: string }) {
  return (
    <defs>
      {/* Sclera. Never flat paper: the socket shades it toward the corners,
          which here means letting the page ground through at the edge. */}
      <radialGradient id={`${p}-sclera`} cx="50%" cy="46%" r="62%">
        <stop offset="0%" stopColor="var(--ink-strong)" stopOpacity="1" />
        <stop offset="62%" stopColor="var(--ink-strong)" stopOpacity="0.97" />
        <stop offset="100%" stopColor="var(--ink-strong)" stopOpacity="0.72" />
      </radialGradient>

      {/* Iris body. Darkens toward the limbus, lit from the upper left so it
          agrees with the catchlight and the lid shade. */}
      <radialGradient id={`${p}-iris`} cx="38%" cy="34%" r="78%">
        <stop offset="0%" stopColor="var(--brand-accent)" stopOpacity="1" />
        <stop offset="55%" stopColor="var(--brand-accent)" stopOpacity="0.95" />
        <stop offset="100%" stopColor="var(--brand-accent)" stopOpacity="0.55" />
      </radialGradient>

      {/* The limbal ring, as a wash rather than a stroke — an even outline
          reads as a border, and the rim of an iris is not even. */}
      <radialGradient id={`${p}-limbus`} cx="50%" cy="50%" r="50%">
        <stop offset="72%" stopColor="var(--background)" stopOpacity="0" />
        <stop offset="93%" stopColor="var(--background)" stopOpacity="0.42" />
        <stop offset="100%" stopColor="var(--background)" stopOpacity="0.62" />
      </radialGradient>

      {/* Upper-lid shade. The single detail that makes the eyeball a sphere
          rather than a hole with a disc sitting in it. */}
      <linearGradient id={`${p}-lidshade`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="var(--background)" stopOpacity="0.55" />
        <stop offset="38%" stopColor="var(--background)" stopOpacity="0.16" />
        <stop offset="72%" stopColor="var(--background)" stopOpacity="0" />
      </linearGradient>
    </defs>
  )
}

let clipSeq = 0
let paintSeq = 0

/**
 * A namespace for one mounted SVG's paint servers. A counter rather than
 * `useId`, because React's generated ids carry characters that have no
 * business inside a URL fragment, and this tree is client-rendered — there is
 * no second pass to disagree about the ordering.
 */
function usePaintId() {
  const id = useRef<string>("")
  if (id.current === "") id.current = `argus-${++paintSeq}`
  return id.current
}

export function ArgusEye({ eye, open, p }: { eye: Eye; open: boolean; p: string }) {
  const { x, y, r } = eye
  // Unique per mounted eye. Keying the clipPath id off coordinates alone
  // collided once margin eyes reused the field's positions, and a duplicate
  // id silently clips the wrong element.
  const uid = useRef<number>(0)
  if (uid.current === 0) uid.current = ++clipSeq
  const clipId = `${p}-clip-${uid.current}`

  // Almond from two cubics, deliberately unequal. The corners differ in
  // height (the inner one sits low, like a tear duct), the upper lid peaks
  // inside of centre and the lower dips outside of it. Total height lands at
  // ~0.8r against a width of 2r — the 2.5:1 an eye wants, where the old
  // symmetric pair gave 2.8:1 and a lemon.
  const innerX = x - r
  const innerY = y + 0.06 * r
  const outerX = x + r
  const outerY = y - 0.04 * r
  const upperLid =
    `M ${innerX} ${innerY} ` +
    `C ${x - 0.52 * r} ${y - 0.62 * r} ${x + 0.3 * r} ${y - 0.6 * r} ${outerX} ${outerY}`
  const lowerLid =
    `C ${x + 0.45 * r} ${y + 0.44 * r} ${x - 0.3 * r} ${y + 0.46 * r} ${innerX} ${innerY}`
  const lid = `${upperLid} ${lowerLid} Z`

  // The iris is wider than the opening is tall, so the lids crop it top and
  // bottom exactly as they do on a real eye — but it must stay narrow enough
  // that white shows either side of it. At 0.42r it filled the whole opening
  // and the eye turned feline.
  const irisR = r * 0.34
  const pupilR = r * 0.15

  // Radial fibres. This, not a gloss gradient, is what stops the iris reading
  // as a flat disc — and it is the same hairline vocabulary as the rest of the
  // page. Only drawn on the eyes big enough to resolve them; below about 20
  // units they collapse into a smudge, so those keep a clean iris.
  const fibres =
    (eye.detail ?? r >= 20)
      ? Array.from({ length: 12 }, (_, i) => {
          // Deterministic jitter — a perfectly even fan reads as a gear.
          const a = ((i + ((i * 7) % 3) * 0.16) / 12) * Math.PI * 2
          const inner = irisR * 0.44
          const outer = irisR * (0.9 + ((i * 5) % 3) * 0.03)
          return {
            x1: x + Math.cos(a) * inner,
            y1: y + Math.sin(a) * inner,
            x2: x + Math.cos(a) * outer,
            y2: y + Math.sin(a) * outer,
          }
        })
      : []

  // Pupil travel is capped so the iris never reaches the corners. With the
  // old 0.3 the iris edge landed at 1.02r — past the lid — and the eye looked
  // dislocated rather than glancing.
  const travel = r * 0.18
  const track = useRef<SVGGElement>(null)
  usePointerWriter(
    useCallback(
      ({ x: px, y: py }) => {
        const el = track.current
        if (el)
          el.style.transform = `translate(${(px * travel * 2).toFixed(2)}px, ${(py * travel * 1.4).toFixed(2)}px)`
      },
      [travel],
    ),
  )

  // The lid sweep. Shared by the sclera and the rim so the silhouette and its
  // outline can never drift apart mid-animation.
  const lidSweep = {
    transformOrigin: `${x}px ${y}px`,
    transform: open ? "scaleY(1)" : "scaleY(0.04)",
    transition: `transform 0.9s var(--ease-core) ${eye.delay}s`,
  }

  return (
    <g transform={eye.rot ? `rotate(${eye.rot} ${x} ${y})` : undefined}>
      <defs>
        <clipPath id={clipId}>
          <path d={lid} />
        </clipPath>
      </defs>

      {/* Sclera */}
      <path d={lid} fill={`url(#${p}-sclera)`} style={lidSweep} />

      {/* Everything the lid contains. Clipped to the almond so it vanishes as
          the eye closes, and faded in behind the lid's own sweep. */}
      <g
        clipPath={`url(#${clipId})`}
        style={{
          opacity: open ? 1 : 0,
          transition: `opacity 0.5s var(--ease-core) ${eye.delay + 0.25}s`,
        }}
      >
        <g ref={track}>
          <circle cx={x} cy={y} r={irisR} fill={`url(#${p}-iris)`} />
          {fibres.map((f, i) => (
            <line
              key={i}
              x1={f.x1}
              y1={f.y1}
              x2={f.x2}
              y2={f.y2}
              stroke="var(--background)"
              strokeOpacity="0.26"
              strokeWidth={r * 0.014}
              strokeLinecap="round"
            />
          ))}
          {/* Limbus last of the iris stack, so the rim darkening closes over
              the fibre ends instead of leaving them stranded. */}
          <circle cx={x} cy={y} r={irisR} fill={`url(#${p}-limbus)`} />
          <circle cx={x} cy={y} r={pupilR} fill="var(--background)" />
          {/* Catchlights. The larger sits opposite the lid shade and straddles
              the pupil edge; the small one is the bounce from below that stops
              the eye looking lit by a single bulb. */}
          <circle
            cx={x - r * 0.13}
            cy={y - r * 0.15}
            r={r * 0.055}
            fill="#FFFFFF"
            opacity="0.85"
          />
          <circle
            cx={x + r * 0.13}
            cy={y + r * 0.12}
            r={r * 0.028}
            fill="#FFFFFF"
            opacity="0.32"
          />
        </g>

        {/* Lid shade, over the iris and fixed to the socket — it must not
            travel with the pupil, or the light source moves with the gaze. */}
        <rect
          x={x - r}
          y={y - r * 0.5}
          width={r * 2}
          height={r * 1.05}
          fill={`url(#${p}-lidshade)`}
        />

        {/* Lash line. Drawn inside the clip so the stroke thickens the top
            edge only, which is where a lid actually overlaps the eyeball.
            Kept to a hairline: at 0.1r and half opacity it read as eyeliner,
            a hard band that flattened everything under it. */}
        <path
          d={upperLid}
          fill="none"
          stroke="var(--background)"
          strokeOpacity="0.22"
          strokeWidth={r * 0.035}
          strokeLinecap="round"
        />
      </g>

      {/* Outer rim, over everything so the silhouette stays crisp. Scaled
          with the eye — a flat 1px outline swamped the smallest of the eleven
          and disappeared on the largest. */}
      <path
        d={lid}
        fill="none"
        stroke="var(--line)"
        strokeWidth={r * 0.022}
        style={lidSweep}
      />
    </g>
  )
}

export function ArgusEyes({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const [open, setOpen] = useState(false)
  const p = usePaintId()

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
        <ArgusDefs p={p} />
        {EYES.map((eye) => (
          <ArgusEye key={`${eye.x}-${eye.y}`} eye={eye} open={open} p={p} />
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
  const p = usePaintId()

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
        <ArgusDefs p={p} />
        {/* `detail: false` regardless of size. The margin eyes render at 22–30
            CSS pixels, where twelve iris fibres are a smudge rather than a
            texture — and they are meant to sit at the edge of vision anyway. */}
        <ArgusEye eye={{ x: 50, y: 50, r: 42, delay: 0, detail: false }} open={open} p={p} />
      </svg>
    </div>
  )
}
