import { tickerItems } from "@/data/cv"

export function Ticker() {
  const items = [...tickerItems, ...tickerItems]
  return (
    <div className="relative z-1 w-full max-w-[100vw] overflow-hidden border-y border-border bg-primary/[0.03] py-4">
      {/* edge fades */}
      <div className="pointer-events-none absolute inset-y-0 left-0 z-2 w-[120px] bg-gradient-to-r from-background to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-2 w-[120px] bg-gradient-to-l from-background to-transparent" />

      <div className="animate-ticker flex w-max items-center gap-10">
        {items.map((item, i) => (
          <span key={i} className="flex items-center gap-10">
            <span className="font-mono-ui text-[0.8rem] font-medium uppercase tracking-[0.06em] text-muted-foreground">
              {item}
            </span>
            <span className="text-[0.7rem] text-primary opacity-70">✦</span>
          </span>
        ))}
      </div>
    </div>
  )
}
