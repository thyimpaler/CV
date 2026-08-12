import { useCallback, useEffect, useState } from "react"

/**
 * Minimal history-API router.
 *
 * The site has exactly two shapes — the CV and a project page — so pulling in
 * a routing library would be more configuration than code. This is the whole
 * of it: read the path, listen for back/forward, and expose a navigate that
 * pushes state and scrolls to top.
 *
 * Vercel already rewrites every path to index.html (see vercel.json), so deep
 * links to /work/<slug> resolve on a hard refresh rather than 404ing.
 */

export function usePath() {
  const [path, setPath] = useState(() =>
    typeof window === "undefined" ? "/" : window.location.pathname,
  )

  useEffect(() => {
    const onPop = () => setPath(window.location.pathname)
    window.addEventListener("popstate", onPop)
    // Same-tab pushes dispatch this so the hook re-renders without a reload.
    window.addEventListener("route", onPop as EventListener)
    return () => {
      window.removeEventListener("popstate", onPop)
      window.removeEventListener("route", onPop as EventListener)
    }
  }, [])

  return path
}

export function navigate(to: string) {
  if (window.location.pathname === to) return
  window.history.pushState({}, "", to)
  window.dispatchEvent(new Event("route"))
  window.scrollTo(0, 0)
}

/**
 * Internal link. Falls back to normal navigation for modified clicks so
 * cmd/ctrl-click still opens a new tab — hijacking that is the most common
 * way hand-rolled routers annoy people.
 */
export function Link({
  to,
  className = "",
  children,
  ...rest
}: {
  to: string
  className?: string
  children: React.ReactNode
} & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href">) {
  const onClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return
      e.preventDefault()
      navigate(to)
    },
    [to],
  )

  return (
    <a href={to} onClick={onClick} className={className} {...rest}>
      {children}
    </a>
  )
}
