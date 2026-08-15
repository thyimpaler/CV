import { useEffect, useState } from "react"

/**
 * One scroll listener, one rAF, one measurement pass for the whole page.
 *
 * Before this there were five independent scroll listeners. Two read
 * `document.documentElement.scrollHeight` on the same frame — a forced layout,
 * computed twice for the identical number — and one (`Nav`) was not throttled
 * at all.
 *
 * ## Do not publish per-frame values as custom properties on :root
 *
 * The obvious design — write `--scroll-depth` on `document.documentElement`
 * and let consumers read it in CSS — is a trap, and it was measured as one.
 * Changing a custom property on the root invalidates computed style for
 * **every element that could inherit it**, i.e. the entire document. Setting
 * two of them per frame took `RecalcStyleDuration` across a full scroll from
 * 0.23s to 36.06s — a 160x regression, and a median frame of 216ms.
 *
 * So continuous values are pushed to *registered writers* instead. Each writer
 * mutates only its own element's inline style, which scopes the invalidation
 * to that element. Writers never re-render React.
 *
 * ## Subscriptions are selector-based, and that is not optional
 *
 * The first version of this store pushed the whole snapshot to every listener
 * on every frame. Because the snapshot was a fresh object each tick, React
 * re-rendered every subscriber 60 times a second — `Nav` with its five
 * `ScrambleText` children, and `ScrollProgress` whose marker transition then
 * restarted continuously. That measured *worse* than the code it replaced:
 * median frame 200ms against 16.7ms.
 *
 * So subscribers register a selector plus a comparator, and are only woken
 * when their own derived value actually changes — a boolean for `Nav`, a
 * quantised step for `ScrollProgress`. Most frames wake nobody.
 */

type Snapshot = { depth: number; velocity: number; scrollY: number }
type Sub = { select: (s: Snapshot) => unknown; notify: (v: never) => void; last: unknown }
type Writer = (s: Snapshot) => void

let snapshot: Snapshot = { depth: 0, velocity: 0, scrollY: 0 }
const subs = new Set<Sub>()
const writers = new Set<Writer>()

let started = false
let frame = 0
let lastY = 0
let vel = 0
// Cached so the scroll handler never forces a layout.
let maxScroll = 0

function measureMax() {
  maxScroll = Math.max(0, document.documentElement.scrollHeight - window.innerHeight)
}

function tick() {
  frame = 0
  const y = window.scrollY
  const delta = y - lastY
  lastY = y

  vel += (delta - vel) * 0.18
  vel *= 0.9
  const v = Math.max(-2.6, Math.min(2.6, vel / 12))
  const velocity = Math.abs(v) < 0.01 ? 0 : +v.toFixed(3)
  const depth = maxScroll > 0 ? Math.min(1, Math.max(0, y / maxScroll)) : 0

  snapshot = { depth, velocity, scrollY: y }

  // Direct style writes, scoped to each writer's own element.
  for (const write of writers) write(snapshot)

  // Wake only the subscribers whose selected value moved.
  for (const sub of subs) {
    const next = sub.select(snapshot)
    if (next !== sub.last) {
      sub.last = next
      ;(sub.notify as (v: unknown) => void)(next)
    }
  }

  // Keep ticking while velocity is still decaying, so the marquee settles.
  if (velocity !== 0) frame = requestAnimationFrame(tick)
}

function onScroll() {
  if (frame) return
  frame = requestAnimationFrame(tick)
}

function onResize() {
  measureMax()
  onScroll()
}

function start() {
  if (started) return
  started = true
  measureMax()
  lastY = window.scrollY
  window.addEventListener("scroll", onScroll, { passive: true })
  window.addEventListener("resize", onResize, { passive: true })

  // The document height changes as rows expand. Refresh the cached maximum,
  // but deliberately do NOT kick the tick here — doing so created a feedback
  // loop, since a tick can re-render content whose height change re-fires the
  // observer.
  if ("ResizeObserver" in window) {
    new ResizeObserver(() => measureMax()).observe(document.body)
  }

  onScroll()
}

/**
 * Subscribe to a derived slice of scroll state. Re-renders only when the
 * selected value changes, so a boolean subscriber wakes twice per page.
 */
function useScrollSelector<T>(select: (s: Snapshot) => T): T {
  const [value, setValue] = useState<T>(() => select(snapshot))

  useEffect(() => {
    start()
    const sub: Sub = {
      select: select as (s: Snapshot) => unknown,
      notify: setValue as never,
      last: select(snapshot),
    }
    subs.add(sub)
    setValue(select(snapshot))
    return () => {
      subs.delete(sub)
    }
    // The selector is a stable arrow per call site in this codebase.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return value
}

/** Depth, quantised to `steps` so consumers wake a bounded number of times. */
export function useScrollDepth(steps = 120): number {
  return useScrollSelector((s) => Math.round(s.depth * steps) / steps)
}

/** True once scrolled past `px`. Re-renders only when it flips. */
export function useScrolledPast(px: number): boolean {
  return useScrollSelector((s) => s.scrollY > px)
}

/**
 * Register a function that writes scroll-derived values straight to its own
 * DOM nodes. Runs inside the shared tick; never re-renders React.
 */
export function useScrollWriter(write: Writer) {
  useEffect(() => {
    start()
    writers.add(write)
    write(snapshot)
    return () => {
      writers.delete(write)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
}
