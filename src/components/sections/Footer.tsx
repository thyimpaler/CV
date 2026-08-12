import { contacts } from "@/data/cv"
import { LineReveal, RevealOnScroll } from "@/components/LineReveal"

/**
 * Closing CTA at display scale.
 *
 * The footer is the last thing a reader sees, so it gets the same type scale
 * as the hero rather than being demoted to small print. Contact links are a
 * ruled list where each row wipes to the accent colour on hover.
 */
export function Footer() {
  return (
    <footer
      id="contact"
      className="section-shell !pb-[clamp(40px,5vw,72px)]"
    >
      <LineReveal
        as="p"
        text="Available for work"
        className="t-eyebrow block"
      />

      <h2 className="t-h1 mt-[clamp(28px,4vw,52px)] text-[var(--ink-strong)]">
        <LineReveal as="span" text="Let's build" className="block" stagger={0.06} />
        <LineReveal
          as="span"
          text="something solid."
          className="block italic text-[var(--brand-gold)]"
          stagger={0.06}
          delay={0.1}
        />
      </h2>

      <div className="mt-[clamp(56px,8vw,110px)] border-t border-[var(--line-soft)]">
        {contacts.map((contact) => (
          <RevealOnScroll key={contact.id}>
            <a
              href={contact.href}
              target={contact.href.startsWith("mailto:") ? undefined : "_blank"}
              rel="noreferrer"
              className="group flex items-center justify-between gap-6 border-b border-[var(--line-soft)] py-[clamp(18px,2.4vw,30px)] outline-none focus-visible:ring-1 focus-visible:ring-[var(--brand-gold)]/50"
            >
              <span className="flex min-w-0 items-center gap-[clamp(14px,2.5vw,32px)]">
                <svg
                  viewBox="0 0 24 24"
                  aria-hidden
                  className="h-4 w-4 shrink-0 fill-[var(--ink-mute)] transition-colors duration-500 group-hover:fill-[var(--brand-gold)]"
                >
                  <path d={contact.path} />
                </svg>
                <span className="truncate font-[family-name:var(--font-display)] text-[clamp(20px,2.6vw,38px)] leading-none text-[var(--ink-strong)] transition-colors duration-500 group-hover:text-[var(--brand-gold)]">
                  {contact.label}
                </span>
              </span>

              {/* Arrow slides out and back in from the left on hover. */}
              <span className="relative h-5 w-5 shrink-0 overflow-hidden">
                <span className="absolute inset-0 flex items-center justify-center text-[var(--ink-mute)] transition-all duration-500 [transition-timing-function:var(--ease-core)] group-hover:translate-x-5 group-hover:opacity-0">
                  ↗
                </span>
                <span className="absolute inset-0 flex -translate-x-5 items-center justify-center text-[var(--brand-gold)] opacity-0 transition-all duration-500 [transition-timing-function:var(--ease-core)] group-hover:translate-x-0 group-hover:opacity-100">
                  ↗
                </span>
              </span>
            </a>
          </RevealOnScroll>
        ))}
      </div>

      {/* Copyright and back-to-top moved into <Coda>, which is now the last
          thing on the page — the closing scene should be the final beat, not
          a legal line followed by an image. */}
    </footer>
  )
}
