import { LineReveal } from "@/components/LineReveal"
import { Star } from "@/components/Furniture"
import { ArgusEyes } from "@/components/ArgusEyes"

/**
 * Closing scene. The last thing on the page, after contact.
 *
 * Bookends the hero: the hero states "The market never closes", this answers
 * it with "Neither do I.", and Argus Panoptes — the hundred-eyed watchman who
 * never closed every eye at once — is the figure standing behind both.
 *
 * The figure is drawn, not sourced. Earlier passes pointed this slot at a
 * Sisyphus GIF and then a Dracula one; both meant a third-party file to
 * license, credit and load, and neither could inherit the accent colour.
 * Geometry has none of those problems, and it let the motion become reactive:
 * the eyes open because the reader arrived, and the pupils follow the cursor.
 */
export function Coda() {
  // No lazy-load state left: the eyes weigh nothing and ArgusEyes runs its own
  // observer for the opening sequence. The whole preload dance existed only to
  // defer a 1.6MB GIF.
  return (
    <section className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden px-[var(--section-edge)] pb-[clamp(32px,5vw,64px)] pt-[clamp(60px,10vw,140px)]">
      {/* Scene */}
      <div className="relative flex w-full flex-1 items-center justify-center">
        <ArgusEyes className="relative aspect-square w-[min(84vw,540px)]" />

        {/* Bloom behind the field, tied to the accent so the eyes sit in a
            warm pool of light rather than on flat black. */}
        <div
          className="pointer-events-none absolute inset-0 -z-10"
          style={{
            background:
              "radial-gradient(closest-side at 50% 48%, rgba(255,196,0,0.09), transparent 70%)",
          }}
          aria-hidden
        />
      </div>

      {/* The line that answers the hero */}
      <div className="relative z-10 mt-[clamp(20px,4vw,48px)] text-center">
        <LineReveal
          as="p"
          text="Neither do I."
          className="block font-[family-name:var(--font-display)] text-[clamp(26px,4vw,58px)] italic leading-tight text-[var(--ink-strong)]"
          stagger={0.07}
        />
        <p className="t-eyebrow mt-6">Argus Panoptes · the hundred-eyed</p>
      </div>

      {/* Colophon.
          A bare "© 2026 ThyImpaler" is the default every template ships with
          and says nothing. This is a ruled three-part strip instead: the
          wordmark set in the display serif on the left, the four-point mark
          holding the centre, and the return on the right. No artwork credit —
          if a credit is ever needed it belongs beside the image, not folded
          into the closing line. */}
      <div className="relative z-10 mt-[clamp(40px,7vw,90px)] w-full">
        <div className="h-px w-full bg-[var(--line-soft)]" />

        <div className="flex flex-wrap items-center justify-between gap-4 pt-[clamp(18px,2.4vw,28px)]">
          <span className="font-[family-name:var(--font-display)] text-[16px] leading-none text-[var(--ink-mute)]">
            Thy<span className="italic">Impaler</span>
            <span className="font-mono-ui ml-3 text-[10px] tracking-[0.14em] opacity-60">
              {new Date().getFullYear()}
            </span>
          </span>

          <Star className="hidden h-2.5 w-2.5 text-[var(--brand-accent)] sm:block" />

          <a
            href="#hero"
            className="font-mono-ui group -my-3 inline-flex min-h-[44px] items-center gap-2 py-3 text-[10px] uppercase tracking-[0.14em] text-[var(--ink-mute)] transition-colors duration-300 hover:text-[var(--ink-strong)]"
          >
            <span className="transition-transform duration-500 [transition-timing-function:var(--ease-core)] group-hover:-translate-y-0.5">
              ↑
            </span>
            Back to top
          </a>
        </div>
      </div>
    </section>
  )
}
