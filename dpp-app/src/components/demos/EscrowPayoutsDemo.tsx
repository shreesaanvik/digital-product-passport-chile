"use client";

import { useState } from "react";

const DEPOSIT = 500;
const FIRST_PAYMENT = 150;
const SECOND_PAYMENT = 175;
const FINAL_PAYMENT = 175;

const STEPS = [
  {
    label: "Buyer deposits $500 into escrow",
    paid: 0,
  },
  {
    label: "Steward verifies loom setup, first payment of $150 released to artisan",
    paid: FIRST_PAYMENT,
  },
  {
    label: "Quality check passed, second payment of $175 released",
    paid: FIRST_PAYMENT + SECOND_PAYMENT,
  },
  {
    label: "Shipped, final payment of $175 released",
    paid: FIRST_PAYMENT + SECOND_PAYMENT + FINAL_PAYMENT,
  },
] as const;

export function EscrowPayoutsDemo() {
  const [step, setStep] = useState(0);
  const current = STEPS[step] ?? STEPS[0];
  const held = DEPOSIT - current.paid;
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
          Held in escrow: <strong>${held}</strong>
        </span>
        <span>
          Paid to artisan: <strong>${current.paid}</strong>
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
