import { useEffect } from "react"
import { projectBySlug, projects } from "@/data/cv"
import { LineReveal, RevealOnScroll } from "@/components/LineReveal"
import { ProgressiveText } from "@/components/ProgressiveText"
import { Link, navigate } from "@/lib/router"
import { ProjectCover, hasCover } from "@/components/ProjectCover"

/**
 * A project's own page, at /work/<slug>.
 *
 * Same type system and rhythm as the CV so it reads as one site rather than a
 * subpage bolted on.
 *
 * The visual is generated cover art derived from what the project does, not a
 * screenshot and never labelled as one. Real captures replace it the moment
 * `shots` is filled in; until then the page has weight without claiming to
 * show a UI that isn't there.
 */
export function ProjectPage({ slug }: { slug: string }) {
  const project = projectBySlug(slug)

  // Keep the tab title in step with the route.
  useEffect(() => {
    document.title = project
      ? `${project.name} — ThyImpaler`
      : "Not found — ThyImpaler"
    return () => {
      document.title = "Thyimpaler — Web3 Community Architect"
    }
  }, [project])

  if (!project) {
    return (
      <main className="section-shell relative z-10 flex min-h-[70svh] flex-col items-center justify-center text-center">
        <p className="t-eyebrow">404</p>
        <h1 className="t-h2 mt-6 text-[var(--ink-strong)]">No such project.</h1>
        <Link
          to="/"
          className="group mt-10 -my-3 inline-flex items-center gap-3 py-3 text-[15px] text-[var(--ink-mute)] transition-colors duration-300 hover:text-[var(--ink-strong)]"
        >
          <span className="transition-transform duration-500 [transition-timing-function:var(--ease-core)] group-hover:-translate-x-1">
            ←
          </span>
          Back to the CV
        </Link>
      </main>
    )
  }

  const others = projects.filter((p) => p.slug !== project.slug)

  return (
    <main className="relative z-10">
      {/* The shell's 260px bottom padding left a near-empty screen between the
          buttons and the image. The header and the picture are one unit here,
          so the seam is much tighter than a between-sections gap. */}
      <section className="section-shell !pb-[clamp(44px,5vw,76px)] !pt-[clamp(120px,15vh,180px)]">
        <RevealOnScroll>
          <Link
            to="/"
            className="group t-eyebrow -my-4 inline-flex items-center gap-3 py-4 transition-colors duration-300 hover:text-[var(--ink-strong)]"
          >
            <span className="transition-transform duration-500 [transition-timing-function:var(--ease-core)] group-hover:-translate-x-1">
              ←
            </span>
            Work
          </Link>
        </RevealOnScroll>

        {/* Statement left, facts right — the hero's composition, so a project
            page reads as part of the same document rather than a detail view
            bolted on. The facts used to be a four-across strip under the copy:
            a dashboard pattern that said nothing, left a wide empty band beside
            the blurb, and pushed everything below it further down. As rows in
            the right column they fill that band and carry the same ruled
            vocabulary as the capabilities index. */}
        <div className="mt-[clamp(28px,4vw,52px)] grid gap-x-[clamp(24px,5vw,80px)] gap-y-[clamp(28px,4vw,48px)] lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
          <div>
            <LineReveal
              as="h1"
              text={project.name}
              className="t-h1 block text-[var(--ink-strong)]"
              immediate
              stagger={0.05}
              delay={0.15}
            />

            <ProgressiveText
              text={project.blurb}
              className="t-lead measure mt-[clamp(20px,2.6vw,32px)] text-[var(--ink)]"
              stagger={0.014}
              delay={0.4}
            />
          </div>

          <RevealOnScroll className="lg:pt-[clamp(8px,1.6vw,22px)]">
            <dl className="border-b border-[var(--line-soft)]">
              {[
                ["Year", project.year],
                ["Status", project.status],
                ["Language", project.language],
                ["Stack", project.stack?.join(", ") ?? "—"],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="group grid grid-cols-[minmax(84px,0.32fr)_1fr] items-baseline gap-4 border-t border-[var(--line-soft)] py-[clamp(12px,1.5vw,18px)]"
                >
                  <dt className="t-eyebrow transition-colors duration-500 group-hover:text-[var(--ink)]">
                    {label}
                  </dt>
                  <dd className="text-[14px] leading-relaxed text-[var(--ink-strong)]">{value}</dd>
                </div>
              ))}
            </dl>
          </RevealOnScroll>
        </div>

        <div className="mt-[clamp(28px,3.4vw,44px)] flex flex-wrap items-center gap-x-8 gap-y-4">
          <a
            href={project.href}
            target="_blank"
            rel="noreferrer"
            className="group inline-flex items-center gap-3 rounded-full bg-[var(--ink-strong)] px-6 py-3 text-[14px] font-medium text-[#08080a] transition-transform duration-500 [transition-timing-function:var(--ease-core)] hover:-translate-y-0.5"
          >
            Source
            <span className="transition-transform duration-500 [transition-timing-function:var(--ease-core)] group-hover:translate-x-1">
              ↗
            </span>
          </a>
          {project.live ? (
            <a
              href={project.live}
              target="_blank"
              rel="noreferrer"
              className="group relative -my-3 inline-flex items-center py-3 text-[14px] text-[var(--ink-mute)] transition-colors duration-300 hover:text-[var(--ink-strong)]"
            >
              Live site
              <span className="absolute bottom-2 left-0 h-px w-full origin-right scale-x-0 bg-current transition-transform duration-500 [transition-timing-function:var(--ease-core)] group-hover:origin-left group-hover:scale-x-100" />
            </a>
          ) : null}
        </div>
      </section>

      {/* Imagery comes before the write-up.
          It used to sit below it, roughly 1700px down the page. You click a
          card that is mostly a screenshot and then land on two full screens of
          type before seeing a single pixel of the thing itself — the card
          makes a promise the page took too long to keep. The picture leads,
          the detail explains it afterwards. */}
      <section className="section-shell !pt-0">
        <RevealOnScroll>
          <div className="flex items-baseline justify-between gap-6">
            <span className="t-eyebrow">
              {project.shots?.length ? "Screens" : "Cover"}
            </span>
            {!project.shots?.length && hasCover(project.slug) ? (
              <span className="font-mono-ui text-[10px] uppercase tracking-[0.14em] text-[var(--ink-mute)] opacity-60">
                Generated mark — not a screenshot
              </span>
            ) : null}
          </div>
          <div className="rule-draw mt-5" />
        </RevealOnScroll>

        <div className="mt-[clamp(28px,4vw,52px)]">
          {project.shots?.length ? (
            /* Two columns only when there is something to put in the second
               one. With a single shot the old md:grid-cols-2 left half the row
               empty and showed the page's best asset at half size. */
            <div
              className={`grid gap-[clamp(14px,2vw,26px)] ${
                project.shots.length > 1 ? "md:grid-cols-2" : ""
              }`}
            >
              {project.shots.map((shot) => (
                <RevealOnScroll key={shot.src}>
                  <figure>
                    <img
                      src={shot.src}
                      alt={shot.caption ?? `${project.name} screenshot`}
                      loading="lazy"
                      className="w-full rounded-[3px] border border-[var(--line-soft)] object-cover"
                    />
                    {shot.caption ? (
                      <figcaption className="t-eyebrow mt-3">{shot.caption}</figcaption>
                    ) : null}
                  </figure>
                </RevealOnScroll>
              ))}
            </div>
          ) : (
            <RevealOnScroll>
              <ProjectCover slug={project.slug} />
            </RevealOnScroll>
          )}
        </div>
      </section>

      {project.detail ? (
        <section className="section-shell !pt-0">
          <ProgressiveText
            text={project.detail}
            className="measure text-[clamp(18px,2vw,26px)] leading-[1.45] text-[var(--ink-strong)]"
            stagger={0.012}
          />
        </section>
      ) : null}

      {/* Next projects */}
      <section className="section-shell !pt-0">
        <RevealOnScroll>
          <span className="t-eyebrow">More work</span>
          <div className="rule-draw mt-5" />
        </RevealOnScroll>

        <div className="mt-[clamp(20px,3vw,36px)] border-t border-[var(--line-soft)]">
          {others.map((p) => (
            <RevealOnScroll key={p.slug}>
              <Link
                to={`/work/${p.slug}`}
                className="group flex items-center justify-between gap-6 border-b border-[var(--line-soft)] py-[clamp(18px,2.4vw,30px)]"
              >
                <span className="font-[family-name:var(--font-display)] text-[clamp(20px,2.4vw,34px)] leading-none text-[var(--ink-strong)] transition-colors duration-500 group-hover:text-[var(--brand-accent)]">
                  {p.name}
                </span>
                <span className="shrink-0 text-[var(--ink-mute)] transition-all duration-500 [transition-timing-function:var(--ease-core)] group-hover:translate-x-1 group-hover:text-[var(--brand-accent)]">
                  →
                </span>
              </Link>
            </RevealOnScroll>
          ))}
        </div>

        <button
          onClick={() => navigate("/")}
          className="group mt-[clamp(40px,6vw,72px)] inline-flex min-h-[44px] items-center gap-3 py-3 text-[15px] text-[var(--ink-mute)] transition-colors duration-300 hover:text-[var(--ink-strong)]"
        >
          <span className="transition-transform duration-500 [transition-timing-function:var(--ease-core)] group-hover:-translate-x-1">
            ←
          </span>
          Back to the CV
        </button>
      </section>
    </main>
  )
}
