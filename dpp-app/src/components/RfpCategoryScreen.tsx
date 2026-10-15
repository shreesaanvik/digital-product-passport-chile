"use client";

import { useMemo, useState } from "react";
import { useFormat, useT } from "@/i18n/LanguageProvider";
import { phrase } from "@/i18n/labels";
import type { Messages } from "@/i18n/messages/es";
import { LANDED_COST_LINES } from "@/lib/data";
import type { DayMonth } from "@/lib/format";

function lineLabel(id: string, t: Messages) {
  switch (id) {
    case "artisan":
      return t.rfp.artisanPayout;
    case "shipping":
      return t.rfp.shipping;
    case "duty":
      return t.rfp.importDuty;
    case "platform":
      return t.rfp.platformFee;
    default:
      return id;
  }
}

function lineNote(note: string, t: Messages) {
  switch (note) {
    case "paidOnOrder":
      return t.rfp.paidOnOrder;
    case "shippingRate":
      return t.rfp.shippingRate;
    case "dutyNote":
      return t.rfp.dutyNote;
    case "platformNote":
      return t.rfp.platformNote;
    default:
      return note;
  }
}

function LogisticsCostCalculator() {
  const t = useT();
  const format = useFormat();
  const [quantity, setQuantity] = useState(1);
  const [locked, setLocked] = useState(false);

  const lineItems = useMemo(
    () =>
      LANDED_COST_LINES.map((line) => ({
        ...line,
        amount: line.amount * quantity,
      })),
    [quantity],
  );

  const total = lineItems.reduce((sum, line) => sum + line.amount, 0);

  function handleQuantityChange(raw: string) {
    setLocked(false);
    const parsed = Number.parseInt(raw, 10);
    if (Number.isNaN(parsed)) return;
    setQuantity(Math.min(10, Math.max(1, parsed)));
  }

  return (
    <section aria-labelledby="logistics-calculator-heading">
      <h2
        id="logistics-calculator-heading"
        className="font-display text-lg font-semibold text-fm-blue mb-3"
      >
        {t.rfp.logistics}
      </h2>
      <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-neu">
        <h3 className="font-display text-xl font-semibold text-fm-ink">{t.rfp.villageDoor}</h3>
        <p className="mt-1 text-sm text-fm-muted">
          {t.rfp.routeFrom} {t.rfp.to} {t.rfp.routeTo}
        </p>

        <div className="mt-4 flex items-center justify-between gap-4 rounded-xl bg-fm-btn-light/60 px-4 py-3 border border-fm-blue/15">
          <label htmlFor="order-quantity" className="text-sm font-medium text-fm-btn-text">
            {t.rfp.quantity}
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
              key={item.id}
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
                  {lineLabel(item.id, t)}
                </p>
                <p className="text-xs text-fm-muted mt-0.5">{lineNote(item.note, t)}</p>
              </div>
              <p
                className={`shrink-0 tabular-nums ${
                  item.prominent
                    ? "font-display text-lg font-bold text-fm-green"
                    : "text-sm font-semibold text-fm-ink"
                }`}
              >
                {format.usd(item.amount)}
              </p>
            </li>
          ))}
        </ul>

        <div className="mt-4 flex items-center justify-between gap-4 rounded-xl bg-fm-surface px-4 py-3 border border-slate-200">
          <p className="font-display font-semibold text-fm-ink">{t.rfp.total}</p>
          <p className="font-display text-xl font-bold text-fm-blue tabular-nums">
            {format.usd(total)}
          </p>
        </div>

        <button
          type="button"
          onClick={() => setLocked(true)}
          className="mt-5 w-full min-h-[52px] rounded-xl bg-fm-btn-bg text-white text-base font-semibold shadow-md hover:bg-fm-btn-text transition-colors"
        >
          {locked ? t.rfp.locked : t.rfp.confirm}
        </button>
        <p className="mt-2 text-center text-xs text-fm-muted">{t.rfp.includes}</p>
      </div>
    </section>
  );
}

const REQUESTS: { id: string; title: string; status: string; closes: DayMonth }[] = [
  { id: "1", title: "Chamantos · Doñihue", status: "Open", closes: { day: 14, month: 11 } },
  {
    id: "2",
    title: "Lana chilota sweaters · Chiloé",
    status: "Reviewing",
    closes: { day: 21, month: 11 },
  },
  {
    id: "3",
    title: "Trariwe belts · Araucanía",
    status: "Open",
    closes: { day: 5, month: 12 },
  },
];

export function RfpCategoryScreen() {
  const t = useT();
  const format = useFormat();
  const [query, setQuery] = useState("");
  const needle = query.trim().toLowerCase();
  const requests = REQUESTS.filter((request) => {
    const title = phrase(request.title, t).toLowerCase();
    return title.includes(needle) || request.title.toLowerCase().includes(needle);
  });

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-display text-2xl font-semibold text-fm-blue">{t.rfp.title}</h1>
        <p className="mt-2 text-fm-muted text-base">{t.rfp.intro}</p>
      </header>

      <section aria-labelledby="sourcing-search-heading">
        <h2
          id="sourcing-search-heading"
          className="font-display text-lg font-semibold text-fm-blue mb-3"
        >
          {t.rfp.find}
        </h2>
        <label htmlFor="cluster-search-rfp" className="sr-only">
          {t.rfp.searchLabel}
        </label>
        <input
          id="cluster-search-rfp"
          type="search"
          placeholder={t.rfp.searchPlaceholder}
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          className="w-full min-h-[52px] rounded-xl border-2 border-slate-200 px-4 text-lg placeholder:text-slate-400 focus:border-fm-blue focus:outline-none"
        />
      </section>

      <section aria-labelledby="open-rfp-heading">
        <h2
          id="open-rfp-heading"
          className="font-display text-lg font-semibold text-fm-blue mb-3"
        >
          {t.rfp.openRequests}
        </h2>
        {requests.length === 0 ? (
          <p className="text-sm text-fm-muted">{t.rfp.noMatch}</p>
        ) : (
          <ul className="flex flex-col gap-3">
            {requests.map((r) => (
              <li
                key={r.id}
                className="rounded-2xl border border-slate-100 bg-white p-4 shadow-neu"
              >
                <div className="flex items-start justify-between gap-3">
                  <p className="font-display font-semibold text-fm-ink">{phrase(r.title, t)}</p>
                  <span
                    className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                      r.status === "Open"
                        ? "bg-fm-green-soft text-fm-green"
                        : "bg-fm-orange-soft text-fm-orange"
                    }`}
                  >
                    {phrase(r.status, t)}
                  </span>
                </div>
                <p className="mt-2 text-sm text-fm-muted">{t.rfp.closes(format.dayMonth(r.closes))}</p>
              </li>
            ))}
          </ul>
        )}
      </section>

      <LogisticsCostCalculator />
    </div>
  );
}
