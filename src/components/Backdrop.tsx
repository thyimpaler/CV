import { useEffect } from "react"
import { motion, useMotionValue, useScroll, useSpring, useTransform } from "motion/react"

/**
 * Fixed decorative layer: animated grid + grain, glowing side edges, drifting
 * colour orbs, and a soft amber light that follows the cursor. Orbs parallax
 * with both scroll and pointer position for depth.
 */
export function Backdrop() {
  const { scrollYProgress } = useScroll()
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -160])
  const y2 = useTransform(scrollYProgress, [0, 1], [0, 200])
  const y3 = useTransform(scrollYProgress, [0, 1], [0, -100])

  // Raw pointer position (viewport coords) + normalised offset from centre.
  const px = useMotionValue(typeof window !== "undefined" ? window.innerWidth / 2 : 0)
  const py = useMotionValue(typeof window !== "undefined" ? window.innerHeight / 2 : 0)
  const nx = useMotionValue(0)
  const ny = useMotionValue(0)

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      px.set(e.clientX)
      py.set(e.clientY)
      nx.set(e.clientX / window.innerWidth - 0.5)
      ny.set(e.clientY / window.innerHeight - 0.5)
    }
    window.addEventListener("pointermove", onMove)
    return () => window.removeEventListener("pointermove", onMove)
  }, [px, py, nx, ny])

  // Cursor glow trails the pointer with a soft spring.
  const glowX = useSpring(useTransform(px, (v) => v - 300), { stiffness: 80, damping: 22 })
  const glowY = useSpring(useTransform(py, (v) => v - 300), { stiffness: 80, damping: 22 })

  // Orbs drift toward the pointer (small factors) on top of scroll parallax.
  const oX1 = useSpring(useTransform(nx, (v) => v * 50), { stiffness: 40, damping: 18 })
  const oX2 = useSpring(useTransform(nx, (v) => v * -40), { stiffness: 40, damping: 18 })
  const oX3 = useSpring(useTransform(nx, (v) => v * 30), { stiffness: 40, damping: 18 })

  return (
    <>
      {/* Ambient animated grid + film grain */}
      <div className="grid-bg" />
      <div className="grain-bg" />

      {/* Edge glows */}
      <div
        className="pointer-events-none fixed inset-y-0 left-0 z-50 w-[3px] max-md:w-[2px]"
        style={{
          background:
            "linear-gradient(180deg, transparent 0%, rgba(255,208,0,0.5) 30%, rgba(255,208,0,0.85) 50%, rgba(255,208,0,0.5) 70%, transparent 100%)",
          boxShadow: "0 0 20px rgba(255,208,0,0.35), 0 0 40px rgba(255,208,0,0.15)",
        }}
      />
      <div
        className="pointer-events-none fixed inset-y-0 right-0 z-50 w-[3px] max-md:w-[2px]"
        style={{
          background:
            "linear-gradient(180deg, transparent 0%, rgba(232,93,4,0.5) 30%, rgba(232,93,4,0.8) 50%, rgba(232,93,4,0.5) 70%, transparent 100%)",
          boxShadow: "0 0 20px rgba(232,93,4,0.3), 0 0 40px rgba(232,93,4,0.12)",
        }}
      />

      {/* Orbs + cursor glow (clipped to viewport) */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        {/* Cursor-following light */}
        <motion.div
          style={{ x: glowX, y: glowY }}
          className="absolute left-0 top-0 h-[600px] w-[600px] rounded-full"
        >
          <div className="h-full w-full rounded-full bg-[radial-gradient(circle,rgba(255,196,0,0.10),transparent_60%)] blur-[40px]" />
        </motion.div>

        <motion.div
          style={{ y: y1, x: oX1 }}
          className="animate-float absolute -left-[10%] -top-[15%] h-[700px] w-[700px] rounded-full bg-brand-gold opacity-[0.07] blur-[130px]"
        />
        <motion.div
          style={{ y: y2, x: oX2 }}
          className="animate-float absolute -bottom-[10%] -right-[10%] h-[550px] w-[550px] rounded-full bg-brand-red opacity-[0.07] blur-[130px] [animation-delay:-8s]"
        />
        <motion.div
          style={{ y: y3, x: oX3 }}
          className="animate-float absolute left-1/2 top-[40%] h-[450px] w-[450px] rounded-full bg-brand-purple opacity-[0.05] blur-[130px] [animation-delay:-16s]"
        />
      </div>
    </>
  )
}
