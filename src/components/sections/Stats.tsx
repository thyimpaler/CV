import { useEffect, useRef, useState } from "react"
import { motion, useInView } from "motion/react"
import { stats } from "@/data/cv"
import { onSpotlightMove } from "@/lib/spotlight"

function CountUp({
  target,
  prefix = "",
  suffix = "",
}: {
  target: number
  prefix?: string
  suffix?: string
}) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.6 })
  const [val, setVal] = useState(0)

  useEffect(() => {
    if (!inView) return
    const duration = 1400
    const start = performance.now()
    let raf = 0
    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - p, 3)
      setVal(Math.round(eased * target))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [inView, target])

  return (
    <span ref={ref}>
      {prefix}
      {val}
      {suffix}
    </span>
  )
}

export function Stats() {
  return (
    <section className="relative z-1 py-24 max-[768px]:py-16">
      <div className="mx-auto max-w-[1100px] px-7">
        {/* eyebrow */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.5 }}
          className="font-mono-ui mb-8 text-center text-xs uppercase tracking-[0.25em] text-muted-foreground"
        >
          <span className="text-primary">//</span> the numbers
        </motion.p>

        <div className="grid grid-cols-4 gap-4 max-[900px]:grid-cols-2 max-[480px]:grid-cols-1">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.55, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -6 }}
              onMouseMove={onSpotlightMove}
              className="card-spotlight group relative overflow-hidden rounded-2xl border border-border bg-card p-7 transition-colors duration-300 hover:border-primary/25 max-[480px]:p-6"
            >
              {/* watermark index */}
              <span className="font-display pointer-events-none absolute -right-1 top-1 select-none text-6xl font-bold text-white/[0.025]">
                0{i + 1}
              </span>

              {/* icon */}
              <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl border border-primary/15 bg-primary/10 text-xl transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6">
                {s.icon}
              </div>

              {/* number */}
              <motion.div
                initial={{ opacity: 0, scale: 0.6, y: 8 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true, amount: 0.6 }}
                transition={{ duration: 0.55, delay: 0.15 + i * 0.1, ease: [0.34, 1.56, 0.64, 1] }}
                className="gradient-text-anim font-display text-[clamp(2.1rem,4vw,3rem)] font-bold leading-none tracking-[-0.04em] transition-transform duration-300 group-hover:scale-105"
              >
                {s.count ? (
                  <CountUp target={s.count} prefix={s.prefix} suffix={s.suffix} />
                ) : (
                  s.value
                )}
              </motion.div>

              {/* label + hint */}
              <div className="mt-3 text-[0.9rem] font-semibold text-foreground">
                {s.label}
              </div>
              <div className="font-mono-ui mt-1 text-[0.7rem] uppercase tracking-wider text-muted-foreground">
                {s.hint}
              </div>

              {/* animated accent bar */}
              <motion.div
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true, amount: 0.6 }}
                transition={{ duration: 0.8, delay: 0.2 + i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                className="bg-gradient-hero mt-6 h-[3px] w-full origin-left rounded-full opacity-70"
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
