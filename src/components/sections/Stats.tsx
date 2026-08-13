import { stats } from "@/data/cv"
import { RevealOnScroll } from "@/components/LineReveal"

/**
 * Stats as an editorial figure row.
 *
 * The emoji are gone — they were the strongest "assembled from a template"
 * signal in the old design. Numerals set large in the display serif carry
 * the weight instead, separated by hairlines rather than card borders.
 */
export function Stats() {
  return (
    <section id="stats" className="section-shell !pb-[clamp(80px,10vw,140px)]">
      <div className="grid gap-px overflow-hidden bg-[var(--line-soft)] sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <RevealOnScroll key={stat.label} className="bg-[var(--background)]">
            <div
              className="group h-full px-2 py-[clamp(28px,4vw,48px)] sm:px-[clamp(16px,2.5vw,36px)]"
              style={{ animationDelay: `${i * 0.08}s` }}
            >
              <span className="t-eyebrow block">{stat.hint}</span>
              <span className="mt-6 block font-[family-name:var(--font-display)] text-[clamp(46px,6vw,86px)] leading-[0.9] tracking-[-0.04em] text-[var(--ink-strong)] transition-colors duration-700 group-hover:text-[var(--brand-blood)]">
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
