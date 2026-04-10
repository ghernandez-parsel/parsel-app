export type PickupStatus =
  | "Scheduled"
  | "Driver Assigned"
  | "En Route"
  | "Picked Up"
  | "Dropped Off"
  | "Cancelled";

export interface Pickup {
  id: string;
  pickupId: string;      // display ID e.g. "#787AFA4B"
  date: string;          // e.g. "April 7, 2026 at 3:00pm - 4:00pm"
  dateISO: string;       // e.g. "2026-04-07" for date-range filtering
  statusDetail: string;  // subtitle shown below pickup ID on the card
  status: PickupStatus;
  carriers: string[];    // all carriers bundled in this batch pickup
  items: number;
  cost: string;
  destination: string;
}

export const PICKUPS: Pickup[] = [
  {
    id: "PU-001",
    pickupId: "#787AFA4B",
    date: "April 7, 2026 at 3:00pm - 4:00pm",
    dateISO: "2026-04-07",
    statusDetail: "April 7, 2026 at 3:00pm - 4:00pm",
    status: "Scheduled",
    carriers: ["UPS", "FedEx", "USPS"],
    items: 12,
    cost: "$48.33",
    destination: "Salt Lake City, UT 84104",
  },
  {
    id: "PU-002",
    pickupId: "#787AFA4B",
    date: "April 7, 2026 at 3:00pm - 4:00pm",
    dateISO: "2026-04-07",
    statusDetail: "April 7, 2026 at 3:00pm - 4:00pm",
    status: "Driver Assigned",
    carriers: ["FedEx", "Veho"],
    items: 3,
    cost: "$23.88",
    destination: "Salt Lake City, UT 84104",
  },
  {
    id: "PU-003",
    pickupId: "#787AFA4B",
    date: "April 7, 2026 at 3:00pm - 4:00pm",
    dateISO: "2026-04-07",
    statusDetail: "Arriving Today at 3:26pm",
    status: "En Route",
    carriers: ["USPS", "OnTrac", "UPS"],
    items: 3,
    cost: "$23.88",
    destination: "Salt Lake City, UT 84104",
  },
  {
    id: "PU-004",
    pickupId: "#787AFA4B",
    date: "April 7, 2026 at 3:00pm - 4:00pm",
    dateISO: "2026-04-07",
    statusDetail: "Picked up today at 3:37pm",
    status: "Picked Up",
    carriers: ["Veho", "FedEx"],
    items: 3,
    cost: "$23.88",
    destination: "Salt Lake City, UT 84104",
  },
  {
    id: "PU-005",
    pickupId: "#787AFA4B",
    date: "April 7, 2026 at 3:00pm - 4:00pm",
    dateISO: "2026-04-07",
    statusDetail: "Dropped off today at 4:46pm",
    status: "Dropped Off",
    carriers: ["OnTrac", "USPS", "UniUni"],
    items: 3,
    cost: "$23.88",
    destination: "Salt Lake City, UT 84104",
  },
  {
    id: "PU-006",
    pickupId: "#787AFA4B",
    date: "April 7, 2026 at 3:00pm - 4:00pm",
    dateISO: "2026-04-07",
    statusDetail: "Cancelled on April 6, 2026",
    status: "Cancelled",
    carriers: ["UPS", "FedEx"],
    items: 3,
    cost: "$23.88",
    destination: "Salt Lake City, UT 84104",
  },
  {
    id: "PU-007",
    pickupId: "#3C91B22A",
    date: "April 8, 2026 at 10:00am - 11:00am",
    dateISO: "2026-04-08",
    statusDetail: "April 8, 2026 at 10:00am - 11:00am",
    status: "Scheduled",
    carriers: ["FedEx", "UPS", "Veho", "USPS"],
    items: 5,
    cost: "$41.20",
    destination: "Denver, CO 80202",
  },
  {
    id: "PU-008",
    pickupId: "#A14D7F03",
    date: "April 8, 2026 at 2:00pm - 3:00pm",
    dateISO: "2026-04-08",
    statusDetail: "April 8, 2026 at 2:00pm - 3:00pm",
    status: "Driver Assigned",
    carriers: ["USPS", "OnTrac"],
    items: 2,
    cost: "$14.50",
    destination: "Austin, TX 78701",
  },
  {
    id: "PU-009",
    pickupId: "#F72C8E19",
    date: "April 9, 2026 at 9:00am - 10:00am",
    dateISO: "2026-04-09",
    statusDetail: "April 9, 2026 at 9:00am - 10:00am",
    status: "Scheduled",
    carriers: ["Veho", "DoorDash", "UniUni"],
    items: 7,
    cost: "$62.15",
    destination: "Chicago, IL 60601",
  },
  {
    id: "PU-010",
    pickupId: "#B88012CC",
    date: "April 9, 2026 at 1:00pm - 2:00pm",
    dateISO: "2026-04-09",
    statusDetail: "Dropped off today at 1:48pm",
    status: "Dropped Off",
    carriers: ["UPS", "FedEx", "USPS", "OnTrac"],
    items: 4,
    cost: "$31.76",
    destination: "Portland, OR 97201",
  },
];
