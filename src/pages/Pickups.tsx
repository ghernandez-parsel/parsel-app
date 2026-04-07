import { useState, useRef, useEffect } from "react";
import {
  Search,
  ChevronDown,
  Truck,
  Calendar,
  ListFilter,
  PackageCheck,
  Clock,
  DollarSign,
  PanelLeft,
  CalendarPlus,
  X,
  Check,
} from "lucide-react";
import { cn } from "../lib/utils";
import { PICKUPS, type PickupStatus } from "../data/pickups";

// ─── Constants ────────────────────────────────────────────────────────────────

const ALL_STATUSES: PickupStatus[] = [
  "Scheduled",
  "Assigned",
  "En Route",
  "Picked Up",
  "Dropped Off",
  "Cancelled",
];

const ALL_CARRIERS = ["UPS", "FedEx", "USPS", "Veho", "OnTrac", "UniUni", "DoorDash"];

const DATE_RANGES = [
  { label: "Today",       value: "today"   },
  { label: "Yesterday",   value: "yesterday" },
  { label: "Last 7 days", value: "7days"   },
  { label: "Last 30 days",value: "30days"  },
  { label: "This month",  value: "month"   },
];

// ─── Status config ────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<PickupStatus, {
  progress: number;
  barColor: string;
  badgeBg: string;
  badgeText: string;
  badgeDot: string;
}> = {
  "Scheduled":  { progress: 15,  barColor: "bg-green-500",  badgeBg: "bg-green-50",   badgeText: "text-green-700",  badgeDot: "bg-green-500"  },
  "Assigned":   { progress: 35,  barColor: "bg-green-500",  badgeBg: "bg-green-50",   badgeText: "text-green-700",  badgeDot: "bg-green-500"  },
  "En Route":   { progress: 60,  barColor: "bg-green-500",  badgeBg: "bg-teal-50",    badgeText: "text-teal-700",   badgeDot: "bg-teal-500"   },
  "Picked Up":  { progress: 80,  barColor: "bg-green-500",  badgeBg: "bg-green-50",   badgeText: "text-green-700",  badgeDot: "bg-green-500"  },
  "Dropped Off":{ progress: 100, barColor: "bg-green-500",  badgeBg: "bg-green-50",   badgeText: "text-green-700",  badgeDot: "bg-green-500"  },
  "Cancelled":  { progress: 100, barColor: "bg-gray-300",   badgeBg: "bg-gray-100",   badgeText: "text-gray-500",   badgeDot: "bg-gray-400"   },
};

// ─── Date range filtering ─────────────────────────────────────────────────────

function isInRange(dateISO: string, range: string): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const d = new Date(dateISO + "T00:00:00");

  if (range === "today") {
    return d.getTime() === today.getTime();
  }
  if (range === "yesterday") {
    const y = new Date(today); y.setDate(y.getDate() - 1);
    return d.getTime() === y.getTime();
  }
  if (range === "7days") {
    const past = new Date(today); past.setDate(past.getDate() - 6);
    return d >= past && d <= today;
  }
  if (range === "30days") {
    const past = new Date(today); past.setDate(past.getDate() - 29);
    return d >= past && d <= today;
  }
  if (range === "month") {
    return (
      d.getFullYear() === today.getFullYear() &&
      d.getMonth() === today.getMonth()
    );
  }
  return true;
}

// ─── Stat Card ────────────────────────────────────────────────────────────────

function StatCard({
  icon, label, value,
}: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex-1 bg-white border border-[#e5e5de] rounded-xl p-6 flex flex-col gap-2 min-w-0">
      <div className="text-[#E8480C]">{icon}</div>
      <p className="text-sm text-[#0a0a0a]/60">{label}</p>
      <p className="text-2xl font-semibold text-[#0a0a0a]">{value}</p>
    </div>
  );
}

// ─── Status Badge ─────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: PickupStatus }) {
  const cfg = STATUS_CONFIG[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium",
        cfg.badgeBg,
        cfg.badgeText,
      )}
    >
      <span className={cn("w-1.5 h-1.5 rounded-full shrink-0", cfg.badgeDot)} />
      {status}
    </span>
  );
}

// ─── Progress Bar ─────────────────────────────────────────────────────────────

function ProgressBar({ status }: { status: PickupStatus }) {
  const cfg = STATUS_CONFIG[status];
  return (
    <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
      <div
        className={cn("h-full rounded-full transition-all", cfg.barColor)}
        style={{ width: `${cfg.progress}%` }}
      />
    </div>
  );
}

