"use client";

import { useMemo, useState } from "react";

const BASE_COSTS = {
  artisanPayout: 450,
  shipping: 42.5,
  duty: 31,
  platformFee: 15,
} as const;

function formatUsd(amount: number) {
  return amount.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

type LineItem = {
  label: string;
  amount: number;
  note: string;
  prominent?: boolean;
};

function LogisticsCostCalculator() {
  const [quantity, setQuantity] = useState(1);
  const [locked, setLocked] = useState(false);

  const costs = useMemo(
    () => ({
      artisanPayout: BASE_COSTS.artisanPayout * quantity,
      shipping: BASE_COSTS.shipping * quantity,
      duty: BASE_COSTS.duty * quantity,
      platformFee: BASE_COSTS.platformFee * quantity,
    }),
    [quantity],
  );

  const total =
    costs.artisanPayout + costs.shipping + costs.duty + costs.platformFee;

  function handleQuantityChange(raw: string) {
    setLocked(false);
    const parsed = Number.parseInt(raw, 10);
    if (Number.isNaN(parsed)) return;
    setQuantity(Math.min(10, Math.max(1, parsed)));
  }

  const lineItems: LineItem[] = [
    {
      label: "Direct Artisan Payout",
      amount: costs.artisanPayout,
      note: "100% to cluster artisans",
      prominent: true,
    },
    {
      label: "Eco-Express Shipping",
      amount: costs.shipping,
      note: "Negotiated DHL / India Post rate",
    },
    {
      label: "Estimated Import Duty",
      amount: costs.duty,
      note: "HTS 5007.20 (Silk)",
    },
    {
      label: "Platform Service Fee",
      amount: costs.platformFee,
      note: "Connects supply & compliance",
    },
  ];

  return (
    <section aria-labelledby="logistics-calculator-heading">
      <h2
        id="logistics-calculator-heading"
        className="font-display text-lg font-semibold text-fm-blue mb-3"
      >
        Logistics &amp; landed cost
      </h2>
      <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-neu">
        <h3 className="font-display text-xl font-semibold text-fm-ink">
          Village-to-Doorstep Logistics
        </h3>
        <p className="mt-1 text-sm text-fm-muted">
          Varanasi, India → New York, USA · 5.0 kg textile box (demo)
        </p>

        <div className="mt-4 flex items-center justify-between gap-4 rounded-xl bg-fm-btn-light/60 px-4 py-3 border border-fm-blue/15">
          <label htmlFor="order-quantity" className="text-sm font-medium text-fm-btn-text">
            Order quantity
          </label>
          <input
            id="order-quantity"
            type="number"
            min={1}
            max={10}
            step={1}
            value={quantity}
            onChange={(e) => handleQuantityChange(e.target.value)}
            className="w-20 min-h-[44px] rounded-lg border-2 border-fm-blue/25 bg-white px-3 text-center text-lg font-semibold text-fm-ink focus:border-fm-blue focus:outline-none focus:ring-2 focus:ring-fm-blue/20"
          />
        </div>

        <ul className="mt-5 space-y-0 divide-y divide-slate-100">
          {lineItems.map((item) => (
            <li
              key={item.label}
              className={`flex items-start justify-between gap-4 py-3 first:pt-0 last:pb-0 ${
                item.prominent
                  ? "rounded-xl bg-fm-green-soft/80 -mx-2 px-2 border border-fm-green/20"
                  : ""
              }`}
            >
              <div>
                <p
                  className={`text-sm ${
                    item.prominent ? "font-semibold text-fm-green" : "font-medium text-fm-ink"
                  }`}
                >
                  {item.label}
                </p>
                <p className="text-xs text-fm-muted mt-0.5">{item.note}</p>
              </div>
              <p
                className={`shrink-0 tabular-nums ${
                  item.prominent
                    ? "font-display text-lg font-bold text-fm-green"
                    : "text-sm font-semibold text-fm-ink"
                }`}
              >
                {formatUsd(item.amount)}
              </p>
            </li>
          ))}
        </ul>

        <div className="mt-4 flex items-center justify-between gap-4 rounded-xl bg-fm-surface px-4 py-3 border border-slate-200">
          <p className="font-display font-semibold text-fm-ink">Total Landed Cost</p>
          <p className="font-display text-xl font-bold text-fm-blue tabular-nums">
            {formatUsd(total)}
          </p>
        </div>

        <button
          type="button"
          onClick={() => setLocked(true)}
          className="mt-5 w-full min-h-[52px] rounded-xl bg-fm-btn-bg text-white text-base font-semibold shadow-md hover:bg-fm-btn-text transition-colors"
        >
          {locked ? "Rate locked ✓" : "Confirm & Lock Rate"}
        </button>
        <p className="mt-2 text-center text-xs text-fm-muted">
          Includes automated Digital Product Passport and customs documentation.
        </p>
      </div>
    </section>
  );
}

export function RfpCategoryScreen() {
  const demos = [
    { id: "1", title: "Temple silk · Kanchipuram", status: "Open", closes: "Apr 28" },
    { id: "2", title: "Ajrakh yardage · Kutch", status: "Reviewing", closes: "May 2" },
    { id: "3", title: "Bandhani scarves · Jaipur", status: "Open", closes: "May 10" },
  ] as const;

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-display text-2xl font-semibold text-fm-blue">
          RFPs &amp; direct sourcing
        </h1>
        <p className="mt-2 text-fm-muted text-base">
          Post and browse sourcing requests. This demo shows the layout only.
        </p>
      </header>

      <section aria-labelledby="sourcing-search-heading">
        <h2
          id="sourcing-search-heading"
          className="font-display text-lg font-semibold text-fm-blue mb-3"
        >
          Find clusters &amp; skills
        </h2>
        <label htmlFor="cluster-search-rfp" className="sr-only">
          Search heritage skill or cluster
        </label>
        <input
          id="cluster-search-rfp"
          type="search"
          placeholder="Search skill, cluster, or GI tag…"
          className="w-full min-h-[52px] rounded-xl border-2 border-slate-200 px-4 text-lg placeholder:text-slate-400 focus:border-fm-blue focus:outline-none"
          readOnly
          aria-describedby="search-hint-rfp"
        />
        <p id="search-hint-rfp" className="text-sm text-fm-muted mt-2">
          Full search connects in the live product. This screen is a guided demo.
        </p>
      </section>

      <section aria-labelledby="open-rfp-heading">
        <h2
          id="open-rfp-heading"
          className="font-display text-lg font-semibold text-fm-blue mb-3"
        >
          Open requests (demo)
        </h2>
        <ul className="flex flex-col gap-3">
          {demos.map((r) => (
            <li
              key={r.id}
              className="rounded-2xl border border-slate-100 bg-white p-4 shadow-neu"
            >
              <div className="flex items-start justify-between gap-3">
                <p className="font-display font-semibold text-fm-ink">{r.title}</p>
                <span
                  className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                    r.status === "Open"
                      ? "bg-fm-green-soft text-fm-green"
                      : "bg-fm-orange-soft text-fm-orange"
                  }`}
                >
                  {r.status}
                </span>
              </div>
              <p className="mt-2 text-sm text-fm-muted">Closes {r.closes} (demo)</p>
            </li>
          ))}
        </ul>
      </section>

      <LogisticsCostCalculator />
    </div>
  );
}
