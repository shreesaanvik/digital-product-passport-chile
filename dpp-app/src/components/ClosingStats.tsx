"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

function StatsContent() {
  return (
    <>
      <h2 id="closing-heading" className="font-display text-xl font-semibold mb-4">
        Village impact
      </h2>
      <ul className="space-y-4 text-lg">
        <li className="flex justify-between gap-4 border-b border-white/20 pb-3">
          <span className="opacity-90">Wealth back to artisans</span>
          <span className="font-semibold text-fm-orange">$42,500</span>
        </li>
        <li className="flex justify-between gap-4 border-b border-white/20 pb-3">
          <span className="opacity-90">EU compliance</span>
          <span className="font-semibold">100%</span>
        </li>
        <li className="flex justify-between gap-4">
          <span className="opacity-90">Faster to market</span>
          <span className="font-semibold">14 days saved</span>
        </li>
      </ul>
    </>
  );
}

const cardClassName =
  "rounded-2xl bg-gradient-to-br from-fm-blue to-fm-btn-bg p-6 text-white shadow-lg";

export function ClosingStats() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <section className={cardClassName} aria-labelledby="closing-heading">
        <StatsContent />
      </section>
    );
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={cardClassName}
      aria-labelledby="closing-heading"
    >
      <StatsContent />
    </motion.section>
  );
}
