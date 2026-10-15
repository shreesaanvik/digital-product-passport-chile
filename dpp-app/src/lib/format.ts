export type Lang = "es" | "en";

export type DayMonth = { day: number; month: number };

export type DayMonthTime = DayMonth & { hour: number; minute: number };

const MONTHS: Record<Lang, readonly string[]> = {
  es: ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"],
  en: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
};

export function isLang(value: string | null): value is Lang {
  return value === "es" || value === "en";
}

export function htmlLang(lang: Lang): "es-CL" | "en" {
  return lang === "en" ? "en" : "es-CL";
}

export function formatDayMonth(date: DayMonth, lang: Lang): string {
  const name = MONTHS[lang][date.month - 1] ?? "";
  return `${date.day} ${name}`;
}

export function formatDayMonthTime(date: DayMonthTime, lang: Lang): string {
  const hours = String(date.hour).padStart(2, "0");
  const minutes = String(date.minute).padStart(2, "0");
  return `${formatDayMonth(date, lang)}, ${hours}:${minutes}`;
}

export function formatStamp(date: Date, lang: Lang): string {
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const day = formatDayMonth(
    { day: date.getDate(), month: date.getMonth() + 1 },
    lang,
  );
  return `${day} ${date.getFullYear()}, ${hours}:${minutes}`;
}

export function formatClp(amount: number, lang: Lang): string {
  const grouped = new Intl.NumberFormat(lang === "es" ? "es-CL" : "en-US", {
    maximumFractionDigits: 0,
  }).format(Math.round(amount));
  return lang === "es" ? `$${grouped} CLP` : `CLP ${grouped}`;
}

export function formatUsd(amount: number, lang: Lang): string {
  const grouped = new Intl.NumberFormat(lang === "es" ? "es-CL" : "en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
  return `US$${grouped}`;
}

export function todayParts(date = new Date()): DayMonthTime {
  return {
    day: date.getDate(),
    month: date.getMonth() + 1,
    hour: date.getHours(),
    minute: date.getMinutes(),
  };
}
