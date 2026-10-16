/**
 * Copy for mod.thyimpaler.xyz, in one place so it can be edited without
 * touching layout.
 *
 * Anything in [BRACKETS] is a placeholder waiting on a real value. Do not
 * replace one with an estimate: these numbers get checked by the people
 * reading them, and a made-up figure costs more than a missing one.
 */

import { experiences, moderationStack, type Experience } from "@/data/cv"

export const EMAIL = "work@thyimpaler.xyz"
export const DISCORD = "aswdftw_25881"
export const TECH_SITE = "https://www.thyimpaler.xyz/"

/** Built from print/cv-mod.html by print/build.mjs. Empty renders a placeholder row. */
export const CV_URL = "/ThyImpaler-Community-CV.pdf"

export type Role = {
  org: string
  context?: string
  role: string
  period: string
  current?: boolean
  points: string[]
  /** Label on the left, value on the right. Real figures or [ADD NUMBER]. */
  metrics?: Array<[string, string]>
  /** The project lead's own quote, read from the CV so there is one copy. */
  lead?: Experience["lead"]
}

/** Moderation and community bots, the same list the CV shows. */
export const tools = moderationStack

const leadOf = (project: string) => experiences.find((e) => e.project === project)?.lead

export const roles: Role[] = [
  {
    org: "Klein Funding",
    context: "Prop trading firm · Remote",
    role: "Community Moderator and Marketing",
    period: "Apr 2026 to Present",
    current: true,
    points: [
      "Moderate the community day to day.",
      "Run X and social marketing, including account growth and content.",
      "Test the trading web app's interface and report issues to the dev team.",
    ],
    metrics: [
      ["Community size", "33,000 members"],
      ["Account growth", "To 1,000 followers"],
      ["Avg. response time", "2 minutes"],
    ],
  },
  {
    org: "$HENNY",
    context: "BESC Hyperchain",
    role: "Head Moderator",
    period: "Jan 2026 to Present",
    current: true,
    points: [
      "Head moderator, holding the room through a $105K all-time high, the project's peak.",
      "Moderation on Telegram with Safeguard and Rose.",
    ],
    lead: leadOf("$HENNY"),
  },
  {
    org: "CAST",
    context: "Fishing game with rotating tournaments",
    role: "Discord server design",
    period: "Sep 2026",
    points: [
      "Designed the channel and role structure.",
      "Set the server's branding.",
      "Planned the webhook automation.",
    ],
  },
  {
    org: "Phantom CTO",
    role: "Admin and Developer",
    period: "Apr 2026 to Jun 2026",
    points: [
      "Admin on the project's community.",
      "Built Phantom Bot for Telegram bridging and trading.",
    ],
    lead: leadOf("Phantom CTO"),
  },
  {
    org: "$CHAD",
    context: "Memecoin · BESC Hyperchain",
    role: "Moderator and NFT Developer",
    period: "Feb 2026 to Jun 2026",
    points: [
      "Moderated the Discord with Carl-bot.",
      "Shipped the first NFT on BESC Hyperchain.",
    ],
    lead: leadOf("$CHAD"),
  },
]

export const services: Array<{ title: string; body: string }> = [
  {
    title: "Discord setup",
    body: "Roles, permissions, onboarding, bots and webhooks.",
  },
  {
    title: "Moderation and scam handling",
    body: "Keeping the chat clean and dealing with scammers and impersonators.",
  },
  {
    title: "Announcements and events",
    body: "Writing announcements and running community events.",
  },
  {
    title: "X content and growth",
    body: "Posting, content and growing the account.",
  },
  {
    title: "Feedback and bug escalation",
    body: "Collecting what users report and passing it to the product and dev teams in a form they can act on.",
  },
]
