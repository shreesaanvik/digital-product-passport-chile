"use client";

import { useT } from "@/i18n/LanguageProvider";

type Props = {
  onClick: () => void;
};

export function BackLink({ onClick }: Props) {
  const t = useT();

  return (
    <button
      type="button"
      onClick={onClick}
      className="min-h-[44px] text-base font-semibold text-fm-btn-text"
    >
      {t.common.back}
    </button>
  );
}
