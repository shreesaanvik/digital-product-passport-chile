"use client";

import { ClosingStats } from "./ClosingStats";
import { ComplianceShields } from "./ComplianceShields";

export function ReportsCategoryScreen() {
  return (
    <div className="space-y-8">
      <header>
        <h1 className="font-display text-2xl font-semibold text-fm-blue">
          Reports
        </h1>
        <p className="mt-2 text-fm-muted text-base">
          Village impact totals and export readiness checks.
        </p>
      </header>
      <ClosingStats />
      <ComplianceShields />
    </div>
  );
}
