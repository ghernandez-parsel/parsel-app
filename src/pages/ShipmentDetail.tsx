import { useParams, useNavigate, Link } from "react-router-dom";
import {
  PanelLeft,
  ChevronRight,
  Copy,
  Printer,
  TriangleAlert,
  MoreHorizontal,
  CalendarCheck,
  ShieldCheck,
  MapPin,
  Package,
} from "lucide-react";
import { cn } from "../lib/utils";
import { useSidebar } from "../lib/sidebar-context";
import { SHIPMENTS, type ShipmentStatus } from "../data/shipments";
import { CarrierTile } from "../components/CarrierTile";

// ─── Status config ─────────────────────────────────────────────────────────────

interface StatusConfig {
  progress: number;            // 0-100
  barColor: string;            // tailwind bg-* class
  primaryCta: { label: string; icon?: React.ReactNode } | null;
  showPrintLabel: boolean;
  showSubmitClaim: boolean;
}

function getStatusConfig(status: ShipmentStatus): StatusConfig {
  switch (status) {
    case "Label Created":
      return { progress: 4,   barColor: "bg-green-500",  primaryCta: { label: "Schedule Pickup", icon: <CalendarCheck size={14} /> }, showPrintLabel: true,  showSubmitClaim: true  };
    case "Pickup Assigned":
      return { progress: 10,  barColor: "bg-green-500",  primaryCta: null,                                                             showPrintLabel: true,  showSubmitClaim: true  };
    case "Picked Up":
      return { progress: 25,  barColor: "bg-green-500",  primaryCta: null,                                                             showPrintLabel: true,  showSubmitClaim: true  };
    case "In Transit":
      return { progress: 55,  barColor: "bg-green-500",  primaryCta: null,                                                             showPrintLabel: true,  showSubmitClaim: true  };
    case "Out for Delivery":
      return { progress: 82,  barColor: "bg-green-500",  primaryCta: null,                                                             showPrintLabel: true,  showSubmitClaim: true  };
    case "Delivered":
      return { progress: 100, barColor: "bg-green-500",  primaryCta: null,                                                             showPrintLabel: true,  showSubmitClaim: true  };
    case "Cancelled":
      return { progress: 100, barColor: "bg-gray-400",   primaryCta: null,                                                             showPrintLabel: true,  showSubmitClaim: true  };
    case "Return to Sender":
      return { progress: 60,  barColor: "bg-orange-400", primaryCta: { label: "Submit Claim", icon: <TriangleAlert size={14} /> },     showPrintLabel: false, showSubmitClaim: false  };
    case "Damaged":
      return { progress: 60,  barColor: "bg-red-500",    primaryCta: { label: "Submit Claim", icon: <TriangleAlert size={14} /> },     showPrintLabel: false, showSubmitClaim: true   };
  }
}

// ─── Progress Bar ─────────────────────────────────────────────────────────────

