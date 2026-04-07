export type PickupStatus =
  | "Scheduled"
  | "Assigned"
  | "En Route"
  | "Picked Up"
  | "Dropped Off"
  | "Cancelled";

export interface Pickup {
  id: string;
  date: string;          // e.g. "Tuesday, April 7"
  dateISO: string;       // e.g. "2026-04-07"  (for filtering)
  timeWindow: string;    // e.g. "3:00pm - 4:00pm"
  statusDetail: string;  // e.g. "Arriving at 3:26pm"  (shown below date for En Route etc.)
  status: PickupStatus;
  carrier: string;
  items: number;
  cost: string;
  destination: string;
}

export const PICKUPS: Pickup[] = [
  {
    id: "PU-001",
    date: "Tuesday, April 7",
    dateISO: "2026-04-07",
    timeWindow: "3:00pm - 4:00pm",
    statusDetail: "3:00pm - 4:00pm",
    status: "Scheduled",
    carrier: "UPS",
    items: 3,
    cost: "$23.88",
    destination: "Salt Lake City, UT 84104",
  },
  {
    id: "PU-002",
    date: "Tuesday, April 7",
    dateISO: "2026-04-07",
    timeWindow: "3:00pm - 4:00pm",
    statusDetail: "3:00pm - 4:00pm",
    status: "Assigned",
    carrier: "FedEx",
    items: 3,
    cost: "$23.88",
    destination: "Salt Lake City, UT 84104",
  },
  {
    id: "PU-003",
    date: "Tuesday, April 7",
    dateISO: "2026-04-07",
    timeWindow: "3:00pm - 4:00pm",
    statusDetail: "Arriving at 3:26pm",
    status: "En Route",
    carrier: "USPS",
    items: 3,
    cost: "$23.88",
    destination: "Salt Lake City, UT 84104",
  },
  {
    id: "PU-004",
    date: "Tuesday, April 7",
    dateISO: "2026-04-07",
    timeWindow: "3:00pm - 4:00pm",
    statusDetail: "Picked up at 3:37pm",
    status: "Picked Up",
    carrier: "Veho",
    items: 3,
    cost: "$23.88",
    destination: "Salt Lake City, UT 84104",
  },
  {
    id: "PU-005",
    date: "Tuesday, April 7",
    dateISO: "2026-04-07",
    timeWindow: "3:00pm - 4:00pm",
    statusDetail: "Dropped off at 4:46pm",
    status: "Dropped Off",
    carrier: "OnTrac",
    items: 3,
    cost: "$23.88",
    destination: "Salt Lake City, UT 84104",
  },
  {
    id: "PU-006",
    date: "Tuesday, April 7",
    dateISO: "2026-04-07",
    timeWindow: "3:00pm - 4:00pm",
    statusDetail: "3:00pm - 4:00pm",
    status: "Cancelled",
    carrier: "UPS",
    items: 3,
    cost: "$23.88",
    destination: "Salt Lake City, UT 84104",
  },
  {
    id: "PU-007",
    date: "Wednesday, April 8",
    dateISO: "2026-04-08",
    timeWindow: "10:00am - 11:00am",
    statusDetail: "10:00am - 11:00am",
    status: "Scheduled",
    carrier: "FedEx",
    items: 5,
    cost: "$41.20",
    destination: "Denver, CO 80202",
  },
  {
    id: "PU-008",
    date: "Wednesday, April 8",
    dateISO: "2026-04-08",
    timeWindow: "2:00pm - 3:00pm",
    statusDetail: "2:00pm - 3:00pm",
    status: "Assigned",
    carrier: "USPS",
    items: 2,
    cost: "$14.50",
    destination: "Austin, TX 78701",
  },
  {
    id: "PU-009",
    date: "Thursday, April 9",
    dateISO: "2026-04-09",
    timeWindow: "9:00am - 10:00am",
    statusDetail: "9:00am - 10:00am",
    status: "Scheduled",
    carrier: "Veho",
    items: 7,
    cost: "$62.15",
    destination: "Chicago, IL 60601",
  },
  {
    id: "PU-010",
    date: "Thursday, April 9",
    dateISO: "2026-04-09",
    timeWindow: "1:00pm - 2:00pm",
    statusDetail: "1:00pm - 2:00pm",
    status: "Dropped Off",
    carrier: "UPS",
    items: 4,
    cost: "$31.76",
    destination: "Portland, OR 97201",
  },
];
