import { CLUSTER_PASSPORTS, PASSPORT_COUNTRY } from "@/lib/data";

const passport = CLUSTER_PASSPORTS.donihue;

export const ESPR_SAMPLE_FIELDS = [
  { id: "material", present: passport.material.length > 0 },
  { id: "country", present: PASSPORT_COUNTRY.length > 0 },
  { id: "origin", present: passport.origin_geo.length > 0 },
  { id: "durability", present: false },
  { id: "disclosure", present: passport.material.length > 0 },
  { id: "care", present: false },
  { id: "identifier", present: false },
] as const;

export type EsprFieldId = (typeof ESPR_SAMPLE_FIELDS)[number]["id"];
