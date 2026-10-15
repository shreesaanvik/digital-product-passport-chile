"use client";

import { useState } from "react";
import { formatClp, formatUsd, clpFromUsd, MAIN_ORDER } from "@/lib/data";

const ARTISAN_USD = MAIN_ORDER.split.artisan.usd;
const OTHER_USD = MAIN_ORDER.buyerPays - ARTISAN_USD;

const STEPS = [
  {
    label: `Buyer pays ${formatUsd(MAIN_ORDER.buyerPays)}. ${formatUsd(ARTISAN_USD)} held for the artisan, ${formatUsd(OTHER_USD)} covers logistics and platform fee.`,
    paid: 0,
  },
  ...MAIN_ORDER.milestones.map((milestone, index) => {
    const paid = MAIN_ORDER.milestones
      .slice(0, index + 1)
      .reduce((sum, item) => sum + item.usd, 0);
    return {
      label: `${milestone.release}, ${formatUsd(milestone.usd)} (${formatClp(clpFromUsd(milestone.usd))}) released`,
      paid,
    };
  }),
];

export function EscrowPayoutsDemo() {
  const [step, setStep] = useState(0);
  const current = STEPS[step] ?? STEPS[0];
  const held = ARTISAN_USD - current.paid;
  const atEnd = step >= STEPS.length - 1;

  return (
    <div className="space-y-4">
      <ol className="space-y-3" aria-label="Escrow steps">
        {STEPS.map((item, index) => {
          const state = index < step ? "done" : index === step ? "current" : "upcoming";
          return (
            <li key={item.label} className="flex items-start gap-3" aria-current={state === "current" ? "step" : undefined}>
              <span
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                  state === "done"
                    ? "bg-fm-green text-white"
                    : state === "current"
                      ? "bg-fm-blue text-white"
                      : "bg-slate-200 text-fm-muted"
                }`}
                aria-hidden
              >
                {index + 1}
              </span>
              <span className={state === "upcoming" ? "text-fm-muted" : "text-fm-ink"}>
                {item.label}
              </span>
            </li>
          );
        })}
      </ol>

      <p className="flex flex-wrap gap-x-4 gap-y-1 rounded-xl bg-fm-surface px-4 py-3 text-fm-ink" aria-live="polite">
        <span>
          Held in escrow: <strong>{formatUsd(held)}</strong>
        </span>
        <span>
          Paid to artisan: <strong>{formatUsd(current.paid)}</strong>
        </span>
      </p>

      <button
        type="button"
        onClick={() => setStep((value) => Math.min(value + 1, STEPS.length - 1))}
        disabled={atEnd}
        className="btn-primary min-h-[52px] w-full text-lg font-semibold disabled:opacity-50"
      >
        Next step
      </button>
    </div>
  );
}
