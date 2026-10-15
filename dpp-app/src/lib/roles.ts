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
  label: string;
  icon: string;
};

export type RoleProfile = {
  initial: string;
  name: string;
  roleLabel: string;
};

export function isRole(value: string | null): value is Role {
  return value != null && (ROLES as readonly string[]).includes(value);
}

export const ROLE_PROFILES: Record<Role, RoleProfile> = {
  steward: { initial: "C", name: "Camila", roleLabel: "Steward" },
  artisan: { initial: "R", name: "Rosa", roleLabel: "Artisan" },
  creative: { initial: "M", name: "Maren", roleLabel: "Creative" },
  manufacturer: { initial: "P", name: "Patricio", roleLabel: "Manufacturer" },
  government: {
    initial: "G",
    name: "Government body",
    roleLabel: "Government body",
  },
};

export function roleTooltip(role: Role): string {
  if (role === "government") return "Government body (Chile)";
  const { name, roleLabel } = ROLE_PROFILES[role];
  if (name === roleLabel) return roleLabel;
  return `${name}, ${roleLabel}`;
}

export const EXPLORE_CARDS: { role: Role; title: string; line: string }[] = [
  {
    role: "steward",
    title: "Steward",
    line: "Onboard artisans and record proof of their work",
  },
  {
    role: "artisan",
    title: "Artisan",
    line: "See your work, payments and passport",
  },
  {
    role: "creative",
    title: "Creative",
    line: "Find makers, post requests and view passports",
  },
  {
    role: "manufacturer",
    title: "Manufacturer",
    line: "Track pooled orders back to each maker",
  },
  {
    role: "government",
    title: "Government body",
    line: "Review features and inspect passport data",
  },
];

export const BOTTOM_TABS: Record<Role, BottomTab[]> = {
  steward: [
    { id: "artisans", label: "Artisans", icon: "☺" },
    { id: "passports", label: "Passports", icon: "▣" },
  ],
  artisan: [],
  creative: [
    { id: "clusters", label: "Clusters", icon: "◎" },
    { id: "passport", label: "Passport", icon: "▣" },
    { id: "rfps", label: "RFPs", icon: "📁" },
  ],
  manufacturer: [
    { id: "order", label: "Order", icon: "☰" },
    { id: "passport", label: "Passport", icon: "▣" },
  ],
  government: [
    { id: "clusters", label: "Clusters", icon: "◎" },
    { id: "passport", label: "Passport", icon: "▣" },
    { id: "whats-live", label: "Features", icon: "●" },
  ],
};

export function defaultScreen(role: Role): AppScreen {
  return BOTTOM_TABS[role][0]?.id ?? "home";
}
