"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { SAMPLE_REGISTRY, type SampleRegistryRecord } from "@/lib/data";

type SampleId = SampleRegistryRecord["id"];

export type VerifiedGovId = {
  id: SampleId;
  name: string;
  craft: string;
  commune: string;
  region: string;
};

function findRecord(raw: string): SampleRegistryRecord | null {
  const key = raw.trim().toUpperCase();
  return SAMPLE_REGISTRY.find((record) => record.id === key) ?? null;
}

function placeRows(record: SampleRegistryRecord) {
  if (record.commune === record.region) {
    return [{ label: "Commune and region", value: record.region }];
  }
  return [
    { label: "Commune", value: record.commune },
    { label: "Region", value: record.region },
  ];
}

type Phase = "idle" | "searching" | "found" | "missing";

type Props = {
  onVerified?: (profile: VerifiedGovId | null) => void;
};

export function GovIdSyncDemo({ onVerified }: Props = {}) {
  const [id, setId] = useState("");
  const [phase, setPhase] = useState<Phase>("idle");
  const [profile, setProfile] = useState<SampleRegistryRecord | null>(null);
  const timer = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timer.current != null) window.clearTimeout(timer.current);
    };
  }, []);

  function clearTimer() {
    if (timer.current != null) {
      window.clearTimeout(timer.current);
      timer.current = null;
    }
  }

  function check(raw: string) {
    const key = raw.trim().toUpperCase();
    setId(key);
    clearTimer();
    setProfile(null);

    const record = findRecord(key);
    if (!record) {
      setPhase("missing");
      onVerified?.(null);
      return;
    }

    setPhase("searching");
    onVerified?.(null);
    timer.current = window.setTimeout(() => {
      setProfile(record);
      setPhase("found");
      onVerified?.({
        id: record.id,
        name: record.name,
        craft: record.craft,
        commune: record.commune,
        region: record.region,
      });
      timer.current = null;
    }, 1500);
  }

  return (
    <div className="space-y-4">
      <label htmlFor="gov-artisan-id" className="block text-sm font-medium text-fm-ink">
        Artisan ID number
      </label>
      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          id="gov-artisan-id"
          type="text"
          inputMode="text"
          autoComplete="off"
          placeholder="e.g. CA-06-0412"
          value={id}
          onChange={(event) => {
            setId(event.target.value);
            setPhase("idle");
            setProfile(null);
            clearTimer();
            onVerified?.(null);
          }}
          className="min-h-[52px] flex-1 rounded-xl border-2 border-slate-200 px-4 text-lg text-fm-ink placeholder:text-slate-400 focus:border-fm-blue focus:outline-none"
        />
        <button
          type="button"
          onClick={() => check(id)}
          className="min-h-[52px] rounded-xl bg-fm-btn-bg px-6 text-lg font-semibold text-white shadow-md hover:bg-fm-btn-text"
        >
          Check ID
        </button>
      </div>

      <div>
        <p className="mb-2 text-sm text-fm-muted">Sample IDs</p>
        <div className="flex flex-wrap gap-2">
          {SAMPLE_REGISTRY.map((record) => (
            <button
              key={record.id}
              type="button"
              onClick={() => check(record.id)}
              className="min-h-[44px] rounded-full border border-fm-blue/30 bg-fm-btn-light px-4 text-sm font-semibold text-fm-btn-text"
            >
              {record.id}
            </button>
          ))}
        </div>
      </div>

      {phase === "searching" && (
        <p
          className="flex items-center gap-3 rounded-xl border border-slate-200 bg-fm-surface px-4 py-3 text-fm-ink"
          role="status"
        >
          <span
            className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-fm-blue/30 border-t-fm-blue motion-reduce:animate-none"
            aria-hidden
          />
          Checking Registro Nacional de Artesanía
        </p>
      )}

      {phase === "missing" && (
        <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-800" role="status">
          No artisan with that number in the sample registry.
        </p>
      )}

      <AnimatePresence>
        {phase === "found" && profile && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="rounded-xl border border-fm-green/25 bg-fm-green-soft px-4 py-4"
            role="status"
          >
            <p className="font-display text-xl font-semibold text-fm-ink">{profile.name}</p>
            <dl className="mt-3 space-y-2 text-sm">
              <div className="flex justify-between gap-3">
                <dt className="text-fm-muted">Craft</dt>
                <dd className="text-right text-fm-ink">{profile.craft}</dd>
              </div>
              {placeRows(profile).map((row) => (
                <div key={row.label} className="flex justify-between gap-3">
                  <dt className="text-fm-muted">{row.label}</dt>
                  <dd className="text-right text-fm-ink">{row.value}</dd>
                </div>
              ))}
              <div className="flex justify-between gap-3">
                <dt className="text-fm-muted">Registry number</dt>
                <dd className="text-right text-fm-ink">{profile.id}</dd>
              </div>
            </dl>
            <p className="mt-3 font-semibold text-fm-ink">{profile.status}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
