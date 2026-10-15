export const SAMPLE_CLP_PER_USD = 950;

export const PASSPORT_COUNTRY = "CL";

export const CLUSTERS = [
  {
    id: "donihue",
    name: "Doñihue",
    region: "O'Higgins",
    craft: "Chamantos y mantas",
    orders: 12,
    artisans: 180,
    lat: -34.226,
    lng: -70.966,
    image: "/clusters/donihue.jpg",
    imageAlt: "Doñihue chamanto pattern",
  },
  {
    id: "chiloe",
    name: "Chiloé",
    region: "Los Lagos",
    craft: "Wool knitwear (lana chilota)",
    orders: 9,
    artisans: 240,
    lat: -42.48,
    lng: -73.76,
    image: "/clusters/chiloe.jpg",
    imageAlt: "Chiloé wool knit pattern",
  },
  {
    id: "araucania",
    name: "Araucanía",
    region: "La Araucanía",
    craft: "Mapuche textiles",
    orders: 14,
    artisans: 310,
    lat: -38.74,
    lng: -72.59,
    image: "/clusters/araucania.jpg",
    imageAlt: "Mapuche textile pattern",
  },
  {
    id: "colchane",
    name: "Colchane",
    region: "Tarapacá",
    craft: "Aymara alpaca textiles",
    orders: 6,
    artisans: 120,
    lat: -19.28,
    lng: -68.64,
    image: "/clusters/colchane.jpg",
    imageAlt: "Aymara textile pattern",
  },
  {
    id: "quinchamali",
    name: "Quinchamalí",
    region: "Ñuble",
    craft: "Black pottery",
    orders: 5,
    artisans: 60,
    lat: -36.66,
    lng: -72.2,
    image: "/clusters/quinchamali.jpg",
    imageAlt: "Quinchamalí black pottery pattern",
  },
] as const;

export type ClusterId = (typeof CLUSTERS)[number]["id"];

export function clusterById(id: ClusterId) {
  const cluster = CLUSTERS.find((item) => item.id === id);
  if (!cluster) {
    throw new Error(`Unknown cluster ${id}`);
  }
  return cluster;
}

function originGeo(id: ClusterId): string {
  const cluster = clusterById(id);
  return `${cluster.lat},${cluster.lng}`;
}

export type ClusterPassport = {
  product: string;
  material: string;
  artisan: string;
  stages: readonly string[];
  currentStage: string;
  origin_geo: string;
  badges: readonly string[];
};

export const CLUSTER_PASSPORTS: Record<ClusterId, ClusterPassport> = {
  donihue: {
    product: "Double-sided Doñihue chamanto",
    material: "Fine wool and silk",
    artisan: "Rosa Elena Muñoz, Doñihue",
    stages: [
      "Thread preparation",
      "Weaving",
      "Finishing",
      "Quality check",
      "Shipped",
    ],
    currentStage: "Quality check",
    origin_geo: originGeo("donihue"),
    badges: ["Handwoven", "Sello de Origen"],
  },
  chiloe: {
    product: "Lana chilota sweater",
    material: "Hand-spun sheep's wool",
    artisan: "Cooperativa Lanas del Archipiélago, Castro",
    stages: ["Spinning", "Dyeing", "Hand knitting", "Quality check", "Shipped"],
    currentStage: "Quality check",
    origin_geo: originGeo("chiloe"),
    badges: ["Hand-knitted", "Natural wool"],
  },
  araucania: {
    product: "Trariwe (woven belt)",
    material: "Sheep's wool, natural dyes",
    artisan: "Ayelén Painemal, La Araucanía",
    stages: [
      "Spinning",
      "Dyeing",
      "Weaving on the witral",
      "Quality check",
      "Shipped",
    ],
    currentStage: "Weaving on the witral",
    origin_geo: originGeo("araucania"),
    badges: ["Handwoven", "Natural dyes"],
  },
  colchane: {
    product: "Alpaca awayu",
    material: "Alpaca fibre",
    artisan: "Justina Choque, Colchane",
    stages: ["Spinning", "Dyeing", "Weaving", "Quality check", "Shipped"],
    currentStage: "Dyeing",
    origin_geo: originGeo("colchane"),
    badges: ["Handwoven", "Alpaca fibre"],
  },
  quinchamali: {
    product: "Black clay piece",
    material: "Local clay",
    artisan: "Elsa Sepúlveda, Quinchamalí",
    stages: [
      "Clay preparation",
      "Shaping",
      "Burnishing and incising",
      "Firing",
      "Shipped",
    ],
    currentStage: "Firing",
    origin_geo: originGeo("quinchamali"),
    badges: ["Handmade", "UNESCO Urgent Safeguarding List (2022)"],
  },
};

export function stageIndex(stages: readonly string[], current: string): number {
  const index = stages.indexOf(current);
  return index < 0 ? 0 : index;
}

export function clpFromUsd(usd: number): number {
  return usd * SAMPLE_CLP_PER_USD;
}

