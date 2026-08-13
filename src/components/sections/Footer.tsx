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
          className="block italic text-[var(--brand-blood)]"
          stagger={0.06}
          delay={0.1}
        />
      </h2>

      {/* Two columns rather than four stacked rows, at half the type size.
          The section was running nearly a full screen for four links — the
          headline earns display scale, a list of handles does not. */}
      <div className="mt-[clamp(32px,4.5vw,60px)] grid border-t border-[var(--line-soft)] sm:grid-cols-2">
        {contacts.map((contact) => (
          <RevealOnScroll key={contact.id}>
            <a
              href={contact.href}
              target={contact.href.startsWith("mailto:") ? undefined : "_blank"}
              rel="noreferrer"
              className="group flex h-full items-center justify-between gap-5 border-b border-[var(--line-soft)] py-[clamp(14px,1.6vw,20px)] pr-2 outline-none focus-visible:ring-1 focus-visible:ring-[var(--brand-blood)]/50"
            >
              <span className="flex min-w-0 items-center gap-4">
                <svg
                  viewBox="0 0 24 24"
                  aria-hidden
                  className="h-4 w-4 shrink-0 fill-[var(--ink-mute)] transition-colors duration-500 group-hover:fill-[var(--brand-blood)]"
                >
                  <path d={contact.path} />
                </svg>
                <span className="truncate text-[clamp(14px,1.3vw,17px)] text-[var(--ink-strong)] transition-colors duration-500 group-hover:text-[var(--brand-blood)]">
                  {contact.label}
                </span>
              </span>

              <span className="shrink-0 text-[var(--ink-mute)] transition-all duration-500 [transition-timing-function:var(--ease-core)] group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[var(--brand-blood)]">
                ↗
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
