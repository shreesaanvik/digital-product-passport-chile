"use client";

import { useEffect } from "react";
import { useT } from "@/i18n/LanguageProvider";
import type { AppScreen } from "@/lib/roles";

type MenuScreen = Extract<AppScreen, "story" | "pay" | "whats-live">;

type Props = {
  open: boolean;
  onClose: () => void;
  onSwitchRole: () => void;
  onOpenScreen: (screen: MenuScreen) => void;
  activeScreen: AppScreen | null;
};

const ITEM_IDS = ["switch-role", "story", "pay", "whats-live"] as const;

export function NavMenuDrawer({
  open,
  onClose,
  onSwitchRole,
  onOpenScreen,
  activeScreen,
}: Props) {
  const t = useT();
  const titles = {
    "switch-role": t.nav.switchRole,
    story: t.nav.story,
    pay: t.nav.pay,
    "whats-live": t.nav.features,
  } as const;

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <div
        className={`fixed inset-0 z-[60] bg-fm-ink/40 backdrop-blur-[2px] transition-opacity duration-200 ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        aria-hidden={!open}
        onClick={onClose}
      />
      <div
        id="app-nav-drawer"
        className={`fixed left-0 top-0 z-[70] flex h-full w-[min(100%,20rem)] flex-col bg-white shadow-2xl transition-transform duration-200 ease-out ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
        role="dialog"
        aria-modal="true"
        aria-label={t.nav.mainMenu}
        aria-hidden={!open}
      >
        <div className="flex items-center justify-between border-b border-slate-200 px-4 py-4">
          <p className="font-display text-lg font-semibold text-fm-blue">{t.nav.menu}</p>
          <button
            type="button"
            onClick={onClose}
            className="flex h-11 min-w-[44px] items-center justify-center rounded-xl text-fm-muted hover:bg-fm-surface hover:text-fm-ink"
            aria-label={t.header.closeMenu}
          >
            <span className="text-2xl leading-none" aria-hidden>
              ×
            </span>
          </button>
        </div>
        <nav className="flex-1 overflow-y-auto px-2 py-3" aria-label={t.nav.sections}>
          <ul className="flex flex-col gap-1">
            {ITEM_IDS.map((id) => {
              const isActive = id !== "switch-role" && activeScreen === id;
              return (
                <li key={id}>
                  <button
                    type="button"
                    onClick={() => {
                      if (id === "switch-role") onSwitchRole();
                      else onOpenScreen(id);
                    }}
                    className={`w-full min-h-[52px] rounded-xl px-4 py-3 text-left transition-colors ${
                      isActive
                        ? "bg-fm-btn-light border border-fm-blue/25"
                        : "hover:bg-fm-surface border border-transparent"
                    }`}
                  >
                    <span
                      className={`block font-display font-semibold ${
                        isActive ? "text-fm-btn-text" : "text-fm-ink"
                      }`}
                    >
                      {titles[id]}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </>
  );
}
