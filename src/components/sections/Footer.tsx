import { useCallback, useEffect, useRef, useState } from "react"
import { contacts } from "@/data/cv"
import { LineReveal, RevealOnScroll } from "@/components/LineReveal"

/** content_copy, and the tick that replaces it for two seconds after. */
const ICON_COPY =
  "M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"
const ICON_DONE = "M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"

/**
 * Copy `text`, with a fallback for browsers that will not hand over the async
 * clipboard. `navigator.clipboard` is undefined outside a secure context and
 * can reject outright when the permission is denied, so the deprecated
 * execCommand path stays — this is the site's primary call to action, and it
 * failing silently is the whole problem being fixed here.
 */
async function copyText(text: string) {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text)
      return true
    }
  } catch {
    // fall through
  }
  try {
    const el = document.createElement("textarea")
    el.value = text
    el.setAttribute("readonly", "")
    el.style.position = "fixed"
    el.style.opacity = "0"
    document.body.appendChild(el)
    el.select()
    const ok = document.execCommand("copy")
    document.body.removeChild(el)
    return ok
  } catch {
    return false
  }
}

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
          className="block italic text-[var(--brand-accent)]"
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
            <ContactRow contact={contact} />
          </RevealOnScroll>
        ))}
      </div>

      {/* Copyright and back-to-top moved into <Coda>, which is now the last
          thing on the page — the closing scene should be the final beat, not
          a legal line followed by an image. */}
    </footer>
  )
}

/**
 * One ruled contact row.
 *
 * The mail row also copies the address on click. A `mailto:` does nothing at
 * all on a machine with no handler registered for the protocol — the browser
 * swallows the click in silence — which is very common on desktop and made
 * the single most important link on the page look broken. Copying alongside
 * means the click always produces something: the client opens for people who
 * have one, and everyone else gets the address on their clipboard and a
 * "Copied" confirmation.
 *
 * Deliberately not `preventDefault`. The navigation still runs; the copy is
 * an addition to it, not a replacement, so nobody loses the behaviour they
 * expect from an email link.
 */
function ContactRow({ contact }: { contact: (typeof contacts)[number] }) {
  const isMail = contact.href.startsWith("mailto:")
  const [copied, setCopied] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  useEffect(() => () => clearTimeout(timer.current), [])

  const onClick = useCallback(() => {
    if (!isMail) return
    void copyText(contact.href.replace(/^mailto:/, "")).then((ok) => {
      if (!ok) return
      setCopied(true)
      clearTimeout(timer.current)
      timer.current = setTimeout(() => setCopied(false), 2000)
    })
  }, [contact.href, isMail])

  return (
    <a
      href={contact.href}
      target={isMail ? undefined : "_blank"}
      rel="noreferrer"
      onClick={onClick}
      className="group flex h-full items-center justify-between gap-5 border-b border-[var(--line-soft)] py-[clamp(14px,1.6vw,20px)] pr-2 outline-none focus-visible:ring-1 focus-visible:ring-[var(--brand-accent)]/50"
    >
      <span className="flex min-w-0 items-center gap-4">
        <svg
          viewBox="0 0 24 24"
          aria-hidden
          className="h-4 w-4 shrink-0 fill-[var(--ink-mute)] transition-colors duration-500 group-hover:fill-[var(--brand-accent)]"
        >
          <path d={contact.path} />
        </svg>
        <span className="truncate text-[clamp(14px,1.3vw,17px)] text-[var(--ink-strong)] transition-colors duration-500 group-hover:text-[var(--brand-accent)]">
          {contact.label}
        </span>
      </span>

      {/* Fixed width so the confirmation cannot shove the row around when it
          appears. The mail row shows a copy glyph rather than the outbound
          arrow, because copying is not navigation. */}
      <span
        className={
          isMail
            ? "flex w-[86px] shrink-0 items-center justify-end gap-2"
            : "shrink-0 text-[var(--ink-mute)] transition-all duration-500 [transition-timing-function:var(--ease-core)] group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[var(--brand-accent)]"
        }
      >
        {isMail ? (
          <>
            <span
              aria-live="polite"
              className={`font-mono-ui text-[10px] uppercase tracking-[0.14em] text-[var(--brand-accent)] transition-opacity duration-300 ${
                copied ? "opacity-100" : "opacity-0"
              }`}
            >
              {copied ? "Copied" : ""}
            </span>
            <svg
              viewBox="0 0 24 24"
              aria-hidden
              className={`h-[15px] w-[15px] shrink-0 transition-colors duration-500 ${
                copied
                  ? "fill-[var(--brand-accent)]"
                  : "fill-[var(--ink-mute)] group-hover:fill-[var(--brand-accent)]"
              }`}
            >
              <path d={copied ? ICON_DONE : ICON_COPY} />
            </svg>
          </>
        ) : (
          "↗"
        )}
      </span>
    </a>
  )
}
