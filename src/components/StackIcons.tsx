import {
  siReact,
  siNextdotjs,
  siVite,
  siTypescript,
  siTailwindcss,
  siFramer,
  siThreedotjs,
  siNodedotjs,
  siExpress,
  siPostgresql,
  siSqlite,
  siPrisma,
  siZod,
  siPython,
  siEthers,
  siSolana,
  siTelegram,
  siDiscord,
} from "simple-icons"

/**
 * Official marks for the stack pills, from simple-icons.
 *
 * Deliberately not hand-drawn. An earlier pass invented glyphs for things
 * with no established mark — a picture frame for "NFTs", a smiley for
 * "Memecoin launches" — and they read as clip-art next to a real logo. These
 * are the actual brand paths, used nominatively to say which technologies
 * were used, which is what a stack list is for.
 *
 * Anything without an official mark stays text-only. Same rule as the chain
 * row: no mark, no glyph. React Three Fiber, Zustand, Telegraf, bs58 and the
 * plain-language entries all fall through to a bare pill, and the mixed row
 * reads fine because the icon is an accent on the label, not a replacement
 * for it.
 *
 * Rendered in currentColor at low opacity so a row of logos reads as one
 * material rather than as a strip of brand colours, which would wreck a
 * near-monochrome page faster than anything else on it.
 */
type Mark = { path: string; title: string }

export const stackIcons: Record<string, Mark> = {
  React: siReact,
  "Next.js": siNextdotjs,
  Vite: siVite,
  TypeScript: siTypescript,
  "Tailwind CSS": siTailwindcss,
  "Framer Motion": siFramer,
  "Three.js": siThreedotjs,
  "Node.js": siNodedotjs,
  Express: siExpress,
  PostgreSQL: siPostgresql,
  SQLite: siSqlite,
  Prisma: siPrisma,
  Zod: siZod,
  Python: siPython,
  "ethers.js": siEthers,
  "@solana/web3.js": siSolana,
  "Telegram Bot API": siTelegram,
  Discord: siDiscord,
  Telegram: siTelegram,
}

export function StackIcon({
  label,
  className = "",
}: {
  label: string
  className?: string
}) {
  const mark = stackIcons[label]
  if (!mark) return null
  return (
    <svg
      role="img"
      aria-hidden
      viewBox="0 0 24 24"
      className={className}
      fill="currentColor"
    >
      <path d={mark.path} />
    </svg>
  )
}
