"use client";

import { useState, type ReactNode } from "react";
import { DemoSheet } from "./demos/DemoSheet";
import { EsprCheckDemo } from "./demos/EsprCheckDemo";
import { EscrowPayoutsDemo } from "./demos/EscrowPayoutsDemo";
import { ESPR_SAMPLE_FIELDS } from "./demos/esprFields";
import { FingerprintDemo } from "./demos/FingerprintDemo";
import { GovIdSyncDemo } from "./demos/GovIdSyncDemo";
import { PassportViewerDemo } from "./demos/PassportViewerDemo";
import { ProofOfHandDemo } from "./demos/ProofOfHandDemo";

type DemoId = "passport" | "gov-id" | "fingerprint" | "escrow" | "espr" | "proof";

type Capability = {
  id: DemoId;
  name: string;
  description: string;
  status: "working" | "planned";
  statusLabel: string;
};

const CAPABILITIES: Capability[] = [
  {
    id: "passport",
    name: "Passport viewer",
    description: "The page a buyer or customs officer opens from the label QR code.",
    status: "working",
    statusLabel: "Working (sample data)",
  },
  {
    id: "gov-id",
    name: "Government ID sync",
    description: "Pull a verified artisan profile from a national ID database.",
    status: "planned",
    statusLabel: "Planned",
  },
  {
    id: "fingerprint",
    name: "Tamper-proof fingerprint",
    description: "A unique fingerprint of the passport data so any later change is detectable.",
    status: "planned",
    statusLabel: "Planned",
  },
  {
    id: "escrow",
    name: "Escrow payouts",
    description: "Buyer funds are held and released to the artisan at each verified milestone.",
    status: "planned",
    statusLabel: "Planned",
  },
  {
    id: "espr",
    name: "ESPR field check",
    description: "Check a passport against required EU fields before shipping.",
    status: "planned",
    statusLabel: "Planned",
  },
  {
    id: "proof",
    name: "Proof of Hand capture",
    description: "The steward records geo-tagged, time-stamped evidence of the artisan's work.",
    status: "planned",
    statusLabel: "Planned",
  },
];

const DATA_HANDLING = [
  "Consent is given verbally, in the artisan's language, and recorded by the steward.",
  "Artisans do not need an account, device or fees.",
  "Data storage location and access rules are to be confirmed with government partners.",
];

const PRESENT_FIELDS = ESPR_SAMPLE_FIELDS.filter((field) => field.present).map(
  (field) => field.label,
);
const MISSING_FIELDS = ESPR_SAMPLE_FIELDS.filter((field) => !field.present).map(
  (field) => field.label,
);

function StatusBadge({
  tone,
  children,
}: {
  tone: "working" | "planned";
  children: ReactNode;
}) {
  const toneClass =
    tone === "working"
      ? "border-fm-green/30 bg-fm-green-soft text-fm-green"
      : "border-amber-300 bg-amber-100 text-amber-900";
  return (
    <span
      className={`inline-flex shrink-0 items-center rounded-full border px-2.5 py-1 text-xs font-semibold ${toneClass}`}
    >
      {children}
    </span>
  );
}

type Props = {
  onOpenPassport: () => void;
};

export function WhatsLiveScreen({ onOpenPassport }: Props) {
  const [activeId, setActiveId] = useState<DemoId | null>(null);
  const [resetKey, setResetKey] = useState(0);
  const active = CAPABILITIES.find((item) => item.id === activeId) ?? null;

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-display text-2xl font-semibold text-fm-blue">What&apos;s live</h1>
        <p className="mt-2 text-fm-muted">
          What works in this demo today, what is planned, and a walkthrough of each.
        </p>
      </header>

      <ul className="flex flex-wrap gap-2" aria-label="Status key">
        <li>
          <StatusBadge tone="working">Working</StatusBadge>
        </li>
        <li>
          <StatusBadge tone="planned">Planned</StatusBadge>
        </li>
      </ul>

      <ul className="flex flex-col gap-3">
        {CAPABILITIES.map((item) => (
          <li
            key={item.id}
            className="rounded-2xl border border-slate-100 bg-white p-4 shadow-neu"
          >
            <div className="flex items-start justify-between gap-3">
              <p className="font-display text-lg font-semibold text-fm-ink">{item.name}</p>
              <StatusBadge tone={item.status}>{item.statusLabel}</StatusBadge>
            </div>
            <p className="mt-1 text-sm text-fm-muted">{item.description}</p>
            <button
              type="button"
              onClick={() => setActiveId(item.id)}
              className="btn-outline mt-3 min-h-[48px] w-full font-semibold"
            >
              See demo
            </button>
          </li>
        ))}
      </ul>

      <section className="rounded-2xl border border-slate-100 bg-white p-4 shadow-neu">
        <h2 className="font-display text-lg font-semibold text-fm-ink">
          How data is handled (planned approach)
        </h2>
        <ul className="mt-2 space-y-2 text-sm text-fm-ink">
          {DATA_HANDLING.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
      </section>

      <section className="rounded-2xl border border-slate-100 bg-white p-4 shadow-neu">
        <h2 className="font-display text-lg font-semibold text-fm-ink">
          ESPR fields in this sample passport
        </h2>
        <p className="mt-2 text-sm text-fm-ink">Present: {PRESENT_FIELDS.join(", ")}.</p>
        <p className="mt-1 text-sm text-fm-ink">Missing: {MISSING_FIELDS.join(", ")}.</p>
      </section>

      <DemoSheet
        open={active != null}
        title={active?.name ?? "Demo"}
        simulated={active?.status === "planned"}
        onClose={() => setActiveId(null)}
        onReset={() => setResetKey((value) => value + 1)}
      >
        {active?.id === "passport" && (
          <PassportViewerDemo
            key={resetKey}
            onOpenPassport={() => {
              setActiveId(null);
              onOpenPassport();
            }}
          />
        )}
        {active?.id === "gov-id" && <GovIdSyncDemo key={resetKey} />}
        {active?.id === "fingerprint" && <FingerprintDemo key={resetKey} />}
        {active?.id === "escrow" && <EscrowPayoutsDemo key={resetKey} />}
        {active?.id === "espr" && <EsprCheckDemo key={resetKey} />}
        {active?.id === "proof" && <ProofOfHandDemo key={resetKey} />}
      </DemoSheet>
    </div>
  );
}
