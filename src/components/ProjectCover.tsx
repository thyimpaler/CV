/**
 * Generated cover art for each project, drawn from the design system.
 *
 * These are deliberately **not** screenshots and are never labelled as such.
 * Faking a product UI would misrepresent what was built; an abstract mark
 * derived from what the project actually does is honest and still gives the
 * page visual weight. Real captures can replace them by filling `shots` in
 * the project data — the cover is the fallback, not a placeholder pretending
 * to be a screenshot.
 *
 * Each mark is deterministic and specific to the project:
 *  - cipv1     research converging into a single executed trade
 *  - csc1      order-book depth, bid and ask stacked around a mid
 *  - zencode   a voice waveform resolving into an even signal
 *  - omni-sync orbits at different rates coming into alignment
 *
 * Everything uses the accent and line tokens, so covers restyle themselves
 * with the palette instead of going stale the way a flat image would.
 */

function Frame({ children }: { children: React.ReactNode }) {
  return (
    <svg viewBox="0 0 640 400" className="h-full w-full" aria-hidden>
      <rect width="640" height="400" fill="#0C0A0B" />
      {children}
    </svg>
  )
}

function Cipv1() {
  // Many inputs, one output.
  const lines = Array.from({ length: 13 }, (_, i) => {
    const y = 40 + i * 26
    return (
      <path
        key={i}
        d={`M 60 ${y} C 240 ${y}, 300 200, 470 200`}
        fill="none"
        stroke="var(--line)"
        strokeWidth="1"
      />
    )
  })
  return (
    <Frame>
      {lines}
      <circle cx="470" cy="200" r="6" fill="var(--brand-accent)" />
      <path d="M 470 200 L 590 200" stroke="var(--brand-accent)" strokeWidth="1.5" />
      <path d="M 578 193 L 590 200 L 578 207" fill="none" stroke="var(--brand-accent)" strokeWidth="1.5" />
    </Frame>
  )
}

function Csc1() {
  // Depth chart: asks above the mid, bids below, one level lit.
  const bars = Array.from({ length: 26 }, (_, i) => {
    const x = 60 + i * 20
    const t = i / 25
    const up = 150 * Math.pow(1 - Math.abs(t - 0.5) * 2, 1.6)
    const lit = i === 17
    return (
      <g key={i}>
        <rect x={x} y={200 - up} width="10" height={up} fill={lit ? "var(--brand-accent)" : "var(--line)"} />
        <rect x={x} y={200} width="10" height={up * 0.72} fill={lit ? "var(--brand-accent)" : "var(--line-soft)"} opacity={lit ? 0.5 : 1} />
      </g>
    )
  })
  return (
    <Frame>
      {bars}
      <path d="M 40 200 L 600 200" stroke="var(--line)" strokeWidth="1" />
    </Frame>
  )
}

function ZenCode() {
  // Voice in, clean signal out.
  const pts = Array.from({ length: 60 }, (_, i) => {
    const x = 50 + i * 9
    const chaos = Math.max(0, 1 - i / 34)
    const a = Math.sin(i * 0.9) * 58 * chaos + Math.sin(i * 0.31) * 16
    return `${x},${200 + a}`
  }).join(" ")
  return (
    <Frame>
      <polyline points={pts} fill="none" stroke="var(--brand-accent)" strokeWidth="1.75" />
      <path d="M 50 200 L 590 200" stroke="var(--line)" strokeWidth="1" strokeDasharray="3 6" />
    </Frame>
  )
}

function OmniSync() {
  // Separate orbits, one shared point.
  return (
    <Frame>
      {[132, 96, 60].map((r, i) => (
        <ellipse
          key={r}
          cx="320"
          cy="200"
          rx={r * 1.5}
          ry={r}
          fill="none"
          stroke="var(--line)"
          strokeWidth="1"
          transform={`rotate(${i * 30} 320 200)`}
        />
      ))}
      <circle cx="320" cy="200" r="5" fill="var(--brand-accent)" />
      <circle cx="518" cy="200" r="3.5" fill="var(--ink-mute)" />
      <circle cx="176" cy="152" r="3.5" fill="var(--ink-mute)" />
      <circle cx="248" cy="266" r="3.5" fill="var(--ink-mute)" />
    </Frame>
  )
}

const COVERS: Record<string, () => React.ReactElement> = {
  cipv1: Cipv1,
  csc1: Csc1,
  zencode: ZenCode,
  "omni-sync": OmniSync,
}

export function ProjectCover({
  slug,
  className = "",
}: {
  slug: string
  className?: string
}) {
  const Mark = COVERS[slug]
  if (!Mark) return null
  return (
    <div className={`overflow-hidden rounded-[3px] border border-[var(--line-soft)] ${className}`}>
      <Mark />
    </div>
  )
}

export const hasCover = (slug: string) => Boolean(COVERS[slug])
