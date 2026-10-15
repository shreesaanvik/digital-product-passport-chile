"use client";

import Image from "next/image";
import { useEffect, useState, type ReactNode } from "react";
import {
  ARTISAN,
  artisanPaymentTotals,
  clusterById,
  paymentProgress,
  type ArtisanPayment,
} from "@/lib/data";
import { useFormat, useT } from "@/i18n/LanguageProvider";
import { phrase } from "@/i18n/labels";
import type { Messages } from "@/i18n/messages/es";
import { BackLink } from "./BackLink";
import { PassportPanel } from "./PassportPanel";

const DONIHUE_PATTERN = clusterById("donihue");

const largeButtonClass =
  "btn-primary flex w-full min-h-[56px] items-center justify-center text-lg font-semibold";

export type ArtisanPanel = "home" | "work" | "money" | "passport" | "steward";

const TILES: { id: Exclude<ArtisanPanel, "home"> }[] = [
  { id: "work" },
  { id: "money" },
  { id: "passport" },
  { id: "steward" },
];

function tileLabel(id: (typeof TILES)[number]["id"], t: Messages) {
  if (id === "work") return t.artisan.work;
  if (id === "money") return t.artisan.money;
  if (id === "passport") return t.artisan.passport;
  return t.artisan.steward;
}

function paymentStatusText(
  payment: ArtisanPayment,
  t: Messages,
  dayMonth: (date: { day: number; month: number }) => string,
) {
  const progress = paymentProgress(payment);
  if (progress.kind === "paid") {
    return progress.date ? t.artisan.paidOn(dayMonth(progress.date)) : t.artisan.paid;
  }
  if (progress.kind === "afterQuality") return t.artisan.whenQuality;
  if (progress.kind === "afterShipping") return t.artisan.whenShipped;
  return t.artisan.waiting;
}

type Props = {
  panel: ArtisanPanel;
  onPanel: (panel: ArtisanPanel) => void;
};

export function ArtisanHome({ panel, onPanel }: Props) {
  const t = useT();
  const back = () => onPanel("home");

  if (panel === "work") return <WorkDetail onBack={back} />;
  if (panel === "money") return <MoneyDetail onBack={back} />;
  if (panel === "passport") return <PassportDetail onBack={back} />;
  if (panel === "steward") return <StewardDetail onBack={back} />;

  const firstName = ARTISAN.name.split(" ")[0];

  return (
    <div className="text-lg text-fm-ink">
      <h1 className="font-display text-2xl font-semibold leading-tight text-fm-ink">
        {t.artisan.hello(firstName)}
      </h1>
      <div className="mt-4 grid grid-cols-2 gap-3">
        {TILES.map((tile) => (
          <button
            key={tile.id}
            type="button"
            onClick={() => onPanel(tile.id)}
            className="flex min-h-[8.75rem] flex-col items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-4 text-center text-fm-ink shadow-neu active:bg-fm-btn-light"
          >
            <TileIcon id={tile.id} />
            <span className="font-display text-2xl font-semibold leading-tight">
              {tileLabel(tile.id, t)}
            </span>
          </button>
        ))}
      </div>
      <OrderProgress onOpen={() => onPanel("work")} />
    </div>
  );
}

export function ArtisanHero({
  title,
  subtitle,
  titleAs = "p",
}: {
  title: string;
  subtitle: string;
  titleAs?: "h1" | "p";
}) {
  const t = useT();
  const TitleTag = titleAs;

  return (
    <div className="relative h-64 w-full overflow-hidden rounded-2xl">
      <Image
        src={DONIHUE_PATTERN.image}
        alt={phrase(DONIHUE_PATTERN.imageAlt, t)}
        fill
        sizes="(max-width: 512px) 100vw, 512px"
        className="object-cover object-center"
        priority
      />
      <div
        className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-black/15"
        aria-hidden
      />
      <div className="absolute inset-x-0 bottom-0 p-5">
        <TitleTag className="font-display text-2xl font-semibold leading-tight text-white">
          {title}
        </TitleTag>
        <p className="mt-1 text-lg leading-snug text-white">{subtitle}</p>
      </div>
    </div>
  );
}

