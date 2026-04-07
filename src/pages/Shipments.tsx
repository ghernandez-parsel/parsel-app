import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Package,
  Smile,
  History,
  CircleDollarSign,
  DoorOpen,
  Home,
  TriangleAlert,
  Search,
  Route,
  Truck,
  Calendar,
  ChevronDown,
  EllipsisVertical,
  TrendingUp,
  PanelLeft,
} from "lucide-react";
import { cn } from "../lib/utils";
import { useSidebar } from "../lib/sidebar-context";
import { SHIPMENTS } from "../data/shipments";
import { CarrierTile } from "../components/CarrierTile";

// ─── Status display config ────────────────────────────────────────────────────

const STATUS_CONFIG: Record<string, { progress: number; color: string }> = {
  "Label Created":    { progress: 4,   color: "bg-gray-300"   },
  "Pickup Assigned":  { progress: 10,  color: "bg-green-500"  },
  "Picked Up":        { progress: 25,  color: "bg-green-500"  },
  "In Transit":       { progress: 55,  color: "bg-green-500"  },
  "Out for Delivery": { progress: 82,  color: "bg-green-500"  },
  "Delivered":        { progress: 100, color: "bg-green-500"  },
  "Cancelled":        { progress: 100, color: "bg-gray-400"   },
  "Return to Sender": { progress: 60,  color: "bg-orange-400" },
  "Damaged":          { progress: 60,  color: "bg-red-500"    },
  "Error":            { progress: 55,  color: "bg-red-500"    },
};

// ─── Status Bar ───────────────────────────────────────────────────────────────

function StatusBar({ status }: { status: string }) {
  const config = STATUS_CONFIG[status] ?? { progress: 0, color: "bg-gray-300" };
  return (
    <div className="flex flex-col gap-1">
      <div className="w-[100px] h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={cn("h-full rounded-full transition-all", config.color)}
          style={{ width: `${config.progress}%` }}
        />
      </div>
      <span className="text-xs text-[#0a0a0a]/60">{status}</span>
    </div>
  );
}

// ─── Stat Card ────────────────────────────────────────────────────────────────

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex-1 bg-white border border-[#e5e5de] rounded-xl p-6 flex flex-col gap-2 min-w-0">
      <div className="text-[#E8480C]">{icon}</div>
      <p className="text-sm text-[#0a0a0a]/60">{label}</p>
      <p className="text-2xl font-semibold text-[#0a0a0a]">{value}</p>
    </div>
  );
}

// ─── Action Card ─────────────────────────────────────────────────────────────

function ActionCard({ icon, label, count, trend, cta }: { icon: React.ReactNode; label: string; count: string; trend: string; cta: string }) {
  return (
    <div className="flex-1 bg-white border border-[#e5e5de] rounded-xl p-6 flex flex-col gap-1 min-w-0">
      <div className="flex items-center justify-between mb-1">
        <div className="text-[#E8480C]">{icon}</div>
        <span className="flex items-center gap-1 text-xs text-[#E8480C] font-medium">
          <TrendingUp size={12} />
          {trend}
        </span>
      </div>
      <p className="text-sm text-[#0a0a0a]/60">{label}</p>
      <p className="text-2xl font-semibold text-[#0a0a0a]">{count}</p>
      <button className="text-xs text-[#E8480C] font-medium text-left mt-2 hover:underline">{cta}</button>
    </div>
  );
}

// ─── Filter Dropdown ─────────────────────────────────────────────────────────

