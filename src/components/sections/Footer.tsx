import { motion } from "motion/react"
import { Reveal } from "@/components/Reveal"
import { contacts } from "@/data/cv"

export function Footer() {
  return (
    <footer id="contact" className="relative z-1 px-7 pb-15 pt-30 max-[768px]:pt-20">
      <div className="mx-auto max-w-[640px] text-center">
        <Reveal>
          <p className="font-mono-ui gradient-text mb-3 text-[0.8rem] font-bold uppercase tracking-[0.14em]">
            Ready to work?
          </p>
          <h2 className="font-display text-[clamp(2.8rem,5.5vw,4.5rem)] font-bold leading-none tracking-[-0.05em] text-foreground">
            Let's <span className="gradient-text-anim">Operate.</span>
          </h2>
          <p className="mx-auto mt-3 max-w-md text-[1.05rem] text-muted-foreground">
            Need a community that actually holds? Let's build it.
          </p>
        </Reveal>

        <div className="mt-13 flex flex-wrap justify-center gap-3.5 max-[768px]:flex-col max-[768px]:items-center">
          {contacts.map((c, i) => (
            <motion.a
              key={c.id}
              href={c.href}
              target="_blank"
              rel="noopener"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.45, delay: i * 0.1 }}
              whileHover={{ y: -3 }}
              className="group inline-flex items-center gap-2.5 rounded-full border border-border bg-card px-6 py-3.5 text-[0.875rem] font-semibold text-[#aaa] transition-colors duration-300 hover:border-primary hover:bg-primary/[0.07] hover:text-primary hover:shadow-[0_6px_24px_rgba(255,196,0,0.15)] max-[768px]:w-full max-[768px]:max-w-[320px] max-[768px]:justify-center"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="h-[18px] w-[18px] shrink-0">
                <path d={c.path} />
              </svg>
              {c.label}
            </motion.a>
          ))}
        </div>

        <div className="mt-16 border-t border-border pt-10 text-[0.78rem] text-[#444]">
          <p>© 2026 Thyimpaler — Built different.</p>
        </div>
      </div>
    </footer>
  )
}
