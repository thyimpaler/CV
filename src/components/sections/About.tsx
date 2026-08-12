import { RevealOnScroll } from "@/components/LineReveal"
import { ProgressiveText, Annotate } from "@/components/ProgressiveText"

/**
 * About: pull-quote statement with hand-drawn emphasis, plus the avatar.
 *
 * The annotations are the highest personality-per-effort technique on the
 * reference sites — a marker bar and a circled phrase make a paragraph look
 * like someone marked it up. Strictly rationed here: two on the whole page.
 */
export function About() {
  return (
    <section id="about" className="section-shell">
      <div className="grid gap-[clamp(40px,7vw,100px)] lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
        <RevealOnScroll>
          <figure className="group relative">
            <div className="relative overflow-hidden rounded-[2px] bg-[#0a0a0a]">
              <img
                src="/avatar.jpg"
                alt="ThyImpaler's avatar artwork"
                loading="lazy"
                className="aspect-square w-full object-cover grayscale transition-all duration-[1.2s] [transition-timing-function:var(--ease-core)] group-hover:scale-[1.03] group-hover:grayscale-0"
              />
            </div>
            <figcaption className="t-eyebrow mt-5 flex items-center justify-between gap-4">
              <span>ThyImpaler</span>
              <span className="opacity-50">Web3 · Since 2026</span>
            </figcaption>
          </figure>
        </RevealOnScroll>

        <div className="lg:pt-[clamp(8px,3vw,56px)]">
          <RevealOnScroll>
            <span className="t-eyebrow">
              <span className="text-[var(--brand-gold)]">00</span>
              <span className="mx-3 opacity-30">/</span>
              About
            </span>
            <div className="rule-draw mt-5" />
          </RevealOnScroll>

          {/* Pull quote, with the marker bar under the phrase that matters */}
          <RevealOnScroll>
            <p className="mt-[clamp(30px,4.5vw,58px)] font-[family-name:var(--font-display)] text-[clamp(25px,3.4vw,50px)] leading-[1.1] text-[var(--ink-strong)]">
              Most communities break in the same place — the moment{" "}
              <Annotate type="mark">volatility arrives</Annotate> and nobody is
              holding the room.
            </p>
          </RevealOnScroll>

          <div className="measure mt-[clamp(28px,4vw,46px)] grid gap-7">
            <RevealOnScroll>
              <p className="t-body text-[var(--ink)]">
                I am the person holding it. Across{" "}
                <Annotate type="circle">
                  <span className="text-[var(--ink-strong)]">five ecosystems</span>
                </Annotate>{" "}
                I have moderated through raids, CTO transitions and record highs —
                eight hours a day, every day — building the bots and role
                structures that keep a room legible when the chart is not.
              </p>
            </RevealOnScroll>

            <ProgressiveText
              text="That work turned into engineering — Telegram bots, dashboards and the web infrastructure these communities run on. I have traded since 2024, mostly memecoins and perps, which is where most of the instinct for reading a room under pressure actually comes from."
              className="t-body text-[var(--ink)]"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
