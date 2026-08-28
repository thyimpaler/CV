export type Experience = {
  role: string
  project: string
  sub?: string
  /** Where the project itself lives. Row becomes a link when present. */
  href?: string
  /** Where `sub` points, when the chain/parent has its own site. */
  subHref?: string
  /**
   * The person who ran the project, their picture, and what they said.
   *
   * These images are the leads' own avatars, not project logos. Rendering
   * them beside the project title read as "this is the token's mark", which
   * is wrong — so they only ever appear round, captioned with a name, and
   * attached to the quote. Shape and placement carry the distinction between
   * a person and a brand.
   *
   * Quotes are supplied by the leads themselves. Nothing here is written on
   * their behalf.
   */
  lead?: { name: string; role?: string; avatar?: string; quote?: string }
  period: string
  status: "Active" | "Closed" | "Ended"
  dev?: boolean
  /** The single thing worth knowing. One line, no padding. */
  impact: string
  tags?: string[]
}

/**
 * One line per role, and only lines that are actually true.
 *
 * An earlier version padded each role with a second sentence of invented
 * detail — "removes scam links and coordinated FUD aimed at funded traders"
 * for a job nobody described that way. Generic moderation filler reads as
 * either trivial or fabricated, and it buries the one fact per role that is
 * genuinely worth reading. A thin true line beats a padded false one.
 *
 * Where a line looks sparse, that is a prompt to supply the real detail — not
 * licence to invent it.
 */
/*
 * Ordered most recent first. A CV is read top-down by people who want the
 * current position first; chronological order buried the newest work at the
 * bottom of the focus table.
 */
export const experiences: Experience[] = [
  {
    role: "Head of Development",
    project: "Nest",
    sub: "NFT launchpad · Robinhood Chain",
    href: "https://nest-nft-launchpad.vercel.app",
    period: "Jul 2026 — Present",
    status: "Active",
    dev: true,
    impact:
      "Leading the build — ERC-721 factory, chain indexer and mint flow, live on Robinhood Chain mainnet.",
    tags: ["Solidity", "TypeScript", "Fastify", "Prisma", "viem"],
  },
  {
    role: "Head of Development",
    project: "Axyom Sites",
    period: "Jun 2026 — Aug 2026",
    status: "Closed",
    dev: true,
    impact: "Led the development team until the studio closed.",
    tags: ["Next.js", "Team lead"],
    lead: {
      name: "Aazy",
      role: "CEO, Axyom Sites",
      // "made maintained" in the original was a slip; the duplicated verb is
      // the only edit. Wording is otherwise theirs.
      quote:
        "The dude maintained the websites so well, all our customers were truly satisfied by his work and his quality.",
    },
  },
  {
    role: "Moderator",
    project: "Klein Funding",
    href: "https://kleinfunding.com",
    period: "Apr 2026 — Present",
    status: "Active",
    impact: "Moderating a 33,000-member community for a funded-trader programme.",
    tags: ["Discord", "Telegram"],
  },
  {
    role: "Developer & Admin",
    project: "Phantom CTO",
    lead: {
      name: "Balthazar",
      role: "Project lead, Phantom CTO",
      avatar: "/lead-balthazar.jpg",
      quote: "One word for you — all-rounder.",
    },
    period: "Apr 2026 — Jun 2026",
    status: "Ended",
    dev: true,
    impact: "Built Phantom Bot — Telegram bridging and trading.",
    tags: ["Telegraf", "ethers.js", "SQLite"],
  },
  {
    role: "NFT Dev & Moderator",
    project: "$CHAD",
    sub: "Memecoin · BESC Hyperchain",
    subHref: "https://bescfinancial.com",
    lead: {
      name: "Chad",
      role: "Project lead, $CHAD",
      avatar: "/lead-chad.jpg",
      // Capitalisation and punctuation tidied for print; wording is theirs.
      quote:
        "We were nervous at first about how the NFTs would even go — this dude made it so much better that all our expectations felt like bare minimum for us.",
    },
    period: "Feb 2026 — Jun 2026",
    status: "Ended",
    dev: true,
    impact: "Shipped the first NFT on BESC Hyperchain — built the data layer that took it live.",
    tags: ["NFTs", "Carl-bot", "Discord"],
  },
  {
    role: "Head Moderator",
    project: "$HENNY",
    sub: "BESC Hyperchain",
    subHref: "https://bescfinancial.com",
    lead: {
      name: "Frontman",
      role: "Project lead, $HENNY",
      avatar: "/lead-frontman.jpg",
      quote:
        "Impaler really held the team together, from the days we started and till we got the attention on CT, he never showed any lack in his work.",
    },
    period: "Jan 2026 — Present",
    status: "Active",
    impact: "Held the room through a $105K all-time high — the project's peak.",
    tags: ["Safeguard", "Rose", "BESC"],
  },
]