export function ArtisanMoneyPanel() {
  const t = useT();
  const format = useFormat();
  const totals = artisanPaymentTotals(ARTISAN.payments);

  return (
    <div className="text-lg text-fm-ink">
      <div className="grid grid-cols-2 gap-3">
        <div className="flex min-h-[8.5rem] flex-col items-center justify-center gap-1 rounded-2xl border border-slate-200 bg-white px-3 py-4 text-center shadow-neu">
          <span
            className="flex h-12 w-12 items-center justify-center rounded-full bg-fm-green text-white"
            aria-hidden
          >
            <CheckIcon />
          </span>
          <p className="font-semibold">{t.artisan.received}</p>
          <p className="font-display text-2xl font-semibold leading-tight">
            {format.clp(totals.received)}
          </p>
        </div>
        <div className="flex min-h-[8.5rem] flex-col items-center justify-center gap-1 rounded-2xl border border-slate-200 bg-white px-3 py-4 text-center shadow-neu">
          <span className="flex h-12 w-12 items-center justify-center text-fm-blue" aria-hidden>
            <ClockIcon />
          </span>
          <p className="font-semibold">{t.artisan.waiting}</p>
          <p className="font-display text-2xl font-semibold leading-tight">
            {format.clp(totals.waiting)}
          </p>
        </div>
      </div>
      <ul className="mt-4 divide-y divide-slate-200 rounded-2xl border border-slate-200 bg-white px-4 shadow-neu">
        {ARTISAN.payments.map((payment) => (
          <li
            key={payment.label}
            className="flex min-h-[56px] items-center justify-between gap-3 py-3"
          >
            <div>
              <p className="font-semibold text-fm-ink">{phrase(payment.label, t)}</p>
              <p className="text-fm-ink">{paymentStatusText(payment, t, format.dayMonth)}</p>
            </div>
            <p className="shrink-0 font-display text-xl font-semibold text-fm-ink">
              {format.clp(payment.amount)}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}

function DetailShell({
  title,
  onBack,
  children,
}: {
  title: string;
  onBack: () => void;
  children: ReactNode;
}) {
  return (
    <div className="text-lg text-fm-ink">
      <BackLink onClick={onBack} />
      <h1 className="mt-2 font-display text-2xl font-semibold text-fm-ink">{title}</h1>
      <div className="mt-4">{children}</div>
    </div>
  );
}

function OrderProgress({ onOpen }: { onOpen: () => void }) {
  const t = useT();
  const current = ARTISAN.currentStage;
  const last = ARTISAN.stages.length - 1;

  return (
    <section className="mt-4" aria-labelledby="artisan-order-heading">
      <h2 id="artisan-order-heading" className="text-lg font-semibold text-fm-ink">
        {t.artisan.yourOrder}
      </h2>
      <div className="relative mt-3 w-[calc(100%+2rem)] -mx-4">
        <ol className="grid w-full grid-cols-5">
          {ARTISAN.stages.map((stage, index) => {
            const state = index < current ? "done" : index === current ? "now" : "later";
            const label = phrase(stage, t);
            return (
              <li
                key={stage}
                className="flex min-w-0 flex-col items-center"
                aria-current={state === "now" ? "step" : undefined}
              >
                <div className="flex h-4 items-end justify-center">
                  {state === "now" ? (
                    <span className="text-[12px] font-semibold leading-none text-fm-blue" aria-hidden>
                      {t.artisan.now}
                    </span>
                  ) : null}
                </div>
                <div className="flex h-2 items-start justify-center" aria-hidden>
                  {state === "now" ? (
                    <svg viewBox="0 0 10 6" className="h-1.5 w-2.5 text-fm-blue">
                      <path d="M0 0 L5 6 L10 0 Z" fill="currentColor" />
                    </svg>
                  ) : null}
                </div>
                <div className="relative flex h-6 w-full items-center justify-center">
                  {index > 0 ? (
                    <span
                      className="absolute inset-y-0 left-0 right-1/2 z-0 my-auto h-0.5 bg-slate-300"
                      aria-hidden
                    />
                  ) : null}
                  {index < last ? (
                    <span
                      className="absolute inset-y-0 left-1/2 right-0 z-0 my-auto h-0.5 bg-slate-300"
                      aria-hidden
                    />
                  ) : null}
                  <ProgressDot state={state} />
                </div>
                <p
                  className={`mt-1 w-full text-center text-[14px] leading-tight tracking-tighter ${
                    state === "later" ? "text-slate-500" : "text-fm-ink"
                  }`}
                >
                  <span className="sr-only">
                    {state === "done" ? `${t.artisan.done}. ` : state === "now" ? `${t.artisan.now}. ` : `${t.artisan.later}. `}
                  </span>
                  {label}
                </p>
              </li>
            );
          })}
        </ol>
        <button
          type="button"
          onClick={onOpen}
          className="absolute inset-0"
          aria-label={t.artisan.openWork}
        />
      </div>
    </section>
  );
}

function ProgressDot({ state }: { state: "done" | "now" | "later" }) {
  const size = state === "now" ? "h-6 w-6" : state === "done" ? "h-4 w-4" : "h-3 w-3";
  const color =
    state === "now" ? "bg-fm-blue" : state === "done" ? "bg-fm-green" : "bg-slate-300";

  return (
    <span
      className={`relative z-10 flex shrink-0 items-center justify-center rounded-full ${size} ${color}`}
      aria-hidden
    >
      {state === "done" ? (
        <svg viewBox="0 0 12 12" className="h-2.5 w-2.5 text-white" fill="none">
          <path
            d="M2.5 6.2 5 8.5 9.5 3.5"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ) : null}
    </span>
  );
}

function WorkDetail({ onBack }: { onBack: () => void }) {
  const t = useT();
  return (
    <DetailShell title={t.artisan.work} onBack={onBack}>
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-neu">
        <p className="font-display text-2xl font-semibold text-fm-ink">{ARTISAN.order.code}</p>
        <p className="mt-2 text-lg text-fm-ink">{phrase(ARTISAN.order.product, t)}</p>
        <p className="mt-1 text-lg text-fm-ink">{t.common.buyer(phrase(ARTISAN.order.buyer, t))}</p>
      </div>
      <ol className="mt-4 space-y-2" aria-label={t.artisan.orderStages}>
        {ARTISAN.stages.map((stage, index) => {
          const state =
            index < ARTISAN.currentStage ? "done" : index === ARTISAN.currentStage ? "now" : "later";
          return (
            <li
              key={stage}
              className={`flex min-h-[56px] items-center gap-3 rounded-xl px-3 ${
                state === "now" ? "border-2 border-fm-blue bg-fm-btn-light" : ""
              }`}
            >
              <StageMark state={state} index={index} />
              <span
                className={`min-w-0 flex-1 text-lg ${
                  state === "later" ? "text-slate-500" : "font-semibold text-fm-ink"
                }`}
              >
                {state === "done" && <span className="sr-only">{t.artisan.done}. </span>}
                {phrase(stage, t)}
              </span>
              {state === "now" && (
                <span className="shrink-0 rounded-full bg-fm-btn-bg px-3 py-1 text-base font-semibold text-white">
                  {t.artisan.now}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </DetailShell>
  );
}

function MoneyDetail({ onBack }: { onBack: () => void }) {
  const t = useT();
  return (
    <DetailShell title={t.artisan.money} onBack={onBack}>
      <ArtisanMoneyPanel />
    </DetailShell>
  );
}

function PassportDetail({ onBack }: { onBack: () => void }) {
  const t = useT();
  const [showFull, setShowFull] = useState(false);

  return (
    <DetailShell title={t.artisan.passport} onBack={onBack}>
      <ArtisanHero
        title={ARTISAN.name}
        subtitle={`${phrase(ARTISAN.craft, t)}, ${ARTISAN.cluster}`}
      />
      <p className="mt-4 text-lg text-fm-ink">{t.artisan.buyersSee}</p>
      <button
        type="button"
        onClick={() => setShowFull(true)}
        className={`${largeButtonClass} mt-4`}
        aria-expanded={showFull}
      >
        {t.artisan.seeFull}
      </button>
      {showFull && (
        <div className="mt-4">
          <PassportPanel clusterId="donihue" />
        </div>
      )}
    </DetailShell>
  );
}

function StewardDetail({ onBack }: { onBack: () => void }) {
  const t = useT();
  const format = useFormat();
  const [callId, setCallId] = useState(0);
  const stewardFirst = ARTISAN.steward.name.split(" ")[0];

  useEffect(() => {
    if (callId === 0) return;
    const timer = window.setTimeout(() => setCallId(0), 2000);
    return () => window.clearTimeout(timer);
  }, [callId]);

  return (
    <DetailShell title={t.artisan.steward} onBack={onBack}>
      <div className="flex items-center gap-4">
        <div
          className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full bg-fm-blue font-display text-4xl font-bold text-white"
          aria-hidden
        >
          {ARTISAN.steward.name.charAt(0)}
        </div>
        <div>
          <p className="font-display text-2xl font-semibold leading-tight text-fm-ink">
            {ARTISAN.steward.name}
          </p>
          <p className="mt-1 text-lg text-fm-ink">{t.roles.stewardWithArea(ARTISAN.steward.area)}</p>
          <p className="mt-1 text-lg text-fm-ink">
            {t.artisan.lastVisit(format.dayMonth(ARTISAN.steward.lastVisit))}
          </p>
        </div>
      </div>
      <button
        type="button"
        onClick={() => setCallId((id) => id + 1)}
        className={`${largeButtonClass} mt-6`}
      >
        {t.artisan.call(stewardFirst)}
      </button>
      <p className="mt-3 min-h-[1.75rem] text-lg font-semibold text-fm-ink" role="status">
        {callId > 0 ? t.artisan.calling(ARTISAN.steward.name) : ""}
      </p>
    </DetailShell>
  );
}

function StageMark({ state, index }: { state: "done" | "now" | "later"; index: number }) {
  if (state === "done") {
    return (
      <span
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-fm-green text-white"
        aria-hidden
      >
        <CheckIcon />
      </span>
    );
  }

  return (
    <span
      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-lg font-semibold ${
        state === "now" ? "bg-fm-btn-bg text-white" : "bg-slate-200 text-slate-500"
      }`}
      aria-hidden
    >
      {index + 1}
    </span>
  );
}

function TileIcon({ id }: { id: (typeof TILES)[number]["id"] }) {
  const className = "h-12 w-12 text-fm-blue";
  if (id === "work") return <WorkIcon className={className} />;
  if (id === "money") return <MoneyIcon className={className} />;
  if (id === "passport") return <PassportIcon className={className} />;
  return <StewardIcon className={className} />;
}

function WorkIcon({ className }: { className: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} fill="none" aria-hidden>
      <rect x="8" y="8" width="32" height="32" rx="4" stroke="currentColor" strokeWidth="2.5" />
      <rect x="16" y="16" width="16" height="16" rx="2" fill="currentColor" />
    </svg>
  );
}

function MoneyIcon({ className }: { className: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden>
      <circle cx="24" cy="24" r="16" fill="none" stroke="currentColor" strokeWidth="2.5" />
      <text
        x="24"
        y="31"
        textAnchor="middle"
        fontSize="20"
        fontWeight="700"
        fill="currentColor"
      >
        $
      </text>
    </svg>
  );
}

function PassportIcon({ className }: { className: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} fill="none" aria-hidden>
      <rect x="11" y="6" width="26" height="36" rx="3" stroke="currentColor" strokeWidth="2.5" />
      <path d="M17 16h14M17 24h14M17 32h8" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

function StewardIcon({ className }: { className: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} fill="none" aria-hidden>
      <circle cx="24" cy="16" r="7" stroke="currentColor" strokeWidth="2.5" />
      <path
        d="M10 40c2.2-8 7.6-12 14-12s11.8 4 14 12"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 48 48" className="h-6 w-6" fill="none" aria-hidden>
      <path
        d="M12 25l8 8 16-18"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg viewBox="0 0 48 48" className="h-12 w-12" fill="none" aria-hidden>
      <circle cx="24" cy="24" r="16" stroke="currentColor" strokeWidth="2.5" />
      <path d="M24 14v11l7 4" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}
