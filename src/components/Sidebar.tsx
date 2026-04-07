import { NavLink, useLocation } from "react-router-dom";
import { cn } from "../lib/utils";
import { useSidebar } from "../lib/sidebar-context";
import {
  Inbox,
  Package,
  Truck,
  MapPin,
  LineChart,
  TicketSlash,
  Receipt,
  Settings,
  LifeBuoy,
  Send,
  ChevronRight,
  ChevronsUpDown,
  GalleryVerticalEnd,
} from "lucide-react";

// ─── Parsel Logo ─────────────────────────────────────────────────────────────

import PARSEL_LOGO from "../assets/parsel-logo.svg";

// ─── Types ────────────────────────────────────────────────────────────────────

interface NavItem {
  label: string;
  icon: React.ReactNode;
  to: string;
  hasChevron?: boolean;
}

// ─── Nav sections ─────────────────────────────────────────────────────────────

const primaryNav: NavItem[] = [
  { label: "Orders", icon: <Inbox size={16} />, to: "/orders" },
  { label: "Shipments", icon: <Package size={16} />, to: "/shipments" },
  { label: "Pickups", icon: <Truck size={16} />, to: "/pickups" },
];

const secondaryNav: NavItem[] = [
  { label: "Tracking", icon: <MapPin size={16} />, to: "/tracking", hasChevron: true },
  { label: "Analytics", icon: <LineChart size={16} />, to: "/analytics", hasChevron: true },
  { label: "Claims", icon: <TicketSlash size={16} />, to: "/claims", hasChevron: true },
  { label: "Billing", icon: <Receipt size={16} />, to: "/billing" },
];

const bottomNav: NavItem[] = [
  { label: "Settings", icon: <Settings size={16} />, to: "/settings" },
  { label: "Support", icon: <LifeBuoy size={16} />, to: "/support" },
  { label: "Feedback", icon: <Send size={16} />, to: "/feedback" },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function Divider() {
  return <div className="h-px w-full bg-[#e5e5de] my-1" />;
}

function MenuButton({
  item,
  collapsed,
}: {
  item: NavItem;
  collapsed: boolean;
}) {
  const location = useLocation();
  const isActive = location.pathname === item.to;

  return (
    <NavLink
      to={item.to}
      title={collapsed ? item.label : undefined}
      className={cn(
        "group flex items-center gap-2 h-8 px-2 rounded-md w-full text-sm transition-colors duration-150",
        "text-[#0a0a0a] hover:bg-[#eaeae4]",
        isActive && "bg-[#FDEEE8] text-[#E8480C] font-medium",
        collapsed && "justify-center px-2"
      )}
    >
      <span className="shrink-0">{item.icon}</span>
      {!collapsed && (
        <>
          <span className="flex-1 truncate">{item.label}</span>
          {item.hasChevron && (
            <ChevronRight size={16} className="text-[#0a0a0a] opacity-50 shrink-0" />
          )}
        </>
      )}
    </NavLink>
  );
}

// ─── Main Sidebar ─────────────────────────────────────────────────────────────

export function Sidebar() {
  const { collapsed } = useSidebar();

  return (
    <aside
      className={cn(
        "bg-[#f3f3ed] flex flex-col h-screen shrink-0 transition-all duration-200 ease-in-out border-r border-[#e5e5de]",
        collapsed ? "w-[50px]" : "w-[255px]"
      )}
    >
      {/* ── Logo ── */}
      <div className="p-2">
        <div className="flex items-center px-2 py-2">
          {!collapsed && (
            <img
              src={PARSEL_LOGO}
              alt="Parsel"
              style={{ height: 22, width: 46, objectFit: "contain" }}
            />
          )}
        </div>
      </div>

      {/* ── Company selector ── */}
      <div className="p-2">
        <button
          className={cn(
            "flex items-center gap-2 w-full px-2 py-2 rounded-lg hover:bg-[#eaeae4] transition-colors",
            collapsed && "justify-center"
          )}
        >
          <div className="bg-[#171717] rounded-lg w-8 h-8 flex items-center justify-center shrink-0">
            <GalleryVerticalEnd size={16} className="text-white" />
          </div>
          {!collapsed && (
            <>
              <div className="flex flex-col items-start flex-1 min-w-0 text-left">
                <span className="text-sm font-semibold leading-5 truncate w-full text-[#0a0a0a]">
                  Acme Inc
                </span>
                <span className="text-xs leading-4 truncate w-full text-[#0a0a0a] opacity-70">
                  Atlanta Upper Westside
                </span>
              </div>
              <ChevronsUpDown size={16} className="text-[#0a0a0a] opacity-50 shrink-0" />
            </>
          )}
        </button>
      </div>

      <Divider />

      {/* ── Primary nav ── */}
      <div className="p-2">
        <nav className="flex flex-col gap-1">
          {primaryNav.map((item) => (
            <MenuButton key={item.to} item={item} collapsed={collapsed} />
          ))}
        </nav>
      </div>

      <Divider />

      {/* ── Secondary nav ── */}
      <div className="p-2">
        <nav className="flex flex-col gap-1">
          {secondaryNav.map((item) => (
            <MenuButton key={item.to} item={item} collapsed={collapsed} />
          ))}
        </nav>
      </div>

      <Divider />

      {/* ── Bottom nav (pushes to bottom) ── */}
      <div className="flex-1" />
      <div className="p-2">
        <nav className="flex flex-col gap-1">
          {bottomNav.map((item) => (
            <MenuButton key={item.to} item={item} collapsed={collapsed} />
          ))}
        </nav>
      </div>

      <Divider />

      {/* ── User footer ── */}
      <div className="p-2">
        <button
          className={cn(
            "flex items-center gap-2 w-full px-2 py-2 rounded-lg hover:bg-[#eaeae4] transition-colors",
            collapsed && "justify-center"
          )}
        >
          <div className="bg-[#171717] rounded-lg w-8 h-8 flex items-center justify-center shrink-0">
            <span className="text-white text-sm font-semibold">J</span>
          </div>
          {!collapsed && (
            <>
              <div className="flex flex-col items-start flex-1 min-w-0 text-left">
                <span className="text-sm font-semibold leading-5 truncate w-full text-[#0a0a0a]">
                  Jane Smith
                </span>
                <span className="text-xs leading-4 truncate w-full text-[#0a0a0a] opacity-70">
                  janesmith@acme.com
                </span>
              </div>
              <ChevronsUpDown size={16} className="text-[#0a0a0a] opacity-50 shrink-0" />
            </>
          )}
        </button>
      </div>
    </aside>
  );
}