export type Stat = {
  value: string
  label: string
  hint: string
}

/**
 * "24/7" and "100% uptime" were removed — nobody moderates 24 hours a day and
 * claiming it undercuts the numbers that are real.
 */
/**
 * One figure is pulled out and given a screen of its own. It has to be an
 * outcome rather than a count, and it should be the outcome of the work being
 * applied for — so this is the split written into the Nest contracts, not the
 * $105K peak, which is a moderation result and now sits in the row below.
 *
 * Keep the value to about five characters. It renders at
 * clamp(96px, 26vw, 400px) in Stats.tsx, and a longer string runs past the
 * section edge on desktop.
 */
export const featuredStat: Stat = {
  value: "95%",
  label: "Of primary mint revenue routed to creators by the contracts I shipped",
  hint: "Nest — live on Robinhood Chain mainnet",
}

export const stats: Stat[] = [
  { value: "11", label: "Products shipped and deployed", hint: "Selected work" },
  { value: "33K", label: "Members moderated", hint: "Klein Funding" },
  { value: "$105K", label: "All-time high held through the volatility", hint: "$HENNY" },
]

export type Pill = { label: string; href?: string }

/**
 * Chains only — things that have a real mark and a canonical home.
 *
 * Asset types used to sit in this list too, which meant inventing icons for
 * "NFTs" and "Memecoin launches". A picture-frame glyph and a smiley face
 * next to the Ethereum diamond looked exactly like the clip-art the rest of
 * the page avoids, and implied they were chains. They are categories of work,
 * so they are set as text below instead.
 */
export const chains: Pill[] = [
  { label: "Ethereum", href: "https://ethereum.org" },
  { label: "Solana", href: "https://solana.com" },
  { label: "Base", href: "https://base.org" },
  { label: "BESC Hyperchain", href: "https://bescfinancial.com" },
  // No href and no mark: the only public surface is a Blockscout explorer,
  // which is not a canonical home for the chain, and drawing a logo for it
  // would be inventing one. Toolkit renders icon-less entries as label-only.
  { label: "Robinhood Chain" },
]

/** What was actually worked on across those chains. Words, not glyphs. */
export const assetTypes = [
  "NFTs",
  "NFT launch infrastructure",
  "Liquid NFT Finance",
  "Memecoin launches",
]

/**
 * Stack pulled from the actual dependency manifests across the projects in
 * this portfolio, not from a list of things worth mentioning.
 */
/*
 * Contracts first. This section used to open on frontend frameworks, which
 * describes the least differentiated half of the work — the Solidity is the
 * part that is hard to fake and the part a hiring engineer is scanning for.
 */
export const codingStack = [
  {
    title: "Smart contracts",
    pills: ["Solidity", "OpenZeppelin", "ERC-721", "ERC-2981 royalties", "solc", "Ganache", "Reentrancy guards", "Pull payments"],
  },
  {
    title: "Frontend",
    pills: ["React", "Next.js", "Vite", "TypeScript", "Tailwind CSS", "Framer Motion", "Three.js", "React Three Fiber", "Zustand"],
  },
  {
    title: "Backend & data",
    pills: ["Node.js", "Fastify", "Express", "PostgreSQL", "SQLite", "Prisma", "Zod", "Python"],
  },
  {
    title: "Web3",
    pills: ["viem", "ethers.js", "@solana/web3.js", "WalletConnect", "Wallet auth (SIWE)", "Chain indexing", "IPFS / Pinata", "Seaport", "bs58"],
  },
  {
    title: "Infrastructure",
    pills: ["Docker", "docker-compose", "GitHub Actions", "Railway", "Vercel", "nginx", "CSP & SRI", "Prisma migrations"],
  },
  {
    title: "Bots & automation",
    pills: ["Telegraf", "Telegram Bot API", "Discord", "Proxy rotation", "Encrypted storage"],
  },
]

