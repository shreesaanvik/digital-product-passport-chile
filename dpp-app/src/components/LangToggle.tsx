"use client";

import { useLanguage, useT } from "@/i18n/LanguageProvider";

export function DemoPill() {
  const t = useT();
  return (
    <span className="inline-flex items-center rounded-full border-[1.5px] border-[#0081A1] bg-white px-2 py-0.5 text-[11px] font-semibold leading-none text-[#006E8A]">
      {t.header.demo}
    </span>
  );
}

export function LangToggle() {
  const t = useT();
  const { lang, setLang } = useLanguage();

  return (
    <div
      role="group"
      aria-label={t.header.lang}
      className="inline-flex items-center gap-0.5 text-[11px] font-semibold leading-none"
    >
      <button
        type="button"
        onClick={() => setLang("es")}
        aria-pressed={lang === "es"}
        className={`min-h-7 min-w-7 rounded px-1 ${
          lang === "es" ? "text-[#006E8A]" : "text-fm-muted"
        }`}
      >
        ES
      </button>
      <span aria-hidden className="text-fm-muted">
        |
      </span>
      <button
        type="button"
        onClick={() => setLang("en")}
        aria-pressed={lang === "en"}
        className={`min-h-7 min-w-7 rounded px-1 ${
          lang === "en" ? "text-[#006E8A]" : "text-fm-muted"
        }`}
      >
        EN
      </button>
    </div>
  );
}

export function HeaderMarks() {
  return (
    <div className="mt-1 inline-flex items-center gap-1.5">
      <DemoPill />
      <LangToggle />
    </div>
  );
}
