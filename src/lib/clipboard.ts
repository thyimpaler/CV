/**
 * Copy `text`, with a fallback for browsers that will not hand over the async
 * clipboard. `navigator.clipboard` is undefined outside a secure context and
 * can reject outright when the permission is denied, so the deprecated
 * execCommand path stays — the contact rows depend on this, and it failing
 * silently is the whole problem it exists to fix.
 */
export async function copyText(text: string) {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text)
      return true
    }
  } catch {
    // fall through
  }
  try {
    const el = document.createElement("textarea")
    el.value = text
    el.setAttribute("readonly", "")
    el.style.position = "fixed"
    el.style.opacity = "0"
    document.body.appendChild(el)
    el.select()
    const ok = document.execCommand("copy")
    document.body.removeChild(el)
    return ok
  } catch {
    return false
  }
}
