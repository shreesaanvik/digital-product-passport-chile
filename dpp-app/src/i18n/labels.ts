import type { AppScreen } from "@/lib/roles";
import { en } from "./messages/en";
import { es, type Messages } from "./messages/es";

export type CatalogKey = keyof Messages["catalog"];

const byEnglish = new Map<string, CatalogKey>();
for (const key of Object.keys(en.catalog) as CatalogKey[]) {
  byEnglish.set(en.catalog[key], key);
}

const MATERIAL_KEYS = [
  "fineWoolSilk",
  "handSpunWool",
  "woolNaturalDyes",
  "alpacaFibre",
  "localClay",
  "sheepWool",
  "handSpunChiloe",
  "undyed",
] as const satisfies readonly CatalogKey[];

export function phrase(value: string, t: Messages): string {
  const key = byEnglish.get(value);
  return key ? t.catalog[key] : value;
}

export function toCanonical(text: string): string {
  const trimmed = text.trim();
  for (const key of MATERIAL_KEYS) {
    if (trimmed === en.catalog[key] || trimmed === es.catalog[key]) {
      return en.catalog[key];
    }
  }
  return trimmed;
}

export function tabLabel(id: AppScreen, t: Messages): string {
  switch (id) {
    case "artisans":
      return t.tabs.artisans;
    case "passports":
      return t.tabs.passports;
    case "clusters":
      return t.tabs.clusters;
    case "passport":
      return t.tabs.passport;
    case "rfps":
      return t.tabs.rfps;
    case "order":
      return t.tabs.order;
    case "whats-live":
      return t.tabs.features;
    default:
      return id;
  }
}
