import { motion } from "motion/react"
import { Button } from "@/components/ui/button"

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] as const },
  }),
}

export function Hero() {
  return (
    <section
      id="hero"
      className="relative flex min-h-[100svh] items-center overflow-hidden pb-28 pt-28 max-[480px]:pb-16"
    >
      <div className="mx-auto w-full max-w-[1100px] px-7">
        <div className="grid items-center gap-20 max-[900px]:gap-9 md:grid-cols-[1fr_auto]">
          {/* LEFT: text */}
          <div className="max-w-[680px] max-[900px]:text-center">
            <motion.p
              custom={0}
              variants={fadeUp}
              initial="hidden"
              animate="show"
              className="font-mono-ui mb-6 text-xs uppercase tracking-[0.25em] text-muted-foreground max-[900px]:mx-auto"
            >
              <span className="text-primary">/</span> web3 community architect
            </motion.p>

            <motion.h1
              custom={1}
              variants={fadeUp}
              initial="hidden"
              animate="show"
              className="font-display text-[clamp(3.2rem,7vw,5.8rem)] font-bold leading-[1] tracking-[-0.045em] text-foreground"
            >
              Thy<span className="gradient-text-anim">Impaler</span>
            </motion.h1>

            <motion.p
              custom={2}
              variants={fadeUp}
              initial="hidden"
              animate="show"
              className="mt-3 text-[clamp(1rem,2.2vw,1.3rem)] font-medium tracking-tight text-[#aaa]"
            >
              Discord &amp; Telegram Operations · DeFi Ecosystems
            </motion.p>

            <motion.p
              custom={3}
              variants={fadeUp}
              initial="hidden"
              animate="show"
              className="mt-6 max-w-[560px] text-[1.05rem] leading-[1.85] text-muted-foreground max-[900px]:mx-auto"
            >
              The operational backbone behind some of DeFi's fastest-moving
              communities. I kill FUD before it spreads, neutralize bot raids
              before they land, and coordinate viral growth that actually moves
              charts.
            </motion.p>

            <motion.div
              custom={4}
              variants={fadeUp}
              initial="hidden"
              animate="show"
              className="mt-10 flex flex-wrap gap-3.5 max-[900px]:justify-center max-[480px]:flex-col"
            >
              <Button
                asChild
                size="lg"
                className="bg-gradient-hero btn-shimmer group relative overflow-hidden rounded-full px-8 py-6 text-[0.95rem] font-semibold text-black outline-none transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_26px_rgba(255,196,0,0.28)] focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                <a href="#contact">
                  Get in Touch
                  <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">
                    →
                  </span>
                </a>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="rounded-full border-white/15 bg-transparent px-8 py-6 text-[0.95rem] font-semibold text-foreground outline-none transition-all duration-300 hover:-translate-y-1 hover:border-primary hover:bg-primary/[0.07] hover:text-primary focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                <a href="#experience">View Experience</a>
              </Button>
            </motion.div>
          </div>

          {/* RIGHT: avatar */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="relative shrink-0 max-[900px]:order-first max-[900px]:mx-auto"
          >
            <motion.div
              animate={{ y: [0, -14, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="bg-gradient-hero animate-glow-pulse relative h-[340px] w-[340px] max-w-full rounded-[18px] p-[3px] max-[900px]:h-[200px] max-[900px]:w-[200px] max-[900px]:rounded-full max-[768px]:h-[160px] max-[768px]:w-[160px] max-[480px]:h-[140px] max-[480px]:w-[140px]"
            >
              <img
                src="/avatar.jpg"
                alt="Thyimpaler"
                className="h-full w-full rounded-[15px] object-cover max-[900px]:rounded-full"
              />
            </motion.div>
            <span className="animate-ring-expand absolute -inset-2 rounded-[26px] border border-primary/15 max-[900px]:rounded-full" />
          </motion.div>
        </div>
      </div>
    </section>
  )
}
