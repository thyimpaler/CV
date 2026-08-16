import { useEffect, useRef, useState } from "react"
import { stats, featuredStat } from "@/data/cv"
import { RevealOnScroll } from "@/components/LineReveal"

/**
 * One figure at display scale, then the rest as a ruled row.
 *
 * Every number used to sit at the same size, which meant the strongest fact
 * on the page — a $105K peak held through the volatility — was queued
 * politely behind "trading since 2024". Giving one figure an entire screen
 * is the cheapest way to make a page assert something instead of listing
 * things.
 *
 * The numeral is set far larger than the hero headline on purpose. It is the
 * only element on the page allowed to be bigger than the name.
 */
function FeaturedStat() {
  const ref = useRef<HTMLDivElement>(null)
  const [shown, setShown] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([e]) => setShown(e.isIntersecting),
      { threshold: 0.35 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className="flex min-h-[72svh] flex-col items-center justify-center text-center"
    >
      <span
        className="t-eyebrow"
        style={{
          opacity: shown ? 1 : 0,
          transform: shown ? "none" : "translateY(10px)",
          transition: "opacity 0.7s var(--ease-core), transform 0.7s var(--ease-core)",
        }}
      >
        {featuredStat.hint}
      </span>

      {/* Rises out of a clipping mask, like the word reveals elsewhere —
          at this size the mask is the whole effect. */}
      <span className="mt-[clamp(20px,3vw,44px)] block overflow-clip [overflow-clip-margin:0.12em]">
        <span
          className="block font-[family-name:var(--font-display)] leading-[0.82] tracking-[-0.055em] text-[var(--ink-strong)]"
          style={{
            fontSize: "clamp(96px, 26vw, 400px)",
            transform: shown ? "translateY(0)" : "translateY(105%)",
            transition: "transform 1.1s var(--ease-core) 0.1s",
          }}
        >
          {featuredStat.value}
        </span>
      </span>

      <span
        className="mt-[clamp(18px,2.4vw,36px)] block text-[clamp(15px,1.5vw,20px)] text-[var(--ink)]"
        style={{
          opacity: shown ? 1 : 0,
          transition: "opacity 0.7s var(--ease-core) 0.5s",
        }}
      >
        {featuredStat.label}
      </span>
    </div>
  )
}

export function Stats() {
  return (
    /* No top padding: FeaturedStat is min-h-[72svh] and centres its own
       content, so the shell's 144px would stack on top of the ~150px of slack
       the centring already produces. Two sources of vertical space for one gap
       measured as a 471px empty band above the numeral — the only band that
       size anywhere on the page. The min-height owns the space now. */
    <section id="stats" className="section-shell !pt-0 !pb-[clamp(80px,10vw,140px)]">
      <FeaturedStat />

      <div className="mt-[clamp(60px,9vw,140px)] grid gap-px overflow-hidden bg-[var(--line-soft)] sm:grid-cols-3">
        {stats.map((stat, i) => (
          <RevealOnScroll key={stat.label} className="bg-[var(--background)]">
            <div
              className="group h-full px-2 py-[clamp(28px,4vw,48px)] sm:px-[clamp(16px,2.5vw,36px)]"
              style={{ animationDelay: `${i * 0.08}s` }}
            >
              <span className="t-eyebrow block">{stat.hint}</span>
              <span className="mt-6 block font-[family-name:var(--font-display)] text-[clamp(40px,5vw,68px)] leading-[0.9] tracking-[-0.04em] text-[var(--ink-strong)] transition-colors duration-700 group-hover:text-[var(--brand-accent)]">
                {stat.value}
              </span>
              <span className="mt-4 block text-[14px] text-[var(--ink-mute)]">
                {stat.label}
              </span>
            </div>
          </RevealOnScroll>
        ))}
      </div>
    </section>
  )
}
