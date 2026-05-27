export type ProductStatus = "live" | "building" | "shipped";
export type Builder = "jhinresh" | "ezven" | "both";

export interface Product {
  slug: string;
  name: string;
  kind: string;
  year: string;
  status: ProductStatus;
  description: string;
  builder: Builder;
  href?: string;
  repo?: string;
  previewImage: string;
  award?: string;
  notes: string[];
}

export const PRODUCTS: Product[] = [
  {
    slug: "gimi",
    name: "Gimi",
    kind: "agentic rentals",
    year: "2026",
    status: "shipped",
    description:
      "Award-winning AI rental agent for school, community, and hackathon inventory.",
    builder: "both",
    repo: "https://github.com/clawdez/Gimi",
    previewImage: "/previews/gimi.png",
    award: "hackathon winner",
    notes: ["AI-guided checkout", "Solana escrow", "Rental-token state"],
  },
  {
    slug: "pincher",
    name: "Pincher",
    kind: "carpool matcher agent",
    year: "2026",
    status: "live",
    description:
      "Telegram-first carpool matcher for crypto conference side events.",
    builder: "jhinresh",
    href: "https://pincher.vercel.app",
    repo: "https://github.com/JhiNResH/Pincher",
    previewImage: "/previews/pincher.png",
    notes: ["Telegram ride rooms", "Time matching", "Manual settlement"],
  },
  {
    slug: "pingme",
    name: "pingme",
    kind: "ping pong finder",
    year: "2026",
    status: "live",
    description:
      "See who's down to play ping pong right now. Signal your status, get pinged when others are ready.",
    builder: "ezven",
    repo: "https://github.com/Ferxxo-pa/pingme",
    previewImage: "/previews/pingme.png",
    notes: ["Real-time presence", "Push notifications", "PWA"],
  },
  {
    slug: "distoken",
    name: "DisToken",
    kind: "nft gallery viewer",
    year: "2026",
    status: "shipped",
    description:
      "Multi-chain NFT gallery viewer. Paste any wallet, see your entire collection across 8 blockchains instantly.",
    builder: "ezven",
    href: "https://distoken.art",
    repo: "https://github.com/Ferxxo-pa/DisToken",
    previewImage: "/previews/distoken.png",
    award: "hackathon winner",
    notes: ["8-chain support", "QR remote", "Kiosk mode"],
  },
  {
    slug: "transparent",
    name: "Transparent",
    kind: "multiplayer party game",
    year: "2026",
    status: "shipped",
    description:
      "Real-money multiplayer party game on Solana. Players buy in with SOL, answer personal questions, and the most transparent player wins the pot.",
    builder: "ezven",
    href: "https://transparent-five.vercel.app",
    repo: "https://github.com/Ferxxo-pa/transparent",
    previewImage: "/previews/transparent.png",
    notes: ["SOL buy-ins", "Embedded wallets", "Prediction side bets"],
  },
  {
    slug: "redlineai",
    name: "Redline AI",
    kind: "law review scanner",
    year: "2026",
    status: "live",
    description:
      "Automated law review scanner. Upload a manuscript, get instant style violation flags with exact rule citations.",
    builder: "ezven",
    href: "http://redlineai.xyz/",
    previewImage: "/previews/redlineai.png",
    notes: ["61+ rules", "Claude mode", "PDF, DOCX, plain text"],
  },
  {
    slug: "dojo",
    name: "Dojo",
    kind: "NFA marketplace",
    year: "2026",
    status: "live",
    description:
      "Marketplace for agent collections, NFA service cards, and receipt-backed reputation.",
    builder: "both",
    href: "https://maiat-dojo.vercel.app",
    repo: "https://github.com/JhiNResH/maiat-dojo",
    previewImage: "/previews/dojo.png",
    award: "hackathon winner",
    notes: ["Agent collections", "NFA service cards", "Receipts and lineage"],
  },
  {
    slug: "jiagon",
    name: "Jiagon",
    kind: "verified reviews",
    year: "2026",
    status: "live",
    description:
      "Receipt-gated review prototype backed by onchain payment proofs.",
    builder: "jhinresh",
    href: "https://jiagon.vercel.app",
    repo: "https://github.com/JhiNResH/jiagon",
    previewImage: "/previews/jiagon.png",
    notes: ["Receipt-gated reviews", "Onchain proof", "Product feedback"],
  },
  {
    slug: "maiat-protocol",
    name: "Maiat Protocol",
    kind: "agent trust layer",
    year: "2026",
    status: "building",
    description:
      "Trust oracle for AI agents, tokens, attestations, and agentic commerce.",
    builder: "both",
    href: "https://app.maiat.io",
    repo: "https://github.com/JhiNResH/maiat-protocol",
    previewImage: "/previews/maiat-protocol.png",
    award: "hackathon winner",
    notes: ["Agent trust scoring", "Attestations", "Reputation layer"],
  },
  {
    slug: "wanderly",
    name: "Wanderly",
    kind: "ios travel app",
    year: "2026",
    status: "building",
    description: "AI-powered place discovery and trip planning app for iOS.",
    builder: "jhinresh",
    repo: "https://github.com/JhiNResH/wanderly",
    previewImage: "/previews/wanderly.png",
    notes: ["Shared-link extraction", "MapKit planning", "Share Extension"],
  },
  {
    slug: "cloak",
    name: "Cloak",
    kind: "ios virtual try-on",
    year: "2026",
    status: "shipped",
    description:
      "Virtual try-on iOS app for trying clothes with your own photo.",
    builder: "jhinresh",
    repo: "https://github.com/JhiNResH/cloak",
    previewImage: "/previews/cloak.png",
    notes: ["Personal photo input", "Clothing previews", "iOS-first"],
  },
];

export const STATUS_LABEL: Record<ProductStatus, string> = {
  live: "live",
  building: "building",
  shipped: "shipped",
};
