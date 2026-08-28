import { assetTypes, chains, codingStack, moderationStack, trading } from "@/data/cv"
import { SectionHeader } from "@/components/SectionHeader"
import { RevealOnScroll } from "@/components/LineReveal"
import { chainIcons } from "@/components/ChainIcons"
import { WatchingEye } from "@/components/ArgusEyes"
import { StackIcon } from "@/components/StackIcons"

type PillItem = string | { label: string; href?: string }

/**
 * Capabilities as a ruled index rather than a tag cloud.
 *
 * The previous version centred ~45 pills in stacked rows and gave each one a
 * deterministic rotation of up to 6 degrees plus a few pixels of vertical
 * offset, so the section looked hand-scattered. It did not. At that count and
 * that size the jitter read as items failing to line up — every row had its
 * own ragged baseline — and a wall of rounded tags is the least distinctive
 * pattern a portfolio can use. It also ran 1923px tall for what is, in the
 * end, a list.
 *
 * A left-aligned index fixes all of it at once: the label column gives the eye
 * a fixed edge to track down, the hairlines do the separating that whitespace
 * was doing badly, and the whole thing reads as a specimen sheet. Nothing was
 * cut — every item, link and mark that was here is still here.
 */

/** One item in a row. Linked items are visibly linked before you click. */
function Item({ item }: { item: PillItem }) {
  const label = typeof item === "string" ? item : item.label
  const href = typeof item === "string" ? undefined : item.href

  const body = (
    <>
      <StackIcon
        label={label}
        className="h-3.5 w-3.5 shrink-0 opacity-40 transition-opacity duration-500 group-hover/i:opacity-100"
      />
      {label}
      {href ? (
        <span className="text-[0.7em] text-[var(--ink-mute)] transition-all duration-500 [transition-timing-function:var(--ease-core)] group-hover/i:translate-x-0.5 group-hover/i:text-[var(--brand-accent)]">
          ↗
        </span>
      ) : null}
    </>
  )

  const cls =
    "group/i inline-flex items-center gap-2 text-[clamp(13px,1.15vw,16px)] text-[var(--ink)] transition-colors duration-400 [transition-timing-function:var(--ease-core)] hover:text-[var(--ink-strong)]"

  return (
    <li>
      {href ? (
        // Same py/-my pair as the chains row: these runs are ~20px tall on a
        // phone, and anything tappable has to clear 44px.
        <a href={href} target="_blank" rel="noreferrer" className={`${cls} -my-3 py-3`}>
          {body}
        </a>
      ) : (
        <span className={cls}>{body}</span>
      )}
    </li>
  )
}

/**
 * A row of the index: label on the left, contents on the right, hairline above.
 * The label sits in its own column so every row starts at the same x — that
 * shared edge is the whole reason this reads as ordered.
 */
function Row({
  label,
  note,
  children,
}: {
  label: string
  note?: string
  children: React.ReactNode
}) {
  return (
    <RevealOnScroll>
      <div className="group grid gap-x-[clamp(20px,4vw,64px)] gap-y-4 border-t border-[var(--line-soft)] py-[clamp(22px,2.8vw,38px)] md:grid-cols-[minmax(120px,0.22fr)_1fr]">
        <div>
          <h3 className="font-mono-ui text-[10px] uppercase tracking-[0.18em] text-[var(--ink-mute)] transition-colors duration-500 group-hover:text-[var(--ink)]">
            {label}
          </h3>
          {note ? (
            <p className="font-mono-ui mt-2 text-[10px] leading-relaxed text-[var(--ink-mute)] opacity-60">
              {note}
            </p>
          ) : null}
        </div>
        <div>{children}</div>
      </div>
    </RevealOnScroll>
  )
}

/** Items flow as a single wrapped line, separated by space rather than boxes. */
function Items({ items }: { items: PillItem[] }) {
  return (
    <ul className="flex flex-wrap items-center gap-x-[clamp(16px,2vw,30px)] gap-y-3.5">
      {items.map((item) => (
        <Item key={typeof item === "string" ? item : item.label} item={item} />
      ))}
    </ul>
  )
}

/**
 * Capabilities, grouped by kind rather than dumped in one heap.
 *
 * The coding stack is taken from the dependency manifests of the actual
 * projects in this portfolio — Next.js, Three.js, ethers, Telegraf, Postgres
 * and the rest are all things that ship in real repos here, not a list of
 * technologies worth being seen with.
 */
export function Toolkit() {
  return (
    <section id="toolkit" className="section-shell relative">
      <WatchingEye className="absolute left-[var(--section-edge)] top-[14%] hidden lg:block" size={28} />
      <SectionHeader index="03" label="Capabilities" title="What I bring" className="heading-gap" />

      <div className="mx-auto max-w-[1150px] border-b border-[var(--line-soft)]">
        {/* Chains keep their marks. This is the one row where the items have
            real, recognisable logos, so it earns the extra height that the
            text rows below do not. */}
        <Row label="Chains">
          <ul className="flex flex-wrap items-center gap-x-[clamp(22px,3.2vw,52px)] gap-y-6">
            {chains.map((chain) => {
              const Icon = chainIcons[chain.label]
              const body = (
                <>
                  {Icon ? (
                    <Icon className="h-6 w-6 shrink-0 text-[var(--ink)] transition-colors duration-500 group-hover/chain:text-[var(--brand-accent)]" />
                  ) : null}
                  <span className="text-[clamp(13px,1.15vw,16px)] text-[var(--ink)] transition-colors duration-500 group-hover/chain:text-[var(--ink-strong)]">
                    {chain.label}
                  </span>
                </>
              )
              // py/-my pair expands the touch area to 44px without moving
              // anything. Laying these out in a single row cut them to 24px
              // tall; the old stacked icon-over-label shape was accidentally
              // clearing the minimum, and this row is all links.
              const cls =
                "group/chain -my-2.5 inline-flex items-center gap-2.5 py-2.5 transition-transform duration-500 [transition-timing-function:var(--ease-core)] hover:-translate-y-0.5"

              return (
                <li key={chain.label}>
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
        </Row>

        {codingStack.map((group) => (
          <Row key={group.title} label={group.title}>
            <Items items={group.pills} />
          </Row>
        ))}

        {/* Below the code, not above it: these are categories of work, and the
            section now leads with what was built rather than what it was for.
            No icons — none of these has an established mark, so any glyph would
            be invented. They were clip-art the one time they had them. */}
        <Row label="Assets">
          <Items items={assetTypes} />
        </Row>

        <Row label="Moderation">
          <Items items={moderationStack} />
        </Row>

        {/* Trading carries its retired models in the label column — dropping a
            method reads as more credible than claiming every one ever touched,
            and it belongs beside the heading, not trailing the list. */}
        <Row
          label={`Trading — since ${trading.since}`}
          note={`Previously ${trading.retired.join(", ")} — no longer in use`}
        >
          <Items items={[...trading.primary, ...trading.methods]} />
        </Row>
      </div>
    </section>
  )
}
