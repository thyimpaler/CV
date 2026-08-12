import { useEffect, useRef, useState, type ElementType, type ReactNode } from "react"

/**
 * Splits text into per-word clipping masks that rise into place on scroll,
 * each one delayed slightly after the last.
 *
 * The stagger is what sells it: a block of text that fades in as one piece
 * reads as a transition, whereas words arriving in sequence read as
 * typesetting. Delay compounds per word but is capped so long paragraphs
 * don't crawl.
 */

type Props = {
  as?: ElementType
  text: string
  className?: string
  /** Seconds between each word. Lower for long copy, higher for headlines. */
  stagger?: number
  /** Seconds before the first word moves. */
  delay?: number
  /** Fires the reveal immediately instead of waiting for scroll. */
  immediate?: boolean
  children?: ReactNode
}

export function LineReveal({
  as: Tag = "span",
  text,
  className = "",
  stagger = 0.035,
  delay = 0,
  immediate = false,
}: Props) {
  const ref = useRef<HTMLElement>(null)
  const [revealed, setRevealed] = useState(immediate)

  useEffect(() => {
    if (immediate) return
    const el = ref.current
    if (!el) return

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRevealed(true)
          io.disconnect()
        }
      },
      // Fire a little before the element is fully in view so the motion
      // has finished by the time the reader's eye lands on it.
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [immediate])

  const words = text.split(" ")

  return (
    <Tag ref={ref} className={className} data-revealed={revealed}>
      {words.map((word, i) => (
        <span key={`${word}-${i}`} className="reveal-word">
          <span style={{ "--reveal-delay": `${delay + i * stagger}s` } as React.CSSProperties}>
            {word}
          </span>
          {i < words.length - 1 ? " " : ""}
        </span>
      ))}
    </Tag>
  )
}

/**
 * Generic scroll-triggered wrapper for anything that isn't text.
 * Sets `data-revealed` so CSS (`.rule-draw`, custom transitions) can hook in.
 */
export function RevealOnScroll({
  children,
  className = "",
  threshold = 0.15,
}: {
  children: ReactNode
  className?: string
  threshold?: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [revealed, setRevealed] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRevealed(true)
          io.disconnect()
        }
      },
      { threshold, rootMargin: "0px 0px -8% 0px" },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [threshold])

  return (
    <div ref={ref} className={className} data-revealed={revealed}>
      {children}
    </div>
  )
}
