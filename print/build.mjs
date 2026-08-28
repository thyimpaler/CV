/**
 * Renders print/cv.html to two PDFs, and print/og.html to the share card,
 * with headless Chrome.
 *
 *   node print/build.mjs
 *
 * Chrome rather than a PDF library because the sheet is real CSS — the same
 * type scale, rhythm and palette as the site — and Chrome's print path keeps
 * the text selectable and the fonts subset-embedded. Fonts are data URIs in
 * print/fonts.css so nothing is fetched at render time and no file:// font
 * gets blocked as cross-origin.
 *
 * Output lands in public/, so both are also served from the deployed site at
 * thyimpaler.xyz/ThyImpaler-CV.pdf.
 *
 * public/og.png is built here too. It is mostly type, in the same faces as the
 * sheet, and it has to repeat the hero's exact wording — kept as a drawing it
 * silently fell a version behind the site it was advertising.
 */
import { execFileSync } from "node:child_process"
import { existsSync } from "node:fs"
import { dirname, resolve } from "node:path"
import { fileURLToPath } from "node:url"

const here = dirname(fileURLToPath(import.meta.url))
const root = resolve(here, "..")

const CANDIDATES = [
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  "/usr/bin/google-chrome",
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
]

const chrome = process.env.CHROME_PATH ?? CANDIDATES.find((p) => existsSync(p))
if (!chrome) {
  console.error("No Chrome found. Set CHROME_PATH to a Chrome or Edge binary.")
  process.exit(1)
}

const fileUrl = (name) =>
  `file:///${resolve(here, name).replaceAll("\\", "/").replaceAll(" ", "%20")}`

// `?paper` flips the sheet to the print-safe variant (see html.paper in cv.css).
const sheet = fileUrl("cv.html")
const targets = [
  { query: "", out: "public/ThyImpaler-CV.pdf", label: "dark" },
  { query: "?paper", out: "public/ThyImpaler-CV-print.pdf", label: "paper" },
]

for (const { query, out, label } of targets) {
  execFileSync(chrome, [
    "--headless",
    "--disable-gpu",
    "--no-pdf-header-footer",
    "--virtual-time-budget=8000",
    `--print-to-pdf=${resolve(root, out)}`,
    sheet + query,
  ])
  console.log(`${label.padEnd(6)} → ${out}`)
}

// The share card. `--headless=new` because the old headless renders the card
// before the 3D-free page has settled its web fonts, and a card that falls
// back to Times is worse than no card.
execFileSync(chrome, [
  "--headless=new",
  "--disable-gpu",
  "--hide-scrollbars",
  "--window-size=1200,630",
  "--virtual-time-budget=6000",
  `--screenshot=${resolve(root, "public/og.png")}`,
  fileUrl("og.html"),
])
console.log("og     → public/og.png")
