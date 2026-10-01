"use client";

import { useEffect, useRef, useState } from "react";

const DEFAULT_FIELDS = {
  product: "Hand-loomed Silk Saree",
  material: "Mulberry silk, zari (tested)",
  origin: "Varanasi, India",
  artisan: "Lata Devi",
};

type FieldKey = keyof typeof DEFAULT_FIELDS;

const FIELDS: { key: FieldKey; label: string }[] = [
  { key: "product", label: "Product" },
  { key: "material", label: "Material" },
  { key: "origin", label: "Origin" },
  { key: "artisan", label: "Artisan" },
];

function canonical(fields: typeof DEFAULT_FIELDS) {
  return [fields.product, fields.material, fields.origin, fields.artisan].join("\n");
}

async function sha256Hex(value: string) {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

function shortFingerprint(hex: string) {
  return `${hex.slice(0, 10)}...${hex.slice(-8)}`;
}

export function FingerprintDemo() {
  const [fields, setFields] = useState(DEFAULT_FIELDS);
  const [saved, setSaved] = useState<{ payload: string; hash: string } | null>(null);
  const [touched, setTouched] = useState(false);
  const [live, setLive] = useState<{ payload: string; hash: string } | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const payloadRef = useRef("");

  const payload = canonical(fields);
  payloadRef.current = payload;

  useEffect(() => {
    if (!touched || !saved) return;
    let cancelled = false;
    void sha256Hex(payload)
      .then((hash) => {
        if (!cancelled) setLive({ payload, hash });
      })
      .catch(() => {
        if (!cancelled) setLive(null);
      });
    return () => {
      cancelled = true;
    };
  }, [payload, saved, touched]);

  async function createFingerprint() {
    const snapshot = payloadRef.current;
    setBusy(true);
    setError("");
    try {
      const hash = await sha256Hex(snapshot);
      setSaved({ payload: snapshot, hash });
      setTouched(payloadRef.current !== snapshot);
      setLive(null);
    } catch {
      setError("This browser could not compute a fingerprint.");
    } finally {
      setBusy(false);
    }
  }

  function update(key: FieldKey, value: string) {
    setFields((current) => ({ ...current, [key]: value }));
    if (saved) setTouched(true);
  }

  const liveReady = live != null && live.payload === payload;
  const matches = liveReady && saved != null && live.hash === saved.hash;

  return (
    <div className="space-y-4">
      {FIELDS.map((field) => (
        <div key={field.key}>
          <label htmlFor={`fp-${field.key}`} className="mb-1 block text-sm font-medium text-fm-ink">
            {field.label}
          </label>
          <input
            id={`fp-${field.key}`}
            type="text"
            value={fields[field.key]}
            onChange={(event) => update(field.key, event.target.value)}
            className="min-h-[52px] w-full rounded-xl border-2 border-slate-200 px-4 text-base text-fm-ink focus:border-fm-blue focus:outline-none"
          />
        </div>
      ))}

      <button
        type="button"
        onClick={() => void createFingerprint()}
        disabled={busy}
        className="btn-primary min-h-[52px] w-full text-lg font-semibold disabled:opacity-60"
      >
        {busy ? "Creating fingerprint..." : "Create fingerprint"}
      </button>

      {error && (
        <p className="text-sm text-red-700" role="status">
          {error}
        </p>
      )}

      {saved && (
        <div className="space-y-3 rounded-xl border border-slate-200 bg-fm-surface p-4" aria-live="polite">
          <div className={touched ? "grid grid-cols-2 gap-3" : undefined}>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-fm-muted">
                Saved fingerprint
              </p>
              <p className="mt-1 break-all font-mono text-sm text-fm-ink">
                {shortFingerprint(saved.hash)}
              </p>
            </div>
            {touched && (
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-fm-muted">
                  Current data fingerprint
                </p>
                <p className="mt-1 break-all font-mono text-sm text-fm-ink">
                  {liveReady ? shortFingerprint(live.hash) : "..."}
                </p>
              </div>
            )}
          </div>
          {touched && liveReady && (
            <p className={`text-sm font-semibold ${matches ? "text-fm-green" : "text-red-700"}`}>
              {matches ? "Matches" : "Does not match. Data was changed."}
            </p>
          )}
        </div>
      )}

      <p className="text-sm text-fm-muted">
        In the full system this fingerprint would be recorded on a public ledger. Here it
        is only computed on this device.
      </p>
    </div>
  );
}
