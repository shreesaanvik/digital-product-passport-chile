export const DEMO_ORDER = {
  order_id: "FM-2026-IND",
  artisan: "Lata Devi",
  village: "Chanderi, MP",
  technique: "Hand-loomed Zari",
  brand_payment: 500.0,
  artisan_payout: 412.5,
  middleman_saved: 185.0,
  esg_score: "A+",
};

export const CLUSTERS = [
  {
    id: "vns",
    name: "Varanasi",
    craft: "Zari Brocade",
    orders: 24,
    artisans: 890,
    x: 62,
    y: 42,
    lat: 25.3176,
    lng: 82.9739,
    orderCode: "FM-VNS-2026",
  },
  {
    id: "kutch",
    name: "Kutch",
    craft: "Ajrakh Block-Print",
    orders: 12,
    artisans: 250,
    x: 38,
    y: 58,
    lat: 23.242,
    lng: 69.6669,
    orderCode: "FM-KUT-2026",
  },
  {
    id: "kanchi",
    name: "Kanchipuram",
    craft: "Temple Silk",
    orders: 18,
    artisans: 410,
    x: 52,
    y: 88,
    lat: 12.8342,
    lng: 79.7036,
    orderCode: "FM-KAN-2026",
  },
  {
    id: "jaipur",
    name: "Jaipur",
    craft: "Bandhani & Gems",
    orders: 31,
    artisans: 620,
    x: 35,
    y: 48,
    lat: 26.9124,
    lng: 75.7873,
    orderCode: "FM-JAI-2026",
  },
  {
    id: "murshidabad",
    name: "Murshidabad",
    craft: "Murshidabad Silk",
    orders: 9,
    artisans: 180,
    x: 58,
    y: 52,
    lat: 24.1839,
    lng: 88.2717,
    orderCode: "FM-MUR-2026",
  },
] as const;

export type ArtisanPayment = {
  label: string;
  amount: number;
  status: "paid" | "waiting";
  date?: string;
};

export const ARTISAN = {
  name: "Lalita Rabari",
  craft: "Ajrakh block-print",
  cluster: "Kutch, Gujarat",
  generation: "Third-generation block-printer",
  steward: { name: "Priya Chauhan", role: "Steward, Kutch", lastVisit: "28 Sep" },
  order: {
    code: "FM-KUT-2026",
    product: "Ajrakh cotton fabric, 20 metres",
    buyer: "Maren Voss studio",
  },
  stages: [
    "Fabric preparation",
    "Block printing",
    "Dyeing and washing",
    "Quality check",
    "Shipped",
  ],
  currentStage: 3,
  payments: [
    { label: "Order started", amount: 12600, status: "paid", date: "12 Sep" },
    { label: "After quality check", amount: 16800, status: "waiting" },
    { label: "After shipping", amount: 12600, status: "waiting" },
  ] satisfies ArtisanPayment[],
  currency: "INR",
};

export const STEWARD = {
  name: "Priya Chauhan",
  role: "Steward",
  area: "Kutch, Gujarat",
} as const;

export type RosterStatus = "Verified" | "Needs visit" | "Consent pending";

export type StewardConsent = {
  date: string;
  language: string;
};

export type RosterArtisan = {
  id: string;
  name: string;
  craft: string;
  village: string;
  status: RosterStatus;
  consent: StewardConsent | null;
  orderCode: string | null;
};

export const ROSTER: RosterArtisan[] = [
  {
    id: "KUT-4410",
    name: "Lalita Rabari",
    craft: "Ajrakh block-print",
    village: "Ajrakhpur",
    status: "Verified",
    consent: { date: "2 Sep", language: "Kutchi" },
    orderCode: "FM-KUT-2026",
  },
  {
    id: "KUT-4417",
    name: "Aamir Khatri",
    craft: "Ajrakh block-print",
    village: "Ajrakhpur",
    status: "Verified",
    consent: { date: "3 Sep", language: "Kutchi" },
    orderCode: null,
  },
  {
    id: "KUT-4502",
    name: "Rekha Vankar",
    craft: "Handloom weaving",
    village: "Bhujodi",
    status: "Needs visit",
    consent: { date: "20 Aug", language: "Gujarati" },
    orderCode: null,
  },
  {
    id: "KUT-4521",
    name: "Kanku Ahir",
    craft: "Ahir embroidery",
    village: "Dhaneti",
    status: "Consent pending",
    consent: null,
    orderCode: null,
  },
  {
    id: "KUT-4533",
    name: "Hasina Khatri",
    craft: "Bandhani",
    village: "Bhuj",
    status: "Verified",
    consent: { date: "5 Sep", language: "Kutchi" },
    orderCode: null,
  },
];

export type EvidenceEntry = {
  stage: string;
  date: string;
};

export const EVIDENCE_GPS = "23.24 N, 69.67 E";

export const EVIDENCE_LOG: EvidenceEntry[] = [
  { stage: "Fabric preparation", date: "12 Sep, 10:14" },
  { stage: "Block printing", date: "18 Sep, 11:02" },
  { stage: "Dyeing and washing", date: "24 Sep, 09:40" },
  { stage: "Quality check started", date: "28 Sep, 15:25" },
];

export function formatInr(amount: number): string {
  const grouped = new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 0,
  }).format(amount);
  return `₹${grouped.replace(/\s/g, "")}`;
}

export function artisanPaymentTotals(payments: readonly ArtisanPayment[]) {
  let received = 0;
  let waiting = 0;
  for (const payment of payments) {
    if (payment.status === "paid") received += payment.amount;
    else waiting += payment.amount;
  }
  return { received, waiting };
}

export function artisanPaymentStatus(payment: ArtisanPayment): string {
  if (payment.status === "paid") return payment.date ? `Paid ${payment.date}` : "Paid";
  if (payment.label === "After quality check") return "When quality check is done";
  if (payment.label === "After shipping") return "When shipped";
  return "Waiting";
}

export const PASSPORT_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "Product",
  name: "Hand-loomed Silk Saree - Order FM-VNS-2026",
  material: "Mulberry silk, zari (tested)",
  countryOfOrigin: { "@type": "Country", name: "IN" },
  additionalProperty: [
    { name: "ESPR_material_disclosure", value: "complete" },
    { name: "durability_class", value: "A" },
    { name: "origin_geo", value: "25.3176,82.9739" },
  ],
};
