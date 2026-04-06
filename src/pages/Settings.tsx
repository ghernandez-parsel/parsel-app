import {
  PanelLeft,
  Building,
  CircleUser,
  Store,
  ShoppingCart,
  Package,
  Printer,
  Route,
  Palette,
} from "lucide-react";

// ─── Card data ────────────────────────────────────────────────────────────────

const SETTINGS_CARDS = [
  {
    icon: <Building size={16} />,
    title: "Organization",
    description: "Manage your organization name, address and core account details.",
  },
  {
    icon: <CircleUser size={16} />,
    title: "Users",
    description: "Invite team members and manage their roles and access.",
  },
  {
    icon: <Store size={16} />,
    title: "Storefronts",
    description: "Connect and configure your ecommerce storefronts.",
  },
  {
    icon: <ShoppingCart size={16} />,
    title: "Orders",
    description: "Set defaults for order creation and fulfillment behavior.",
  },
  {
    icon: <Package size={16} />,
    title: "Packages",
    description: "Define reusable package presets for faster shipment creation.",
  },
  {
    icon: <Printer size={16} />,
    title: "Packing Slip",
    description: "Customize the packaging slip template included with your orders.",
  },
  {
    icon: <Route size={16} />,
    title: "Service Levels",
    description: "Map carrier service levels to your available shipping options.",
  },
  {
    icon: <Palette size={16} />,
    title: "Tracking",
    description: "Customize the branding and appearance of your customer tracking page.",
  },
];

// ─── Setting Card ─────────────────────────────────────────────────────────────

function SettingCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <button className="group text-left bg-white border border-[#e5e5de] rounded-xl p-6 flex flex-col gap-3 hover:border-[#E8480C]/40 hover:shadow-sm transition-all duration-150">
      <div className="text-[#E8480C]">{icon}</div>
      <div className="flex flex-col gap-1">
        <p className="text-sm font-semibold text-[#0a0a0a] group-hover:text-[#E8480C] transition-colors">
          {title}
        </p>
        <p className="text-sm text-[#0a0a0a]/55 leading-snug">{description}</p>
      </div>
    </button>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export function Settings() {
  return (
    <div className="flex flex-col h-full overflow-auto bg-white">
      {/* Header */}
      <div className="flex items-center gap-3 px-6 h-16 border-b border-[#e5e5de] shrink-0">
        <button className="p-1.5 rounded-md hover:bg-[#f3f3ed] text-[#0a0a0a]/40 hover:text-[#0a0a0a] transition-colors">
          <PanelLeft size={16} />
        </button>
        <div className="w-px h-4 bg-[#e5e5de]" />
        <h1 className="text-sm font-semibold text-[#0a0a0a]">Settings</h1>
      </div>

      {/* Grid */}
      <div className="flex-1 p-8">
        <div className="grid grid-cols-3 gap-4 max-w-[1000px]">
          {SETTINGS_CARDS.map((card) => (
            <SettingCard key={card.title} {...card} />
          ))}
        </div>
      </div>
    </div>
  );
}
