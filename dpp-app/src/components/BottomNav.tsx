"use client";

import { useT } from "@/i18n/LanguageProvider";
import { tabLabel } from "@/i18n/labels";
import type { AppScreen, BottomTab } from "@/lib/roles";

type Props = {
  tabs: BottomTab[];
  active: AppScreen | null;
  onChange: (tab: AppScreen) => void;
};

export function BottomNav({ tabs, active, onChange }: Props) {
  const t = useT();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-30 border-t border-slate-200 bg-white/95 backdrop-blur-md safe-area-pb"
      aria-label={t.nav.main}
    >
      <div className="mx-auto flex max-w-lg justify-around px-2 py-2">
        {tabs.map((item) => {
          const isActive = active === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onChange(item.id)}
              className={`flex min-w-[72px] flex-col items-center gap-0.5 rounded-xl px-1 py-2 text-center text-sm leading-tight ${
                isActive ? "text-fm-blue font-semibold" : "text-fm-muted"
              }`}
              aria-current={isActive ? "page" : undefined}
            >
              <span className="text-xl" aria-hidden>
                {item.icon}
              </span>
              {tabLabel(item.id, t)}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
