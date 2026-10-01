"use client";

import Image from "next/image";

type Props = {
  onMenuClick: () => void;
  menuOpen: boolean;
  initial: string;
  tooltip: string;
};

export function AppHeader({ onMenuClick, menuOpen, initial, tooltip }: Props) {
  return (
    <header className="sticky top-0 z-40 bg-fm-surface/95 backdrop-blur-md border-b border-slate-200/80">
      <div className="mx-auto flex max-w-lg items-center justify-between gap-3 px-4 py-3">
        <button
          type="button"
          onClick={onMenuClick}
          className="flex h-11 w-11 flex-col items-center justify-center gap-[5px] rounded-xl bg-white shadow-neu text-fm-blue"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          aria-controls="app-nav-drawer"
        >
          <span className="block h-0.5 w-5 rounded-full bg-current" aria-hidden />
          <span className="block h-0.5 w-5 rounded-full bg-current" aria-hidden />
          <span className="block h-0.5 w-5 rounded-full bg-current" aria-hidden />
        </button>
        <div className="text-center flex flex-col items-center">
          <Image
            src="/logo.png"
            alt="Fashion Mingle"
            width={280}
            height={24}
            className="h-[24px] w-auto"
            style={{ width: "auto", height: "24px" }}
            priority
          />
          <p className="text-xs text-fm-ink -mt-0.5">
            Digital Product Passport
          </p>
        </div>
        <div
          className="flex h-11 w-11 items-center justify-center rounded-full bg-fm-blue text-white font-display font-bold text-xl shadow-md"
          title={tooltip}
          aria-label={tooltip}
        >
          {initial}
        </div>
      </div>
    </header>
  );
}