function FilterDropdown({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <button className="flex items-center gap-2 h-9 px-3 rounded-lg border border-[#e5e5de] bg-white text-sm text-[#0a0a0a] hover:bg-[#f8f8f4] transition-colors">
      <span className="text-[#0a0a0a]/50">{icon}</span>
      <span>{label}</span>
      <ChevronDown size={14} className="text-[#0a0a0a]/40" />
    </button>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export function Shipments() {
  const { toggle: toggleSidebar } = useSidebar();
  const [search, setSearch] = useState("");
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());

  const filtered = SHIPMENTS.filter(
    (s) =>
      s.trackingNumber.toLowerCase().includes(search.toLowerCase()) ||
      s.order.toLowerCase().includes(search.toLowerCase()) ||
      s.destination.toLowerCase().includes(search.toLowerCase())
  );

  const allSelected = selectedRows.size === filtered.length && filtered.length > 0;

  function toggleAll() {
    if (allSelected) setSelectedRows(new Set());
    else setSelectedRows(new Set(filtered.map((s) => s.id)));
  }

  function toggleRow(id: string) {
    const next = new Set(selectedRows);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedRows(next);
  }

  return (
    <div className="flex flex-col h-full overflow-auto bg-white">
      {/* Header */}
      <div className="flex items-center gap-3 px-6 h-16 border-b border-[#e5e5de] shrink-0">
        <button onClick={toggleSidebar} className="p-1.5 rounded-md hover:bg-[#f3f3ed] text-[#0a0a0a]/40 hover:text-[#0a0a0a] transition-colors">
          <PanelLeft size={16} />
        </button>
        <div className="w-px h-4 bg-[#e5e5de]" />
        <h1 className="text-sm font-semibold text-[#0a0a0a]">Shipments</h1>
      </div>

      {/* Body */}
      <div className="flex-1 p-6 space-y-8 overflow-auto">

        {/* Activity Overview */}
        <section>
          <h2 className="text-lg font-semibold text-[#0a0a0a] mb-4">Activity Overview</h2>
          <div className="flex gap-4">
            <StatCard icon={<Package size={16} />}          label="Total Shipments"   value="15"    />
            <StatCard icon={<Smile size={16} />}            label="Success Rate"      value="94.7%" />
            <StatCard icon={<History size={16} />}          label="Avg Delivery Time" value="2.3d"  />
            <StatCard icon={<CircleDollarSign size={16} />} label="Shipping Cost"     value="$4.2k" />
          </div>
        </section>

        {/* Action Required */}
        <section>
          <h2 className="text-lg font-semibold text-[#0a0a0a] mb-4">Action Required</h2>
          <div className="flex gap-4">
            <ActionCard icon={<DoorOpen size={16} />}      label="Access Issues"            count="3" trend="+1.2%" cta="View Shipments"   />
            <ActionCard icon={<Home size={16} />}          label="Address Issues"           count="2" trend="+1.6%" cta="Update Addresses" />
            <ActionCard icon={<TriangleAlert size={16} />} label="Lost, Damaged or Refused" count="3" trend="+2.3%" cta="Resolve Issues"   />
          </div>
        </section>

        {/* All Shipments Table */}
        <section>
          <h2 className="text-lg font-semibold text-[#0a0a0a] mb-4">All Shipments</h2>
          <div className="border border-[#e5e5de] rounded-xl overflow-hidden bg-white">

            {/* Search + Filters */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#e5e5de]">
              <div className="relative w-[400px]">
                <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#0a0a0a]/40" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search orders, tracking numbers, customers"
                  className="w-full h-10 pl-9 pr-4 rounded-lg border border-[#e5e5de] text-sm bg-white placeholder:text-[#0a0a0a]/40 focus:outline-none focus:ring-2 focus:ring-[#E8480C]/20 focus:border-[#E8480C]"
                />
              </div>
              <div className="flex items-center gap-2">
                <FilterDropdown icon={<Route size={14} />}    label="All Statuses" />
                <FilterDropdown icon={<Truck size={14} />}    label="Carriers"     />
                <FilterDropdown icon={<Calendar size={14} />} label="Date Range"   />
              </div>
            </div>

            {/* Table */}
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#e5e5de] bg-[#fafaf8]">
                  <th className="w-14 py-3 text-left">
                    <div className="flex justify-center">
                      <input type="checkbox" checked={allSelected} onChange={toggleAll}
                        className="w-4 h-4 rounded border-[#e5e5de] accent-[#E8480C] cursor-pointer" />
                    </div>
                  </th>
                  <th className="py-3 px-2 text-left text-[10px] font-semibold tracking-wider text-[#0a0a0a]/50 uppercase">Carrier Tracking #</th>
                  <th className="py-3 px-2 text-left text-[10px] font-semibold tracking-wider text-[#0a0a0a]/50 uppercase w-32">Order</th>
                  <th className="py-3 px-2 text-left text-[10px] font-semibold tracking-wider text-[#0a0a0a]/50 uppercase w-44">Status</th>
                  <th className="py-3 px-2 text-left text-[10px] font-semibold tracking-wider text-[#0a0a0a]/50 uppercase w-44">Label Created</th>
                  <th className="py-3 px-2 text-left text-[10px] font-semibold tracking-wider text-[#0a0a0a]/50 uppercase w-36">Destination</th>
                  <th className="py-3 px-2 w-12" />
                </tr>
              </thead>
              <tbody>
                {filtered.map((shipment) => (
                  <tr
                    key={shipment.id}
                    className={cn(
                      "border-b border-[#e5e5de] last:border-0 hover:bg-[#fafaf8] transition-colors",
                      selectedRows.has(shipment.id) && "bg-[#fff9f7]"
                    )}
                  >
                    {/* Checkbox */}
                    <td className="py-5 w-14">
                      <div className="flex justify-center">
                        <input type="checkbox" checked={selectedRows.has(shipment.id)} onChange={() => toggleRow(shipment.id)}
                          className="w-4 h-4 rounded border-[#e5e5de] accent-[#E8480C] cursor-pointer" />
                      </div>
                    </td>

                    {/* Carrier + Tracking — clickable link to detail */}
                    <td className="py-5 px-2">
                      <Link to={`/shipments/${shipment.id}`} className="flex items-center gap-3 group">
                        <CarrierTile carrier={shipment.carrier} />
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-[#0a0a0a] group-hover:text-[#E8480C] transition-colors underline-offset-2 group-hover:underline">
                            {shipment.trackingNumber}
                          </span>
                          <span className="text-xs text-[#0a0a0a]/50">{shipment.serviceLevel}</span>
                        </div>
                      </Link>
                    </td>

                    {/* Order */}
                    <td className="py-5 px-2 w-32">
                      <span className="text-sm font-medium text-[#E8480C]">{shipment.order}</span>
                    </td>

                    {/* Status */}
                    <td className="py-5 px-2 w-44">
                      <StatusBar status={shipment.status} />
                    </td>

                    {/* Label Created */}
                    <td className="py-5 px-2 w-44">
                      <span className="text-sm text-[#0a0a0a]/70">{shipment.labelCreated}</span>
                    </td>

                    {/* Destination */}
                    <td className="py-5 px-2 w-36">
                      <span className="text-sm text-[#0a0a0a]/70">{shipment.destination}</span>
                    </td>

                    {/* Actions */}
                    <td className="py-5 px-2 w-12">
                      <button className="p-1.5 rounded-md hover:bg-[#f3f3ed] text-[#0a0a0a]/40 hover:text-[#0a0a0a] transition-colors">
                        <EllipsisVertical size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Footer */}
            <div className="flex items-center justify-between px-6 py-4 border-t border-[#e5e5de] bg-[#fafaf8]">
              <span className="text-sm text-[#0a0a0a]/50">
                {selectedRows.size} of {filtered.length} row(s) selected.
              </span>
              <div className="flex items-center gap-2">
                <button className="h-9 px-4 rounded-lg border border-[#e5e5de] bg-white text-sm text-[#0a0a0a] hover:bg-[#f3f3ed] transition-colors">Previous</button>
                <button className="h-9 px-4 rounded-lg border border-[#e5e5de] bg-white text-sm text-[#0a0a0a] hover:bg-[#f3f3ed] transition-colors">Next</button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
