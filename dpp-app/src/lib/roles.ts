import type { Messages } from "@/i18n/messages/es";

export const ROLES = [
  "steward",
  "artisan",
  "creative",
  "manufacturer",
  "government",
] as const;

export type Role = (typeof ROLES)[number];

export type AppScreen =
  | "home"
  | "artisans"
  | "passports"
  | "clusters"
  | "passport"
  | "rfps"
  | "order"
  | "whats-live"
  | "story"
  | "pay";

export type BottomTab = {
  id: AppScreen;
  icon: string;
};

export type RoleProfile = {
  initial: string;
  name: string;
};

export function isRole(value: string | null): value is Role {
  return value != null && (ROLES as readonly string[]).includes(value);
}

export const ROLE_PROFILES: Record<Role, RoleProfile> = {
  steward: { initial: "C", name: "Camila" },
  artisan: { initial: "R", name: "Rosa" },
  creative: { initial: "M", name: "Maren" },
  manufacturer: { initial: "P", name: "Patricio" },
  government: { initial: "G", name: "" },
};

export function roleTooltip(role: Role, t: Messages): string {
  if (role === "government") return t.roles.governmentTip;
  return `${ROLE_PROFILES[role].name}, ${t.roles[role]}`;
}

export const EXPLORE_ROLES: Role[] = [...ROLES];

export const BOTTOM_TABS: Record<Role, BottomTab[]> = {
  steward: [
    { id: "artisans", icon: "☺" },
    { id: "passports", icon: "▣" },
  ],
  artisan: [],
  creative: [
    { id: "clusters", icon: "◎" },
    { id: "passport", icon: "▣" },
    { id: "rfps", icon: "📁" },
  ],
  manufacturer: [
    { id: "order", icon: "☰" },
    { id: "passport", icon: "▣" },
  ],
  government: [
    { id: "clusters", icon: "◎" },
    { id: "passport", icon: "▣" },
    { id: "whats-live", icon: "●" },
  ],
};

export function defaultScreen(role: Role): AppScreen {
  return BOTTOM_TABS[role][0]?.id ?? "home";
}
