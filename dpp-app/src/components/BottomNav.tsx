"use client";

import type { MainNavTab } from "./NavMenuDrawer";

type Props = {
  active: MainNavTab;
  onChange: (t: MainNavTab) => void;
};

const NAV: { id: MainNavTab; label: string; icon: string }[] = [
  { id: "home", label: "Home", icon: "⌂" },
  { id: "rfp", label: "RFPs", icon: "📁" },
  { id: "pay", label: "Pay", icon: "$" },
  { id: "reports", label: "Reports", icon: "▤" },
];

export function BottomNav({ active, onChange }: Props) {
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-30 border-t border-slate-200 bg-white/95 backdrop-blur-md safe-area-pb"
      aria-label="Main"
    >
      <div className="mx-auto flex max-w-lg justify-around px-2 py-2">
        {NAV.map((item) => {
          const isActive = active === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onChange(item.id)}
              className={`flex min-w-[72px] flex-col items-center gap-0.5 rounded-xl px-2 py-2 text-sm ${
                isActive ? "text-fm-blue font-semibold" : "text-fm-muted"
              }`}
              aria-current={isActive ? "page" : undefined}
            >
              <span className="text-xl" aria-hidden>
                {item.icon}
              </span>
              {item.label}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
