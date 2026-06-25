import { useEffect, useState } from "react"
import { motion } from "motion/react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const links = [
  { label: "Experience", href: "#experience" },
  { label: "Toolkit", href: "#toolkit" },
  { label: "Contact", href: "#contact" },
]

export function Nav() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "fixed inset-x-0 top-0 z-100 border-b py-[18px] backdrop-blur-2xl transition-colors duration-300",
        scrolled
          ? "border-primary/15 bg-background/85"
          : "border-border bg-background/50",
      )}
    >
      <div className="mx-auto flex max-w-[1100px] items-center justify-between gap-6 px-7">
        <a href="#" className="group flex items-center gap-2.5 text-[1.15rem] font-bold tracking-tight">
          <img
            src="/avatar.jpg"
            alt="Thyimpaler"
            className="h-[34px] w-[34px] rounded-full border-[1.5px] border-primary/50 object-cover transition-transform duration-300 group-hover:scale-110"
          />
          <span className="font-display text-foreground">
            thy<span className="gradient-text">impaler</span>
          </span>
        </a>

        <ul className="hidden gap-8 md:flex">
          {links.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className="group relative text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                {l.label}
                <span className="bg-gradient-hero absolute -bottom-1 left-0 h-[1.5px] w-0 transition-all duration-300 group-hover:w-full" />
              </a>
            </li>
          ))}
        </ul>

        <Button
          asChild
          className="bg-gradient-hero btn-shimmer relative overflow-hidden rounded-full font-semibold text-black shadow-none outline-none transition-transform duration-300 hover:-translate-y-0.5 hover:shadow-[0_6px_22px_rgba(255,196,0,0.28)] focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background max-[480px]:hidden"
        >
          <a href="#contact">Hire Me →</a>
        </Button>
      </div>
    </motion.nav>
  )
}
