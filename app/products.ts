export type ProductStatus = "live" | "building" | "shipped" | "paused" | "preview";

export interface Product {
  slug: string;
  t: string;
  k: string;
  y: string;
  s: ProductStatus;
  art: string;
  desc: string;
  builtBy?: string;
  href?: string;
  repo?: string;
  previewImage?: string;
  hackathon?: string; // e.g. "hackathon winner"
  preview: {
    lead: string;
    notes: string[];
  };
}

export const PRODUCTS: Product[] = [
  {
    slug: "agent-link",
    t: "Agent Link",
    k: "shared agent rooms",
    y: "2026",
    s: "paused",
    art: "art-1",
    desc: "Free, MIT open-source tool for connecting two people's existing AI agents in a temporary shared room.",
    builtBy: "ezven",
    repo: "https://github.com/Ferxxo-pa/agent-link",
    preview: {
      lead: "Two people bring their own AI agents into a temporary shared room. Each person sees the shared transcript, privately instructs their own agent, and reviews messages before they're shared.",
      notes: [
        "Shared transcript with private instructions to your own agent",
        "Review messages before they're shared",
        "Archived early prototype: local trial only, no verified integrations with specific agent products",
        "Built by ezven",
      ],
    },
  },
  {
    slug: "dip",
    t: "DIP",
    k: "Group coordination",
    y: "2026",
    s: "building",
    art: "art-6",
    desc: "Real-time group readiness check. Share a link, everyone taps in, dip when it's time.",
    builtBy: "ezven",
    href: "https://dip-neon-three.vercel.app/",
    preview: {
      lead: "A real-time group coordination tool. Share a link, everyone signals ready, and you dip together.",
      notes: [
        "Real-time group readiness signals",
        "Shareable link — no app download needed",
        "Built by ezven",
      ],
    },
  },
  {
    builtBy: "jhinresh + ezven",
    slug: "gimi",
    t: "GIMI",
    k: "Agentic rentals",
    y: "2026",
    s: "shipped",
    art: "art-8",
    desc: "Award-winning AI rental agent for school, community, and hackathon inventory.",
    href: "https://gimi-pr18.vercel.app/",
    repo: "https://github.com/jh1nresh/Gimi",
    hackathon: "hackathon winner",
    previewImage: "/previews/gimi.png",
    preview: {
      lead: "Gimi is an agentic rental marketplace with Solana settlement built in: ask for a nearby item, fund escrow, hold a temporary rental token, return the item, and leave a receipt-backed outcome.",
      notes: [
        "AI-guided inventory search and rental checkout",
        "Solana escrow, metered rent accrual, rental-token state, and receipt events",
        "LI.FI funding quotes, ElevenLabs tools, Privy wallet onboarding, and MCP-style rental tools",
        "Award-winning hackathon build by jeezlabs",
      ],
    },
  },
  {
    slug: "pingme",
    t: "PINGME",
    k: "Ping pong finder",
    y: "2026",
    s: "live",
    art: "art-3",
    desc: "See who's down to play ping pong right now. Signal your status, get pinged when others are ready.",
    builtBy: "ezven",
    href: "https://usepingme.com/",
    repo: "https://github.com/Ferxxo-pa/pingme",
    previewImage: "/previews/pingme.png",
    preview: {
      lead: "A real-time status board for pickup ping pong. Drag the ball to signal you're down, get push-notified when others are ready. Live at Texas Tech.",
      notes: [
        "Real-time presence — see who's down, playing, or away",
        "Push notifications when the app is closed",
        "PWA — installs to home screen on iOS and Android",
        "Built by ezven",
      ],
    },
  },
  {
    slug: "distoken",
    t: "DISTOKEN",
    k: "NFT gallery viewer",
    y: "2026",
    s: "shipped",
    art: "art-1",
    desc: "Multi-chain NFT gallery viewer. Paste any wallet, see your entire collection across 8 blockchains instantly.",
    builtBy: "ezven",
    href: "https://distoken.art/",
    repo: "https://github.com/Ferxxo-pa/DisToken",
    hackathon: "hackathon winner",
    previewImage: "/previews/distoken.png",
    preview: {
      lead: "The best display for digital art is the screen you already own. Paste a wallet address and see your entire collection across 8 chains — no account needed.",
      notes: [
        "8-chain support: Ethereum, Solana, Base, Polygon, Arbitrum, Optimism, Tezos, Ordinals",
        "Phone remote control via QR code and room code",
        "Kiosk mode for galleries and retail",
        "Embed widget for any website",
        "Built by ezven",
      ],
    },
  },
  {
    slug: "transparent",
    t: "TRANSPARENT",
    k: "Multiplayer party game",
    y: "2026",
    s: "shipped",
    art: "art-4",
    desc: "Real-money multiplayer party game on Solana. Players buy in with SOL, answer personal questions, and the most transparent player wins the pot.",
    builtBy: "ezven",
    href: "https://transparent-five.vercel.app/",
    repo: "https://github.com/Ferxxo-pa/transparent",
    previewImage: "/previews/transparent.png",
    preview: {
      lead: "The party game with real stakes. Buy in with SOL, answer personal questions in the hot seat, and the most transparent player wins the pot.",
      notes: [
        "Real SOL buy-ins and payouts on-chain",
        "Email login with embedded wallets — no seed phrases",
        "Prediction market for side bets",
        "3 game modes: Classic, Hot-Take, Custom",
        "Built by ezven",
      ],
    },
  },
  {
    slug: "redlineai",
    t: "REDLINE AI",
    k: "Law review scanner",
    y: "2026",
    s: "live",
    art: "art-5",
    desc: "Automated law review scanner. Upload a manuscript, get instant style violation flags with exact rule citations.",
    builtBy: "ezven",
    href: "https://redlineai.xyz/",
    previewImage: "/previews/redlineai.png",
    preview: {
      lead: "Scan your law review paper for style violations instantly. Supports PDF, DOCX, and plain text. 61+ rules with AI-powered context-aware detection.",
      notes: [
        "61+ style violation rules with exact citations",
        "AI mode (Claude) for context-aware detection",
        "PDF, DOCX, and plain text support",
        "Built by ezven",
      ],
    },
  },
  {
    builtBy: "jhinresh + ezven",
    slug: "agentshack",
    t: "AGENTSHACK",
    k: "AI agent marketplace",
    y: "2026",
    s: "live",
    art: "art-2",
    desc: "AI agent marketplace for hiring, subscribing to, and forking agents with verifiable work history.",
    hackathon: "hackathon winner",
    href: "https://agentshack.io/",
    repo: "https://github.com/jh1nresh/agentshack",
    previewImage: "/previews/dojo.png",
    preview: {
      lead: "AgentShack is an AI agent marketplace for hiring, subscribing to, and forking agents with verifiable work history, payments, and reputation.",
      notes: [
        "Agent marketplace for service access",
        "Verifiable work history and reputation",
        "Payments-aware agent workflows",
        "Built for Maiat-style agent reputation and service access",
      ],
    },
  },
  {
    "slug": "output",
    "t": "OUTPUT",
    "k": "Print-production network \u00b7 sandbox",
    "y": "2026",
    "s": "preview",
    "art": "art-3",
    "desc": "Distributed print-production network connecting jobs with print shops. Sandbox preview.",
    "builtBy": "JeezLabs",
    "href": "https://output.jeezlabs.io/",
    "preview": {
      "lead": "Print-production network \u00b7 sandbox",
      "notes": [
        "Sandbox preview"
      ]
    }
  },
  {
    builtBy: "jhinresh + ezven",
    slug: "maiat-protocol",
    t: "MAIAT PROTOCOL",
    k: "Agent trust layer",
    y: "2026",
    s: "shipped",
    art: "art-3",
    desc: "Trust oracle for AI agents, tokens, attestations, and agentic commerce.",
    hackathon: "hackathon winner",
    href: "https://app.maiat.io/",
    previewImage: "/previews/maiat-protocol.png",
    preview: {
      lead: "A protocol layer for trust signals, attestations, and reputation across agentic commerce.",
      notes: ["Agent trust scoring", "Attestation-aware reputation", "Protocol-first direction"],
    },
  },
  {
    slug: "wanderly",
    t: "savvy",
    k: "iOS travel app",
    y: "2026",
    s: "building",
    art: "art-4",
    desc: "Private place-memory app for iOS. Save places from shared links; review uncertain matches before adding them to a private map.",
    builtBy: "jhinresh",
    href: "https://savvy.jeezlabs.io/",
    repo: "https://github.com/jh1nresh/SAV-E",
    previewImage: "/previews/wanderly.png",
    preview: {
      lead: "savvy saves places from shared links, with Review for uncertain matches and a private map for confirmed places.",
      notes: ["Shared links", "Review before saving", "Private place memory"],
    },
  },
  {
    "slug": "eznest",
    "t": "EZNest",
    "k": "Nesting for print shops \u00b7 preview",
    "y": "2026",
    "s": "preview",
    "art": "art-3",
    "desc": "Nesting workspace for print shops. Preview.",
    "builtBy": "JeezLabs",
    "href": "https://eznest.jeezlabs.io/",
    "preview": {
      "lead": "Nesting for print shops \u00b7 preview",
      "notes": [
        "Preview"
      ]
    }
  }
];

export const STATUS_LABEL: Record<ProductStatus, string> = {
  live: "live", building: "building", shipped: "shipped", paused: "paused", preview: "preview",
};
