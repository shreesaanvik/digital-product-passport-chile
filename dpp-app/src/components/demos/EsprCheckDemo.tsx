"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ESPR_SAMPLE_FIELDS } from "./esprFields";

type RowState = "pending" | "present" | "missing";

const MISSING_COUNT = ESPR_SAMPLE_FIELDS.filter((field) => !field.present).length;

export function EsprCheckDemo() {
  const [running, setRunning] = useState(false);
  const [revealed, setRevealed] = useState(0);
  const [finished, setFinished] = useState(false);
  const [filled, setFilled] = useState(false);

  useEffect(() => {
    if (!running) return;
    if (revealed >= ESPR_SAMPLE_FIELDS.length) {
      setRunning(false);
      setFinished(true);
      return;
    }
    const timer = window.setTimeout(() => setRevealed((count) => count + 1), 380);
    return () => window.clearTimeout(timer);
  }, [running, revealed]);

  function runCheck() {
    setFilled(false);
    setFinished(false);
    setRevealed(0);
    setRunning(true);
  }

  function rowState(index: number, present: boolean): RowState {
    if (revealed <= index) return "pending";
    if (present || filled) return "present";
    return "missing";
  }

  return (
    <div className="space-y-4">
      <ul className="space-y-2" aria-label="ESPR fields">
        {ESPR_SAMPLE_FIELDS.map((field, index) => {
          const state = rowState(index, field.present);
          return (
            <li
              key={field.label}
              className="flex items-center gap-3 rounded-xl border border-slate-100 bg-white px-3 py-2"
            >
              <span
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                  state === "present"
                    ? "bg-fm-green text-white"
                    : state === "missing"
                      ? "bg-red-600 text-white"
                      : "bg-slate-200 text-fm-muted"
                }`}
                aria-hidden
              >
                {state === "pending" ? (
                  index + 1
                ) : (
                  <motion.span
                    key={state}
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                  >
                    {state === "present" ? "✓" : "✕"}
                  </motion.span>
                )}
              </span>
              <span className="text-fm-ink">{field.label}</span>
              <span className="sr-only">
                {state === "present" ? "Present" : state === "missing" ? "Missing" : "Waiting"}
              </span>
            </li>
          );
        })}
      </ul>

      <button
        type="button"
        onClick={runCheck}
        disabled={running}
        className="btn-primary min-h-[52px] w-full text-lg font-semibold disabled:opacity-60"
      >
        Run check
      </button>

      {finished && !filled && (
        <p className="text-sm font-semibold text-red-700" role="status">
          {MISSING_COUNT === 1
            ? "1 required field missing. Product would be held before shipping."
            : `${MISSING_COUNT} required fields missing. Product would be held before shipping.`}
        </p>
      )}

      {finished && !filled && (
        <button
          type="button"
          onClick={() => setFilled(true)}
          className="btn-outline min-h-[52px] w-full font-semibold"
        >
          Fill missing fields
        </button>
      )}

      {filled && (
        <p className="text-sm font-semibold text-fm-green" role="status">
          Ready to ship
        </p>
      )}

      <p className="text-sm text-fm-muted">
        Final textile requirements under ESPR are still being set by the EU.
      </p>
    </div>
  );
}
