import { Reveal } from "@/components/Reveal"
import type { ReactNode } from "react"

export function SectionHeader({
  label,
  children,
}: {
  label: string
  children: ReactNode
}) {
  return (
    <Reveal className="mb-16 max-[768px]:mb-12">
      <p className="font-mono-ui gradient-text mb-3 text-xs font-bold uppercase tracking-[0.16em]">
        {label}
      </p>
      <h2 className="font-display text-[clamp(2.2rem,4.5vw,3.2rem)] font-bold leading-[1.1] tracking-[-0.04em] text-foreground">
        {children}
      </h2>
    </Reveal>
  )
}
