import { useCallback, useEffect } from "react"

/**
 * One pointer loop for the whole page, pushed to registered writers.
 *
 * Every eye used to run its own rAF and its own React state: six components
 * re-rendering their subtrees on every pointer move.
 *
 * The obvious fix — publish `--px` / `--py` on `document.documentElement` and
 * read them in CSS — trades one problem for a worse one. A custom property on
 * the root invalidates computed style for **every element that could inherit
 * it**, i.e. the whole document, on every pointer event. Measured on the
 * equivalent scroll code that cost 36s of style recalculation across a single
 * scroll, against 0.23s when the same values were written directly to the
 * handful of elements that needed them. Moving the mouse while scrolling made
 * both happen at once.
 *
 * So: one listener, one rAF, and each consumer registers a writer that mutates
 * only its own element. Invalidation is scoped to the elements that actually
 * move, and React never sees the pointer at all.
 */

type Offset = { x: number; y: number }
type Writer = (o: Offset) => void

let offset: Offset = { x: 0, y: 0 }
const writers = new Set<Writer>()

let started = false
// Retained so the id can be cancelled if the loop is ever torn down.
let frame = 0
void frame
let running = false
let tx = 0
let ty = 0

function tick() {
  offset = {
    x: offset.x + (tx - offset.x) * 0.06,
    y: offset.y + (ty - offset.y) * 0.06,
  }
  for (const write of writers) write(offset)

  // Park once the eased value has caught up, rather than burning a frame
  // callback for the life of the page.
  if (Math.abs(tx - offset.x) < 0.0008 && Math.abs(ty - offset.y) < 0.0008) {
    running = false
    return
  }
  frame = requestAnimationFrame(tick)
}

function onMove(e: PointerEvent) {
  tx = e.clientX / window.innerWidth - 0.5
  ty = e.clientY / window.innerHeight - 0.5
  if (!running) {
    running = true
    frame = requestAnimationFrame(tick)
  }
}

function start() {
  if (started) return
  started = true
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
  window.addEventListener("pointermove", onMove, { passive: true })
}

/**
 * Register a function that writes pointer-derived values straight to its own
 * DOM nodes. Runs inside the shared loop; never re-renders React.
 */
export function usePointerWriter(write: Writer) {
  useEffect(() => {
    start()
    writers.add(write)
    write(offset)
    return () => {
      writers.delete(write)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
}

/** Convenience for the common case: translate an element by the offset. */
export function usePointerTranslate(
  ref: React.RefObject<SVGGElement | HTMLElement | null>,
  scaleX: number,
  scaleY: number,
) {
  usePointerWriter(
    useCallback(
      ({ x, y }) => {
        const el = ref.current
        if (el) el.style.transform = `translate(${(x * scaleX).toFixed(2)}px, ${(y * scaleY).toFixed(2)}px)`
      },
      [ref, scaleX, scaleY],
    ),
  )
}

/** Starts the loop without registering a writer. */
export function usePointerVars() {
  useEffect(() => {
    start()
  }, [])
}