export const moderationStack = [
  "Carl-bot",
  "Wick",
  "Rose",
  "Safeguard",
  "Raidder",
  "RBAC",
  "Discord",
  "Telegram",
]

/**
 * Trading. Stated plainly, including the models no longer in use — dropping
 * a method is more credible than listing every one ever touched.
 */
export const trading = {
  since: "2024",
  primary: ["Memecoins", "Perpetuals"],
  methods: ["Chart reading", "Orderflow", "Liquidity-based strategy"],
  retired: ["ICT", "SMT models"],
}

export type Project = {
  /** URL segment: /work/<slug> */
  slug: string
  name: string
  blurb: string
  language: string
  /** Source repository. */
  href: string
  /** Deployed instance, where one exists. */
  live?: string
  year: string
  status: "Shipped" | "In progress" | "Archived"
  /** Longer description for the project page. Still one paragraph. */
  detail?: string
  /** What it is actually built with. */
  stack?: string[]
  /**
   * Screenshots for the project page. Empty until real captures exist — the
   * page renders a labelled placeholder rather than a stock mock-up, because
   * a fake screenshot misrepresents what was built.
   */
  shots?: { src: string; caption?: string }[]
}

/**
 * Work, newest and strongest first.
 *
 * `shots` are real captures of the deployed apps, taken from their live URLs —
 * not mock-ups. Where a capture would misrepresent the project it is omitted
 * and `ProjectCover.tsx` draws a generated mark instead:
 *
 *  - CryptoIntel renders an onboarding empty state to a signed-out visitor,
 *    and populating it needs an admin password. The capture is honest about
 *    what it is rather than being staged.
 *  - ZenCode has no deploy, so its image is its own source cloned and run
 *    against the relay server in the repo, then driven into the review state.
 *    The reviewing UI is not drawn — desktop `#previewCard` and mobile
 *    `#mainInterface` ship in the markup and are populated through the same
 *    fields `handleStreamStart` and `handleStreamEnd` fill. Only the spoken
 *    instruction and the resulting snippet are representative, because those
 *    come from a live VS Code session there is no way to stage. Labelled a
 *    reconstruction, like the two bots.
 *
 * The two Telegram bots have no web UI to capture at all. Their images are
 * reconstructions: the message text and inline keyboards are rendered verbatim
 * from the definitions in each repo (`src/bot/menus.js` and
 * `buildDashboardText` for Phantom Bridge, `src/ux/alertUi.ts` for Alpha
 * Signals), with representative values in place of live data. They are
 * labelled as reconstructions on the project pages rather than passed off as
 * captures.
 */
