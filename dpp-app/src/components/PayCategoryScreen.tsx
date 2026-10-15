"use client";

import { useT } from "@/i18n/LanguageProvider";
import { PayoutToggle } from "./PayoutToggle";

export function PayCategoryScreen() {
  const t = useT();

  return (
    <div className="space-y-4">
      <header>
        <h1 className="font-display text-2xl font-semibold text-fm-blue">{t.pay.title}</h1>
        <p className="mt-2 text-fm-muted text-base">{t.pay.intro}</p>
      </header>
      <PayoutToggle />
    </div>
  );
}
