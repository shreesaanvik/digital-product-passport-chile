const ITEMS = [
  { label: "EU ESPR ready", ok: true },
  { label: "US FABRIC Act ready", ok: true },
  { label: "GI-tag path", ok: true },
];

export function ComplianceShields() {
  return (
    <section
      className="rounded-2xl bg-fm-card p-5 shadow-neu border border-white"
      aria-labelledby="compliance-heading"
    >
      <h2
        id="compliance-heading"
        className="font-display text-xl font-semibold text-fm-blue mb-3"
      >
        Export checks
      </h2>
      <p className="text-fm-muted text-base mb-4">
        Simple green checks for regulators. Tap nothing — just read.
      </p>
      <ul className="flex flex-col gap-3">
        {ITEMS.map((item) => (
          <li
            key={item.label}
            className="flex items-center gap-3 rounded-xl bg-fm-green-soft px-4 py-3 border border-fm-green/25"
          >
            <span
              className="flex h-10 w-10 items-center justify-center rounded-full bg-fm-green text-white text-lg"
              aria-hidden
            >
              ✓
            </span>
            <span className="font-medium text-fm-ink">{item.label}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