export const projects: Project[] = [
  {
    slug: "nest",
    name: "Nest",
    blurb:
      "Permissionless NFT launchpad for Robinhood Chain — upload artwork, deploy an ERC-721, open a mint, without writing code.",
    detail:
      "Creators upload artwork, get permanent IPFS metadata, and deploy their own ERC-721 through a factory contract that keeps 95% of primary mint revenue under their control. The contracts are Solidity 0.8.24 on OpenZeppelin 5 — royalties, two-step ownership, reentrancy guards and pull-payment accounting rather than pushing ETH on mint. Behind them sits a Fastify and PostgreSQL backend with a chain indexer that stores the hash of the last block it read, so a reorg rewinds and replays instead of quietly losing a mint, plus a reconciliation worker and an idempotency layer on every endpoint that touches money.",
    // Two languages, and the pairing is the point: the Solidity is what makes
    // it more than another dashboard, the TypeScript is most of the lines.
    language: "TypeScript · Solidity",
    stack: ["Solidity", "OpenZeppelin", "TypeScript", "Fastify", "Prisma", "PostgreSQL", "viem", "IPFS / Pinata"],
    year: "2026",
    status: "Shipped",
    href: "https://github.com/thyimpaler",
    live: "https://nest-nft-launchpad.vercel.app",
    shots: [{ src: "/shot-nest.png", caption: "Live site" }],
  },
  {
    slug: "phantom-bridge",
    name: "Phantom Bridge",
    blurb:
      "Telegram trading desk for BESC — custodial wallets, cross-chain bridging to BNB and ETH, and a PnL board.",
    detail:
      "A Telegraf bot that gives each user a generated wallet and drives the whole flow from inline keyboards: balances, swaps, bridging BESC to BNB or ETH, positions and realised PnL. Keys are encrypted at rest with Fernet, state is in SQLite, and chain calls go through ethers v6. Bridges can strand funds mid-route, so there is a dedicated recovery path for stuck WBESC rather than a support ticket.",
    language: "JavaScript",
    stack: ["Telegraf", "ethers v6", "better-sqlite3", "Fernet", "zod", "pngjs"],
    year: "2026",
    status: "Shipped",
    href: "https://github.com/thyimpaler",
    shots: [
      {
        src: "/shot-phantom-bridge.png",
        caption:
          "Reconstruction — control center and wallet vault, rendered from the bot's own message and keyboard definitions",
      },
    ],
  },
  {
    slug: "alpha-signals",
    name: "Alpha Signals",
    blurb:
      "Watches X for narratives forming, ranks the tokens attached to them, and alerts before the rotation is obvious.",
    detail:
      "Reads a curated set of X accounts, groups posts into narratives, then scores each candidate token on liquidity attraction, age and volume against liquidity to pick a main play. Following a narrative subscribes you to stage changes, main-play shifts, continuation moves and saturation warnings, so the alert is a thread rather than a one-off. Free and premium tiers render different screens from the same payload.",
    language: "TypeScript",
    stack: ["Telegraf", "X API", "DexScreener", "ethers", "Node"],
    year: "2026",
    status: "Shipped",
    href: "https://github.com/thyimpaler",
    shots: [
      {
        src: "/shot-alpha-signals.png",
        caption:
          "Reconstruction — realtime trigger and token ranking, rendered from the bot's own alert templates",
      },
    ],
  },
  {
    slug: "riggk",
    name: "$RIGGK",
    blurb:
      "Penalty-shootout arcade game on Solana — burn tokens for attempts, beat an AI keeper, climb the leaderboard.",
    detail:
      "A Phaser game wrapped in React, with wallet connection, a burn shop that trades tokens for attempts, and a leaderboard. The keeper adapts as your streak grows, so the difficulty comes from the opponent rather than from the physics.",
    language: "JavaScript",
    stack: ["React", "Phaser", "Zustand", "@solana/web3.js", "Vite"],
    year: "2026",
    status: "Shipped",
    href: "https://github.com/thyimpaler",
    live: "https://riggk.vercel.app",
    shots: [{ src: "/shot-riggk.png", caption: "Landing screen — live build" }],
  },
  {
    slug: "henny-run",
    name: "Henny Run",
    blurb:
      "Endless runner in the browser, rendered in 3D — dodge the FUD, collect bones, unlock skins.",
    detail:
      "Built with React Three Fiber over a Three.js city scene, with DOM overlays for the HUD, a garage of unlockable skins tied to token holdings, and a generated share card for scores.",
    language: "JavaScript",
    stack: ["React Three Fiber", "Three.js", "Zustand", "Vite"],
    year: "2026",
    status: "Shipped",
    href: "https://github.com/thyimpaler",
    live: "https://henny-run.vercel.app",
    shots: [{ src: "/shot-henny-run.png", caption: "Home screen — live build" }],
  },
  {
    slug: "axyom",
    name: "Axyom Sites",
    blurb:
      "The studio site for the development team I led, until the studio closed.",
    detail:
      "Next.js marketing site with a showcase, pricing and enquiry flow. I owned the technical direction and the shipping cadence across the product suite.",
    language: "TypeScript",
    stack: ["Next.js", "React", "Tailwind CSS", "Framer Motion"],
    year: "2026",
    status: "Archived",
    href: "https://github.com/thyimpaler/axysites",
    live: "https://axysites.vercel.app",
    shots: [{ src: "/shot-axyom.png", caption: "Live site" }],
  },
  {
    slug: "ansemg",
    name: "$ANSEMG",
    blurb: "Token site with live price, market cap and holder count.",
    detail:
      "A single-page token site wired to live market data, built to hold up on launch day when traffic and price both move fast.",
    language: "JavaScript",
    stack: ["HTML", "CSS", "JavaScript"],
    year: "2026",
    status: "Shipped",
    href: "https://github.com/thyimpaler",
    live: "https://ansemg.vercel.app",
    shots: [{ src: "/shot-ansemg.png", caption: "Live site" }],
  },
  {
    slug: "cipv1",
    name: "CIPV1",
    blurb:
      "Turns crypto research into automated trades — AI-assisted analysis, multi-exchange aggregation and real-time execution.",
    detail:
      "A research-to-execution pipeline: pull signals from across exchanges, score them, and route the resulting orders without leaving the tool. Built to compress the gap between spotting something and acting on it.",
    language: "JavaScript",
    stack: ["JavaScript", "Node.js", "Exchange APIs"],
    year: "2026",
    status: "Shipped",
    href: "https://github.com/thyimpaler/CIPV1",
    live: "https://cipv-1.vercel.app",
    shots: [
      {
        src: "/shot-cipv1.png",
        caption: "Live build, signed out — the populated view is behind an admin login",
      },
    ],
  },
  {
    slug: "csc1",
    name: "csc1",
    blurb:
      "Crypto dashboard on live Binance data: probability scoring, correlation analysis and order-book depth tracking.",
    detail:
      "A live market dashboard built around order flow rather than candles — depth, correlation between pairs, and a probability score per setup. Shares the CryptoIntel front end with CIPV1.",
    language: "JavaScript",
    stack: ["JavaScript", "Binance API", "WebSockets"],
    year: "2026",
    status: "Shipped",
    href: "https://github.com/thyimpaler/csc1",
    live: "https://csc1.vercel.app",
    shots: [
      {
        src: "/shot-csc1.png",
        caption: "Live build, signed out — the populated view is behind an admin login",
      },
    ],
  },
  {
    slug: "zencode",
    name: "ZenCode",
    blurb: "Voice your code, watch it stream to your phone, approve with a glance.",
    detail:
      "Speak a change, watch it stream to your phone, approve it with a glance. A relay server pairs a VS Code extension to a phone with a four-digit code, then keeps the two in step over a websocket. An experiment in moving code review off the desk and onto the device already in your hand. The repository is ZenCode; the interface it ships brands itself AuraCode, which is the name in the screens below.",
    language: "HTML",
    stack: ["HTML", "JavaScript", "WebSockets", "Web Speech API"],
    year: "2026",
    status: "Shipped",
    href: "https://github.com/thyimpaler/ZenCode",
    shots: [
      {
        src: "/shot-zencode.png",
        caption:
          "Reconstruction — the project's own pages, run against the relay server in its repo and driven into the review state, with a representative instruction and result",
      },
    ],
  },
  {
    slug: "omni-sync",
    name: "OmniSync",
    blurb:
      "Unified social inbox — WhatsApp and Instagram DMs in one queue, with SLA tracking on every conversation.",
    detail:
      "A support inbox that merges WhatsApp and Instagram DMs into a single queue, prioritises what is going stale, and tracks an SLA clock per conversation so nothing sits unanswered. Marketing site, pricing and demo are live.",
    language: "JavaScript",
    stack: ["React", "Vite", "Node.js"],
    year: "2026",
    status: "In progress",
    href: "https://github.com/thyimpaler/omni-sync",
    live: "https://omni-sync-e7gd.vercel.app",
    shots: [{ src: "/shot-omni-sync.png", caption: "Live site" }],
  },
]

