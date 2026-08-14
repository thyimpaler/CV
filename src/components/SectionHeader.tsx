import { LineReveal, RevealOnScroll } from "@/components/LineReveal"

/**
 * Section titles set centred, huge, and alone.
 *
 * pxnz3r gives "Activity" and "Who am I?" an entire screen at ~180px with
 * nothing beside them. A left-aligned 76px heading is the safe choice and
 * reads as a document; centred, isolated and enormous reads as a title card.
 * That difference is most of why their sections feel like chapters.
 */
export function SectionHeader({
  index,
  label,
  title,
  align = "center",
  className = "",
}: {
  index: string
  label: string
  title: string
  align?: "center" | "left"
  className?: string
}) {
  const centred = align === "center"

  return (
    <RevealOnScroll className={className}>
      <div className={centred ? "text-center" : ""}>
        <span className="t-eyebrow inline-flex items-center">
          <span className="text-[var(--brand-accent)]">{index}</span>
          <span className="mx-3 opacity-30">/</span>
          {label}
        </span>

        <LineReveal
          as="h2"
          text={title}
          className={`mt-[clamp(24px,3.5vw,44px)] block text-[var(--ink-strong)] ${
            centred
              ? "text-[clamp(52px,10vw,150px)] leading-[0.88] tracking-[-0.05em]"
              : "t-h2"
          }`}
          stagger={0.055}
        />
      </div>
    </RevealOnScroll>
  )
}
