import { motion } from "motion/react"
import { SectionHeader } from "@/components/SectionHeader"
import { experiences } from "@/data/cv"
import { onSpotlightMove } from "@/lib/spotlight"
import { cn } from "@/lib/utils"

export function Experience() {
  return (
    <section id="experience" className="relative z-1 py-30 max-[768px]:py-20">
      <div className="mx-auto max-w-[1100px] px-7">
        <SectionHeader label="Battle Record">
          Where I've <span className="gradient-text">Operated</span>
        </SectionHeader>

        <div className="relative flex flex-col">
          {/* vertical connector */}
          <span className="absolute -left-7 bottom-7 top-7 w-0.5 bg-gradient-to-b from-primary via-primary/30 to-transparent max-[900px]:hidden" />

          {experiences.map((exp, i) => (
            <motion.article
              key={exp.project}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.55, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -5 }}
              onMouseMove={onSpotlightMove}
              className={cn(
                "card-spotlight group relative mb-5 overflow-hidden rounded-[18px] border p-11 transition-colors duration-300 max-[768px]:p-7 max-[480px]:p-5",
                exp.dev
                  ? "card-spotlight--dev border-brand-purple/30 bg-[linear-gradient(145deg,#090910_0%,#0C0A14_100%)] hover:border-brand-purple/50"
                  : "border-border bg-card hover:border-primary/20",
              )}
            >
              {/* top highlight bar */}
              <span
                className={cn(
                  "absolute inset-x-0 top-0 h-0.5 opacity-0 transition-opacity duration-300 group-hover:opacity-100",
                  exp.dev ? "bg-gradient-subtle" : "bg-gradient-hero",
                )}
              />

              {/* timeline dot */}
              <span
                className={cn(
                  "absolute -left-[36px] top-9 h-3 w-3 rounded-full max-[900px]:hidden",
                  exp.dev ? "bg-gradient-to-br from-brand-purple to-primary" : "bg-gradient-hero",
                )}
                style={{
                  boxShadow: exp.dev
                    ? "0 0 0 4px rgba(139,92,246,0.15), 0 0 12px rgba(139,92,246,0.4)"
                    : "0 0 0 4px rgba(255,196,0,0.15), 0 0 12px rgba(255,196,0,0.4)",
                }}
              />

              <header className="mb-6 flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="font-display text-[1.3rem] font-bold tracking-tight text-foreground max-[480px]:text-[1.1rem]">
                    {exp.role}
                  </div>
                  <div className="mt-1 text-base font-medium text-[#aaa]">
                    {exp.token ? (
                      <span className="gradient-text font-bold">{exp.token}</span>
                    ) : (
                      exp.project
                    )}
                    {exp.sub && <span className="text-muted-foreground"> · {exp.sub}</span>}
                  </div>
                </div>
                <span
                  className={cn(
                    "font-mono-ui whitespace-nowrap rounded-full border px-4 py-1.5 text-xs font-semibold",
                    exp.current
                      ? "border-primary/20 bg-primary/[0.06] text-primary"
                      : "border-border text-muted-foreground",
                  )}
                >
                  {exp.period}
                </span>
              </header>

              {exp.achievement && (
                <div className="mb-5 flex items-center gap-2.5 rounded-lg border border-primary/15 bg-primary/10 px-4.5 py-3 text-[0.9rem] font-semibold text-primary">
                  <span>⚡</span>
                  {exp.achievement}
                </div>
              )}

              <ul className="flex flex-col gap-3.5">
                {exp.items.map((item) => (
                  <li key={item.label} className="flex items-start gap-3">
                    <span className="bg-gradient-hero mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full" />
                    <span className="text-muted-foreground">
                      <span className="font-bold text-foreground">{item.label} — </span>
                      {item.text}
                    </span>
                  </li>
                ))}
              </ul>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}
