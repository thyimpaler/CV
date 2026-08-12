import { experiences } from "@/data/cv"
import { SectionHeader } from "@/components/SectionHeader"
import { RevealOnScroll } from "@/components/LineReveal"

/**
 * Experience rows, linked out where the project has somewhere to go.
 *
 * The micro-interaction is deliberately tied to the page's own idea rather
 * than borrowed: hovering nudges the row *up and to the right*, along the
 * same incline the scroll marker climbs. Rows that link somewhere also
 * surface their destination host on hover, so the reader knows where a click
 * lands before making it — an external link that doesn't announce itself is
 * just a trap.
 *
 * Rows without a URL stay inert. No fake affordances.
 */

function host(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, "")
  } catch {
    return url
  }
}

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
        {experiences.map((exp, i) => {
          const linked = Boolean(exp.href)

          const row = (
            <div
              className={`group/row grid gap-x-[clamp(20px,4vw,56px)] gap-y-4 border-b border-[var(--line-soft)] py-[clamp(24px,3.2vw,42px)] transition-transform duration-500 [transition-timing-function:var(--ease-core)] md:grid-cols-[minmax(130px,0.65fr)_1.45fr_minmax(150px,0.9fr)] ${
                linked ? "hover:-translate-y-0.5 hover:translate-x-1" : ""
              }`}
            >
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

              {/* The one line that matters */}
              <div className="order-3 md:order-none">
                <p className="text-[clamp(16px,1.5vw,20px)] leading-snug text-[var(--ink-strong)]">
                  {exp.impact}
                </p>
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
                {/* Token art as a small plate. Desaturated at rest so five of
                    them down the page stay quiet, resolving to full colour on
                    hover — the same treatment the avatar gets, so the page has
                    one way of handling images rather than three. */}
                {exp.art ? (
                  <img
                    src={exp.art}
                    alt=""
                    loading="lazy"
                    className="mb-3 h-11 w-11 rounded-[3px] object-cover grayscale transition-all duration-700 [transition-timing-function:var(--ease-core)] group-hover/row:grayscale-0 md:ml-auto"
                  />
                ) : null}

                <span className="inline-flex items-baseline gap-2">
                  <span className="font-[family-name:var(--font-display)] text-[clamp(21px,2.2vw,32px)] leading-none text-[var(--ink-strong)] transition-colors duration-500 group-hover/row:text-[var(--brand-gold)]">
                    {exp.project}
                  </span>
                  {linked ? (
                    <span className="text-[0.62em] text-[var(--ink-mute)] transition-all duration-500 [transition-timing-function:var(--ease-core)] group-hover/row:-translate-y-0.5 group-hover/row:translate-x-0.5 group-hover/row:text-[var(--brand-gold)]">
                      ↗
                    </span>
                  ) : null}
                </span>

                <span className="mt-2.5 block text-[13px] text-[var(--ink-mute)]">
                  {exp.role}
                </span>

                {/* The chain gets its own link — it is a different destination
                    from the project that ran on it. */}
                {exp.sub ? (
                  exp.subHref ? (
                    <a
                      href={exp.subHref}
                      target="_blank"
                      rel="noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="font-mono-ui relative z-10 mt-1.5 inline-block text-[10px] uppercase tracking-[0.14em] text-[var(--ink-mute)] opacity-60 transition-all duration-300 hover:text-[var(--brand-gold)] hover:opacity-100"
                    >
                      {exp.sub} ↗
                    </a>
                  ) : (
                    <span className="font-mono-ui mt-1.5 block text-[10px] uppercase tracking-[0.14em] text-[var(--ink-mute)] opacity-60">
                      {exp.sub}
                    </span>
                  )
                ) : null}

                {/* Destination, revealed only on hover. */}
                {linked ? (
                  <span className="font-mono-ui mt-2 block text-[10px] tracking-[0.1em] text-[var(--brand-gold)] opacity-0 transition-opacity duration-500 group-hover/row:opacity-70">
                    {host(exp.href!)}
                  </span>
                ) : null}
              </div>
            </div>
          )

          return (
            <RevealOnScroll key={`${exp.project}-${i}`}>
              {linked ? (
                <a
                  href={exp.href}
                  target="_blank"
                  rel="noreferrer"
                  className="block outline-none focus-visible:ring-1 focus-visible:ring-[var(--brand-gold)]/50"
                >
                  {row}
                </a>
              ) : (
                row
              )}
            </RevealOnScroll>
          )
        })}
      </div>
    </section>
  )
}