type Milestone = {
  usd: number;
  release: string;
  paymentLabel: string;
  status: "paid" | "waiting";
  date?: string;
};

export const MAIN_ORDER = {
  code: "FM-DON-2026",
  buyer: "Maren Voss studio, New York",
  product: "Double-sided Doñihue chamanto",
  routeFrom: "Doñihue, Chile",
  routeTo: "New York, USA",
  dutyNote: "US-Chile Free Trade Agreement, subject to rules of origin",
  buyerPays: 625,
  split: {
    artisan: { usd: 500, share: 80 },
    logistics: { usd: 93.75, share: 15, shipping: 93.75, importDuty: 0 },
    platformFee: { usd: 31.25, share: 5 },
  },
  milestones: [
    {
      usd: 150,
      release: "Weaving done",
      paymentLabel: "Order started",
      status: "paid",
      date: "12 Sep",
    },
    {
      usd: 200,
      release: "Quality check passed",
      paymentLabel: "After quality check",
      status: "waiting",
    },
    {
      usd: 150,
      release: "Shipped",
      paymentLabel: "After shipping",
      status: "waiting",
    },
  ] satisfies Milestone[],
};

export const OLD_PAYOUT_SHARES = [
  { label: "Exporter", share: 40 },
  { label: "Middlemen", share: 30 },
  { label: "Other costs", share: 15 },
  { label: "Artisan", share: 15 },
] as const;

export const MINGLE_PAYOUT_SHARES = [
  { label: "Platform fee", share: MAIN_ORDER.split.platformFee.share },
  { label: "Logistics", share: MAIN_ORDER.split.logistics.share },
  { label: "Artisan", share: MAIN_ORDER.split.artisan.share },
] as const;

export const LANDED_COST_LINES = [
  {
    label: "Artisan payout",
    amount: MAIN_ORDER.split.artisan.usd,
    note: "Paid on this order",
    prominent: true,
  },
  {
    label: "Shipping",
    amount: MAIN_ORDER.split.logistics.shipping,
    note: "Negotiated DHL / Correos de Chile rate",
    prominent: false,
  },
  {
    label: "Import duty",
    amount: MAIN_ORDER.split.logistics.importDuty,
    note: MAIN_ORDER.dutyNote,
    prominent: false,
  },
  {
    label: "Platform fee",
    amount: MAIN_ORDER.split.platformFee.usd,
    note: "Connects supply & compliance",
    prominent: false,
  },
] as const;

export type ArtisanPayment = {
  label: string;
  amount: number;
  status: "paid" | "waiting";
  date?: string;
};

export const ARTISAN = {
  name: "Rosa Elena Muñoz",
  craft: "Chamantos y mantas",
  cluster: "Doñihue, O'Higgins",
  generation: "Third-generation weaver",
  registryId: "CA-06-0412",
  steward: {
    name: "Camila Araya",
    role: "Gestora territorial, O'Higgins",
    lastVisit: "28 Sep",
  },
  order: {
    code: MAIN_ORDER.code,
    product: MAIN_ORDER.product,
    buyer: MAIN_ORDER.buyer,
  },
  stages: CLUSTER_PASSPORTS.donihue.stages,
  currentStage: stageIndex(
    CLUSTER_PASSPORTS.donihue.stages,
    CLUSTER_PASSPORTS.donihue.currentStage,
  ),
  payments: MAIN_ORDER.milestones.map(
    (milestone): ArtisanPayment => ({
      label: milestone.paymentLabel,
      amount: clpFromUsd(milestone.usd),
      status: milestone.status,
      ...(milestone.date ? { date: milestone.date } : {}),
    }),
  ),
  currency: "CLP",
};

const donihueCluster = clusterById("donihue");
const araucaniaCluster = clusterById("araucania");

export const SAMPLE_REGISTRY = [
  {
    id: ARTISAN.registryId,
    name: ARTISAN.name,
    craft: ARTISAN.craft,
    commune: donihueCluster.name,
    region: donihueCluster.region,
    status: "Registered",
  },
  {
    id: "CA-09-0208",
    name: CLUSTER_PASSPORTS.araucania.artisan.split(",")[0].trim(),
    craft: araucaniaCluster.craft,
    commune: araucaniaCluster.region,
    region: araucaniaCluster.region,
    status: "Registered",
  },
] as const;

export type SampleRegistryRecord = (typeof SAMPLE_REGISTRY)[number];

