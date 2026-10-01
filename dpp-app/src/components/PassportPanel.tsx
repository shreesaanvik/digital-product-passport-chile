"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { PASSPORT_JSON_LD } from "@/lib/data";

const ARTISAN_HERO_IMAGE =
  "https://images.unsplash.com/photo-1638310533874-6c124c012e1d?auto=format&fit=crop&w=1400&q=85";

const TIMELINE = [
  { step: "Loom setup", status: "done" },
  { step: "Weaving", status: "done" },
  { step: "Quality check", status: "current" },
  { step: "Ship to warehouse", status: "upcoming" },
] as const;

const BADGES = [
  { label: "Hand-woven", icon: "◇" },
  { label: "Natural dye", icon: "◆" },
  { label: "Fair wage step", icon: "✓" },
];

type PassportPanelProps = {
  heritageName: string;
  heritageCraft: string;
  defaultShowTech?: boolean;
};

export function PassportPanel({
  heritageName,
  heritageCraft,
  defaultShowTech = false,
}: PassportPanelProps) {
  const [showTech, setShowTech] = useState(defaultShowTech);

  return (
    <section
      className="rounded-2xl bg-fm-card p-5 shadow-neu border border-white overflow-hidden"
      aria-labelledby="passport-heading"
    >
      <div className="mb-4 flex items-center gap-3">
        <div
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border-2 border-fm-blue/20 bg-white"
          role="img"
          aria-label="Demo QR code placeholder"
        >
          <span className="text-xl text-fm-blue/40" aria-hidden>
            ▣
          </span>
        </div>
        <p className="text-xs text-fm-muted leading-snug">
          Scan on a real label → opens this passport
        </p>
      </div>

      <h2
        id="passport-heading"
        className="font-display text-xl font-semibold text-fm-blue mb-1"
      >
        Digital Product Passport
      </h2>
      <p className="text-fm-muted text-base mb-4">
        What a shopper or customs officer sees after scanning the QR code on the
        label.
      </p>

      <div className="-mx-5 mb-4">
        <div className="relative h-[200px] w-full overflow-hidden">
          <Image
            src={ARTISAN_HERO_IMAGE}
            alt={`Artisan at a weaving loom, ${heritageName}, ${heritageCraft}`}
            fill
            sizes="(max-width: 512px) 100vw, 512px"
            className="object-cover object-center scale-105"
            priority
          />
          <div
            className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-black/15"
            aria-hidden
          />
          <div className="absolute inset-x-0 bottom-0 p-5">
            <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-white/65">
              Heritage story
            </p>
            <div className="mt-2 h-px w-10 bg-fm-blue/80" aria-hidden />
            <p className="font-display text-[1.65rem] font-semibold leading-tight text-white mt-3 tracking-tight">
              {heritageName}
            </p>
            <p className="text-base font-normal text-white/90 mt-1 tracking-wide">
              {heritageCraft}
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {BADGES.map((b) => (
          <span
            key={b.label}
            className="inline-flex items-center gap-1 rounded-full bg-fm-green-soft text-fm-green px-3 py-1.5 text-sm font-medium border border-fm-green/25"
          >
            <span aria-hidden>{b.icon}</span> {b.label}
          </span>
        ))}
      </div>

      <h3 className="text-sm font-semibold text-fm-ink uppercase tracking-wide mb-2">
        Journey
      </h3>
      <ol className="space-y-2 mb-4">
        {TIMELINE.map((t, i) => (
          <li key={t.step} className="flex items-center gap-3 text-base">
            <span
              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                t.status === "done"
                  ? "bg-fm-green text-white"
                  : t.status === "current"
                    ? "bg-fm-orange text-white"
                    : "bg-slate-200 text-fm-muted"
              }`}
              aria-hidden
            >
              {i + 1}
            </span>
            <span className={t.status === "upcoming" ? "text-fm-muted" : "text-fm-ink"}>
              {t.step}
            </span>
          </li>
        ))}
      </ol>

      <button
        type="button"
        onClick={() => setShowTech((v) => !v)}
        className="w-full min-h-[52px] rounded-xl border-2 border-fm-btn-bg text-fm-btn-text font-semibold text-lg hover:bg-fm-surface transition-colors"
        aria-expanded={showTech}
      >
        {showTech ? "Hide technical details" : "Technical view (EU / customs)"}
      </button>

      <AnimatePresence>
        {showTech && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <pre
              className="mt-3 p-3 rounded-xl bg-slate-900 text-fm-green text-xs overflow-x-auto leading-relaxed"
              tabIndex={0}
            >
              {JSON.stringify(PASSPORT_JSON_LD, null, 2)}
            </pre>
            <p className="text-xs text-fm-muted mt-2">
              JSON-LD helps search engines and border systems read the same facts.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
