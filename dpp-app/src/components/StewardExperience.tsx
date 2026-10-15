"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import {
  ARTISAN,
  clusterById,
  EVIDENCE_GPS,
  EVIDENCE_LOG,
  ROSTER,
  STEWARD,
  type EvidenceEntry,
  type RosterArtisan,
  type RosterStatus,
  type StewardConsent,
} from "@/lib/data";
import { todayParts } from "@/lib/format";
import { useFormat, useT } from "@/i18n/LanguageProvider";
import { phrase } from "@/i18n/labels";
import { BackLink } from "./BackLink";
import { PassportPanel } from "./PassportPanel";
import { DemoSheet } from "./demos/DemoSheet";
import { GovIdSyncDemo, type VerifiedGovId } from "./demos/GovIdSyncDemo";
import { ProofOfHandDemo } from "./demos/ProofOfHandDemo";

const DONIHUE_PATTERN = clusterById("donihue");

type SyncState = "pending" | "synced";

type LiveConsent = StewardConsent & { sync?: SyncState };

type LiveArtisan = Omit<RosterArtisan, "consent"> & { consent: LiveConsent | null };

type LiveEvidence = EvidenceEntry & { sync?: SyncState };

type StewardTab = "artisans" | "passports";

const STATUS_CLASS: Record<RosterStatus, string> = {
  Verified: "border-fm-green/25 bg-fm-green-soft text-fm-green",
  "Needs visit": "border-amber-200 bg-amber-100 text-amber-800",
  "Consent pending": "border-slate-300 bg-slate-200 text-slate-600",
};

function copyRoster(): LiveArtisan[] {
  return ROSTER.map((artisan) => ({
    ...artisan,
    consent: artisan.consent ? { ...artisan.consent } : null,
  }));
}

function initialLogs(): Record<string, LiveEvidence[]> {
  const featured = ROSTER.find((artisan) => artisan.orderCode === ARTISAN.order.code);
  if (!featured) return {};
  return {
    [featured.id]: EVIDENCE_LOG.map((entry) => ({ ...entry })),
  };
}

