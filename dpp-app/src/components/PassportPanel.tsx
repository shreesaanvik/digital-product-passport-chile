"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useT } from "@/i18n/LanguageProvider";
import { phrase } from "@/i18n/labels";
import {
  CLUSTER_PASSPORTS,
  clusterById,
  passportJsonLd,
  POOLED_PASSPORT,
  stageIndex,
  type ClusterId,
} from "@/lib/data";

export type PassportTechnicalExtra = {
  pieceId: string;
  makerArtisanId: string;
  orderCode: string;
  carton: string;
  materials: {
    yarn: string;
    yarnSource: string;
    dye: string;
  };
};

type PassportPanelProps = {
  clusterId: ClusterId;
  heritageName?: string;
  heritageCraft?: string;
  defaultShowTech?: boolean;
  pieceLine?: string;
  technicalExtra?: PassportTechnicalExtra;
  pooled?: boolean;
};

export function PassportPanel({
  clusterId,
  heritageName,
  heritageCraft,
  defaultShowTech = false,
  pieceLine,
  technicalExtra,
  pooled = false,
}: PassportPanelProps) {
  const t = useT();
  const [showTech, setShowTech] = useState(defaultShowTech);
  const cluster = clusterById(clusterId);
  const passport = CLUSTER_PASSPORTS[clusterId];
  const title = heritageName ?? cluster.name;
  const craft = phrase(heritageCraft ?? cluster.craft, t);
  const hero = cluster;
  const badges = passport.badges;
  const stages = pooled ? POOLED_PASSPORT.stages : passport.stages;
  const currentName = pooled ? POOLED_PASSPORT.currentStage : passport.currentStage;
  const currentIndex = stageIndex(stages, currentName);
  const storyLine = pooled ? pieceLine : passport.artisan;
  const technicalJson = pooled
    ? {
        ...passportJsonLd({
          product: POOLED_PASSPORT.product,
          material: technicalExtra
            ? `${technicalExtra.materials.yarn}, ${technicalExtra.materials.dye}`
            : POOLED_PASSPORT.material,
          origin_geo: POOLED_PASSPORT.origin_geo,
          stages: POOLED_PASSPORT.stages,
          currentStage: POOLED_PASSPORT.currentStage,
        }),
        ...technicalExtra,
      }
    : passportJsonLd({
        product: passport.product,
        material: passport.material,
        artisan: passport.artisan,
        origin_geo: passport.origin_geo,
        stages: passport.stages,
        currentStage: passport.currentStage,
      });

  return (
    <section
      className="rounded-2xl bg-fm-card p-5 shadow-neu border border-white overflow-hidden"
      aria-labelledby="passport-heading"
    >
      <div className="mb-4 flex items-center gap-3">
        <div
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border-2 border-fm-blue/20 bg-white"
          role="img"
          aria-label={t.common.qr}
        >
          <span className="text-xl text-fm-blue/40" aria-hidden>
            ▣
          </span>
        </div>
        <p className="text-xs text-fm-muted leading-snug">
          {t.passport.scan}
        </p>
      </div>

      <h2
        id="passport-heading"
        className="font-display text-xl font-semibold text-fm-blue mb-1"
      >
        {t.passport.title}
      </h2>
      <p className="text-fm-muted text-base mb-4">
        {t.passport.intro}
      </p>

      <div className="-mx-5 mb-4">
        <div className="relative h-[200px] w-full overflow-hidden">
          <Image
            src={hero.image}
            alt={phrase(hero.imageAlt, t)}
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
              {t.passport.heritage}
            </p>
            <div className="mt-2 h-px w-10 bg-fm-blue/80" aria-hidden />
            <p className="font-display text-[1.65rem] font-semibold leading-tight text-white mt-3 tracking-tight">
              {title}
            </p>
            <p className="text-base font-normal text-white/90 mt-1 tracking-wide">
              {craft}
            </p>
          </div>
        </div>
      </div>

      {storyLine ? (
        <p className="mb-4 text-base leading-snug text-fm-ink">{storyLine}</p>
      ) : null}

      <div className="flex flex-wrap gap-2 mb-4">
        {badges.map((label) => (
          <span
            key={label}
            className="inline-flex items-center gap-1 rounded-full bg-fm-green-soft text-fm-green px-3 py-1.5 text-sm font-medium border border-fm-green/25"
          >
            <span aria-hidden>◇</span> {phrase(label, t)}
          </span>
        ))}
      </div>

      <h3 className="text-sm font-semibold text-fm-ink uppercase tracking-wide mb-2">
        {t.passport.journey}
      </h3>
      <ol className="space-y-2 mb-4">
        {stages.map((step, i) => {
          const status = i < currentIndex ? "done" : i === currentIndex ? "current" : "upcoming";
          return (
            <li key={step} className="flex items-center gap-3 text-base">
              <span
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                  status === "done"
                    ? "bg-fm-green text-white"
                    : status === "current"
                      ? "bg-fm-orange text-white"
                      : "bg-slate-200 text-fm-muted"
                }`}
                aria-hidden
              >
                {i + 1}
              </span>
              <span className={status === "upcoming" ? "text-fm-muted" : "text-fm-ink"}>
                {phrase(step, t)}
              </span>
            </li>
          );
        })}
      </ol>

      <button
        type="button"
        onClick={() => setShowTech((v) => !v)}
        className="w-full min-h-[52px] rounded-xl border-2 border-fm-btn-bg text-fm-btn-text font-semibold text-lg hover:bg-fm-surface transition-colors"
        aria-expanded={showTech}
      >
        {showTech ? t.passport.hideTech : t.passport.showTech}
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
              {JSON.stringify(technicalJson, null, 2)}
            </pre>
            <p className="text-xs text-fm-muted mt-2">
              {t.passport.jsonNote}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
