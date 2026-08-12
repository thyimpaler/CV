import { experiences } from "@/data/cv"
import { SectionHeader } from "@/components/SectionHeader"
import { RevealOnScroll } from "@/components/LineReveal"

/**
 * Experience as a static ruled table — no accordion.
 *
 * The expandable version existed to hide three or four bullets per role. Now
 * that each role carries one impact line and one line of context, there is
 * nothing worth hiding: everything fits on screen and the reader takes in
 * five roles without a single click. Removing the interaction made the
 * section better, which is usually the sign it was compensating for
 * something.
 */
export function Experience() {
  return (
    <section id="experience" className="section-shell">
      <SectionHeader
        index="01"
        label="Experience"
        title="Where I've operated"
        className="heading-gap"
      />

      <div className="border-t border-[var(--line-soft)]">
        {experiences.map((exp, i) => (
          <RevealOnScroll key={`${exp.project}-${i}`}>
            <div className="group grid gap-x-[clamp(20px,4vw,56px)] gap-y-4 border-b border-[var(--line-soft)] py-[clamp(24px,3.2vw,42px)] md:grid-cols-[minmax(130px,0.65fr)_1.45fr_minmax(150px,0.9fr)]">
              {/* Period + status */}
              <div className="order-2 md:order-none">
                <span className="font-mono-ui block text-[12px] tabular-nums text-[var(--ink-mute)]">
                  {exp.period}
                </span>
                <span
                  className={`font-mono-ui mt-2 inline-block text-[10px] uppercase tracking-[0.14em] ${
                    exp.status === "Active"
                      ? "text-[var(--brand-gold)]"
                      : "text-[var(--ink-mute)] opacity-60"
                  }`}
                >
                  {exp.status}
                  {exp.dev ? " · Dev" : ""}
                </span>
              </div>

              {/* The impact line carries the row. */}
              <div className="order-3 md:order-none">
                <p className="text-[clamp(16px,1.5vw,20px)] leading-snug text-[var(--ink-strong)]">
                  {exp.impact}
                </p>
                {exp.detail ? (
                  <p className="mt-2.5 text-[14px] leading-relaxed text-[var(--ink-mute)]">
                    {exp.detail}
                  </p>
                ) : null}
                {exp.tags?.length ? (
                  <ul className="mt-4 flex flex-wrap items-center gap-x-2.5 gap-y-2">
                    {exp.tags.map((tag) => (
                      <li
                        key={tag}
                        className="font-mono-ui rounded-full border border-[var(--line-soft)] px-2.5 py-1 text-[10px] uppercase tracking-[0.1em] text-[var(--ink-mute)]"
                      >
                        {tag}
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>

              {/* Project + role */}
              <div className="order-1 md:order-none md:text-right">
                <span className="block font-[family-name:var(--font-display)] text-[clamp(21px,2.2vw,32px)] leading-none text-[var(--ink-strong)] transition-colors duration-500 group-hover:text-[var(--brand-gold)]">
                  {exp.project}
                </span>
                <span className="mt-2.5 block text-[13px] text-[var(--ink-mute)]">
                  {exp.role}
                </span>
                {exp.sub ? (
                  <span className="font-mono-ui mt-1.5 block text-[10px] uppercase tracking-[0.14em] text-[var(--ink-mute)] opacity-60">
                    {exp.sub}
                  </span>
                ) : null}
              </div>
            </div>
          </RevealOnScroll>
        ))}
      </div>
    </section>
  )
}
