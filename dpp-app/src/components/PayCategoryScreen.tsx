"use client";

import { PayoutToggle } from "./PayoutToggle";

export function PayCategoryScreen() {
  return (
    <div className="space-y-4">
      <header>
        <h1 className="font-display text-2xl font-semibold text-fm-blue">
          Pay &amp; payouts
        </h1>
        <p className="mt-2 text-fm-muted text-base">
          Compare old supply chains with Fashion Mingle on a sample order.
        </p>
      </header>
      <PayoutToggle />
    </div>
  );
}
