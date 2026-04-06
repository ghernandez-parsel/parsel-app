import { cn } from "../lib/utils";

// ─── Figma asset URLs ─────────────────────────────────────────────────────────
// These Figma-hosted URLs expire after 7 days. Replace with self-hosted
// versions before deploying to production.

const LOGOS = {
  ups:      "https://www.figma.com/api/mcp/asset/c0308eac-ade7-49fe-88d0-21e0b50784bc",
  usps:     "https://www.figma.com/api/mcp/asset/3ba6bf26-f9d9-466d-b8b4-bfd962f73350",
  fedex:    "https://www.figma.com/api/mcp/asset/8c631587-a349-48d5-a830-ffb95361df04",
  veho:     "https://www.figma.com/api/mcp/asset/350713d4-dc24-4e16-bad8-665a51f6cf47",
  ontrac:   "https://www.figma.com/api/mcp/asset/c09663cd-47a0-4808-ba62-975e248b3bda",
  uniuni:   "https://www.figma.com/api/mcp/asset/54f505a0-81fe-401f-8c20-aaf002faf4e9",
  jitsu:    "https://www.figma.com/api/mcp/asset/dc23380a-3e6e-4e40-833f-88c76ca8b1cf",
  doordash: "https://www.figma.com/api/mcp/asset/98dc6704-8180-4652-b087-570438d69a7d",
  parsel:   "https://www.figma.com/api/mcp/asset/2818886a-1a95-43e8-b9f2-61874baa0998",
};

// ─── Per-carrier styling ──────────────────────────────────────────────────────

interface CarrierConfig {
  bg: string;
  border?: string;
  logo: string;
  // padding inside the tile as percentage on each side: [top, right, bottom, left]
  p: [number, number, number, number];
}

const CARRIERS: Record<string, CarrierConfig> = {
  UPS:      { bg: "#4b0606", logo: LOGOS.ups,      p: [18, 22, 18, 22] },
  USPS:     { bg: "#30308e", logo: LOGOS.usps,      p: [22,  5, 22,  5] },
  FedEx:    { bg: "#420d83", logo: LOGOS.fedex,     p: [34,  6, 36,  8] },
  Veho:     { bg: "#e84931", logo: LOGOS.veho,      p: [32, 10, 32, 10] },
  OnTrac:   { bg: "#d02a36", logo: LOGOS.ontrac,    p: [38, 10, 40, 12] },
  UniUni:   { bg: "#ffffff", logo: LOGOS.uniuni,    p: [25, 25, 25, 25], border: "1px solid #e5e5de" },
  Jitsu:    { bg: "#4dc480", logo: LOGOS.jitsu,     p: [30, 10, 30, 10] },
  DoorDash: { bg: "#eb1700", logo: LOGOS.doordash,  p: [28, 10, 28, 10] },
  Parsel:   { bg: "#0f0f0f", logo: LOGOS.parsel,    p: [28, 12, 28, 12], border: "1px solid #303030" },
};

// ─── Component ────────────────────────────────────────────────────────────────

export type CarrierName =
  | "UPS" | "USPS" | "FedEx" | "Veho" | "OnTrac"
  | "UniUni" | "Jitsu" | "DoorDash" | "Parsel";

interface CarrierTileProps {
  carrier: CarrierName | string;
  size?: "sm" | "md";
}

export function CarrierTile({ carrier, size = "md" }: CarrierTileProps) {
  const px = size === "sm" ? 24 : 40;
  const config = CARRIERS[carrier];

  if (!config) {
    return (
      <div
        className={cn("shrink-0 rounded-[6px] flex items-center justify-center overflow-hidden")}
        style={{ width: px, height: px, backgroundColor: "#f0f0ea", border: "1px solid #e5e5de" }}
      >
        <span style={{ fontSize: 9, fontWeight: 700, color: "rgba(10,10,10,0.4)", lineHeight: 1 }}>
          {String(carrier).slice(0, 3).toUpperCase()}
        </span>
      </div>
    );
  }

  const [pt, pr, pb, pl] = config.p;

  return (
    <div
      className="shrink-0 rounded-[6px] overflow-hidden relative"
      style={{
        width: px,
        height: px,
        backgroundColor: config.bg,
        border: config.border,
      }}
    >
      <img
        alt={carrier}
        src={config.logo}
        style={{
          position: "absolute",
          top: `${pt}%`,
          right: `${pr}%`,
          bottom: `${pb}%`,
          left: `${pl}%`,
          width: `${100 - pl - pr}%`,
          height: `${100 - pt - pb}%`,
          objectFit: "contain",
        }}
      />
    </div>
  );
}
