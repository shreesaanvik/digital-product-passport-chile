"use client";

import Image from "next/image";
import { useT } from "@/i18n/LanguageProvider";
import { EXPLORE_ROLES, type Role } from "@/lib/roles";
import { HeaderMarks } from "./LangToggle";

type Props = {
  onSelect: (role: Role) => void;
};

export function ExploreAsScreen({ onSelect }: Props) {
  const t = useT();
  const lines: Record<Role, string> = {
    steward: t.explore.steward,
    artisan: t.explore.artisan,
    creative: t.explore.creative,
    manufacturer: t.explore.manufacturer,
    government: t.explore.government,
  };

  return (
    <main className="mx-auto max-w-lg px-4 py-8">
      <div className="mb-8 flex flex-col items-center text-center">
        <Image
          src="/logo.png"
          alt={t.header.brand}
          width={280}
          height={32}
          className="h-8 w-auto"
          style={{ width: "auto", height: "32px" }}
          priority
        />
        <HeaderMarks />
        <h1 className="font-display mt-6 text-3xl font-semibold text-fm-blue">
          {t.explore.title}
        </h1>
        <p className="mt-2 text-fm-muted">{t.explore.subtitle}</p>
      </div>

      <ul className="flex flex-col gap-3">
        {EXPLORE_ROLES.map((role) => (
          <li key={role}>
            <button
              type="button"
              onClick={() => onSelect(role)}
              className="w-full rounded-2xl border border-slate-100 bg-white p-5 text-left shadow-neu transition-colors hover:bg-fm-surface min-h-[88px]"
            >
              <span className="block font-display text-xl font-semibold text-fm-ink">
                {t.roles[role]}
              </span>
              <span className="mt-1 block text-sm text-fm-muted">{lines[role]}</span>
            </button>
          </li>
        ))}
      </ul>
    </main>
  );
}
