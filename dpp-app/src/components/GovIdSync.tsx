"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const SAMPLE_IDS = ["VAR-9982", "KUT-4410", "CHN-2201"];

export function GovIdSync() {
  const [id, setId] = useState("");
  const [verified, setVerified] = useState(false);

  function handleVerify() {
    const ok =
      id.trim().length > 3 ||
      SAMPLE_IDS.some((s) => id.toUpperCase().includes(s.split("-")[0]!));
    setVerified(ok);
  }

  return (
    <section
      className="rounded-2xl bg-fm-card p-5 shadow-neu border border-white"
      aria-labelledby="gov-sync-heading"
    >
      <h2
        id="gov-sync-heading"
        className="font-display text-xl font-semibold text-fm-blue mb-1"
      >
        Government ID check
      </h2>
      <p className="text-fm-muted text-base mb-4">
        Type an artisan ID (Pehchan-style). We pretend to sync with the national
        database — no real data leaves your device in this demo.
      </p>
      <label htmlFor="pehchan" className="block text-sm font-medium text-fm-ink mb-2">
        Artisan ID number
      </label>
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          id="pehchan"
          type="text"
          inputMode="text"
          autoComplete="off"
          placeholder="e.g. VAR-9982"
          value={id}
          onChange={(e) => {
            setId(e.target.value);
            setVerified(false);
          }}
          className="flex-1 min-h-[52px] rounded-xl border-2 border-slate-200 px-4 text-lg text-fm-ink placeholder:text-slate-400 focus:border-fm-blue focus:outline-none"
        />
        <button
          type="button"
          onClick={handleVerify}
          className="min-h-[52px] px-6 rounded-xl bg-fm-btn-bg text-white text-lg font-semibold shadow-md hover:bg-fm-btn-text transition-colors"
        >
          Check ID
        </button>
      </div>
      <div className="mt-2 text-sm text-fm-muted">
        Try:{" "}
        <button
          type="button"
          className="text-fm-green underline"
          onClick={() => setId("VAR-9982")}
        >
          VAR-9982
        </button>
      </div>

      <AnimatePresence>
        {verified && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-4 flex items-center gap-3 rounded-xl bg-fm-green-soft px-4 py-3 border border-fm-green/25"
            role="status"
          >
            <span className="text-2xl" aria-hidden>
              ✓
            </span>
            <div>
              <p className="font-semibold text-fm-ink">Verified match</p>
              <p className="text-fm-muted text-sm">
                Name and skill pulled from mock records. Ready for passport.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
