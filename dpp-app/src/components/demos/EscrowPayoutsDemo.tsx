"use client";

import { useState } from "react";
import { useFormat, useT } from "@/i18n/LanguageProvider";
import { phrase } from "@/i18n/labels";
import { clpFromUsd, MAIN_ORDER } from "@/lib/data";

export function EscrowPayoutsDemo() {
  const t = useT();
  const format = useFormat();
  const artisanUsd = MAIN_ORDER.split.artisan.usd;
  const otherUsd = MAIN_ORDER.buyerPays - artisanUsd;
  const steps = [
    t.escrow.buyerPays(format.usd(MAIN_ORDER.buyerPays), format.usd(artisanUsd), format.usd(otherUsd)),
    ...MAIN_ORDER.milestones.map((milestone) =>
      t.escrow.released(
        phrase(milestone.release, t),
        format.usd(milestone.usd),
        format.clp(clpFromUsd(milestone.usd)),
      ),
    ),
  ];
  const paidByStep = [
    0,
    ...MAIN_ORDER.milestones.map((_, index) =>
      MAIN_ORDER.milestones.slice(0, index + 1).reduce((sum, item) => sum + item.usd, 0),
    ),
  ];
  const [step, setStep] = useState(0);
  const paid = paidByStep[step] ?? 0;
  const held = artisanUsd - paid;
  const atEnd = step >= steps.length - 1;

  return (
    <div className="space-y-4">
      <ol className="space-y-3" aria-label={t.escrow.steps}>
        {steps.map((label, index) => {
          const state = index < step ? "done" : index === step ? "current" : "upcoming";
          return (
            <li
              key={label}
              className="flex items-start gap-3"
              aria-current={state === "current" ? "step" : undefined}
            >
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
              <span className={state === "upcoming" ? "text-fm-muted" : "text-fm-ink"}>{label}</span>
            </li>
          );
        })}
      </ol>

      <p
        className="flex flex-wrap gap-x-4 gap-y-1 rounded-xl bg-fm-surface px-4 py-3 text-fm-ink"
        aria-live="polite"
      >
        <span>
          {t.escrow.held} <strong>{format.usd(held)}</strong>
        </span>
        <span>
          {t.escrow.paid} <strong>{format.usd(paid)}</strong>
        </span>
      </p>

      <button
        type="button"
        onClick={() => setStep((value) => Math.min(value + 1, steps.length - 1))}
        disabled={atEnd}
        className="btn-primary min-h-[52px] w-full text-lg font-semibold disabled:opacity-50"
      >
        {t.escrow.next}
      </button>
    </div>
  );
}
