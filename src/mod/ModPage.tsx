import { useCallback, useEffect, useRef, useState } from "react"
import { LineReveal, RevealOnScroll } from "@/components/LineReveal"
import { SectionHeader } from "@/components/SectionHeader"
import { Star } from "@/components/Furniture"
import { contacts } from "@/data/cv"
import { copyText } from "@/lib/clipboard"
import { CV_URL, DISCORD, EMAIL, TECH_SITE, roles, services, tools } from "./content"

/**
 * mod.thyimpaler.xyz: the community and moderation page.
 *
 * Same tokens, type scale and primitives as the CV (index.css, LineReveal,
 * SectionHeader), none of its heavy pieces: no drawn cursor, no Argus field,
 * no cursor-tracked lamp, no scroll-driven backdrop. One page, read top to
 * bottom on a phone, so it should be light enough to open from a DM.
 */

const iconPath = (id: string) => contacts.find((c) => c.id === id)?.path ?? ""
const ICON_MAIL = iconPath("email")
const ICON_DISCORD = iconPath("discord")
const ICON_DOC =
  "M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"
const ICON_COPY =
  "M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"
const ICON_DONE = "M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"

type CopyState = "idle" | "copied" | "failed"

/**
 * Copy with a visible result either way. When the clipboard is refused (in-app
 * browsers, or right after a wallet popup) the caller selects the text so
 * Ctrl+C still works, and the label says so instead of doing nothing.
 */
function useCopy(text: string, onFail?: () => void) {
  const [state, setState] = useState<CopyState>("idle")
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  useEffect(() => () => clearTimeout(timer.current), [])

  const copy = useCallback(() => {
    void copyText(text).then((ok) => {
      if (!ok) onFail?.()
      setState(ok ? "copied" : "failed")
      clearTimeout(timer.current)
      timer.current = setTimeout(() => setState("idle"), ok ? 2000 : 4000)
    })
  }, [text, onFail])

  return [state, copy] as const
}

const copyLabel = (state: CopyState) =>
  state === "copied" ? "Copied" : state === "failed" ? "Press Ctrl+C" : ""

export function ModPage() {
  return (
    <>
      <div className="grain-bg" aria-hidden />
      <main className="relative z-10">
        <Hero />
        <Experience />
        <Services />
        <Contact />
        <Colophon />
      </main>
    </>
  )
}

function Nav() {
  return (
    <nav className="relative z-20 flex items-center justify-between px-[var(--section-edge)] py-[clamp(14px,1.8vw,22px)]">
      <a
        href="#top"
        className="font-[family-name:var(--font-display)] -my-3.5 inline-flex items-center py-3.5 text-[17px] leading-none text-[var(--ink-strong)] transition-colors duration-300 hover:text-[var(--brand-accent)]"
      >
        Thy<span className="italic">Impaler</span>
      </a>

      <div className="flex items-center gap-[clamp(18px,3vw,40px)]">
        <a
          href={TECH_SITE}
          className="group font-mono-ui -my-3.5 inline-flex items-center gap-1.5 py-3.5 text-[11px] uppercase tracking-[0.16em] text-[var(--ink-mute)] transition-colors duration-300 hover:text-[var(--ink-strong)]"
        >
          Tech portfolio
          <span className="transition-transform duration-500 [transition-timing-function:var(--ease-core)] group-hover:-translate-y-0.5 group-hover:translate-x-0.5">
            ↗
          </span>
        </a>
        <a
          href="#contact"
          className="group font-mono-ui relative -my-3.5 hidden items-center py-3.5 text-[11px] uppercase tracking-[0.16em] text-[var(--ink-strong)] sm:inline-flex"
        >
          Contact
          <span className="absolute bottom-2 left-0 h-px w-full origin-right scale-x-0 bg-[var(--brand-accent)] transition-transform duration-500 [transition-timing-function:var(--ease-core)] group-hover:origin-left group-hover:scale-x-100" />
        </a>
      </div>
    </nav>
  )
}

