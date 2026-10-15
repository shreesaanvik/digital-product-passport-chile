import { CLUSTER_PASSPORTS, PASSPORT_COUNTRY } from "@/lib/data";

const passport = CLUSTER_PASSPORTS.donihue;

export const ESPR_SAMPLE_FIELDS = [
  { label: "Material", present: passport.material.length > 0 },
  { label: "Country of origin", present: PASSPORT_COUNTRY.length > 0 },
  { label: "Origin location", present: passport.origin_geo.length > 0 },
  { label: "Durability class", present: false },
  { label: "Material disclosure", present: passport.material.length > 0 },
  { label: "Care and repair instructions", present: false },
  { label: "Unique product identifier", present: false },
] as const;
