import { useCallback, useRef } from "react"
import { tickerItems } from "@/data/cv"
import { Star } from "@/components/Furniture"
import { useScrollWriter } from "@/lib/scrollStore"

/**
 * Marquee running along a tilted axis.
 *
 * Kaos rotates their repeating band a few degrees off horizontal with a
 * four-point star between repeats. The tilt is the entire trick: a straight
 * marquee is a widget, a tilted one is a composition.
 *
 * The band leans into scroll velocity via a direct style write from the shared
 * scroll tick. Previously it subscribed to a hook that called setState on
 * **every frame**, re-rendering 20 spans and 20 SVG stars sixty times a second
 * and continuing ~1.2s after scrolling stopped — the second-worst source of
 * jank on the page. Rendering is now completely static.
 */
export function Ticker() {
  const band = useRef<HTMLDivElement>(null)
  const items = [...tickerItems, ...tickerItems]

  useScrollWriter(
    useCallback(({ velocity }) => {
      if (band.current) band.current.style.rotate = `${-2.4 + velocity * 1.5}deg`
    }, []),
  )

  return (
    <div className="relative overflow-hidden py-[clamp(48px,8vw,110px)]">
      <div
        ref={band}
        className="group border-y border-[var(--line-soft)] bg-[#08080a] py-[clamp(14px,1.8vw,24px)]"
        style={{ rotate: "-2.4deg", willChange: "rotate" }}
      >
        <div
          className="flex w-max animate-ticker items-center gap-[clamp(24px,3.4vw,52px)] group-hover:[animation-play-state:paused]"
          style={{ animationDuration: "52s" }}
        >
          {items.map((item, i) => (
            <span
              key={`${item}-${i}`}
              className="flex items-center gap-[clamp(24px,3.4vw,52px)]"
            >
              <span className="whitespace-nowrap font-[family-name:var(--font-display)] text-[clamp(22px,2.6vw,40px)] leading-none text-[var(--ink)]">
                {item}
              </span>
              <Star className="h-3 w-3 shrink-0 text-[var(--brand-accent)]/70" />
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
