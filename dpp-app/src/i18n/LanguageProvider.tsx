"use client";

import { useRouter, useSearchParams } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  type ReactNode,
} from "react";
import {
  formatClp,
  formatDayMonth,
  formatDayMonthTime,
  formatStamp,
  formatUsd,
  htmlLang,
  isLang,
  type DayMonth,
  type DayMonthTime,
  type Lang,
} from "@/lib/format";
import { en } from "./messages/en";
import { es, type Messages } from "./messages/es";

type LanguageContextValue = {
  lang: Lang;
  messages: Messages;
  setLang: (next: Lang) => void;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const raw = searchParams.get("lang");
  const lang: Lang = isLang(raw) ? raw : "es";
  const messages = lang === "en" ? en : es;

  useEffect(() => {
    document.documentElement.lang = htmlLang(lang);
    document.title = messages.meta.title;
    const description = document.querySelector('meta[name="description"]');
    if (description) description.setAttribute("content", messages.meta.description);
  }, [lang, messages]);

  const setLang = useCallback(
    (next: Lang) => {
      const params = new URLSearchParams(searchParams.toString());
      if (next === "es") params.delete("lang");
      else params.set("lang", next);
      const qs = params.toString();
      router.replace(qs ? `/?${qs}` : "/", { scroll: false });
    },
    [router, searchParams],
  );

  const value = useMemo(
    () => ({ lang, messages, setLang }),
    [lang, messages, setLang],
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

function useLanguageContext() {
  const value = useContext(LanguageContext);
  if (!value) {
    throw new Error("useT must be used within LanguageProvider");
  }
  return value;
}

export function useT(): Messages {
  return useLanguageContext().messages;
}

export function useLanguage() {
  return useLanguageContext();
}

export function useFormat() {
  const { lang } = useLanguageContext();
  return {
    clp: (amount: number) => formatClp(amount, lang),
    usd: (amount: number) => formatUsd(amount, lang),
    dayMonth: (date: DayMonth) => formatDayMonth(date, lang),
    dayMonthTime: (date: DayMonthTime) => formatDayMonthTime(date, lang),
    stamp: (date: Date) => formatStamp(date, lang),
  };
}
