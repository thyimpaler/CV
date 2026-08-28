import { RevealOnScroll } from "@/components/LineReveal"
import { WatchingEye } from "@/components/ArgusEyes"
import { ProgressiveText, Annotate } from "@/components/ProgressiveText"
import { trading } from "@/data/cv"

/**
 * About: pull-quote statement with hand-drawn emphasis, plus the avatar.
 *
 * The annotations are the highest personality-per-effort technique on the
 * reference sites — a marker bar and a circled phrase make a paragraph look
 * like someone marked it up. Strictly rationed here: two on the whole page.
 */
export function About() {
  return (
    <section id="about" className="section-shell relative">
      <WatchingEye className="absolute right-[var(--section-edge)] top-[18%] hidden lg:block" size={30} />
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
              {/* Read from the data, not typed in. This was hardcoded to 2026
                  — the current year, so it read as "started a few months ago"
                  — while the paragraph beside it says "I have traded since
                  2024". Two different start years within one screen. */}
              <span className="opacity-50">Web3 · Since {trading.since}</span>
            </figcaption>
          </figure>
        </RevealOnScroll>

        <div className="lg:pt-[clamp(8px,3vw,56px)]">
          <RevealOnScroll>
            <span className="t-eyebrow">
              <span className="text-[var(--brand-accent)]">00</span>
              <span className="mx-3 opacity-30">/</span>
              About
            </span>
            <div className="rule-draw mt-5" />
          </RevealOnScroll>

          {/* Pull quote, with the marker bar under the phrase that matters */}
          <RevealOnScroll>
            <p className="mt-[clamp(30px,4.5vw,58px)] font-[family-name:var(--font-display)] text-[clamp(25px,3.4vw,50px)] leading-[1.1] text-[var(--ink-strong)]">
              Most crypto products break in the same place — the moment{" "}
              <Annotate type="mark">real money moves</Annotate> through code
              nobody stress-tested.
            </p>
          </RevealOnScroll>

          <div className="measure mt-[clamp(28px,4vw,46px)] grid gap-7">
            <RevealOnScroll>
              <p className="t-body text-[var(--ink)]">
                I write the parts that cannot fail. On Nest that meant ERC-721
                factory contracts with reentrancy guards,{" "}
                <Annotate type="circle">
                  <span className="text-[var(--ink-strong)]">pull-payment accounting</span>
                </Annotate>{" "}
                and a 95/5 revenue split — and an indexer that stores the hash of
                the block it last read, so a reorg rewinds and replays instead of
                losing a mint.
              </p>
            </RevealOnScroll>

            <ProgressiveText
              text="Before the contracts there were five ecosystems' worth of Discord and Telegram rooms — raids, CTO transitions, a $105K peak — which is where the instinct for building things that hold under load actually comes from. I have traded since 2024, mostly memecoins and perps."
              className="t-body text-[var(--ink)]"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
