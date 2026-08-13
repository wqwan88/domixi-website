import en from "./translations/en";
import fr from "./translations/fr";
import ru from "./translations/ru";
import ja from "./translations/ja";
import vi from "./translations/vi";
import zh from "./translations/zh";
import zhTW from "./translations/zh-TW";

export const languages = [
  { code: "zh", label: "简体中文", flag: "🇨🇳", htmlLang: "zh-CN" },
  { code: "en", label: "English", flag: "🇺🇸", htmlLang: "en" },
  { code: "fr", label: "Français", flag: "🇫🇷", htmlLang: "fr" },
  { code: "ru", label: "Русский", flag: "🇷🇺", htmlLang: "ru" },
  { code: "ja", label: "日本語", flag: "🇯🇵", htmlLang: "ja" },
  { code: "vi", label: "Tiếng Việt", flag: "🇻🇳", htmlLang: "vi" },
  { code: "zh-TW", label: "繁體中文", flag: "🇹🇼", htmlLang: "zh-TW" },
] as const;

export type Lang = (typeof languages)[number]["code"];
const dict: Record<string, typeof en> = { en, fr, ru, ja, zh, vi, "zh-TW": zhTW };

export function getLang(code: string | undefined): Lang {
  if (code && dict[code]) return code as Lang;
  return "zh";
}

export function getDict(lang: Lang): typeof en {
  return dict[lang] || dict.en;
}

export function langPath(lang: Lang, path: string = ""): string {
  if (lang === "zh") return path || "/";
  return `/${lang}${path}`;
}

export function langSwitchUrl(currentPath: string, target: Lang): string {
  // Strip current language prefix
  const stripped = currentPath.replace(/^\/(en|fr|ru|ja|vi|zh-TW)(\/|$)/, "/");
  if (target === "zh") return stripped;
  return `/${target}${stripped === "/" ? "" : stripped}`;
}

export function getHtmlLang(lang: Lang): string {
  return languages.find((l) => l.code === lang)?.htmlLang ?? "en";
}
