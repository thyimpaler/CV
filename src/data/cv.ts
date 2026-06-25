export type Experience = {
  role: string
  project: string
  token?: string
  sub?: string
  period: string
  current?: boolean
  dev?: boolean
  achievement?: string
  items: { label: string; text: string }[]
}

export const experiences: Experience[] = [
  {
    role: "Head of Development",
    project: "Axyom Sites",
    token: "Axyom Sites",
    period: "Jun 2026 — Present",
    current: true,
    dev: true,
    items: [
      {
        label: "Engineering Leadership",
        text: "Lead the development team end-to-end — owning technical direction, build quality, and the shipping cadence across the Axyom product suite.",
      },
      {
        label: "Architecture & Delivery",
        text: "Define standards for the web and bot infrastructure, review code, and keep releases fast, stable, and on schedule.",
      },
      {
        label: "Roadmap & Team",
        text: "Coordinate developers, prioritise the roadmap, and translate community and client needs into shipped features.",
      },
    ],
  },
  {
    role: "Moderator",
    project: "Klein Funding Crypto",
    period: "Apr 2026 — Now",
    current: true,
    items: [
      {
        label: "Community Operations",
        text: "Active moderation support for day-to-day ecosystem discussions and escalations across Discord and Telegram.",
      },
      {
        label: "Trust & Safety",
        text: "Enforced community standards by identifying and removing bad actors, scam links, and coordinated FUD campaigns targeting funded traders.",
      },
      {
        label: "Trader Support",
        text: "Assisted members with funding-programme queries, prop-firm processes, and account escalations in real time.",
      },
      {
        label: "Signal Integrity",
        text: "Maintained a clean, high-signal environment by filtering noise and keeping announcements and alpha uncontaminated.",
      },
    ],
  },
  {
    role: "Developer & Admin",
    project: "Phantom CTO",
    token: "Phantom CTO",
    period: "Apr 2026 — Jun 2026",
    dev: true,
    items: [
      {
        label: "Bot Development",
        text: "Built and maintained the Phantom Bot — a Telegram-based automated bridging and trading tool.",
      },
      {
        label: "Administrative Ops",
        text: "Full admin oversight of the Phantom CTO ecosystem: deployments, user support, and operational strategy.",
      },
    ],
  },
  {
    role: "Moderator",
    project: "$CHAD",
    token: "$CHAD",
    period: "Feb 2026 — Present",
    items: [
      {
        label: "Real-Time Ops",
        text: "Executed 24/7 FUD mitigation and conflict resolution during peak trading volatility.",
      },
      {
        label: "Onboarding & Education",
        text: "Streamlined the entry pipeline for new members, breaking down project mechanics and utility.",
      },
      {
        label: "Environment Control",
        text: "Used Carl-bot and advanced Discord role structures to maintain a clean, high-energy space.",
      },
    ],
  },
  {
    role: "Head Moderator",
    project: "$HENNY",
    token: "$HENNY",
    sub: "Besc Hyperchain",
    period: "Jan 2026 — Present",
    achievement: "Community held strong through a $105K ATH — the highest the project ever reached.",
    items: [
      {
        label: "Security Architecture",
        text: "Deployed Safeguard and Rose to systematically neutralize bot raids and phishing attempts.",
      },
      {
        label: "Viral Growth Ops",
        text: "Orchestrated coordinated X (Twitter) raids via Raidder to maintain ecosystem visibility.",
      },
      {
        label: "Sentiment Management",
        text: "Navigated complex CTO transitions and high-volatility events while preserving investor trust.",
      },
    ],
  },
]

export type Stat = {
  value: string
  label: string
  icon: string
  hint: string
  count?: number
  prefix?: string
  suffix?: string
}

export const stats: Stat[] = [
  { value: "4", count: 4, suffix: "+", label: "DeFi Ecosystems", icon: "⛓️", hint: "Communities operated" },
  { value: "24/7", label: "Active Moderation", icon: "🛡️", hint: "Always on watch" },
  { value: "$105K", count: 105, prefix: "$", suffix: "K", label: "ATH Under Watch", icon: "📈", hint: "Peak held strong" },
  { value: "100%", count: 100, suffix: "%", label: "Uptime Commitment", icon: "⚡", hint: "No gaps, ever" },
]

export const toolkit = [
  {
    icon: "🛡️",
    title: "Moderation Stack",
    pills: ["Carl-bot", "Wick", "RBAC", "Rose", "Raidder", "Safeguard", "Discord", "Telegram"],
  },
  {
    icon: "⛓️",
    title: "Ecosystem Expertise",
    pills: ["Solana", "Besc Hyperchain", "Liquid NFT Finance", "DeFi"],
  },
  {
    icon: "🎯",
    title: "Strategic Operations",
    pills: ["Anti-FUD Frameworks", "Viral Raid Coordination", "Sentiment Analytics", "Community Growth"],
  },
]

export const devCard = {
  icon: "🧠",
  title: "Development & Build",
  href: "https://github.com/thyimpaler",
  pills: ["Phantom Bot Developer", "Head of NFT Dev ($CHAD)", "OmniSync (In Progress)"],
}

export const tickerItems = [
  "Community Architecture",
  "Anti-FUD Operations",
  "Bot Security",
  "Viral Growth Coordination",
  "DeFi Moderation",
  "Sentiment Management",
  "Discord Strategy",
  "Telegram Operations",
  "Signal Architecture",
  "24/7 Uptime",
]

export const contacts = [
  {
    id: "email",
    label: "Gmail",
    href: "mailto:thyimpal3r@gmail.com",
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
]