export const STEWARD = {
  name: "Camila Araya",
  role: "Gestora territorial",
  area: "O'Higgins",
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
    id: "CA-06-0412",
    name: "Rosa Elena Muñoz",
    craft: "Chamantos y mantas",
    village: "Doñihue",
    status: "Verified",
    consent: { date: "2 Sep", language: "Spanish" },
    orderCode: MAIN_ORDER.code,
  },
  {
    id: "CA-06-0417",
    name: "Luisa Contreras",
    craft: "Chamantos y mantas",
    village: "Doñihue",
    status: "Verified",
    consent: { date: "3 Sep", language: "Spanish" },
    orderCode: null,
  },
  {
    id: "CA-06-0502",
    name: "Marisol Cáceres",
    craft: "Mantas",
    village: "Coltauco",
    status: "Needs visit",
    consent: { date: "20 Aug", language: "Spanish" },
    orderCode: null,
  },
  {
    id: "CA-06-0521",
    name: "Carmen Gutiérrez",
    craft: "Loom weaving",
    village: "Coltauco",
    status: "Consent pending",
    consent: null,
    orderCode: null,
  },
  {
    id: "CA-06-0533",
    name: "Patricia Soto",
    craft: "Embroidery",
    village: "Rancagua",
    status: "Verified",
    consent: { date: "5 Sep", language: "Spanish" },
    orderCode: null,
  },
];

export const MANUFACTURER = {
  name: "Patricio Vera",
  org: "Cooperativa Lanas del Archipiélago",
  area: "Castro, Chiloé",
} as const;

export type PooledMaterials = {
  yarn: string;
  yarnSource: string;
  dye: string;
};

export type PooledPiece = {
  id: string;
  makerId: string;
  carton: "A" | "B";
  wovenDate: string;
  recordedBy: string;
};

const POOLED_MAKERS = [
  { id: "CA-10-0301", name: "Marta Cárcamo", village: "Castro", pieces: 10 },
  { id: "CA-10-0306", name: "Gladys Oyarzo", village: "Castro", pieces: 8 },
  { id: "CA-10-0311", name: "Nelly Barrientos", village: "Dalcahue", pieces: 8 },
  { id: "CA-10-0315", name: "Ana Mansilla", village: "Dalcahue", pieces: 7 },
  { id: "CA-10-0320", name: "Teresa Vargas", village: "Chonchi", pieces: 7 },
] as const;

function wovenDateForIndex(index: number): string {
  const day = 1 + Math.round((index * 24) / 39);
  return `${day} Sep`;
}

function buildPooledPieces(): PooledPiece[] {
  const pieces: PooledPiece[] = [];
  let number = 1;
  for (const maker of POOLED_MAKERS) {
    for (let count = 0; count < maker.pieces; count += 1) {
      pieces.push({
        id: `CH-${String(number).padStart(2, "0")}`,
        makerId: maker.id,
        carton: number <= 20 ? "A" : "B",
        wovenDate: wovenDateForIndex(number - 1),
        recordedBy: STEWARD.name,
      });
      number += 1;
    }
  }
  return pieces;
}

export const POOLED_PIECES: PooledPiece[] = buildPooledPieces();

export const POOLED_ORDER = {
  code: "FM-CHL-2031",
  product: "Lana chilota sweater",
  buyer: "Maren Voss studio, New York",
  totalPieces: 40,
  stage: "Packed for shipping",
  materials: {
    yarn: "Sheep's wool",
    yarnSource: "Hand-spun in Chiloé",
    dye: "Undyed natural tones",
  } satisfies PooledMaterials,
  makers: POOLED_MAKERS,
  cartons: [
    { id: "Carton A", pieces: "CH-01 to CH-20" },
    { id: "Carton B", pieces: "CH-21 to CH-40" },
  ],
} as const;

export const POOLED_PASSPORT = {
  product: CLUSTER_PASSPORTS.chiloe.product,
  material: CLUSTER_PASSPORTS.chiloe.material,
  stages: CLUSTER_PASSPORTS.chiloe.stages,
  currentStage: CLUSTER_PASSPORTS.chiloe.currentStage,
  origin_geo: CLUSTER_PASSPORTS.chiloe.origin_geo,
};

export type EvidenceEntry = {
  stage: string;
  date: string;
};

export const EVIDENCE_GPS = "34.23 S, 70.97 W (Doñihue)";

export const EVIDENCE_LOG: EvidenceEntry[] = [
  { stage: "Thread preparation", date: "12 Sep, 10:14" },
  { stage: "Weaving", date: "18 Sep, 11:02" },
  { stage: "Finishing", date: "24 Sep, 09:40" },
  { stage: "Quality check started", date: "28 Sep, 15:25" },
];

export function formatClp(amount: number): string {
  const grouped = new Intl.NumberFormat("es-CL", {
    maximumFractionDigits: 0,
  }).format(Math.round(amount));
  return `$${grouped} CLP`;
}

export function formatUsd(amount: number): string {
  const grouped = amount.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return `US$${grouped}`;
}

export function passportJsonLd(input: {
  product: string;
  material: string;
  artisan?: string;
  origin_geo: string;
  stages: readonly string[];
  currentStage: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: input.product,
    material: input.material,
    ...(input.artisan ? { artisan: input.artisan } : {}),
    countryOfOrigin: { "@type": "Country", name: PASSPORT_COUNTRY },
    additionalProperty: [{ name: "origin_geo", value: input.origin_geo }],
    stages: [...input.stages],
    currentStage: input.currentStage,
  };
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
