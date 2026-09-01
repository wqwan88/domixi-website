import type { Lang } from "./i18n";

/** ISO 3166-1 alpha-2 → website language */
export const COUNTRY_TO_LANG: Record<string, Lang> = {
  CN: "zh",
  TW: "zh-TW",
  HK: "zh-TW",
  MO: "zh-TW",
  JP: "ja",
  FR: "fr",
  RU: "ru",
  VN: "vi",
};

/** ISO 3166-1 alpha-2 → New API i18next localStorage code */
export const COUNTRY_TO_CONSOLE_LNG: Record<string, string> = {
  CN: "zhCN",
  TW: "zhTW",
  HK: "zhTW",
  MO: "zhTW",
  JP: "ja",
  FR: "fr",
  RU: "ru",
  VN: "vi",
};

export const LANG_COOKIE = "domixi_lang";
export const LANG_PREFIXES = ["en", "fr", "ru", "ja", "vi", "zh-TW"] as const;

export function normalizeCountry(raw: string | null | undefined): string {
  if (!raw) return "";
  return raw.trim().toUpperCase().replace(/[^A-Z]/g, "").slice(0, 2);
}

export function geoLangFromCountry(raw: string | null | undefined): Lang {
  const country = normalizeCountry(raw);
  return COUNTRY_TO_LANG[country] ?? "en";
}

export function consoleLngFromCountry(raw: string | null | undefined): string {
  const country = normalizeCountry(raw);
  return COUNTRY_TO_CONSOLE_LNG[country] ?? "en";
}

export function isLangCode(code: string | undefined): code is Lang {
  return (
    code === "zh" ||
    code === "en" ||
    code === "fr" ||
    code === "ru" ||
    code === "ja" ||
    code === "vi" ||
    code === "zh-TW"
  );
}
