"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { DEMO_ORDER } from "@/lib/data";

const TRADITIONAL = [
  { label: "Brand pays", pct: 100, color: "bg-slate-400" },
  { label: "Exporter", pct: 40, color: "bg-slate-500" },
  { label: "Middleman", pct: 30, color: "bg-fm-pink/80" },
  { label: "Artisan", pct: 15, color: "bg-fm-orange" },
];

const MINGLE = [
  { label: "Brand pays", pct: 100, color: "bg-slate-400" },
  { label: "Platform fee", pct: 5, color: "bg-fm-btn-bg" },
  { label: "Logistics", pct: 15, color: "bg-fm-purple/70" },
  { label: "Artisan", pct: 80, color: "bg-fm-green" },
];

export function PayoutToggle() {
  const [mode, setMode] = useState<"old" | "new">("new");
  const rows = mode === "old" ? TRADITIONAL : MINGLE;

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
        share of each step (demo numbers).
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

      <div className="space-y-3" role="list">
        {rows.map((row) => (
          <div key={row.label} className="flex items-center gap-3">
            <span className="w-28 shrink-0 text-sm text-fm-ink">{row.label}</span>
            <div className="flex-1 h-10 rounded-lg bg-slate-100 overflow-hidden">
              <motion.div
                layout
                className={`h-full ${row.color} rounded-lg`}
                initial={false}
                animate={{ width: `${row.pct}%` }}
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
              {row.pct}%
            </span>
          </div>
        ))}
      </div>

      <div className="mt-6 rounded-xl bg-fm-surface p-4 border border-slate-200">
        <p className="text-sm text-fm-muted mb-1">Sample order (demo data)</p>
        <p className="text-fm-ink">
          <strong>{DEMO_ORDER.artisan}</strong> · {DEMO_ORDER.village}
        </p>
        <p className="text-fm-green font-semibold mt-2">
          Artisan payout this order: ${DEMO_ORDER.artisan_payout.toFixed(2)}
        </p>
      </div>
    </section>
  );
}