function TrackingProgressBar({ progress, barColor }: { progress: number; barColor: string }) {
  return (
    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
      <div
        className={cn("h-full rounded-full transition-all duration-500", barColor)}
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}

// ─── Tracking History Row ─────────────────────────────────────────────────────

function TrackingRow({ event, isFirst }: { event: { label: string; description?: string; timestamp?: string; hasMoreLink?: boolean }; isFirst: boolean }) {
  return (
    <div className={cn("flex items-start justify-between py-3", !isFirst && "border-t border-[#f0f0ea]")}>
      <div className="flex flex-col gap-0.5">
        <span className={cn("text-sm font-medium text-[#0a0a0a]", isFirst && "font-semibold")}>{event.label}</span>
        {event.description && (
          <span className="text-sm text-[#0a0a0a]/60">{event.description}</span>
        )}
      </div>
      <div className="flex items-center gap-3 shrink-0 ml-4">
        {event.hasMoreLink && (
          <button className="text-sm text-[#0a0a0a]/50 underline underline-offset-2 hover:text-[#0a0a0a] whitespace-nowrap">
            See 14 More Updates
          </button>
        )}
        {event.timestamp && (
          <span className="text-sm text-[#0a0a0a]/50 whitespace-nowrap">{event.timestamp}</span>
        )}
      </div>
    </div>
  );
}

// ─── Order Item Card ──────────────────────────────────────────────────────────

function OrderItemCard({ item }: { item: { name: string; weight: string; units: string } }) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-lg border border-[#f0f0ea] bg-[#fafaf8]">
      <div className="w-16 h-16 rounded-md bg-[#f0f0ea] flex items-center justify-center shrink-0">
        <Package size={20} className="text-[#0a0a0a]/30" />
      </div>
      <div className="flex flex-col gap-1">
        <span className="text-sm font-medium text-[#0a0a0a]">{item.name}</span>
        <span className="text-xs text-[#0a0a0a]/50">{item.weight}</span>
        <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-[#f0f0ea] text-xs text-[#0a0a0a]/70 w-fit">
          {item.units}
        </span>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export function ShipmentDetail() {
  const { toggle: toggleSidebar } = useSidebar();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const shipment = SHIPMENTS.find((s) => s.id === id);

  if (!shipment) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-3">
        <p className="text-lg font-semibold text-[#0a0a0a]">Shipment not found</p>
        <button onClick={() => navigate("/shipments")} className="text-sm text-[#E8480C] underline">
          Back to Shipments
        </button>
      </div>
    );
  }

  const config = getStatusConfig(shipment.status);

  return (
    <div className="flex flex-col h-full overflow-auto bg-white">
      {/* ── Header bar ── */}
      <div className="flex items-center justify-between px-6 h-16 border-b border-[#e5e5de] shrink-0">
        {/* Left: breadcrumb */}
        <div className="flex items-center gap-3">
          <button onClick={toggleSidebar} className="p-1.5 rounded-md hover:bg-[#f3f3ed] text-[#0a0a0a]/40 hover:text-[#0a0a0a] transition-colors">
            <PanelLeft size={16} />
          </button>
          <div className="w-px h-4 bg-[#e5e5de]" />
          <nav className="flex items-center gap-1 text-sm">
            <Link to="/shipments" className="text-[#0a0a0a]/50 hover:text-[#0a0a0a] transition-colors">
              Shipments
            </Link>
            <ChevronRight size={14} className="text-[#0a0a0a]/30" />
            <span className="text-[#0a0a0a] font-medium">{shipment.trackingNumber}</span>
          </nav>
        </div>
      </div>

      {/* ── Body ── */}
      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-[1200px] mx-auto flex flex-col gap-6">

          {/* ── Page title row ── */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CarrierTile carrier={shipment.carrier} size="md" />
              <h1 className="text-2xl font-semibold text-[#0a0a0a]">{shipment.trackingNumber}</h1>
              <button
                onClick={() => navigator.clipboard.writeText(shipment.trackingNumber)}
                className="p-1.5 rounded-md hover:bg-[#f3f3ed] text-[#0a0a0a]/40 hover:text-[#0a0a0a] transition-colors"
                title="Copy tracking number"
              >
                <Copy size={15} />
              </button>
            </div>

            {/* CTAs */}
            <div className="flex items-center gap-2">
              {config.primaryCta && (
                <button className="flex items-center gap-1.5 h-9 px-4 rounded-lg bg-[#E8480C] text-white text-sm font-medium hover:bg-[#d03e0a] transition-colors">
                  {config.primaryCta.icon}
                  {config.primaryCta.label}
                </button>
              )}
              {config.showPrintLabel && (
                <button className="flex items-center gap-1.5 h-9 px-4 rounded-lg border border-[#e5e5de] bg-white text-sm text-[#0a0a0a] hover:bg-[#f3f3ed] transition-colors">
                  <Printer size={14} className="text-[#0a0a0a]/60" />
                  Print Label
                </button>
              )}
              {config.showSubmitClaim && (
                <button className="flex items-center gap-1.5 h-9 px-4 rounded-lg border border-[#e5e5de] bg-white text-sm text-[#0a0a0a] hover:bg-[#f3f3ed] transition-colors">
                  <TriangleAlert size={14} className="text-[#0a0a0a]/60" />
                  Submit Claim
                </button>
              )}
              <button className="flex items-center justify-center w-9 h-9 rounded-lg border border-[#e5e5de] bg-white hover:bg-[#f3f3ed] transition-colors">
                <MoreHorizontal size={16} className="text-[#0a0a0a]/60" />
              </button>
            </div>
          </div>

          {/* ── Two-column layout ── */}
          <div className="flex gap-6 items-start">

            {/* ── Left column ── */}
            <div className="flex-1 flex flex-col gap-4 min-w-0">

              {/* Tracking Card */}
              <div className="border border-[#e5e5de] rounded-xl p-6 bg-white">
                {/* Status headline */}
                <div className="flex items-center gap-2 mb-4">
                  <Package size={16} className="text-[#E8480C]" />
                  <span className="text-base font-semibold text-[#0a0a0a]">{shipment.statusHeadline}</span>
                </div>

                {/* Progress bar */}
                <TrackingProgressBar progress={config.progress} barColor={config.barColor} />

                {/* Tracking History */}
                <div className="mt-5">
                  <h3 className="text-sm font-semibold text-[#0a0a0a] mb-1">Tracking History</h3>
                  <div>
                    {shipment.trackingHistory.map((event, i) => (
                      <TrackingRow key={i} event={event} isFirst={i === 0} />
                    ))}
                  </div>
                </div>
              </div>

              {/* Order Items Card */}
              <div className="border border-[#e5e5de] rounded-xl p-6 bg-white">
                <div className="flex items-center gap-2 mb-4">
                  <MapPin size={16} className="text-[#E8480C]" />
                  <Link
                    to="#"
                    className="text-base font-semibold text-[#0a0a0a] underline underline-offset-2 hover:text-[#E8480C] transition-colors"
                  >
                    Order {shipment.order}
                  </Link>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {shipment.orderItems.map((item, i) => (
                    <OrderItemCard key={i} item={item} />
                  ))}
                </div>
              </div>
            </div>

            {/* ── Right column: Shipment Details ── */}
            <div className="w-[260px] shrink-0">
              <div className="border border-[#e5e5de] rounded-xl p-5 bg-white">
                <div className="flex items-center gap-2 mb-4">
                  <ShieldCheck size={16} className="text-[#E8480C]" />
                  <h2 className="text-sm font-semibold text-[#0a0a0a]">Shipment Details</h2>
                </div>

                {/* Price */}
                <p className="text-2xl font-bold text-[#0a0a0a] mb-3">{shipment.price}</p>

                {/* Badges */}
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="flex items-center gap-1 px-2.5 py-1 rounded-full border border-blue-200 bg-blue-50 text-xs text-blue-700 font-medium">
                    <ShieldCheck size={11} />
                    Shipping Protection
                  </span>
                  <span className="flex items-center gap-1 px-2.5 py-1 rounded-full border border-green-200 bg-green-50 text-xs text-green-700 font-medium">
                    <MapPin size={11} />
                    Verified Address
                  </span>
                </div>

                <div className="space-y-3 text-sm">
                  <DetailRow label="Carrier" value={shipment.carrierFull} />
                  <DetailRow label="Weight" value={shipment.weight} />
                  <DetailRow label="Dimensions" value={shipment.dimensions} />

                  {/* Address */}
                  <div>
                    <p className="text-[#0a0a0a]/50 mb-0.5 text-xs font-medium uppercase tracking-wide">Shipping Address</p>
                    <p className="text-[#0a0a0a] leading-snug">
                      {shipment.recipientName}<br />
                      {shipment.address}<br />
                      {shipment.city}
                    </p>
                  </div>

                  <DetailRow label="Phone" value={shipment.phone} />
                  <DetailRow label="Created" value={shipment.created} />

                  <button className="text-sm text-[#E8480C] font-medium hover:underline pt-1">
                    Edit Details
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Helper ───────────────────────────────────────────────────────────────────

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[#0a0a0a]/50 text-xs font-medium uppercase tracking-wide mb-0.5">{label}</p>
      <p className="text-[#0a0a0a]">{value}</p>
    </div>
  );
}