export const projectBySlug = (slug: string) => projects.find((p) => p.slug === slug)

export const githubUrl = "https://github.com/thyimpaler"

export const tickerItems = [
  "Solidity",
  "Smart Contracts",
  "ERC-721",
  "Full-stack TypeScript",
  "Chain Indexing",
  "IPFS",
  "Telegram Bots",
  "Community Operations",
  "Orderflow",
  "Shipping",
]

export const contacts = [
  {
    id: "email",
    label: "work@thyimpaler.xyz",
    href: "mailto:work@thyimpaler.xyz",
    path: "M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z",
  },
  {
    id: "discord",
    label: "thyimpaler_",
    href: "https://discord.com/users/thyimpaler_",
    path: "M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189z",
  },
  {
    id: "telegram",
    label: "@ThyImpaler",
    href: "https://t.me/ThyImpaler",
    path: "M11.944 0A12 12 0 000 12a12 12 0 0012 12 12 12 0 0012-12A12 12 0 0012 0 12 12 0 0011.944 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 01.171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.479.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z",
  },
  {
    id: "twitter",
    label: "@Thy_Impaler",
    href: "https://x.com/Thy_Impaler",
    path: "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z",
  },
  {
    id: "github",
    label: "github.com/thyimpaler",
    href: "https://github.com/thyimpaler",
    path: "M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12",
  },
]