// ─── Pickup Card ─────────────────────────────────────────────────────────────

function PickupCard({ pickup }: { pickup: typeof PICKUPS[0] }) {
  const canContactDriver =
    pickup.status === "Assigned" ||
    pickup.status === "En Route" ||
    pickup.status === "Picked Up";

  return (
    <div className="bg-white border border-[#e5e5de] rounded-xl p-5 flex flex-col gap-4 shadow-sm">
      {/* Top row */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          {/* Generic truck icon — each pickup is a batch of multiple carriers */}
          <div className="w-10 h-10 rounded-lg bg-[#f3f3ed] border border-[#e5e5de] flex items-center justify-center shrink-0">
            <Truck size={18} className="text-[#0a0a0a]/50" />
          </div>
          <div>
            <p className="text-sm font-semibold text-[#0a0a0a]">{pickup.date}</p>
            <p className="text-xs text-[#0a0a0a]/60">{pickup.statusDetail}</p>
          </div>
        </div>
        <StatusBadge status={pickup.status} />
      </div>

      {/* Progress bar */}
      <ProgressBar status={pickup.status} />

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div>
          <p className="text-[10px] font-semibold tracking-wider text-[#0a0a0a]/40 uppercase mb-1">Items</p>
          <p className="text-sm font-medium text-[#0a0a0a]">{pickup.items}</p>
        </div>
        <div>
          <p className="text-[10px] font-semibold tracking-wider text-[#0a0a0a]/40 uppercase mb-1">Cost</p>
          <p className="text-sm font-medium text-[#0a0a0a]">{pickup.cost}</p>
        </div>
        <div>
          <p className="text-[10px] font-semibold tracking-wider text-[#0a0a0a]/40 uppercase mb-1">Destination</p>
          <p className="text-sm font-medium text-[#0a0a0a] leading-tight">{pickup.destination}</p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 flex-wrap">
        <button className="h-8 px-3 rounded-lg border border-[#e5e5de] bg-white text-xs font-medium text-[#0a0a0a] hover:bg-[#f3f3ed] transition-colors">
          Pickup Details
        </button>
        <button className="h-8 px-3 rounded-lg border border-[#e5e5de] bg-white text-xs font-medium text-[#0a0a0a] hover:bg-[#f3f3ed] transition-colors">
          View BOL
        </button>
        {canContactDriver && (
          <button className="h-8 px-3 rounded-lg border border-[#e5e5de] bg-white text-xs font-medium text-[#0a0a0a] hover:bg-[#f3f3ed] transition-colors">
            Contact Driver
          </button>
        )}
      </div>
    </div>
  );
}

// ─── Multi-Select Dropdown ────────────────────────────────────────────────────

interface MultiSelectDropdownProps {
  icon: React.ReactNode;
  placeholder: string;
  options: string[];
  selected: string[];
  onChange: (next: string[]) => void;
}

function MultiSelectDropdown({
  icon,
  placeholder,
  options,
  selected,
  onChange,
}: MultiSelectDropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function toggle(value: string) {
    const next = selected.includes(value)
      ? selected.filter((v) => v !== value)
      : [...selected, value];
    onChange(next);
  }

  function clearAll() {
    onChange([]);
  }

  const label =
    selected.length === 0
      ? placeholder
      : selected.length === 1
      ? selected[0]
      : `${selected[0]} +${selected.length - 1}`;

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className={cn(
          "flex items-center gap-2 h-9 px-3 rounded-lg border bg-white text-sm transition-colors",
          open
            ? "border-[#E8480C] ring-2 ring-[#E8480C]/20 text-[#0a0a0a]"
            : "border-[#e5e5de] text-[#0a0a0a] hover:bg-[#f8f8f4]",
        )}
      >
        <span className="text-[#0a0a0a]/50 shrink-0">{icon}</span>
        <span className={selected.length > 0 ? "font-medium text-[#0a0a0a]" : ""}>
          {label}
        </span>
        {selected.length > 0 ? (
          <span
            role="button"
            tabIndex={0}
            onClick={(e) => { e.stopPropagation(); clearAll(); }}
            onKeyDown={(e) => { if (e.key === "Enter") { e.stopPropagation(); clearAll(); } }}
            className="ml-0.5 text-[#0a0a0a]/40 hover:text-[#0a0a0a] transition-colors"
          >
            <X size={12} />
          </span>
        ) : (
          <ChevronDown size={14} className="text-[#0a0a0a]/40 ml-0.5" />
        )}
      </button>

      {open && (
        <div className="absolute top-full mt-1.5 left-0 z-50 bg-white border border-[#e5e5de] rounded-xl shadow-lg py-1.5 min-w-[180px]">
          {options.map((opt) => {
            const checked = selected.includes(opt);
            return (
              <button
                key={opt}
                onClick={() => toggle(opt)}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-[#0a0a0a] hover:bg-[#f8f8f4] transition-colors text-left"
              >
                <span
                  className={cn(
                    "w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-colors",
                    checked
                      ? "bg-[#E8480C] border-[#E8480C]"
                      : "border-[#d4d4cc] bg-white",
                  )}
                >
                  {checked && <Check size={10} strokeWidth={3} className="text-white" />}
                </span>
                {opt}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── Date Range Dropdown ──────────────────────────────────────────────────────

interface DateRangeDropdownProps {
  selected: string | null;
  onChange: (next: string | null) => void;
}

function DateRangeDropdown({ selected, onChange }: DateRangeDropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const activeLabel = DATE_RANGES.find((r) => r.value === selected)?.label ?? "Date Range";

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className={cn(
          "flex items-center gap-2 h-9 px-3 rounded-lg border bg-white text-sm transition-colors",
          open
            ? "border-[#E8480C] ring-2 ring-[#E8480C]/20 text-[#0a0a0a]"
            : "border-[#e5e5de] text-[#0a0a0a] hover:bg-[#f8f8f4]",
        )}
      >
        <span className="text-[#0a0a0a]/50 shrink-0">
          <Calendar size={14} />
        </span>
        <span className={selected ? "font-medium text-[#0a0a0a]" : ""}>
          {activeLabel}
        </span>
        {selected ? (
          <span
            role="button"
            tabIndex={0}
            onClick={(e) => { e.stopPropagation(); onChange(null); }}
            onKeyDown={(e) => { if (e.key === "Enter") { e.stopPropagation(); onChange(null); } }}
            className="ml-0.5 text-[#0a0a0a]/40 hover:text-[#0a0a0a] transition-colors"
          >
            <X size={12} />
          </span>
        ) : (
          <ChevronDown size={14} className="text-[#0a0a0a]/40 ml-0.5" />
        )}
      </button>

      {open && (
        <div className="absolute top-full mt-1.5 right-0 z-50 bg-white border border-[#e5e5de] rounded-xl shadow-lg py-1.5 min-w-[160px]">
          {DATE_RANGES.map((range) => {
            const active = selected === range.value;
            return (
              <button
                key={range.value}
                onClick={() => { onChange(active ? null : range.value); setOpen(false); }}
                className={cn(
                  "w-full flex items-center justify-between gap-2 px-3 py-2 text-sm text-[#0a0a0a] hover:bg-[#f8f8f4] transition-colors text-left",
                  active && "text-[#E8480C] font-medium",
                )}
              >
                {range.label}
                {active && <Check size={13} strokeWidth={2.5} className="text-[#E8480C]" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export function Pickups() {
  const [search, setSearch]               = useState("");
  const [selectedStatuses, setStatuses]   = useState<string[]>([]);
  const [selectedCarriers, setCarriers]   = useState<string[]>([]);
  const [selectedDateRange, setDateRange] = useState<string | null>(null);

  // Derive stats
  const scheduledCount = PICKUPS.filter((p) => p.status === "Scheduled").length;

  // Filter pickups
  const filtered = PICKUPS.filter((p) => {
    const q = search.toLowerCase();
    const matchesSearch =
      !q ||
      p.id.toLowerCase().includes(q) ||
      p.destination.toLowerCase().includes(q) ||
      p.date.toLowerCase().includes(q) ||
      // Search digs into every carrier inside the batch
      p.carriers.some((c) => c.toLowerCase().includes(q));

    const matchesStatus =
      selectedStatuses.length === 0 || selectedStatuses.includes(p.status);

    // A pickup matches if ANY of its carriers is in the selected set
    const matchesCarrier =
      selectedCarriers.length === 0 ||
      p.carriers.some((c) => selectedCarriers.includes(c));

    const matchesDate =
      !selectedDateRange || isInRange(p.dateISO, selectedDateRange);

    return matchesSearch && matchesStatus && matchesCarrier && matchesDate;
  });

  const activeFilterCount =
    selectedStatuses.length + selectedCarriers.length + (selectedDateRange ? 1 : 0);

  function clearAllFilters() {
    setStatuses([]);
    setCarriers([]);
    setDateRange(null);
    setSearch("");
  }

  return (
    <div className="flex flex-col h-full overflow-auto bg-white">

      {/* ── Header ── */}
      <div className="flex items-center justify-between px-6 h-16 border-b border-[#e5e5de] shrink-0">
        <div className="flex items-center gap-3">
          <button className="p-1.5 rounded-md hover:bg-[#f3f3ed] text-[#0a0a0a]/40 hover:text-[#0a0a0a] transition-colors">
            <PanelLeft size={16} />
          </button>
          <div className="w-px h-4 bg-[#e5e5de]" />
          <h1 className="text-sm font-semibold text-[#0a0a0a]">Pickups</h1>
        </div>
        <button className="flex items-center gap-2 h-9 px-4 rounded-lg bg-[#E8480C] text-white text-sm font-medium hover:bg-[#d03f09] transition-colors">
          <CalendarPlus size={15} />
          Schedule Pickup
        </button>
      </div>

      {/* ── Body ── */}
      <div className="flex-1 p-6 space-y-8 overflow-auto">

        {/* Activity Overview */}
        <section>
          <h2 className="text-lg font-semibold text-[#0a0a0a] mb-4">Activity Overview</h2>
          <div className="flex gap-4">
            <StatCard icon={<Calendar size={16} />}      label="Scheduled Pickups"  value={String(scheduledCount)} />
            <StatCard icon={<PackageCheck size={16} />}  label="Completed Pickups"  value="23"     />
            <StatCard icon={<Clock size={16} />}         label="Time Saved"         value="26hrs"  />
            <StatCard icon={<DollarSign size={16} />}    label="Shipping Cost"      value="$4.2k"  />
          </div>
        </section>

        {/* All Pickups */}
        <section>
          <h2 className="text-lg font-semibold text-[#0a0a0a] mb-4">All Pickups</h2>

          <div className="border border-[#e5e5de] rounded-xl overflow-visible bg-white">

            {/* Search + Filters */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-[#e5e5de] gap-3 flex-wrap">

              {/* Search */}
              <div className="relative flex-1 min-w-[220px] max-w-[420px]">
                <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#0a0a0a]/40" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search pickups, carriers, destinations"
                  className="w-full h-9 pl-9 pr-4 rounded-lg border border-[#e5e5de] text-sm bg-white placeholder:text-[#0a0a0a]/40 focus:outline-none focus:ring-2 focus:ring-[#E8480C]/20 focus:border-[#E8480C]"
                />
              </div>

              {/* Filter dropdowns */}
              <div className="flex items-center gap-2">
                <MultiSelectDropdown
                  icon={<ListFilter size={14} />}
                  placeholder="All Statuses"
                  options={ALL_STATUSES}
                  selected={selectedStatuses}
                  onChange={setStatuses}
                />
                <MultiSelectDropdown
                  icon={<Truck size={14} />}
                  placeholder="Carriers"
                  options={ALL_CARRIERS}
                  selected={selectedCarriers}
                  onChange={setCarriers}
                />
                <DateRangeDropdown
                  selected={selectedDateRange}
                  onChange={setDateRange}
                />

                {/* Clear filters */}
                {activeFilterCount > 0 && (
                  <button
                    onClick={clearAllFilters}
                    className="flex items-center gap-1.5 h-9 px-3 rounded-lg border border-[#e5e5de] text-sm text-[#0a0a0a]/60 hover:bg-[#f8f8f4] hover:text-[#0a0a0a] transition-colors"
                  >
                    <X size={13} />
                    Clear
                  </button>
                )}
              </div>
            </div>

            {/* Cards grid */}
            <div className="p-4 bg-[#f3f3ed] rounded-b-xl">
              {filtered.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {filtered.map((pickup) => (
                    <PickupCard key={pickup.id} pickup={pickup} />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="w-10 h-10 rounded-full bg-[#f3f3ed] flex items-center justify-center mb-3">
                    <Truck size={18} className="text-[#0a0a0a]/30" />
                  </div>
                  <p className="text-sm font-medium text-[#0a0a0a]">No pickups found</p>
                  <p className="text-xs text-[#0a0a0a]/50 mt-1">Try adjusting your search or filters.</p>
                  {(activeFilterCount > 0 || search) && (
                    <button
                      onClick={clearAllFilters}
                      className="mt-3 text-xs text-[#E8480C] font-medium hover:underline"
                    >
                      Clear all filters
                    </button>
                  )}
                </div>
              )}
            </div>

          </div>
        </section>
      </div>
    </div>
  );
}
