"use client";

import { useT } from "@/i18n/LanguageProvider";

type Props = {
  onOpenPassport: () => void;
};

export function PassportViewerDemo({ onOpenPassport }: Props) {
  const t = useT();

  return (
    <div className="space-y-4">
      <p className="text-fm-ink">{t.viewer.body}</p>
      <button
        type="button"
        onClick={onOpenPassport}
        className="btn-primary min-h-[52px] w-full text-lg font-semibold"
      >
        {t.viewer.open}
      </button>
    </div>
  );
}
