import { useParams, Link } from "react-router-dom";
import {
  PanelLeft,
  ChevronRight,
  Printer,
  TriangleAlert,
  MoreHorizontal,
  MoreVertical,
  CircleCheck,
  Truck,
  Calendar,
  CalendarCheck,
  PackageCheck,
  XCircle,
  Package,
} from "lucide-react";
import { cn } from "../lib/utils";
import { useSidebar } from "../lib/sidebar-context";
import { PICKUPS, type PickupStatus } from "../data/pickups";
import { CarrierTile } from "../components/CarrierTile";

// ─── Status config (mirrors Pickups.tsx) ──────────────────────────────────────

const PICKUP_STATUS_CONFIG: Record<PickupStatus, {
  progress: number;
  barColor: string;
  badgeBg: string;
  badgeText: string;
  icon: React.ReactNode;
}> = {
  "Scheduled":       { progress: 20,  barColor: "bg-blue-400",   badgeBg: "bg-blue-50",   badgeText: "text-blue-600",   icon: <Calendar size={12} />      },
  "Driver Assigned": { progress: 40,  barColor: "bg-green-500",  badgeBg: "bg-green-50",  badgeText: "text-green-700",  icon: <CalendarCheck size={12} /> },
  "En Route":        { progress: 60,  barColor: "bg-green-500",  badgeBg: "bg-teal-50",   badgeText: "text-teal-700",   icon: <Truck size={12} />         },
  "Picked Up":       { progress: 78,  barColor: "bg-purple-500", badgeBg: "bg-purple-50", badgeText: "text-purple-700", icon: <PackageCheck size={12} />  },
  "Dropped Off":     { progress: 100, barColor: "bg-orange-400", badgeBg: "bg-orange-50", badgeText: "text-orange-700", icon: <CircleCheck size={12} />   },
  "Cancelled":       { progress: 100, barColor: "bg-gray-300",   badgeBg: "bg-gray-100",  badgeText: "text-gray-500",   icon: <XCircle size={12} />       },
};

// ─── Carrier shipment row status ──────────────────────────────────────────────

const CARRIER_STATUS_CONFIG: Record<string, { barColor: string; textColor: string; progress: number }> = {
  "In Transit":       { barColor: "bg-green-500",  textColor: "text-gray-600",    progress: 65  },
  "Error":            { barColor: "bg-red-500",    textColor: "text-red-600",     progress: 100 },
  "Cancelled":        { barColor: "bg-gray-300",   textColor: "text-gray-400",    progress: 100 },
  "Delivered":        { barColor: "bg-green-500",  textColor: "text-gray-600",    progress: 100 },
  "Return to Sender": { barColor: "bg-orange-400", textColor: "text-orange-600",  progress: 60  },
};

// ─── Static mock data for detail view ────────────────────────────────────────

const MOCK_EXTRA = {
  weight: "28.00 lbs",
  dimensions: "11.00w x 14.00l x 4.00h in",
  sortingCenter: "Bay Area Sam\n939 La Mesa Ter\nSunnyvale, CA 94086-1707\n(732) 673-9846",
  shipperName: "Jane Smith\n(555) 555-5555",
  pickupCreated: "April 5, 2026 at 2:39 pm",
  pickupInstructions:
    "Please pull up to Dock #5. Please contact Jane Smith upon arrival 555-555-55555",
  dropoffInstructions:
    "Back into door #6. This is a sortation stop. Items will be unloaded off the sprinter and then loaded back on after receiving scans. Please call John Smith if needed 333-333-3333",
};

const TRACKING_EVENTS = [
  { event: "Dropped off at sorting center", sub: "This shipment has been delivered.", date: "March 24 at 4:05 pm", seeMore: false },
  { event: "In transit to sorting center",  sub: "Los Angeles, CA 92376",             date: null,                   seeMore: true  },
  { event: "Pick up arrived",               sub: null,                                 date: "March 18 at 4:00 pm",  seeMore: false },
  { event: "Pickup en route",               sub: null,                                 date: "March 18 at 4:00 pm",  seeMore: false },
  { event: "Driver assigned",               sub: null,                                 date: "March 18 at 4:00 pm",  seeMore: false },
  { event: "Looking for driver",            sub: null,                                 date: "March 18 at 4:00 pm",  seeMore: false },
  { event: "Pickup created",                sub: null,                                 date: "March 18 at 4:00 pm",  seeMore: false },
];

