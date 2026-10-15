"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { useFormat, useT } from "@/i18n/LanguageProvider";
import { phrase } from "@/i18n/labels";
import { CLUSTER_PASSPORTS, EVIDENCE_GPS, STEWARD, clusterById, stageIndex } from "@/lib/data";

const DONIHUE_PATTERN = clusterById("donihue");

const DONIHUE_PASSPORT = CLUSTER_PASSPORTS.donihue;
const STAMP_PLACE = EVIDENCE_GPS;

type ProofOfHandDemoProps = {
  onRecorded?: () => void;
};

export function ProofOfHandDemo({ onRecorded }: ProofOfHandDemoProps = {}) {
  const t = useT();
  const format = useFormat();
  const [recordedAt, setRecordedAt] = useState<Date | null>(null);
  const when = recordedAt ? format.stamp(recordedAt) : "";
  const stampBy = t.proof.stampBy(STEWARD.name, t.roles.steward);
  const priorSteps = DONIHUE_PASSPORT.stages.slice(
    0,
    stageIndex(DONIHUE_PASSPORT.stages, DONIHUE_PASSPORT.currentStage),
  );

  return (
    <div className="space-y-5">
      <div className="mx-auto w-[min(100%,280px)] rounded-[2rem] border-[10px] border-slate-900 bg-slate-900 shadow-neu">
        <div className="overflow-hidden rounded-[1.25rem] bg-white">
          <div className="relative aspect-[3/4] w-full bg-slate-200">
            {recordedAt ? (
              <Image
                src={DONIHUE_PATTERN.image}
                alt={phrase(DONIHUE_PATTERN.imageAlt, t)}
                fill
                sizes="280px"
                className="object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center px-6 text-center text-sm text-fm-muted">
                {t.proof.camera}
              </div>
            )}
            {recordedAt && (
              <div className="absolute inset-x-3 bottom-3 rounded-lg border border-white/70 bg-black/60 px-3 py-2 text-white">
                <p className="text-xs font-semibold">{stampBy}</p>
                <p className="text-xs">{when}</p>
                <p className="text-xs">{STAMP_PLACE}</p>
              </div>
            )}
          </div>
        </div>
        <button
          type="button"
          onClick={() => {
            setRecordedAt(new Date());
            onRecorded?.();
          }}
          disabled={recordedAt != null}
          className="my-3 min-h-[48px] w-full rounded-full bg-white text-base font-semibold text-fm-ink disabled:opacity-70"
        >
          {recordedAt ? t.proof.recorded : t.proof.record}
        </button>
      </div>

      <div>
        <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-fm-ink">
          {t.proof.journey}
        </h3>
        <ol className="space-y-2">
          {priorSteps.map((step, index) => (
            <li key={step} className="flex items-center gap-3 text-sm">
              <span
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-fm-green text-xs font-bold text-white"
                aria-hidden
              >
                {index + 1}
              </span>
              <span className="text-fm-ink">{phrase(step, t)}</span>
            </li>
          ))}
          <AnimatePresence>
            {recordedAt && (
              <motion.li
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex items-start gap-3 text-sm"
              >
                <span
                  className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-fm-blue text-xs font-bold text-white"
                  aria-hidden
                >
                  {priorSteps.length + 1}
                </span>
                <span>
                  <span className="block font-semibold text-fm-ink">{t.proof.recordedTitle}</span>
                  <span className="mt-1 block text-xs text-fm-muted">{stampBy}</span>
                  <span className="block text-xs text-fm-muted">{when}</span>
                  <span className="block text-xs text-fm-muted">{STAMP_PLACE}</span>
                </span>
              </motion.li>
            )}
          </AnimatePresence>
        </ol>
      </div>
    </div>
  );
}
