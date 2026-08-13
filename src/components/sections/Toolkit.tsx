import { assetTypes, chains, codingStack, moderationStack, trading } from "@/data/cv"
import { SectionHeader } from "@/components/SectionHeader"
import { RevealOnScroll } from "@/components/LineReveal"
import { chainIcons } from "@/components/ChainIcons"

// Deterministic pseudo-random from the pill's own text, so the scatter is
// stable across renders and reloads instead of reshuffling on every mount.
function jitter(seed: string, spread: number) {
  let h = 0
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) | 0
  return ((Math.abs(h) % 1000) / 1000 - 0.5) * 2 * spread
}

type PillItem = string | { label: string; href?: string }

/**
 * Pills straighten and lift on hover. Ones with a destination also get an
 * arrow, so a linked pill is distinguishable from an inert one before you
 * click — the scatter already makes them look interactive, and a pill that
 * looks clickable but isn't is a small lie repeated across the section.
 */
function PillRow({ items }: { items: PillItem[] }) {
  return (
    <ul className="flex flex-wrap items-center justify-center gap-x-3 gap-y-3.5">
      {items.map((item, i) => {
        const label = typeof item === "string" ? item : item.label
        const href = typeof item === "string" ? undefined : item.href

        const base =
          "inline-flex items-center gap-1.5 rounded-full border border-[var(--line)] bg-[#0d0d10] px-[clamp(13px,1.4vw,20px)] py-[clamp(7px,0.8vw,12px)] text-[clamp(12px,1.1vw,15px)] text-[var(--ink)] transition-all duration-500 [transition-timing-function:var(--ease-core)]"
        const style = {
          rotate: `${jitter(label, 6)}deg`,
          translate: `0 ${jitter(label + "y", 4)}px`,
          animation: `fade-rise 0.7s var(--ease-core) ${i * 0.035}s both`,
        } as React.CSSProperties

        // The jitter lives on the inner element only — applying it to the <li>
        // as well would compound both rotations.
        return (
          <li key={label} className="flex">
            {href ? (
              <a
                href={href}
                target="_blank"
                rel="noreferrer"
                style={style}
                className={`${base} group/pill hover:!rotate-0 hover:!translate-y-0 hover:border-[var(--brand-blood)]/50 hover:text-[var(--ink-strong)]`}
              >
                {label}
                <span className="text-[0.7em] text-[var(--ink-mute)] transition-all duration-500 [transition-timing-function:var(--ease-core)] group-hover/pill:translate-x-0.5 group-hover/pill:text-[var(--brand-blood)]">
                  ↗
                </span>
              </a>
            ) : (
              <span style={style} className={`${base} hover:!rotate-0`}>
                {label}
              </span>
            )}
          </li>
        )
      })}
    </ul>
  )
}

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <RevealOnScroll>
      <div className="flex flex-col items-center gap-6 text-center">
        <h3 className="font-mono-ui text-[10px] uppercase tracking-[0.18em] text-[var(--ink-mute)]">
          {title}
        </h3>
        {children}
      </div>
    </RevealOnScroll>
  )
}

/**
 * Capabilities, grouped by kind rather than dumped in one heap.
 *
 * The coding stack is taken from the dependency manifests of the actual
 * projects in this portfolio — Next.js, Three.js, ethers, Telegraf,
 * Postgres and the rest are all things that ship in real repos here, not a
 * list of technologies worth being seen with.
 */
export function Toolkit() {
  return (
    <section id="toolkit" className="section-shell">
      <SectionHeader index="03" label="Capabilities" title="What I bring" className="heading-gap" />

      <div className="mx-auto flex max-w-[1150px] flex-col gap-[clamp(44px,6vw,80px)]">
        {/* Chains carry marks rather than words. This row was the longest on
            the page and most of that length was spelling out things with a
            recognisable shape. Only real chains appear here — asset types
            follow as text, because inventing glyphs for them produced
            clip-art. */}
        <Group title="Chains">
          <ul className="flex flex-wrap items-center justify-center gap-x-[clamp(18px,3vw,44px)] gap-y-7">
            {chains.map((chain, i) => {
              const Icon = chainIcons[chain.label]
              const body = (
                <>
                  {Icon ? (
                    <Icon className="h-7 w-7 text-[var(--ink)] transition-colors duration-500 group-hover/chain:text-[var(--brand-blood)]" />
                  ) : null}
                  <span className="text-[12px] text-[var(--ink-mute)] transition-colors duration-500 group-hover/chain:text-[var(--ink-strong)]">
                    {chain.label}
                  </span>
                </>
              )

              const cls =
                "group/chain flex w-[clamp(74px,9vw,104px)] flex-col items-center gap-2.5 text-center transition-transform duration-500 [transition-timing-function:var(--ease-core)] hover:-translate-y-1"

              return (
                <li
                  key={chain.label}
                  style={{ animation: `fade-rise 0.7s var(--ease-core) ${i * 0.05}s both` }}
                >
                  {chain.href ? (
                    <a href={chain.href} target="_blank" rel="noreferrer" className={cls}>
                      {body}
                    </a>
                  ) : (
                    <span className={cls}>{body}</span>
                  )}
                </li>
              )
            })}
          </ul>

          {/* Asset types, set as a plain ruled line. No icons: none of these
              has an established mark, so any glyph would be invented. */}
          <ul className="mt-9 flex flex-wrap items-center justify-center gap-x-4 gap-y-3">
            {assetTypes.map((label, i) => (
              <li key={label} className="flex items-center gap-4">
                {i > 0 ? (
                  <span className="h-3 w-px bg-[var(--line)]" aria-hidden />
                ) : null}
                <span className="text-[13px] text-[var(--ink-mute)]">{label}</span>
              </li>
            ))}
          </ul>
        </Group>

        {codingStack.map((group) => (
          <Group key={group.title} title={group.title}>
            <PillRow items={group.pills} />
          </Group>
        ))}

        <Group title="Moderation stack">
          <PillRow items={moderationStack} />
        </Group>

        {/* Trading gets its own treatment — the retired methods are listed
            plainly, because dropping a model reads as more credible than
            claiming every one ever touched. */}
        <RevealOnScroll>
          <div className="flex flex-col items-center gap-6 text-center">
            <h3 className="font-mono-ui text-[10px] uppercase tracking-[0.18em] text-[var(--ink-mute)]">
              Trading — since {trading.since}
            </h3>
            <PillRow items={[...trading.primary, ...trading.methods]} />
            <p className="font-mono-ui mt-1 text-[11px] text-[var(--ink-mute)] opacity-70">
              Previously: {trading.retired.join(", ")} — no longer in use
            </p>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  )
}
