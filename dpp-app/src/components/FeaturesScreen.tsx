"use client";

import { useState } from "react";
import { useT } from "@/i18n/LanguageProvider";
import type { Messages } from "@/i18n/messages/es";
import { DemoSheet } from "./demos/DemoSheet";
import { EsprCheckDemo } from "./demos/EsprCheckDemo";
import { EscrowPayoutsDemo } from "./demos/EscrowPayoutsDemo";
import { ESPR_SAMPLE_FIELDS, type EsprFieldId } from "./demos/esprFields";
import { FingerprintDemo } from "./demos/FingerprintDemo";
import { GovIdSyncDemo } from "./demos/GovIdSyncDemo";
import { PassportViewerDemo } from "./demos/PassportViewerDemo";
import { ProofOfHandDemo } from "./demos/ProofOfHandDemo";

type FeatureId = "passport" | "gov-id" | "fingerprint" | "escrow" | "espr" | "proof";

const FEATURE_IDS: FeatureId[] = ["passport", "gov-id", "fingerprint", "escrow", "espr", "proof"];

function featureCopy(id: FeatureId, t: Messages) {
  switch (id) {
    case "passport":
      return t.features.items.passport;
    case "gov-id":
      return t.features.items.govId;
    case "fingerprint":
      return t.features.items.fingerprint;
    case "escrow":
      return t.features.items.escrow;
    case "espr":
      return t.features.items.espr;
    case "proof":
      return t.features.items.proof;
  }
}

function esprLabel(id: EsprFieldId, t: Messages) {
  return t.espr[id];
}

type Props = {
  onOpenPassport: () => void;
};

export function FeaturesScreen({ onOpenPassport }: Props) {
  const t = useT();
  const [activeId, setActiveId] = useState<FeatureId | null>(null);
  const [resetKey, setResetKey] = useState(0);
  const active = activeId ? featureCopy(activeId, t) : null;
  const present = ESPR_SAMPLE_FIELDS.filter((field) => field.present)
    .map((field) => esprLabel(field.id, t))
    .join(", ");
  const missing = ESPR_SAMPLE_FIELDS.filter((field) => !field.present)
    .map((field) => esprLabel(field.id, t))
    .join(", ");

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-display text-2xl font-semibold text-fm-blue">{t.features.title}</h1>
        <p className="mt-2 text-fm-muted">{t.features.intro}</p>
      </header>

      <ul className="flex flex-col gap-3">
        {FEATURE_IDS.map((id) => {
          const item = featureCopy(id, t);
          return (
            <li
              key={id}
              className="rounded-2xl border border-slate-100 bg-white p-4 shadow-neu"
            >
              <p className="font-display text-lg font-semibold text-fm-ink">{item.name}</p>
              <p className="mt-1 text-sm text-fm-muted">{item.description}</p>
              <button
                type="button"
                onClick={() => setActiveId(id)}
                className="btn-outline mt-3 min-h-[48px] w-full font-semibold"
              >
                {t.features.tryIt}
              </button>
            </li>
          );
        })}
      </ul>

      <section className="rounded-2xl border border-slate-100 bg-white p-4 shadow-neu">
        <h2 className="font-display text-lg font-semibold text-fm-ink">{t.features.handlingTitle}</h2>
        <ul className="mt-2 space-y-2 text-sm text-fm-ink">
          {t.features.handling.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
      </section>

      <section className="rounded-2xl border border-slate-100 bg-white p-4 shadow-neu">
        <h2 className="font-display text-lg font-semibold text-fm-ink">{t.features.esprTitle}</h2>
        <p className="mt-2 text-sm text-fm-ink">{t.features.presentLine(present)}</p>
        <p className="mt-1 text-sm text-fm-ink">{t.features.missingLine(missing)}</p>
      </section>

      <section className="rounded-2xl border border-slate-100 bg-white p-4 shadow-neu">
        <h2 className="font-display text-lg font-semibold text-fm-ink">{t.features.contextTitle}</h2>
        <ul className="mt-2 space-y-2 text-sm text-fm-ink">
          {t.features.context.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
      </section>

      <DemoSheet
        open={active != null}
        title={active?.name ?? t.common.feature}
        onClose={() => setActiveId(null)}
        onReset={() => setResetKey((value) => value + 1)}
      >
        {activeId === "passport" && (
          <PassportViewerDemo
            key={resetKey}
            onOpenPassport={() => {
              setActiveId(null);
              onOpenPassport();
            }}
          />
        )}
        {activeId === "gov-id" && <GovIdSyncDemo key={resetKey} />}
        {activeId === "fingerprint" && <FingerprintDemo key={resetKey} />}
        {activeId === "escrow" && <EscrowPayoutsDemo key={resetKey} />}
        {activeId === "espr" && <EsprCheckDemo key={resetKey} />}
        {activeId === "proof" && <ProofOfHandDemo key={resetKey} />}
      </DemoSheet>
    </div>
  );
}
