"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  ARTISAN,
  clusterById,
  formatInr,
  formatUsd,
  inrFromUsd,
  MAIN_ORDER,
  MINGLE_PAYOUT_SHARES,
  OLD_PAYOUT_SHARES,
} from "@/lib/data";

function barColor(label: string, mode: "old" | "new") {
  if (label === "Artisan") return mode === "new" ? "bg-fm-green" : "bg-fm-orange";
  if (label === "Exporter") return "bg-slate-500";
  if (label === "Middlemen") return "bg-fm-pink/80";
  if (label === "Other costs") return "bg-slate-400";
  if (label === "Platform fee") return "bg-fm-btn-bg";
  if (label === "Logistics") return "bg-fm-purple/70";
  return "bg-slate-400";
}

export function PayoutToggle() {
  const [mode, setMode] = useState<"old" | "new">("new");
  const rows = mode === "old" ? OLD_PAYOUT_SHARES : MINGLE_PAYOUT_SHARES;
  const artisanUsd = MAIN_ORDER.split.artisan.usd;
  const clusterName = clusterById("kutch").name;

  return (
    <section
      className="rounded-2xl bg-fm-card p-5 shadow-neu border border-white"
      aria-labelledby="payout-heading"
    >
      <h2
        id="payout-heading"
        className="font-display text-xl font-semibold text-fm-blue mb-1"
      >
        Where the money goes
      </h2>
      <p className="text-fm-muted text-base mb-4">
        One switch compares old supply chains with Fashion Mingle. Bars show
        share of each step.
      </p>

      <div
        className="flex rounded-xl bg-slate-100 p-1 mb-6 max-w-md"
        role="group"
        aria-label="Comparison mode"
      >
        <button
          type="button"
          onClick={() => setMode("old")}
          className={`flex-1 min-h-[48px] rounded-lg text-base font-semibold transition-colors ${
            mode === "old" ? "bg-white text-fm-pink shadow-sm" : "text-fm-muted"
          }`}
        >
          Old way
        </button>
        <button
          type="button"
          onClick={() => setMode("new")}
          className={`flex-1 min-h-[48px] rounded-lg text-base font-semibold transition-colors ${
            mode === "new" ? "bg-white text-fm-green shadow-sm" : "text-fm-muted"
          }`}
        >
          Fashion Mingle
        </button>
      </div>

      <p className="mb-3 font-semibold text-fm-ink">
        Buyer pays {formatUsd(MAIN_ORDER.buyerPays)}
      </p>

      <div className="space-y-3" role="list">
        {rows.map((row) => (
          <div key={row.label} className="flex items-center gap-3">
            <span className="w-28 shrink-0 text-sm text-fm-ink">{row.label}</span>
            <div className="flex-1 h-10 rounded-lg bg-slate-100 overflow-hidden">
              <motion.div
                layout
                className={`h-full ${barColor(row.label, mode)} rounded-lg`}
                initial={false}
                animate={{ width: `${row.share}%` }}
                transition={{ type: "spring", stiffness: 120, damping: 20 }}
                style={{
                  boxShadow:
                    row.label === "Artisan" && mode === "new"
                      ? "0 0 20px rgba(102, 187, 106, 0.45)"
                      : undefined,
                }}
              />
            </div>
            <span className="w-12 text-right font-mono text-sm text-fm-muted">
              {row.share}%
            </span>
          </div>
        ))}
      </div>

      <div className="mt-6 rounded-xl bg-fm-surface p-4 border border-slate-200">
        <p className="text-sm text-fm-muted mb-1">Sample order</p>
        <p className="text-fm-ink">
          {`${ARTISAN.name}, ${clusterName}. Artisan receives ${formatUsd(artisanUsd)} (${formatInr(inrFromUsd(artisanUsd))}) on this order.`}
        </p>
      </div>
    </section>
  );
}