function Hero() {
  const [state, copy] = useCopy(EMAIL)

  return (
    <section id="top" className="relative flex min-h-[100svh] flex-col overflow-hidden">
      <div className="grain-field" aria-hidden />
      <Nav />

      <div className="relative z-10 flex flex-1 flex-col justify-center px-[var(--section-edge)] pb-[clamp(140px,22vw,300px)] pt-[clamp(48px,9vh,120px)]">
        <LineReveal
          as="p"
          text="Community · Moderation · Growth"
          className="t-eyebrow t-eyebrow--bright block"
          immediate
          stagger={0.03}
          delay={0.15}
        />

        <h1 className="mt-[clamp(22px,3vw,40px)] max-w-[19ch] text-[clamp(44px,7.6vw,118px)] leading-[0.9] tracking-[-0.045em] text-[var(--ink-strong)]">
          <LineReveal
            as="span"
            text="Community moderation and growth"
            immediate
            stagger={0.05}
            delay={0.3}
          />{" "}
          <LineReveal
            as="span"
            text="for trading and crypto communities."
            className="italic text-[var(--brand-accent)]"
            immediate
            stagger={0.05}
            delay={0.5}
          />
        </h1>

        <div
          className="mt-[clamp(32px,4.5vw,56px)] flex flex-col items-start gap-[clamp(24px,3vw,40px)]"
          style={{ animation: "fade-rise 0.9s var(--ease-core) 1s both" }}
        >
          <p className="t-lead measure text-[var(--ink)]">
            I keep trading and crypto communities clean, active and growing, and I make sure what
            users report reaches the team that can fix it.
          </p>

          <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
            <a
              href={`mailto:${EMAIL}`}
              onClick={copy}
              className="group inline-flex min-h-[48px] items-center gap-3 rounded-full bg-[var(--ink-strong)] px-6 py-3 text-[14px] font-medium text-[#08080a] transition-colors duration-300 hover:bg-[var(--brand-accent)]"
            >
              {EMAIL}
              <span className="transition-transform duration-500 [transition-timing-function:var(--ease-core)] group-hover:translate-x-1">
                →
              </span>
            </a>
            <span
              aria-live="polite"
              className="font-mono-ui min-w-[11ch] text-[10px] uppercase tracking-[0.14em] text-[var(--brand-accent)]"
            >
              {copyLabel(state)}
            </span>
          </div>
        </div>
      </div>

      {/* The CV hero bleeds its wordmark off the bottom edge; this one bleeds
          the subdomain. Same device, so the two read as one family, with a
          different word so neither page looks like a copy of the other. */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 z-0 select-none overflow-hidden"
        style={{ animation: "fade-rise 1.4s var(--ease-core) 0.55s both" }}
        aria-hidden
      >
        <span
          className="block translate-y-[18%] whitespace-nowrap pr-[var(--section-edge)] text-right font-[family-name:var(--font-display)] text-[46vw] italic leading-[0.8] tracking-[-0.055em] text-[var(--ink-strong)] opacity-[0.08] sm:text-[30vw]"
        >
          mod.
        </span>
      </div>
    </section>
  )
}

function Experience() {
  return (
    <section id="experience" className="section-shell">
      <SectionHeader index="01" label="Experience" title="Where I've worked" className="heading-gap" />

      <div className="border-t border-[var(--line-soft)]">
        {roles.map((r) => (
          <RevealOnScroll key={r.org} className="border-b border-[var(--line-soft)]">
            <article className="grid gap-x-[clamp(20px,4vw,56px)] gap-y-5 py-[clamp(30px,4vw,56px)] md:grid-cols-[minmax(120px,0.55fr)_1.45fr_minmax(160px,0.85fr)]">
              <div className="order-2 md:order-none">
                <span className="font-mono-ui block text-[12px] tabular-nums text-[var(--ink-mute)]">
                  {r.period}
                </span>
                {r.current ? (
                  <span className="font-mono-ui mt-2 inline-block text-[10px] uppercase tracking-[0.14em] text-[var(--brand-accent)]">
                    Current
                  </span>
                ) : null}
              </div>

              <div className="order-3 md:order-none">
                <ul className="space-y-3">
                  {r.points.map((p) => (
                    <li
                      key={p}
                      className="text-[clamp(17px,1.6vw,22px)] leading-snug text-[var(--ink-strong)]"
                    >
                      {p}
                    </li>
                  ))}
                </ul>

                {r.metrics?.length ? (
                  <dl className="mt-[clamp(24px,3vw,36px)] grid grid-cols-1 border-t border-[var(--line-soft)] sm:grid-cols-3">
                    {r.metrics.map(([label, value]) => (
                      <div
                        key={label}
                        className="flex items-baseline justify-between gap-4 border-b border-[var(--line-soft)] py-3 sm:block sm:border-b-0 sm:py-4"
                      >
                        <dt className="t-eyebrow">{label}</dt>
                        <dd className="font-mono-ui text-[12px] text-[var(--ink-mute)] sm:mt-2">
                          {value}
                        </dd>
                      </div>
                    ))}
                  </dl>
                ) : null}

                {/* The lead's words, verbatim from the CV. Round avatar and a
                    name caption, so it reads as a person and not a token mark. */}
                {r.lead?.quote ? (
                  <figure className="mt-[clamp(24px,3vw,36px)] border-l border-[var(--brand-accent)]/35 pl-5">
                    <blockquote className="font-[family-name:var(--font-display)] text-[clamp(17px,1.8vw,23px)] italic leading-snug text-[var(--ink-strong)]">
                      “{r.lead.quote}”
                    </blockquote>
                    <figcaption className="mt-4 flex items-center gap-3">
                      {r.lead.avatar ? (
                        <img
                          src={r.lead.avatar}
                          alt=""
                          width={32}
                          height={32}
                          loading="lazy"
                          className="h-8 w-8 shrink-0 rounded-full object-cover"
                        />
                      ) : null}
                      <span className="font-mono-ui text-[10px] uppercase tracking-[0.14em] text-[var(--ink-mute)]">
                        {r.lead.name}
                        {r.lead.role ? <span className="opacity-60"> · {r.lead.role}</span> : null}
                      </span>
                    </figcaption>
                  </figure>
                ) : null}
              </div>

              <div className="order-1 md:order-none md:text-right">
                <h3 className="text-[clamp(30px,3vw,46px)] leading-none text-[var(--ink-strong)]">
                  {r.org}
                </h3>
                <span className="mt-3 block text-[14px] text-[var(--ink)]">{r.role}</span>
                {r.context ? (
                  <span className="font-mono-ui mt-1.5 block text-[10px] uppercase tracking-[0.14em] text-[var(--ink-mute)]">
                    {r.context}
                  </span>
                ) : null}
              </div>
            </article>
          </RevealOnScroll>
        ))}
      </div>
    </section>
  )
}

function Services() {
  return (
    <section id="scope" className="section-shell">
      <SectionHeader index="02" label="Scope" title="What I do" className="heading-gap" />

      <ol className="border-t border-[var(--line-soft)]">
        {services.map((s, i) => (
          <li key={s.title} className="border-b border-[var(--line-soft)]">
            <RevealOnScroll className="grid items-baseline gap-x-[clamp(20px,4vw,56px)] gap-y-2 py-[clamp(22px,2.8vw,36px)] grid-cols-[2.5ch_1fr] md:grid-cols-[minmax(120px,0.55fr)_1fr_1fr]">
              <span className="font-mono-ui text-[11px] tabular-nums text-[var(--brand-accent)]">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="t-h3 text-[var(--ink-strong)]">{s.title}</h3>
              <p className="t-body col-start-2 text-[var(--ink)] md:col-start-auto">{s.body}</p>
            </RevealOnScroll>
          </li>
        ))}
      </ol>

      <RevealOnScroll className="mt-[clamp(32px,4vw,56px)] flex flex-wrap items-baseline gap-x-6 gap-y-3">
        <span className="t-eyebrow">Tools</span>
        <ul className="flex flex-wrap gap-x-2.5 gap-y-2">
          {tools.map((t) => (
            <li
              key={t}
              className="font-mono-ui rounded-full border border-[var(--line-soft)] px-2.5 py-1 text-[10px] uppercase tracking-[0.1em] text-[var(--ink-mute)]"
            >
              {t}
            </li>
          ))}
        </ul>
      </RevealOnScroll>
    </section>
  )
}

function Contact() {
  return (
    <section id="contact" className="section-shell !pb-[clamp(40px,5vw,72px)]">
      <LineReveal as="p" text="03 / Contact" className="t-eyebrow block" />

      <h2 className="t-h1 mt-[clamp(28px,4vw,52px)] text-[var(--ink-strong)]">
        <LineReveal as="span" text="Let's talk about" className="block" stagger={0.06} />
        <LineReveal
          as="span"
          text="your community."
          className="block italic text-[var(--brand-accent)]"
          stagger={0.06}
          delay={0.1}
        />
      </h2>

      <div className="mt-[clamp(32px,4.5vw,60px)] grid border-t border-[var(--line-soft)] sm:grid-cols-2">
        <RevealOnScroll>
          <CopyRow icon={ICON_MAIL} kind="Email" label={EMAIL} href={`mailto:${EMAIL}`} />
        </RevealOnScroll>
        <RevealOnScroll>
          <CopyRow icon={ICON_DISCORD} kind="Discord" label={DISCORD} />
        </RevealOnScroll>
        <RevealOnScroll>
          <CvRow />
        </RevealOnScroll>
      </div>
    </section>
  )
}

const rowClass =
  "group flex h-full min-h-[56px] w-full items-center justify-between gap-5 border-b border-[var(--line-soft)] py-[clamp(14px,1.6vw,20px)] pr-2 text-left outline-none focus-visible:ring-1 focus-visible:ring-[var(--brand-accent)]/50"

function RowLabel({ icon, kind, label, labelRef }: { icon: string; kind: string; label: string; labelRef?: React.Ref<HTMLSpanElement> }) {
  return (
    <span className="flex min-w-0 items-center gap-4">
      <svg
        viewBox="0 0 24 24"
        aria-hidden
        className="h-4 w-4 shrink-0 fill-[var(--ink-mute)] transition-colors duration-500 group-hover:fill-[var(--brand-accent)]"
      >
        <path d={icon} />
      </svg>
      <span className="min-w-0">
        <span className="font-mono-ui block text-[10px] uppercase tracking-[0.14em] text-[var(--ink-mute)]">
          {kind}
        </span>
        <span
          ref={labelRef}
          className="mt-1 block truncate text-[clamp(14px,1.3vw,17px)] text-[var(--ink-strong)] transition-colors duration-500 group-hover:text-[var(--brand-accent)]"
        >
          {label}
        </span>
      </span>
    </span>
  )
}

/**
 * Email and Discord. Email keeps its mailto (and copies alongside, because a
 * mailto with no mail client registered does nothing at all). Discord has no
 * usable profile URL without the numeric user ID, so it copies the handle.
 */
function CopyRow({ icon, kind, label, href }: { icon: string; kind: string; label: string; href?: string }) {
  const labelRef = useRef<HTMLSpanElement>(null)
  const select = useCallback(() => {
    const el = labelRef.current
    const sel = window.getSelection()
    if (!el || !sel) return
    const range = document.createRange()
    range.selectNodeContents(el)
    sel.removeAllRanges()
    sel.addRange(range)
  }, [])
  const [state, copy] = useCopy(label, select)

  const tail = (
    <span className="flex w-[104px] shrink-0 items-center justify-end gap-2">
      <span
        aria-live="polite"
        className="font-mono-ui text-[10px] uppercase tracking-[0.14em] text-[var(--brand-accent)]"
      >
        {copyLabel(state)}
      </span>
      <svg
        viewBox="0 0 24 24"
        aria-hidden
        className={`h-[15px] w-[15px] shrink-0 transition-colors duration-500 ${
          state === "copied"
            ? "fill-[var(--brand-accent)]"
            : "fill-[var(--ink-mute)] group-hover:fill-[var(--brand-accent)]"
        }`}
      >
        <path d={state === "copied" ? ICON_DONE : ICON_COPY} />
      </svg>
    </span>
  )

  const body = (
    <>
      <RowLabel icon={icon} kind={kind} label={label} labelRef={labelRef} />
      {tail}
    </>
  )

  return href ? (
    <a href={href} onClick={copy} className={rowClass}>
      {body}
    </a>
  ) : (
    <button type="button" onClick={copy} className={rowClass} aria-label={`Copy ${kind} handle ${label}`}>
      {body}
    </button>
  )
}

function CvRow() {
  if (!CV_URL) {
    // Placeholder until the PDF exists. Rendered as plain text rather than a
    // dead link, so nobody clicks through to nothing.
    return (
      <div className={rowClass} aria-disabled="true">
        <RowLabel icon={ICON_DOC} kind="CV (PDF)" label="[ADD CV LINK]" />
      </div>
    )
  }
  return (
    <a href={CV_URL} target="_blank" rel="noreferrer" className={rowClass}>
      <RowLabel icon={ICON_DOC} kind="CV (PDF)" label="Download the CV" />
      <span className="shrink-0 text-[var(--ink-mute)] transition-all duration-500 [transition-timing-function:var(--ease-core)] group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[var(--brand-accent)]">
        ↗
      </span>
    </a>
  )
}

function Colophon() {
  return (
    <footer className="px-[var(--section-edge)] pb-[clamp(32px,5vw,64px)] pt-[clamp(60px,9vw,120px)]">
      <div className="h-px w-full bg-[var(--line-soft)]" />

      <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 pt-[clamp(18px,2.4vw,28px)]">
        <span className="font-[family-name:var(--font-display)] text-[16px] leading-none text-[var(--ink-mute)]">
          Thy<span className="italic">Impaler</span>
          <span className="font-mono-ui ml-3 text-[10px] tracking-[0.14em] opacity-60">
            {new Date().getFullYear()}
          </span>
        </span>

        <Star className="hidden h-2.5 w-2.5 text-[var(--brand-accent)] sm:block" />

        <div className="flex items-center gap-6">
          <a
            href={TECH_SITE}
            className="font-mono-ui group -my-3 inline-flex min-h-[44px] items-center gap-2 py-3 text-[10px] uppercase tracking-[0.14em] text-[var(--ink-mute)] transition-colors duration-300 hover:text-[var(--ink-strong)]"
          >
            thyimpaler.xyz
            <span className="transition-transform duration-500 [transition-timing-function:var(--ease-core)] group-hover:-translate-y-0.5 group-hover:translate-x-0.5">
              ↗
            </span>
          </a>
          <a
            href="#top"
            className="font-mono-ui group -my-3 inline-flex min-h-[44px] items-center gap-2 py-3 text-[10px] uppercase tracking-[0.14em] text-[var(--ink-mute)] transition-colors duration-300 hover:text-[var(--ink-strong)]"
          >
            <span className="transition-transform duration-500 [transition-timing-function:var(--ease-core)] group-hover:-translate-y-0.5">
              ↑
            </span>
            Back to top
          </a>
        </div>
      </div>
    </footer>
  )
}
