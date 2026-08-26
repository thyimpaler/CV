import { useEffect } from "react"

/**
 * Per-route head metadata.
 *
 * ## The problem this exists to fix
 *
 * This is a single-page app behind a catch-all rewrite, so every URL is served
 * the same `index.html`. That means every `/work/<slug>` page shipped the
 * home page's `<link rel="canonical" href="https://www.thyimpaler.xyz/">`.
 *
 * A canonical pointing somewhere else is not a hint about preference — it is a
 * statement that this URL is a duplicate of that one. Ten project pages all
 * declaring themselves duplicates of the home page is an instruction to drop
 * them from the index and fold any signal into `/`. They also all shared the
 * home page's description, so even the ones that survived would have had a
 * snippet describing a different page.
 *
 * The real fix for an SPA is prerendering, which would put the right tags in
 * the served HTML rather than after hydration. This is the smaller change:
 * Google renders JavaScript and reads the canonical from the rendered DOM, so
 * setting it per route is enough to stop the pages actively de-indexing
 * themselves. Social crawlers mostly do not render, so a link shared straight
 * to a project page still previews as the site rather than the project —
 * worth prerendering later, not worth blocking this on.
 *
 * ## Defaults
 *
 * The fallbacks are read out of the document once at module load, before any
 * component has had a chance to touch them, so they are exactly what the
 * server sent. Hard-coding them here instead would mean two copies of the same
 * strings drifting apart the first time `index.html` is edited.
 */

const read = (selector: string, attr: string) =>
  document.querySelector(selector)?.getAttribute(attr) ?? ""

const DEFAULTS = {
  title: document.title,
  description: read('meta[name="description"]', "content"),
  canonical: read('link[rel="canonical"]', "href"),
}

export type HeadFields = {
  title: string
  description: string
  /** Absolute URL. Relative canonicals are legal but easy to get wrong. */
  canonical: string
}

function apply({ title, description, canonical }: HeadFields) {
  document.title = title

  const meta = document.querySelector('meta[name="description"]')
  if (meta) meta.setAttribute("content", description)

  const link = document.querySelector('link[rel="canonical"]')
  if (link) link.setAttribute("href", canonical)

  // Keep the sharing tags in step. A crawler that does render JS should not
  // find a canonical and an og:url disagreeing about which page this is.
  const og: Array<[string, string]> = [
    ['meta[property="og:title"]', title],
    ['meta[property="og:description"]', description],
    ['meta[property="og:url"]', canonical],
    ['meta[name="twitter:title"]', title],
    ['meta[name="twitter:description"]', description],
  ]
  for (const [selector, value] of og) {
    document.querySelector(selector)?.setAttribute("content", value)
  }
}

/**
 * Set the head for the current route, restoring the served defaults on the way
 * out so a client-side navigation back to `/` does not leave a project's
 * canonical behind.
 */
export function useHead(fields: HeadFields | null) {
  const { title, description, canonical } = fields ?? DEFAULTS
  useEffect(() => {
    apply({ title, description, canonical })
    return () => apply(DEFAULTS)
  }, [title, description, canonical])
}

export const SITE_ORIGIN = "https://www.thyimpaler.xyz"
