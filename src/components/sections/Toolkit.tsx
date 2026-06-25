import { motion } from "motion/react"
import { SectionHeader } from "@/components/SectionHeader"
import { Badge } from "@/components/ui/badge"
import { toolkit, devCard } from "@/data/cv"
import { onSpotlightMove } from "@/lib/spotlight"

const cardMotion = {
  initial: { opacity: 0, y: 32 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
}

function Pill({ children, dev }: { children: React.ReactNode; dev?: boolean }) {
  return (
    <Badge
      variant="outline"
      className={
        dev
          ? "rounded-full border-primary/30 bg-primary/[0.05] px-3.5 py-1 text-[0.8rem] font-medium text-primary/80 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary hover:text-primary"
          : "rounded-full border-border px-3.5 py-1 text-[0.8rem] font-medium text-[#aaa] transition-all duration-300 hover:-translate-y-0.5 hover:border-primary hover:bg-primary/[0.07] hover:text-primary"
      }
    >
      {children}
    </Badge>
  )
}

export function Toolkit() {
  return (
    <section id="toolkit" className="relative z-1 py-30 max-[768px]:py-20">
      <div className="mx-auto max-w-[1100px] px-7">
        <SectionHeader label="Technical Toolkit">
          Tools of the <span className="gradient-text">Trade</span>
        </SectionHeader>

        <div className="grid grid-cols-2 gap-4 max-[900px]:grid-cols-1">
          {toolkit.map((card, i) => (
            <motion.div
              key={card.title}
              {...cardMotion}
              transition={{ duration: 0.55, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -5 }}
              onMouseMove={onSpotlightMove}
              className="card-spotlight group relative overflow-hidden rounded-[18px] border border-border bg-card p-9 transition-colors duration-300 hover:border-primary/20 max-[480px]:p-6"
            >
              <div className="relative">
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl border border-primary/15 bg-primary/10 text-[1.4rem] transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6">
                  {card.icon}
                </div>
                <h3 className="font-display mb-4 text-[1.1rem] font-bold tracking-tight text-foreground">
                  {card.title}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {card.pills.map((p) => (
                    <Pill key={p}>{p}</Pill>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}

          {/* Dev card */}
          <motion.a
            href={devCard.href}
            target="_blank"
            rel="noopener"
            {...cardMotion}
            transition={{ duration: 0.55, delay: 0.24, ease: [0.22, 1, 0.36, 1] }}
            whileHover={{ y: -6 }}
            onMouseMove={onSpotlightMove}
            className="card-spotlight card-spotlight--dev group relative block overflow-hidden rounded-[18px] border border-primary/25 bg-[linear-gradient(145deg,#090910_0%,#0e0916_100%)] p-9 transition-shadow duration-300 hover:shadow-[0_12px_60px_rgba(255,196,0,0.18)] max-[480px]:p-6"
          >
            <div className="relative">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl border border-primary/25 bg-[linear-gradient(135deg,rgba(255,196,0,0.2),rgba(139,92,246,0.2))] text-[1.4rem] shadow-[0_0_20px_rgba(255,196,0,0.15)] transition-transform duration-300 group-hover:scale-110">
                {devCard.icon}
              </div>
              <h3 className="font-display gradient-text mb-4 text-[1.1rem] font-bold tracking-tight">
                {devCard.title}{" "}
                <span className="inline-block opacity-60 transition-all duration-300 group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:opacity-100">
                  ↗
                </span>
              </h3>
              <div className="flex flex-wrap gap-2">
                {devCard.pills.map((p) => (
                  <Pill key={p} dev>
                    {p}
                  </Pill>
                ))}
              </div>
            </div>
          </motion.a>
        </div>
      </div>
    </section>
  )
}
