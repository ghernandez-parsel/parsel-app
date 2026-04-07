import { useState, useRef, useEffect } from "react";
import {
  Search,
  ChevronDown,
  Calendar,
  PanelLeft,
  Upload,
  TrendingUp,
  ShoppingCart,
  Scale,
  MapPin,
  EllipsisVertical,
  Tag,
  ListFilter,
  X,
  Check,
  Image,
} from "lucide-react";
import { cn } from "../lib/utils";
import { ORDERS, ALL_ORDER_TAGS, type OrderStatus } from "../data/orders";

// ─── Constants ────────────────────────────────────────────────────────────────

const ALL_STATUSES: OrderStatus[] = [
  "Unfulfilled",
  "Partially Fulfilled",
  "In Progress",
  "Fulfilled",
  "Externally Closed",
  "Cancelled",
];

const DATE_RANGES = [
  { label: "Today",        value: "today"     },
  { label: "Yesterday",    value: "yesterday" },
  { label: "Last 7 days",  value: "7days"     },
  { label: "Last 30 days", value: "30days"    },
  { label: "This month",   value: "month"     },
];

// ─── Status config ────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<OrderStatus, { text: string; dot: string }> = {
  "Unfulfilled":        { text: "text-[#E8480C]",  dot: "bg-[#E8480C]"  },
  "Partially Fulfilled":{ text: "text-blue-600",   dot: "bg-blue-500"   },
  "In Progress":        { text: "text-amber-600",  dot: "bg-amber-500"  },
  "Fulfilled":          { text: "text-green-600",  dot: "bg-green-500"  },
  "Externally Closed":  { text: "text-[#0a0a0a]/50", dot: "bg-gray-400" },
  "Cancelled":          { text: "text-red-500",    dot: "bg-red-400"    },
};

// ─── Date range helper ────────────────────────────────────────────────────────

function isInRange(dateISO: string, range: string): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const d = new Date(dateISO + "T00:00:00");

  if (range === "today")     return d.getTime() === today.getTime();
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
    return d.getFullYear() === today.getFullYear() && d.getMonth() === today.getMonth();
  }
  return true;
}

// ─── Action Card ─────────────────────────────────────────────────────────────

function ActionCard({
  icon, label, count, trend, cta, onCta,
}: {
  icon: React.ReactNode;
  label: string;
  count: number;
  trend: string;
  cta: string;
  onCta?: () => void;
}) {
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
      <button
        onClick={onCta}
        className="text-xs text-[#E8480C] font-medium text-left mt-2 hover:underline"
      >
        {cta}
      </button>
    </div>
  );
}

// ─── Status Cell ─────────────────────────────────────────────────────────────

function StatusCell({ status }: { status: OrderStatus }) {
  const cfg = STATUS_CONFIG[status];
  return (
    <span className={cn("inline-flex items-center gap-1.5 text-sm font-medium", cfg.text)}>
      <span className={cn("w-1.5 h-1.5 rounded-full shrink-0", cfg.dot)} />
      {status}
    </span>
  );
}

// ─── Tag Pill ─────────────────────────────────────────────────────────────────

function TagPill({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#f3f3ed] border border-[#e5e5de] text-[10px] font-medium text-[#0a0a0a]/60">
      {label}
    </span>
  );
}

// ─── Multi-Select Dropdown ────────────────────────────────────────────────────

interface MultiSelectProps {
  icon: React.ReactNode;
  placeholder: string;
  options: string[];
  selected: string[];
  onChange: (next: string[]) => void;
  alignRight?: boolean;
}

