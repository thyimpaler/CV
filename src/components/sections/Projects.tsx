import { projects, githubUrl } from "@/data/cv"
import { SectionHeader } from "@/components/SectionHeader"
import { RevealOnScroll } from "@/components/LineReveal"
import { Link } from "@/lib/router"
import { WatchingEye } from "@/components/ArgusEyes"

/**
 * Pinned repositories.
 *
 * Laid out as an offset two-column grid rather than an even one — pxnz3r
 * staggers their project cards so the eye moves diagonally instead of
 * scanning rows. Without screenshots to show, the blurb carries the card, so
 * each is set large enough to actually read.
 */
export function Projects() {
  return (
    <section id="projects" className="section-shell relative">
      <WatchingEye className="absolute right-[calc(var(--section-edge)/3)] top-[30%] hidden xl:block" size={22} />
      <SectionHeader index="02" label="Selected work" title="Things I've built" className="heading-gap" />

      <div className="mx-auto grid max-w-[1150px] gap-x-[clamp(24px,5vw,80px)] gap-y-[clamp(32px,5vw,64px)] md:grid-cols-2">
        {projects.map((project, i) => (
          <RevealOnScroll
            key={project.name}
            // Offset every second card so the grid reads as composed.
            className={i % 2 === 1 ? "md:mt-[clamp(32px,6vw,90px)]" : ""}
          >
            {/* Routes to the project's own page rather than jumping straight
                to GitHub — the case study is the point, the repo is one link
                on it. */}
            <Link
              to={`/work/${project.slug}`}
              className="group flex h-full flex-col border-t border-[var(--line)] pt-7 outline-none transition-colors duration-500 hover:border-[var(--brand-accent)]/50 focus-visible:border-[var(--brand-accent)]"
            >
              <div className="flex items-start justify-between gap-5">
                <h3 className="font-[family-name:var(--font-display)] text-[clamp(26px,3vw,44px)] leading-none text-[var(--ink-strong)] transition-colors duration-500 group-hover:text-[var(--brand-accent)]">
                  {project.name}
                </h3>
                <span className="mt-1 shrink-0 text-[var(--ink-mute)] transition-all duration-500 [transition-timing-function:var(--ease-core)] group-hover:translate-x-1 group-hover:text-[var(--brand-accent)]">
                  →
                </span>
              </div>

              <p className="t-body mt-5 max-w-[46ch] text-[var(--ink)]">{project.blurb}</p>

              <span className="font-mono-ui mt-6 flex items-center gap-3 text-[10px] uppercase tracking-[0.14em] text-[var(--ink-mute)]">
                {project.language}
                <span className="opacity-40">/</span>
                {project.status}
              </span>
            </Link>
          </RevealOnScroll>
        ))}
      </div>

      <RevealOnScroll className="mt-[clamp(44px,6vw,80px)] text-center">
        <a
          href={githubUrl}
          target="_blank"
          rel="noreferrer"
          className="group -my-3 inline-flex items-center gap-3 py-3 text-[15px] text-[var(--ink-mute)] transition-colors duration-300 hover:text-[var(--ink-strong)]"
        >
          <span className="relative">
            Everything else on GitHub
            <span className="absolute -bottom-1 left-0 h-px w-full origin-right scale-x-0 bg-current transition-transform duration-500 [transition-timing-function:var(--ease-core)] group-hover:origin-left group-hover:scale-x-100" />
          </span>
          <span className="transition-transform duration-500 [transition-timing-function:var(--ease-core)] group-hover:translate-x-1">
            →
          </span>
        </a>
      </RevealOnScroll>
    </section>
  )
}
