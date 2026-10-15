"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useFormat, useT } from "@/i18n/LanguageProvider";
import type { Messages } from "@/i18n/messages/es";
import {
  ARTISAN,
  clusterById,
  clpFromUsd,
  MAIN_ORDER,
  MINGLE_PAYOUT_SHARES,
  OLD_PAYOUT_SHARES,
} from "@/lib/data";

function barColor(id: string, mode: "old" | "new") {
  if (id === "artisan") return mode === "new" ? "bg-fm-green" : "bg-fm-orange";
  if (id === "exporter") return "bg-slate-500";
  if (id === "middlemen") return "bg-fm-pink/80";
  if (id === "other") return "bg-slate-400";
  if (id === "platform") return "bg-fm-btn-bg";
  if (id === "logistics") return "bg-fm-purple/70";
  return "bg-slate-400";
}

function shareLabel(id: string, t: Messages) {
  switch (id) {
    case "exporter":
      return t.pay.exporter;
    case "middlemen":
      return t.pay.middlemen;
    case "other":
      return t.pay.other;
    case "artisan":
      return t.pay.artisan;
    case "platform":
      return t.pay.platform;
    case "logistics":
      return t.pay.logistics;
    default:
      return id;
  }
}

export function PayoutToggle() {
  const t = useT();
  const format = useFormat();
  const [mode, setMode] = useState<"old" | "new">("new");
  const rows = mode === "old" ? OLD_PAYOUT_SHARES : MINGLE_PAYOUT_SHARES;
  const artisanUsd = MAIN_ORDER.split.artisan.usd;
  const clusterName = clusterById("donihue").name;

  return (
    <section
      className="rounded-2xl bg-fm-card p-5 shadow-neu border border-white"
      aria-labelledby="payout-heading"
    >
      <h2
        id="payout-heading"
        className="font-display text-xl font-semibold text-fm-blue mb-1"
      >
        {t.pay.where}
      </h2>
      <p className="text-fm-muted text-base mb-4">{t.pay.whereBody}</p>

      <div
        className="flex rounded-xl bg-slate-100 p-1 mb-6 max-w-md"
        role="group"
        aria-label={t.pay.comparison}
      >
        <button
          type="button"
          onClick={() => setMode("old")}
          className={`flex-1 min-h-[48px] rounded-lg text-base font-semibold transition-colors ${
            mode === "old" ? "bg-white text-fm-pink shadow-sm" : "text-fm-muted"
          }`}
        >
          {t.pay.oldWay}
        </button>
        <button
          type="button"
          onClick={() => setMode("new")}
          className={`flex-1 min-h-[48px] rounded-lg text-base font-semibold transition-colors ${
            mode === "new" ? "bg-white text-fm-green shadow-sm" : "text-fm-muted"
          }`}
        >
          {t.header.brand}
        </button>
      </div>

      <p className="mb-3 font-semibold text-fm-ink">
        {t.pay.buyerPays(format.usd(MAIN_ORDER.buyerPays))}
      </p>

      <div className="space-y-3" role="list">
        {rows.map((row) => (
          <div key={row.id} className="flex items-center gap-3">
            <span className="w-36 shrink-0 text-sm leading-tight text-fm-ink">
              {shareLabel(row.id, t)}
            </span>
            <div className="flex-1 h-10 rounded-lg bg-slate-100 overflow-hidden">
              <motion.div
                layout
                className={`h-full ${barColor(row.id, mode)} rounded-lg`}
                initial={false}
                animate={{ width: `${row.share}%` }}
                transition={{ type: "spring", stiffness: 120, damping: 20 }}
                style={{
                  boxShadow:
                    row.id === "artisan" && mode === "new"
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
        <p className="text-sm text-fm-muted mb-1">{t.pay.sample}</p>
        <p className="text-fm-ink">
          {t.pay.sampleLine({
            name: ARTISAN.name,
            cluster: clusterName,
            usd: format.usd(artisanUsd),
            clp: format.clp(clpFromUsd(artisanUsd)),
          })}
        </p>
      </div>
    </section>
  );
}