function MultiSelectDropdown({
  icon, placeholder, options, selected, onChange, alignRight,
}: MultiSelectProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  function toggle(v: string) {
    onChange(selected.includes(v) ? selected.filter((x) => x !== v) : [...selected, v]);
  }

  const label =
    selected.length === 0 ? placeholder
    : selected.length === 1 ? selected[0]
    : `${selected[0]} +${selected.length - 1}`;

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className={cn(
          "flex items-center gap-2 h-9 px-3 rounded-lg border bg-white text-sm transition-colors",
          open
            ? "border-[#E8480C] ring-2 ring-[#E8480C]/20"
            : "border-[#e5e5de] hover:bg-[#f8f8f4]",
        )}
      >
        <span className="text-[#0a0a0a]/50 shrink-0">{icon}</span>
        <span className={cn(selected.length > 0 && "font-medium text-[#0a0a0a]")}>{label}</span>
        {selected.length > 0 ? (
          <span
            role="button"
            tabIndex={0}
            onClick={(e) => { e.stopPropagation(); onChange([]); }}
            onKeyDown={(e) => { if (e.key === "Enter") { e.stopPropagation(); onChange([]); } }}
            className="ml-0.5 text-[#0a0a0a]/40 hover:text-[#0a0a0a] transition-colors"
          >
            <X size={12} />
          </span>
        ) : (
          <ChevronDown size={14} className="text-[#0a0a0a]/40 ml-0.5" />
        )}
      </button>

      {open && (
        <div
          className={cn(
            "absolute top-full mt-1.5 z-50 bg-white border border-[#e5e5de] rounded-xl shadow-lg py-1.5 min-w-[190px]",
            alignRight ? "right-0" : "left-0",
          )}
        >
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
                    checked ? "bg-[#E8480C] border-[#E8480C]" : "border-[#d4d4cc] bg-white",
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

function DateRangeDropdown({
  selected, onChange,
}: { selected: string | null; onChange: (v: string | null) => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const label = DATE_RANGES.find((r) => r.value === selected)?.label ?? "Date Range";

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className={cn(
          "flex items-center gap-2 h-9 px-3 rounded-lg border bg-white text-sm transition-colors",
          open
            ? "border-[#E8480C] ring-2 ring-[#E8480C]/20"
            : "border-[#e5e5de] hover:bg-[#f8f8f4]",
        )}
      >
        <span className="text-[#0a0a0a]/50 shrink-0"><Calendar size={14} /></span>
        <span className={cn(selected && "font-medium text-[#0a0a0a]")}>{label}</span>
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
          {DATE_RANGES.map((r) => {
            const active = selected === r.value;
            return (
              <button
                key={r.value}
                onClick={() => { onChange(active ? null : r.value); setOpen(false); }}
                className={cn(
                  "w-full flex items-center justify-between gap-2 px-3 py-2 text-sm text-[#0a0a0a] hover:bg-[#f8f8f4] transition-colors",
                  active && "text-[#E8480C] font-medium",
                )}
              >
                {r.label}
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

export function Orders() {
  const [search, setSearch]             = useState("");
  const [selectedStatuses, setStatuses] = useState<string[]>([]);
  const [selectedTags, setTags]         = useState<string[]>([]);
  const [dateRange, setDateRange]       = useState<string | null>(null);
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());

  // ── Derived action-required counts ──────────────────────────────────────────
  const unfulfilled = ORDERS.filter((o) => o.status === "Unfulfilled").length;
  const missingWeight = 2;   // placeholder — real data would come from a weight field
  const invalidAddress = 3;  // placeholder — real data would come from address validation

  // ── Filter ──────────────────────────────────────────────────────────────────
  const filtered = ORDERS.filter((o) => {
    const q = search.toLowerCase();
    const matchesSearch =
      !q ||
      o.orderNumber.toLowerCase().includes(q) ||
      o.destination.toLowerCase().includes(q) ||
      o.status.toLowerCase().includes(q) ||
      o.tags.some((t) => t.toLowerCase().includes(q));

    const matchesStatus =
      selectedStatuses.length === 0 || selectedStatuses.includes(o.status);

    // An order matches if it has ANY of the selected tags
    const matchesTags =
      selectedTags.length === 0 || selectedTags.some((t) => o.tags.includes(t));

    const matchesDate = !dateRange || isInRange(o.createdISO, dateRange);

    return matchesSearch && matchesStatus && matchesTags && matchesDate;
  });

  const activeFilterCount =
    selectedStatuses.length + selectedTags.length + (dateRange ? 1 : 0);

  function clearAllFilters() {
    setStatuses([]);
    setTags([]);
    setDateRange(null);
    setSearch("");
  }

  // ── Row selection ────────────────────────────────────────────────────────────
  const allSelected = selectedRows.size === filtered.length && filtered.length > 0;

  function toggleAll() {
    setSelectedRows(allSelected ? new Set() : new Set(filtered.map((o) => o.id)));
  }
  function toggleRow(id: string) {
    const next = new Set(selectedRows);
    next.has(id) ? next.delete(id) : next.add(id);
    setSelectedRows(next);
  }

  // ── Filter "Action Required" cards by status ─────────────────────────────────
  function filterByStatus(status: OrderStatus) {
    setStatuses([status]);
    setTags([]);
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
          <h1 className="text-sm font-semibold text-[#0a0a0a]">Orders</h1>
        </div>
        <button className="flex items-center gap-2 h-9 px-4 rounded-lg bg-[#E8480C] text-white text-sm font-medium hover:bg-[#d03f09] transition-colors">
          <Upload size={15} />
          Import Orders
        </button>
      </div>

      {/* ── Body ── */}
      <div className="flex-1 p-6 space-y-8 overflow-auto">

        {/* Action Required */}
        <section>
          <h2 className="text-lg font-semibold text-[#0a0a0a] mb-4">Action Required</h2>
          <div className="flex gap-4">
            <ActionCard
              icon={<ShoppingCart size={16} />}
              label="Unfulfilled Orders"
              count={unfulfilled}
              trend="+1.2%"
              cta="Review Orders"
              onCta={() => filterByStatus("Unfulfilled")}
            />
            <ActionCard
              icon={<Scale size={16} />}
              label="Missing Weight"
              count={missingWeight}
              trend="+1.6%"
              cta="Update Orders"
            />
            <ActionCard
              icon={<MapPin size={16} />}
              label="Invalid Address"
              count={invalidAddress}
              trend="+2.3%"
              cta="Review Addresses"
            />
          </div>
        </section>

        {/* All Orders */}
        <section>
          <h2 className="text-lg font-semibold text-[#0a0a0a] mb-4">All Orders</h2>

          <div className="border border-[#e5e5de] rounded-xl overflow-visible bg-white">

            {/* Search + Filters */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#e5e5de] gap-3 flex-wrap">
              <div className="relative flex-1 min-w-[220px] max-w-[420px]">
                <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#0a0a0a]/40" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search order numbers, customers"
                  className="w-full h-9 pl-9 pr-4 rounded-lg border border-[#e5e5de] text-sm bg-white placeholder:text-[#0a0a0a]/40 focus:outline-none focus:ring-2 focus:ring-[#E8480C]/20 focus:border-[#E8480C]"
                />
              </div>

              <div className="flex items-center gap-2">
                <MultiSelectDropdown
                  icon={<ListFilter size={14} />}
                  placeholder="All Statuses"
                  options={ALL_STATUSES}
                  selected={selectedStatuses}
                  onChange={setStatuses}
                />
                <MultiSelectDropdown
                  icon={<Tag size={14} />}
                  placeholder="Tags"
                  options={ALL_ORDER_TAGS}
                  selected={selectedTags}
                  onChange={setTags}
                />
                <DateRangeDropdown selected={dateRange} onChange={setDateRange} />

                {(activeFilterCount > 0 || search) && (
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

            {/* Table */}
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#e5e5de] bg-[#fafaf8]">
                  <th className="w-14 py-3">
                    <div className="flex justify-center">
                      <input
                        type="checkbox"
                        checked={allSelected}
                        onChange={toggleAll}
                        className="w-4 h-4 rounded border-[#e5e5de] accent-[#E8480C] cursor-pointer"
                      />
                    </div>
                  </th>
                  <th className="py-3 px-3 text-left text-[10px] font-semibold tracking-wider text-[#0a0a0a]/50 uppercase w-44">Status</th>
                  <th className="py-3 px-3 text-left text-[10px] font-semibold tracking-wider text-[#0a0a0a]/50 uppercase w-28">Order</th>
                  <th className="py-3 px-3 text-left text-[10px] font-semibold tracking-wider text-[#0a0a0a]/50 uppercase w-36">Products</th>
                  <th className="py-3 px-3 text-left text-[10px] font-semibold tracking-wider text-[#0a0a0a]/50 uppercase w-44">Created</th>
                  <th className="py-3 px-3 text-left text-[10px] font-semibold tracking-wider text-[#0a0a0a]/50 uppercase">Destination</th>
                  <th className="py-3 px-3 text-left text-[10px] font-semibold tracking-wider text-[#0a0a0a]/50 uppercase w-48">Tags</th>
                  <th className="py-3 px-3 w-12" />
                </tr>
              </thead>
              <tbody>
                {filtered.length > 0 ? (
                  filtered.map((order) => (
                    <tr
                      key={order.id}
                      className={cn(
                        "border-b border-[#e5e5de] last:border-0 hover:bg-[#fafaf8] transition-colors",
                        selectedRows.has(order.id) && "bg-[#fff9f7]",
                      )}
                    >
                      {/* Checkbox */}
                      <td className="py-4 w-14">
                        <div className="flex justify-center">
                          <input
                            type="checkbox"
                            checked={selectedRows.has(order.id)}
                            onChange={() => toggleRow(order.id)}
                            className="w-4 h-4 rounded border-[#e5e5de] accent-[#E8480C] cursor-pointer"
                          />
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-4 px-3 w-44">
                        <StatusCell status={order.status} />
                      </td>

                      {/* Order number */}
                      <td className="py-4 px-3 w-28">
                        <span className="text-sm font-medium text-[#E8480C]">
                          {order.orderNumber}
                        </span>
                      </td>

                      {/* Products */}
                      <td className="py-4 px-3 w-36">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-md bg-[#f3f3ed] border border-[#e5e5de] flex items-center justify-center shrink-0">
                            <Image size={12} className="text-[#0a0a0a]/30" />
                          </div>
                          <span className="text-sm text-[#0a0a0a]/70">
                            {order.products} Unit{order.products !== 1 ? "s" : ""}
                          </span>
                        </div>
                      </td>

                      {/* Created */}
                      <td className="py-4 px-3 w-44">
                        <span className="text-sm text-[#0a0a0a]/70">{order.created}</span>
                      </td>

                      {/* Destination */}
                      <td className="py-4 px-3">
                        <span className="text-sm text-[#0a0a0a]/70">{order.destination}</span>
                      </td>

                      {/* Tags */}
                      <td className="py-4 px-3 w-48">
                        {order.tags.length > 0 ? (
                          <div className="flex items-center gap-1 flex-wrap">
                            {order.tags.map((t) => <TagPill key={t} label={t} />)}
                          </div>
                        ) : (
                          <span className="text-sm text-[#0a0a0a]/30">—</span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-3 w-12">
                        <button className="p-1.5 rounded-md hover:bg-[#f3f3ed] text-[#0a0a0a]/40 hover:text-[#0a0a0a] transition-colors">
                          <EllipsisVertical size={16} />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="py-16 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <div className="w-10 h-10 rounded-full bg-[#f3f3ed] flex items-center justify-center">
                          <ShoppingCart size={18} className="text-[#0a0a0a]/30" />
                        </div>
                        <p className="text-sm font-medium text-[#0a0a0a]">No orders found</p>
                        <p className="text-xs text-[#0a0a0a]/50">Try adjusting your search or filters.</p>
                        {(activeFilterCount > 0 || search) && (
                          <button
                            onClick={clearAllFilters}
                            className="mt-1 text-xs text-[#E8480C] font-medium hover:underline"
                          >
                            Clear all filters
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            {/* Footer */}
            <div className="flex items-center justify-between px-6 py-4 border-t border-[#e5e5de] bg-[#fafaf8]">
              <span className="text-sm text-[#0a0a0a]/50">
                {selectedRows.size} of {filtered.length} row(s) selected.
              </span>
              <div className="flex items-center gap-2">
                <button className="h-9 px-4 rounded-lg border border-[#e5e5de] bg-white text-sm text-[#0a0a0a] hover:bg-[#f3f3ed] transition-colors">
                  Previous
                </button>
                <button className="h-9 px-4 rounded-lg border border-[#e5e5de] bg-white text-sm text-[#0a0a0a] hover:bg-[#f3f3ed] transition-colors">
                  Next
                </button>
              </div>
            </div>

          </div>
        </section>
      </div>
    </div>
  );
}