const CARRIER_ROWS = [
  { carrier: "UPS",    tracking: "UUS5A62471982914608", service: "Standard",         cost: "$4.32", status: "In Transit",       created: "March 4 at 2:49pm", destination: "New York, NY"      },
  { carrier: "Veho",   tracking: "UUS5A62471982914608", service: "Premium Economy",  cost: "$4.32", status: "In Transit",       created: "March 4 at 2:49pm", destination: "Los Angeles, CA"   },
  { carrier: "USPS",   tracking: "UUS5A62471982914608", service: "Ground Advantage", cost: "$4.32", status: "In Transit",       created: "March 4 at 2:49pm", destination: "Atlanta, GA"       },
  { carrier: "OnTrac", tracking: "UUS5A62471982914608", service: "Ground",           cost: "$4.32", status: "Error",            created: "March 4 at 2:49pm", destination: "New York, NY"      },
  { carrier: "FedEx",  tracking: "UUS5A62471982914608", service: "Standard",         cost: "$4.32", status: "In Transit",       created: "March 4 at 2:49pm", destination: "San Francisco, CA" },
  { carrier: "UniUni", tracking: "UUS5A62471982914608", service: "Standard",         cost: "$4.32", status: "Cancelled",        created: "March 4 at 2:49pm", destination: "New York, NY"      },
  { carrier: "UPS",    tracking: "UUS5A62471982914608", service: "Premium Economy",  cost: "$4.32", status: "Delivered",        created: "March 4 at 2:49pm", destination: "Los Angeles, CA"   },
  { carrier: "USPS",   tracking: "UUS5A62471982914608", service: "Ground Advantage", cost: "$4.32", status: "Delivered",        created: "March 4 at 2:49pm", destination: "Atlanta, GA"       },
  { carrier: "FedEx",  tracking: "UUS5A62471982914608", service: "Standard",         cost: "$4.32", status: "Delivered",        created: "March 4 at 2:49pm", destination: "San Francisco, CA" },
  { carrier: "Veho",   tracking: "UUS5A62471982914608", service: "Premium Economy",  cost: "$4.32", status: "Delivered",        created: "March 4 at 2:49pm", destination: "Los Angeles, CA"   },
  { carrier: "OnTrac", tracking: "UUS5A62471982914608", service: "Ground Advantage", cost: "$4.32", status: "Delivered",        created: "March 4 at 2:49pm", destination: "Atlanta, GA"       },
  { carrier: "UniUni", tracking: "UUS5A62471982914608", service: "Ground",           cost: "$4.32", status: "Return to Sender", created: "March 4 at 2:49pm", destination: "New York, NY"      },
];

// ─── Detail label/value pair ──────────────────────────────────────────────────

