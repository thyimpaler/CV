import { motion, useScroll, useSpring } from "motion/react"

export function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  })

  return (
    // A hairline, not a 3px gradient bar — the indicator should be findable
    // when looked for and invisible otherwise.
    <motion.div
      style={{ scaleX }}
      className="fixed inset-x-0 top-0 z-200 h-px origin-left bg-[var(--brand-gold)]/70"
    />
  )
}
