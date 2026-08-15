import { useEffect, useRef, useState, type ElementType, type ReactNode } from "react"

/**
 * Body copy that sits dim and brightens word by word as it enters view.
 *
 * Both reference sites do this and it is the cheapest technique on the list
 * with a real payoff: a paragraph that resolves as you reach it feels
 * authored, where the same paragraph at full opacity is just text.
 *
 * Kept separate from LineReveal on purpose — headlines get the mask-and-rise
 * treatment, paragraphs get this. Using the mask on long copy makes the
 * reader wait for their own sentence.
 */
export function ProgressiveText({
  as: Tag = "p",
  text,
  className = "",
  stagger = 0.022,
  delay = 0,
}: {
  as?: ElementType
  text: string
  className?: string
  stagger?: number
  delay?: number
}) {
  const ref = useRef<HTMLElement>(null)
  const [revealed, setRevealed] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    // Kept connected: the brightening runs backwards on the way up.
    const io = new IntersectionObserver(
      ([entry]) => setRevealed(entry.isIntersecting),
      // Starts a little later than a headline reveal — the brightening should
      // track the reader arriving, not finish before they get there.
      { threshold: 0.25, rootMargin: "0px 0px -12% 0px" },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  const words = text.split(" ")

  return (
    <Tag ref={ref} className={className} data-revealed={revealed}>
      {words.map((word, i) => (
        <span
          key={`${word}-${i}`}
          className="dim-word"
          style={{ "--reveal-delay": `${delay + i * stagger}s` } as React.CSSProperties}
        >
          {word}
          {i < words.length - 1 ? " " : ""}
        </span>
      ))}
    </Tag>
  )
}

/**
 * Hand-drawn emphasis over a phrase: a rough circle, underline, or marker
 * highlight that draws itself once in view.
 *
 * The paths are deliberately imperfect — a geometric ellipse reads as a
 * border, a wobbly one reads as a person with a pen. Use two or three per
 * page at most.
 */
export function Annotate({
  children,
  type = "circle",
}: {
  children: ReactNode
  type?: "circle" | "underline" | "mark"
}) {
  const paths: Record<string, { d: string; len: number; box: string }> = {
    // Slightly open ellipse, drawn past its own start like a real pen stroke
    circle: {
      d: "M148,12 C86,4 20,16 9,44 C-2,72 44,92 108,94 C168,96 214,80 213,52 C212,26 170,10 120,8",
      len: 640,
      box: "0 0 220 100",
    },
    underline: {
      d: "M6,60 C58,44 128,42 214,52 M14,72 C70,60 140,58 206,66",
      len: 460,
      box: "0 0 220 100",
    },
    mark: {
      d: "M10,52 C70,44 150,46 210,50",
      len: 210,
      box: "0 0 220 100",
    },
  }

  const p = paths[type]

  return (
    <span className={`annot${type === "mark" ? " annot--mark" : ""}`}>
      {children}
      <svg viewBox={p.box} preserveAspectRatio="none" aria-hidden="true">
        <path d={p.d} style={{ "--len": p.len } as React.CSSProperties} />
      </svg>
    </span>
  )
}
