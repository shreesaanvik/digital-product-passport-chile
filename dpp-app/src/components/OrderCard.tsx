"use client";

type Props = {
  onViewPassport: () => void;
  orderCode: string;
  locationLine: string;
};

export function OrderCard({
  onViewPassport,
  orderCode,
  locationLine,
}: Props) {
  return (
    <article className="min-w-[280px] max-w-[300px] shrink-0 rounded-2xl bg-white p-4 shadow-neu border border-slate-100 text-center flex flex-col items-center">
      <p className="text-xs font-semibold uppercase tracking-wide text-fm-pink">
        Active order
      </p>
      <h3 className="font-display text-lg font-semibold text-fm-ink mt-1">
        #{orderCode}
      </h3>
      <p className="text-fm-muted text-sm mt-1">{locationLine}</p>
      <div className="mt-3 inline-flex items-center justify-center gap-2 rounded-full bg-fm-green-soft px-3 py-1 text-sm font-medium text-fm-green border border-fm-green/25">
        <span aria-hidden>●</span> Loom setup: verified
      </div>
      <div
        className="mt-4 w-full aspect-video rounded-lg bg-gradient-to-br from-fm-btn-light to-slate-200 flex items-center justify-center text-fm-muted text-sm"
        role="img"
        aria-label="Placeholder for loom video"
      >
        Loom video preview
      </div>
      <button
        type="button"
        onClick={onViewPassport}
        className="mt-4 w-full min-h-[48px] rounded-xl bg-fm-btn-bg text-white font-semibold shadow-md hover:bg-fm-btn-text transition-colors text-center"
      >
        View passport QR
      </button>
    </article>
  );
}
