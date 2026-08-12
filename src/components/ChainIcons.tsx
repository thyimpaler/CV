/**
 * Chain marks, drawn as simple geometry.
 *
 * Icons compress the chain row from a wall of text pills down to a line you
 * take in at a glance — the section was the longest on the page and most of
 * that length was words for things that have a recognisable shape.
 *
 * These are simplified geometric marks rather than the official brand assets:
 * a diamond for Ethereum, stacked bars for Solana, a ring for Base. Close
 * enough to read instantly, and no logo files to license or keep in sync.
 */

type IconProps = { className?: string }

export function EthereumMark({ className = "" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={className} fill="currentColor">
      <path d="M12 1.5 5.5 12.2 12 16l6.5-3.8L12 1.5Z" opacity="0.85" />
      <path d="M12 17.4 5.5 13.6 12 22.5l6.5-8.9-6.5 3.8Z" opacity="0.55" />
    </svg>
  )
}

export function SolanaMark({ className = "" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={className} fill="currentColor">
      <path d="M5.4 16.4h13a.7.7 0 0 1 .5 1.2l-2.6 2.6a.9.9 0 0 1-.6.3h-13a.7.7 0 0 1-.5-1.2l2.6-2.6a.9.9 0 0 1 .6-.3Z" />
      <path d="M5.4 3.5h13a.7.7 0 0 1 .5 1.2L16.3 7.3a.9.9 0 0 1-.6.3h-13a.7.7 0 0 1-.5-1.2l2.6-2.6a.9.9 0 0 1 .6-.3Z" opacity="0.75" />
      <path d="M15.7 9.9H2.7a.7.7 0 0 0-.5 1.2l2.6 2.6a.9.9 0 0 0 .6.3h13a.7.7 0 0 0 .5-1.2l-2.6-2.6a.9.9 0 0 0-.6-.3Z" opacity="0.55" />
    </svg>
  )
}

export function BaseMark({ className = "" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={className} fill="currentColor">
      <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 9.9-8.6H8.6v-2.8h13.3A10 10 0 0 0 12 2Z" />
    </svg>
  )
}

export function BescMark({ className = "" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={className} fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M12 2.6 20 7.3v9.4L12 21.4 4 16.7V7.3l8-4.7Z" strokeLinejoin="round" />
      <path d="M9.6 8.4h3.2a1.9 1.9 0 0 1 0 3.8H9.6V8.4Zm0 3.8h3.5a1.9 1.9 0 0 1 0 3.8H9.6v-3.8Z" strokeLinejoin="round" />
    </svg>
  )
}

export function NftMark({ className = "" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={className} fill="none" stroke="currentColor" strokeWidth="1.6">
      <rect x="3.5" y="3.5" width="17" height="17" rx="2.4" />
      <path d="M3.8 15.4 8.6 11l4 3.6 3-2.4 4.6 3.9" strokeLinejoin="round" />
      <circle cx="9" cy="8.2" r="1.4" />
    </svg>
  )
}

export function LiquidMark({ className = "" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={className} fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M12 2.8c3.6 4 5.9 6.9 5.9 9.8a5.9 5.9 0 0 1-11.8 0c0-2.9 2.3-5.8 5.9-9.8Z" strokeLinejoin="round" />
    </svg>
  )
}

export function MemecoinMark({ className = "" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={className} fill="none" stroke="currentColor" strokeWidth="1.6">
      <circle cx="12" cy="12" r="9" />
      <path d="M8.6 9.4h.01M15.4 9.4h.01" strokeLinecap="round" strokeWidth="2.2" />
      <path d="M8.2 14.2a4.6 4.6 0 0 0 7.6 0" strokeLinecap="round" />
    </svg>
  )
}

export const chainIcons: Record<string, (p: IconProps) => React.ReactElement> = {
  Ethereum: EthereumMark,
  Solana: SolanaMark,
  Base: BaseMark,
  "BESC Hyperchain": BescMark,
  "Liquid NFT Finance": LiquidMark,
  NFTs: NftMark,
  "Memecoin launches": MemecoinMark,
}
