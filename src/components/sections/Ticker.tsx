import { tickerItems } from "@/data/cv"
import { Star } from "@/components/Furniture"
import { useScrollVelocity } from "@/lib/interactions"

/**
 * Marquee running along a tilted axis.
 *
 * Kaos rotates their repeating band a few degrees off horizontal with a
 * four-point star between repeats. The tilt is the entire trick: a straight
 * marquee is a widget, a tilted one is a composition. It needs generous
 * vertical padding and `overflow-hidden` on the wrapper so the rotated
 * corners don't clip or leak horizontal scroll.
 */
export function Ticker() {
  const items = [...tickerItems, ...tickerItems]
  const velocity = useScrollVelocity(2.6)

  return (
    <div className="relative overflow-hidden py-[clamp(48px,8vw,110px)]">
      {/* The band's tilt responds to scroll velocity: flick the page and it
          leans into the movement, then settles. The page acknowledging the
          scroll is what reads as alive — ambient drift does not. */}
      <div
        className="group border-y border-[var(--line-soft)] bg-[#08080a] py-[clamp(14px,1.8vw,24px)] [transition:rotate_0.5s_var(--ease-core)]"
        style={{ rotate: `${-2.4 + velocity * 1.5}deg` }}
      >
        <div
          className="flex w-max animate-ticker items-center gap-[clamp(24px,3.4vw,52px)] group-hover:[animation-play-state:paused]"
          style={{
            animationDuration: "52s",
            // Words stretch slightly with the surge, like tape being pulled.
            scale: `${1 + Math.abs(velocity) * 0.03} 1`,
          }}
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
