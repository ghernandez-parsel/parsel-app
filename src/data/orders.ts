export type OrderStatus =
  | "Unfulfilled"
  | "Partially Fulfilled"
  | "In Progress"
  | "Fulfilled"
  | "Externally Closed"
  | "Cancelled";

export interface Order {
  id: string;
  orderNumber: string;   // e.g. "#1161"
  status: OrderStatus;
  products: number;      // unit count
  created: string;       // display string e.g. "Mar, 4 2026 1:46pm"
  createdISO: string;    // for date-range filtering e.g. "2026-03-04"
  destination: string;
  tags: string[];
}

export const ALL_ORDER_TAGS = [
  "Priority",
  "Wholesale",
  "Retail",
  "International",
  "B2B",
  "B2C",
  "Subscription",
  "Return",
];

export const ORDERS: Order[] = [
  {
    id: "ORD-001",
    orderNumber: "#1161",
    status: "Unfulfilled",
    products: 1,
    created: "Mar, 4 2026 1:46pm",
    createdISO: "2026-03-04",
    destination: "555 Main St. San Francisco, CA 94103",
    tags: ["Retail", "B2C"],
  },
  {
    id: "ORD-002",
    orderNumber: "#1160",
    status: "Unfulfilled",
    products: 2,
    created: "Mar, 4 2026 1:46pm",
    createdISO: "2026-03-04",
    destination: "555 Main St. San Francisco, CA 94103",
    tags: ["Priority", "B2C"],
  },
  {
    id: "ORD-003",
    orderNumber: "#1159",
    status: "Unfulfilled",
    products: 1,
    created: "Mar, 4 2026 1:46pm",
    createdISO: "2026-03-04",
    destination: "555 Main St. San Francisco, CA 94103",
    tags: ["Wholesale", "B2B"],
  },
  {
    id: "ORD-004",
    orderNumber: "#1158",
    status: "Partially Fulfilled",
    products: 3,
    created: "Mar, 4 2026 1:46pm",
    createdISO: "2026-03-04",
    destination: "555 Main St. San Francisco, CA 94103",
    tags: ["Retail"],
  },
  {
    id: "ORD-005",
    orderNumber: "#1157",
    status: "In Progress",
    products: 1,
    created: "Mar, 4 2026 1:46pm",
    createdISO: "2026-03-04",
    destination: "555 Main St. San Francisco, CA 94103",
    tags: ["Priority", "International"],
  },
  {
    id: "ORD-006",
    orderNumber: "#1156",
    status: "Fulfilled",
    products: 2,
    created: "Mar, 4 2026 1:46pm",
    createdISO: "2026-03-04",
    destination: "555 Main St. San Francisco, CA 94103",
    tags: ["B2B", "Wholesale"],
  },
  {
    id: "ORD-007",
    orderNumber: "#1155",
    status: "Externally Closed",
    products: 1,
    created: "Mar, 4 2026 1:46pm",
    createdISO: "2026-03-04",
    destination: "555 Main St. San Francisco, CA 94103",
    tags: [],
  },
  {
    id: "ORD-008",
    orderNumber: "#1154",
    status: "Fulfilled",
    products: 4,
    created: "Mar, 4 2026 1:46pm",
    createdISO: "2026-03-04",
    destination: "555 Main St. San Francisco, CA 94103",
    tags: ["Subscription", "B2C"],
  },
  {
    id: "ORD-009",
    orderNumber: "#1153",
    status: "Unfulfilled",
    products: 1,
    created: "Mar, 10 2026 9:12am",
    createdISO: "2026-03-10",
    destination: "200 Park Ave. New York, NY 10166",
    tags: ["Priority"],
  },
  {
    id: "ORD-010",
    orderNumber: "#1152",
    status: "In Progress",
    products: 2,
    created: "Mar, 10 2026 9:12am",
    createdISO: "2026-03-10",
    destination: "200 Park Ave. New York, NY 10166",
    tags: ["B2C"],
  },
  {
    id: "ORD-011",
    orderNumber: "#1151",
    status: "Fulfilled",
    products: 1,
    created: "Mar, 15 2026 3:30pm",
    createdISO: "2026-03-15",
    destination: "1600 Amphitheatre Pkwy. Mountain View, CA 94043",
    tags: ["Wholesale", "B2B"],
  },
  {
    id: "ORD-012",
    orderNumber: "#1150",
    status: "Cancelled",
    products: 2,
    created: "Mar, 15 2026 3:30pm",
    createdISO: "2026-03-15",
    destination: "1600 Amphitheatre Pkwy. Mountain View, CA 94043",
    tags: ["Return"],
  },
  {
    id: "ORD-013",
    orderNumber: "#1149",
    status: "Partially Fulfilled",
    products: 3,
    created: "Mar, 20 2026 11:05am",
    createdISO: "2026-03-20",
    destination: "350 5th Ave. New York, NY 10118",
    tags: ["Priority", "International"],
  },
  {
    id: "ORD-014",
    orderNumber: "#1148",
    status: "Unfulfilled",
    products: 1,
    created: "Mar, 25 2026 2:18pm",
    createdISO: "2026-03-25",
    destination: "233 S Wacker Dr. Chicago, IL 60606",
    tags: ["B2C"],
  },
  {
    id: "ORD-015",
    orderNumber: "#1147",
    status: "Fulfilled",
    products: 5,
    created: "Apr, 1 2026 10:00am",
    createdISO: "2026-04-01",
    destination: "1 Infinite Loop. Cupertino, CA 95014",
    tags: ["Subscription"],
  },
];