function DetailField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] font-semibold tracking-wider text-[#0a0a0a]/40 uppercase mb-1">{label}</p>
      <p className="text-sm text-[#0a0a0a] whitespace-pre-line leading-snug">{value}</p>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function PickupDetail() {
  const { id } = useParams<{ id: string }>();
  const { toggle: toggleSidebar } = useSidebar();

  const pickup = PICKUPS.find((p) => p.id === id);

  if (!pickup) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-2">
        <p className="text-base font-semibold text-[#0a0a0a]">Pickup not found</p>
        <Link to="/pickups" className="text-sm text-[#E8480C] hover:underline">← Back to Pickups</Link>
      </div>
    );
  }

  const statusCfg = PICKUP_STATUS_CONFIG[pickup.status];

  return (
    <div className="flex flex-col h-full overflow-auto bg-white">

      {/* ── Header ── */}
      <div className="flex items-center px-4 h-16 border-b border-[#e5e5de] shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={toggleSidebar}
            className="p-1.5 rounded-md hover:bg-[#f3f3ed] text-[#0a0a0a]/40 hover:text-[#0a0a0a] transition-colors"
          >
            <PanelLeft size={16} />
          </button>
          <div className="w-px h-4 bg-[#e5e5de]" />
          <nav className="flex items-center gap-1.5">
            <Link
              to="/pickups"
              className="text-sm text-[#0a0a0a]/50 hover:text-[#0a0a0a] transition-colors"
            >
              Pickups
            </Link>
            <ChevronRight size={14} className="text-[#0a0a0a]/30" />
            <span className="text-sm font-semibold text-[#0a0a0a]">{pickup.pickupId}</span>
          </nav>
        </div>
      </div>

      {/* ── Page content ── */}
      <div className="flex-1 px-6 py-6 overflow-auto">

        {/* Title row + CTAs */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-[#0a0a0a]">{pickup.pickupId}</h1>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 h-9 px-4 rounded-lg bg-[#E8480C] text-white text-sm font-medium hover:bg-[#d03f09] transition-colors">
              <Printer size={14} />
              Print BOL
            </button>
            <button className="flex items-center gap-2 h-9 px-4 rounded-lg border border-[#e5e5de] bg-white text-sm font-medium text-[#0a0a0a] hover:bg-[#f3f3ed] transition-colors">
              <TriangleAlert size={14} />
              Submit Claim
            </button>
            <button className="w-9 h-9 rounded-lg border border-[#e5e5de] bg-white flex items-center justify-center text-[#0a0a0a]/50 hover:bg-[#f3f3ed] transition-colors">
              <MoreHorizontal size={16} />
            </button>
          </div>
        </div>

        {/* Two-column layout */}
        <div className="flex gap-6 items-start">

          {/* ── Left: main content ── */}
          <div className="flex-1 min-w-0 space-y-4">

            {/* Tracking card */}
            <div className="border border-[#e5e5de] rounded-xl overflow-hidden">
              <div className="px-6 pt-6 pb-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#f3f3ed] border border-[#e5e5de] flex items-center justify-center shrink-0">
                    <Calendar size={18} className="text-[#E8480C]" />
                  </div>
                  <div>
                    <p className="text-base font-semibold text-[#0a0a0a]">{pickup.date}</p>
                    <p className="text-sm text-[#0a0a0a]/60 mt-0.5">{pickup.statusDetail}</p>
                  </div>
                </div>
                <span className={cn(
                  "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium shrink-0",
                  statusCfg.badgeBg, statusCfg.badgeText,
                )}>
                  {statusCfg.icon}
                  {pickup.status}
                </span>
              </div>
              <div className="px-6 pb-5">
                <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={cn("h-full rounded-full", statusCfg.barColor)}
                    style={{ width: `${statusCfg.progress}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Map + Tracking History */}
            <div className="border border-[#e5e5de] rounded-xl overflow-hidden">
              {/* Map */}
              <div className="w-full h-[260px] bg-[#e8ecef] overflow-hidden relative">
                <iframe
                  title="Pickup location map"
                  src="https://www.openstreetmap.org/export/embed.html?bbox=-74.05,40.68,-73.87,40.84&layer=mapnik"
                  className="w-full h-full border-0"
                  style={{ pointerEvents: "none" }}
                />
              </div>

              {/* Tracking History */}
              <div className="px-6 py-5">
                <h3 className="text-base font-semibold text-[#0a0a0a] mb-5">Pickup Tracking History</h3>
                <div className="space-y-4">
                  {TRACKING_EVENTS.map((ev, i) => (
                    <div key={i}>
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-sm font-medium text-[#0a0a0a]">{ev.event}</p>
                          {ev.sub && (
                            <p className="text-xs text-[#0a0a0a]/50 mt-0.5">{ev.sub}</p>
                          )}
                        </div>
                        <div className="shrink-0">
                          {ev.date && (
                            <p className="text-sm text-[#0a0a0a]/50 whitespace-nowrap">{ev.date}</p>
                          )}
                          {ev.seeMore && (
                            <button className="text-sm text-[#E8480C] font-medium hover:underline whitespace-nowrap">
                              See 14 More Updates
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Instructions */}
            <div className="border border-[#e5e5de] rounded-xl px-6 py-5">
              <h3 className="text-base font-semibold text-[#0a0a0a] mb-4">Instructions</h3>
              <div className="space-y-2">
                <p className="text-sm text-[#0a0a0a]/80">
                  <span className="font-semibold text-[#0a0a0a]">Pickup Instructions:</span>{" "}
                  {MOCK_EXTRA.pickupInstructions}
                </p>
                <p className="text-sm text-[#0a0a0a]/80">
                  <span className="font-semibold text-[#0a0a0a]">Drop-off Instructions:</span>{" "}
                  {MOCK_EXTRA.dropoffInstructions}
                </p>
              </div>
            </div>

            {/* Proof of Delivery */}
            <div className="border border-[#e5e5de] rounded-xl px-6 py-5">
              <h3 className="text-base font-semibold text-[#0a0a0a] mb-4">Proof of Delivery/Pickup</h3>
              <div className="flex gap-3">
                {[0, 1].map((i) => (
                  <div
                    key={i}
                    className="w-[100px] h-[100px] rounded-xl bg-[#f3f3ed] border border-[#e5e5de] flex items-center justify-center shrink-0"
                  >
                    <Package size={28} className="text-[#0a0a0a]/20" />
                  </div>
                ))}
              </div>
            </div>

            {/* Carrier Tracking Table */}
            <div className="border border-[#e5e5de] rounded-xl overflow-hidden">
              {/* Header row */}
              <div
                className="grid items-center bg-white border-b border-[#e5e5de] px-4 py-3"
                style={{ gridTemplateColumns: "2fr 0.8fr 1.4fr 1.4fr 1.2fr 40px" }}
              >
                {["CARRIER TRACKING #", "LABEL COST", "STATUS", "LABEL CREATED", "DESTINATION", ""].map((col) => (
                  <div key={col} className="px-2">
                    <p className="text-[10px] font-semibold tracking-wider text-[#0a0a0a]/40 uppercase">{col}</p>
                  </div>
                ))}
              </div>

              {/* Data rows */}
              {CARRIER_ROWS.map((row, i) => {
                const sCfg = CARRIER_STATUS_CONFIG[row.status] ?? CARRIER_STATUS_CONFIG["In Transit"];
                return (
                  <div
                    key={i}
                    className={cn(
                      "grid items-center px-4 py-4",
                      i < CARRIER_ROWS.length - 1 && "border-b border-[#e5e5de]",
                    )}
                    style={{ gridTemplateColumns: "2fr 0.8fr 1.4fr 1.4fr 1.2fr 40px" }}
                  >
                    {/* Carrier tile + tracking # */}
                    <div className="flex items-center gap-3 px-2">
                      <CarrierTile carrier={row.carrier} size="sm" />
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-[#0a0a0a] truncate">{row.tracking}</p>
                        <p className="text-xs text-[#0a0a0a]/50">{row.service}</p>
                      </div>
                    </div>

                    {/* Label cost */}
                    <div className="px-2">
                      <p className="text-sm text-[#0a0a0a]">{row.cost}</p>
                    </div>

                    {/* Status w/ progress bar */}
                    <div className="px-2">
                      <div className="w-full max-w-[110px] h-1.5 bg-gray-100 rounded-full overflow-hidden mb-1.5">
                        <div
                          className={cn("h-full rounded-full", sCfg.barColor)}
                          style={{ width: `${sCfg.progress}%` }}
                        />
                      </div>
                      <p className={cn("text-xs", sCfg.textColor)}>{row.status}</p>
                    </div>

                    {/* Label created */}
                    <div className="px-2">
                      <p className="text-sm text-[#0a0a0a]/60">{row.created}</p>
                    </div>

                    {/* Destination */}
                    <div className="px-2">
                      <p className="text-sm text-[#0a0a0a]/60">{row.destination}</p>
                    </div>

                    {/* Ellipsis */}
                    <div className="flex items-center justify-center">
                      <button className="w-8 h-8 rounded-lg flex items-center justify-center text-[#0a0a0a]/40 hover:bg-[#f3f3ed] hover:text-[#0a0a0a] transition-colors">
                        <MoreVertical size={15} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>

          {/* ── Right: Pickup Details sidebar ── */}
          <div className="w-80 shrink-0 sticky top-0">
            <div className="border border-[#e5e5de] rounded-xl p-6">

              {/* Card header */}
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-amber-50 border border-amber-100 flex items-center justify-center shrink-0">
                  <Package size={18} className="text-amber-500" />
                </div>
                <p className="text-base font-semibold text-[#0a0a0a]">Pickup Details</p>
              </div>

              {/* Total Cost */}
              <div className="mb-5">
                <p className="text-[10px] font-semibold tracking-wider text-[#0a0a0a]/40 uppercase mb-1">Total Cost</p>
                <p className="text-2xl font-bold text-[#0a0a0a]">{pickup.cost}</p>
              </div>

              <div className="border-t border-[#e5e5de] mb-4" />

              {/* Items / Weight / Dimensions */}
              <div className="space-y-3 mb-4">
                <DetailField label="Items" value={String(pickup.items)} />
                <DetailField label="Weight" value={MOCK_EXTRA.weight} />
                <DetailField label="Dimensions" value={MOCK_EXTRA.dimensions} />
              </div>

              <div className="border-t border-[#e5e5de] mb-4" />

              {/* Sorting Center */}
              <div className="mb-4">
                <DetailField label="Sorting Center" value={MOCK_EXTRA.sortingCenter} />
              </div>

              <div className="border-t border-[#e5e5de] mb-4" />

              {/* Shipper + Created */}
              <div className="space-y-3 mb-5">
                <DetailField label="Shipper Name" value={MOCK_EXTRA.shipperName} />
                <DetailField label="Pickup Created" value={MOCK_EXTRA.pickupCreated} />
              </div>

              <button className="text-sm text-[#E8480C] font-medium hover:underline">
                Edit Details
              </button>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
