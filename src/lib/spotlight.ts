import type { MouseEvent } from "react"

/**
 * Tracks the cursor inside a card and exposes its position as CSS custom
 * properties (--mx / --my). Paired with the `.card-spotlight` class, this
 * drives a radial amber glow that follows the mouse.
 */
export function onSpotlightMove(e: MouseEvent<HTMLElement>) {
  const el = e.currentTarget
  const rect = el.getBoundingClientRect()
  el.style.setProperty("--mx", `${e.clientX - rect.left}px`)
  el.style.setProperty("--my", `${e.clientY - rect.top}px`)
}