export function StewardExperience({ screen }: { screen: StewardTab }) {
  const t = useT();
  const [online, setOnline] = useState(true);
  const [roster, setRoster] = useState<LiveArtisan[]>(copyRoster);
  const [logs, setLogs] = useState<Record<string, LiveEvidence[]>>(initialLogs);
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [passportOpen, setPassportOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [addKey, setAddKey] = useState(0);
  const [verified, setVerified] = useState<VerifiedGovId | null>(null);
  const [proofFor, setProofFor] = useState<string | null>(null);
  const [proofKey, setProofKey] = useState(0);
  const [prevScreen, setPrevScreen] = useState(screen);
  const wasOnline = useRef(online);

  if (screen !== prevScreen) {
    setPrevScreen(screen);
    setSelectedId(null);
    setPassportOpen(false);
    setAddOpen(false);
    setProofFor(null);
    setVerified(null);
  }

  useEffect(() => {
    const switchedToOnline = online && !wasOnline.current;
    wasOnline.current = online;
    if (!switchedToOnline) return;

    const timer = window.setTimeout(() => {
      setRoster((prev) => {
        if (!prev.some((artisan) => artisan.consent?.sync === "pending")) return prev;
        return prev.map((artisan) =>
          artisan.consent?.sync === "pending"
            ? { ...artisan, consent: { ...artisan.consent, sync: "synced" } }
            : artisan,
        );
      });
      setLogs((prev) => {
        const ids = Object.keys(prev);
        if (!ids.some((id) => prev[id]?.some((entry) => entry.sync === "pending"))) return prev;
        const next: Record<string, LiveEvidence[]> = {};
        for (const id of ids) {
          next[id] = prev[id].map((entry) =>
            entry.sync === "pending" ? { ...entry, sync: "synced" } : entry,
          );
        }
        return next;
      });
    }, 1000);

    return () => window.clearTimeout(timer);
  }, [online]);

  const query = search.trim().toLowerCase();
  const visible = query
    ? roster.filter((artisan) => artisan.name.toLowerCase().includes(query))
    : roster;
  const selected = roster.find((artisan) => artisan.id === selectedId) ?? null;
  const withOrders = roster.filter((artisan) => artisan.orderCode);
  const verifiedAlready =
    verified != null && roster.some((artisan) => artisan.id === verified.id);

  function recordConsent(id: string) {
    const now = todayParts();
    const consent: LiveConsent = {
      date: { day: now.day, month: now.month },
      language: "Spanish",
      ...(online ? {} : { sync: "pending" as const }),
    };
    setRoster((prev) =>
      prev.map((artisan) => (artisan.id === id ? { ...artisan, consent } : artisan)),
    );
  }

  function recordEvidence(id: string) {
    const entry: LiveEvidence = {
      stage: "Quality check",
      date: todayParts(),
      ...(online ? {} : { sync: "pending" as const }),
    };
    setLogs((prev) => ({
      ...prev,
      [id]: [...(prev[id] ?? []), entry],
    }));
  }

  function addArtisan(profile: VerifiedGovId) {
    setRoster((prev) => {
      if (prev.some((artisan) => artisan.id === profile.id)) return prev;
      return [
        ...prev,
        {
          id: profile.id,
          name: profile.name,
          craft: profile.craft,
          village:
            profile.commune === profile.region ? profile.region : profile.commune,
          status: "Verified",
          consent: null,
          orderCode: null,
        },
      ];
    });
    setSearch("");
    setVerified(null);
    setAddOpen(false);
  }

  return (
    <div>
      <header className="mb-4 flex justify-end">
        <div
          className="inline-flex rounded-full border border-slate-200 bg-white p-0.5 text-sm shadow-neu"
          role="group"
          aria-label={t.steward.connection}
        >
          <button
            type="button"
            aria-pressed={online}
            onClick={() => setOnline(true)}
            className={`min-h-[36px] rounded-full px-3 font-semibold ${
              online ? "bg-fm-btn-bg text-white" : "text-fm-muted"
            }`}
          >
            {t.steward.online}
          </button>
          <button
            type="button"
            aria-pressed={!online}
            onClick={() => setOnline(false)}
            className={`min-h-[36px] rounded-full px-3 font-semibold ${
              online ? "text-fm-muted" : "bg-slate-500 text-white"
            }`}
          >
            {t.steward.offline}
          </button>
        </div>
      </header>

      {screen === "artisans" && selected && (
        <ArtisanDetail
          artisan={selected}
          entries={[...(logs[selected.id] ?? [])].reverse()}
          onBack={() => setSelectedId(null)}
          onRecordConsent={() => recordConsent(selected.id)}
          onRecordProof={() => setProofFor(selected.id)}
        />
      )}

      {screen === "artisans" && !selected && (
        <div>
          <h1 className="font-display text-2xl font-semibold text-fm-ink">{t.steward.myArtisans}</h1>
          <p className="mt-1 text-fm-muted">{STEWARD.area}</p>
          <button
            type="button"
            onClick={() => {
              setVerified(null);
              setAddOpen(true);
            }}
            className="btn-primary mt-4 min-h-[48px] w-full font-semibold"
          >
            {t.steward.addArtisan}
          </button>
          <label htmlFor="artisan-search" className="mt-4 block text-sm font-medium text-fm-ink">
            {t.steward.search}
          </label>
          <input
            id="artisan-search"
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder={t.steward.search}
            autoComplete="off"
            className="mt-2 min-h-[48px] w-full rounded-xl border-2 border-slate-200 px-4 text-base text-fm-ink placeholder:text-slate-400 focus:border-fm-blue focus:outline-none"
          />
          {visible.length === 0 ? (
            <p className="mt-4 text-fm-muted">{t.steward.noMatch}</p>
          ) : (
            <ul className="mt-4 flex flex-col gap-3">
              {visible.map((artisan) => (
                <li key={artisan.id}>
                  <button
                    type="button"
                    onClick={() => setSelectedId(artisan.id)}
                    className="w-full rounded-2xl border border-slate-100 bg-white p-4 text-left shadow-neu"
                  >
                    <span className="flex items-start justify-between gap-3">
                      <span className="font-display text-lg font-semibold text-fm-ink">
                        {artisan.name}
                      </span>
                      <StatusBadge status={artisan.status} />
                    </span>
                    <span className="mt-1 block text-sm text-fm-ink">{phrase(artisan.craft, t)}</span>
                    <span className="block text-sm text-fm-muted">{artisan.village}</span>
                    <span className="mt-1 block text-sm text-fm-muted">{artisan.id}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {screen === "passports" && passportOpen && (
        <div>
          <button
            type="button"
            onClick={() => setPassportOpen(false)}
            className="min-h-[44px] text-base font-semibold text-fm-btn-text"
          >
            {t.common.back}
          </button>
          <div className="mt-4">
            <PassportPanel clusterId="donihue" />
          </div>
        </div>
      )}

      {screen === "passports" && !passportOpen && (
        <div>
          <h1 className="font-display text-2xl font-semibold text-fm-ink">
            {t.steward.passportsTitle}
          </h1>
          {withOrders.length === 0 ? (
            <p className="mt-4 text-fm-muted">{t.steward.noPassports}</p>
          ) : (
            <ul className="mt-4 flex flex-col gap-3">
              {withOrders.map((artisan) => (
                <li
                  key={artisan.id}
                  className="rounded-2xl border border-slate-100 bg-white p-4 shadow-neu"
                >
                  <p className="font-display text-xl font-semibold text-fm-ink">
                    {artisan.orderCode}
                  </p>
                  <p className="mt-1 text-fm-ink">{artisan.name}</p>
                  <p className="mt-1 text-fm-ink">{phrase(ARTISAN.order.product, t)}</p>
                  <p className="mt-1 text-fm-ink">
                    {t.common.currentStage(phrase(ARTISAN.stages[ARTISAN.currentStage], t))}
                  </p>
                  <p className="mt-1 text-sm text-fm-muted">
                    {t.steward.evidenceCount(logs[artisan.id]?.length ?? 0)}
                  </p>
                  <button
                    type="button"
                    onClick={() => setPassportOpen(true)}
                    className="btn-outline mt-3 min-h-[48px] w-full font-semibold"
                  >
                    {t.steward.viewPassport}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      <DemoSheet
        open={addOpen}
        title={t.steward.registryTitle}
        onClose={() => {
          setAddOpen(false);
          setVerified(null);
        }}
        onReset={() => {
          setAddKey((value) => value + 1);
          setVerified(null);
        }}
      >
        <GovIdSyncDemo key={addKey} onVerified={setVerified} />
        {verified && (
          <button
            type="button"
            onClick={() => addArtisan(verified)}
            disabled={verifiedAlready}
            className="btn-primary mt-4 min-h-[52px] w-full text-lg font-semibold disabled:opacity-60"
          >
            {verifiedAlready ? t.steward.alreadyListed : t.steward.addToList}
          </button>
        )}
      </DemoSheet>

      <DemoSheet
        open={proofFor != null}
        title={t.steward.proofTitle}
        onClose={() => setProofFor(null)}
        onReset={() => setProofKey((value) => value + 1)}
      >
        <ProofOfHandDemo
          key={proofKey}
          onRecorded={() => {
            if (proofFor) recordEvidence(proofFor);
          }}
        />
      </DemoSheet>
    </div>
  );
}

function ArtisanDetail({
  artisan,
  entries,
  onBack,
  onRecordConsent,
  onRecordProof,
}: {
  artisan: LiveArtisan;
  entries: LiveEvidence[];
  onBack: () => void;
  onRecordConsent: () => void;
  onRecordProof: () => void;
}) {
  const t = useT();
  const format = useFormat();
  return (
    <div>
      <BackLink onClick={onBack} />
      <div className="mt-2 flex items-start justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-semibold text-fm-ink">{artisan.name}</h1>
          <p className="mt-1 text-fm-ink">{phrase(artisan.craft, t)}</p>
          <p className="text-fm-muted">{artisan.village}</p>
          <p className="mt-1 text-sm text-fm-muted">{artisan.id}</p>
        </div>
        <StatusBadge status={artisan.status} />
      </div>

      <section className="mt-6 rounded-2xl border border-slate-100 bg-white p-4 shadow-neu">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-fm-muted">{t.steward.consent}</h2>
        {artisan.consent ? (
          <>
            <p className="mt-2 text-fm-ink">
              {t.steward.consentRecorded(
                format.dayMonth(artisan.consent.date),
                phrase(artisan.consent.language, t),
              )}
            </p>
            <SyncBadge sync={artisan.consent.sync} />
          </>
        ) : (
          <>
            <p className="mt-2 font-semibold text-amber-800">{t.steward.consentMissing}</p>
            <button
              type="button"
              onClick={onRecordConsent}
              className="btn-outline mt-3 min-h-[48px] w-full font-semibold"
            >
              {t.steward.recordConsent}
            </button>
          </>
        )}
      </section>

      {artisan.orderCode && (
        <section className="mt-4 rounded-2xl border border-slate-100 bg-white p-4 shadow-neu">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-fm-muted">
            {t.steward.currentOrder}
          </h2>
          <p className="mt-2 font-display text-xl font-semibold text-fm-ink">{artisan.orderCode}</p>
          <p className="mt-1 text-fm-ink">{phrase(ARTISAN.order.product, t)}</p>
          <p className="mt-1 text-fm-ink">
            {t.common.currentStage(phrase(ARTISAN.stages[ARTISAN.currentStage], t))}
          </p>
        </section>
      )}

      <section className="mt-4">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-fm-muted">
          {t.steward.evidenceLog}
        </h2>
        {entries.length === 0 ? (
          <p className="mt-2 text-fm-muted">{t.steward.noEvidence}</p>
        ) : (
          <ol className="mt-3 flex flex-col gap-3">
            {entries.map((entry, index) => (
              <li
                key={`${entry.stage}-${entry.date}-${index}`}
                className="flex gap-3 rounded-2xl border border-slate-100 bg-white p-3 shadow-neu"
              >
                <Image
                  src={DONIHUE_PATTERN.image}
                  alt={phrase(DONIHUE_PATTERN.imageAlt, t)}
                  width={64}
                  height={64}
                  className="h-16 w-16 shrink-0 rounded-lg object-cover"
                />
                <div className="min-w-0">
                  <p className="font-semibold text-fm-ink">{phrase(entry.stage, t)}</p>
                  <p className="text-sm text-fm-ink">{format.dayMonthTime(entry.date)}</p>
                  <p className="text-sm text-fm-muted">{t.common.recordedBy(STEWARD.name)}</p>
                  <p className="text-sm text-fm-muted">{EVIDENCE_GPS}</p>
                  <SyncBadge sync={entry.sync} />
                </div>
              </li>
            ))}
          </ol>
        )}
      </section>

      {artisan.orderCode && (
        <button
          type="button"
          onClick={onRecordProof}
          className="btn-primary mt-4 flex min-h-[56px] w-full items-center justify-center text-lg font-semibold"
        >
          {t.steward.recordProof}
        </button>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: RosterStatus }) {
  const t = useT();
  return (
    <span
      className={`inline-flex shrink-0 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${STATUS_CLASS[status]}`}
    >
      {phrase(status, t)}
    </span>
  );
}

function SyncBadge({ sync }: { sync?: SyncState }) {
  const t = useT();
  if (sync === "pending") {
    return (
      <p className="mt-2">
        <span className="inline-flex rounded-full bg-slate-200 px-2.5 py-1 text-xs font-semibold text-slate-600">
          {t.steward.savedOnPhone}
        </span>
      </p>
    );
  }
  if (sync === "synced") {
    return (
      <p className="mt-2">
        <span className="inline-flex rounded-full border border-fm-green/25 bg-fm-green-soft px-2.5 py-1 text-xs font-semibold text-fm-green">
          {t.steward.synced}
        </span>
      </p>
    );
  }
  return null;
}
