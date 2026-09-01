import { NextRequest, NextResponse } from "next/server";
import {
  LANG_COOKIE,
  LANG_PREFIXES,
  geoLangFromCountry,
  isLangCode,
} from "@/lib/locale-geo";
import { langPath, type Lang } from "@/lib/i18n";

const ONE_YEAR = 60 * 60 * 24 * 365;

function withLangCookie(res: NextResponse, lang: Lang) {
  res.cookies.set(LANG_COOKIE, lang, {
    path: "/",
    maxAge: ONE_YEAR,
    sameSite: "lax",
  });
  return res;
}

function langFromPath(pathname: string): Lang | null {
  for (const code of LANG_PREFIXES) {
    if (pathname === `/${code}` || pathname.startsWith(`/${code}/`)) {
      return code;
    }
  }
  return null;
}

export function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

  if (
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/static") ||
    pathname.startsWith("/topup") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  const setLang = searchParams.get("set_lang");
  if (setLang && isLangCode(setLang)) {
    const url = request.nextUrl.clone();
    url.searchParams.delete("set_lang");
    const res = NextResponse.redirect(url);
    return withLangCookie(res, setLang);
  }

  const pathLang = langFromPath(pathname);
  if (pathLang) {
    const res = NextResponse.next();
    const saved = request.cookies.get(LANG_COOKIE)?.value;
    if (saved !== pathLang) {
      return withLangCookie(res, pathLang);
    }
    return res;
  }

  const cookieLang = request.cookies.get(LANG_COOKIE)?.value;
  const preferred: Lang =
    cookieLang && isLangCode(cookieLang)
      ? cookieLang
      : geoLangFromCountry(request.headers.get("cf-ipcountry"));

  if (preferred === "zh") {
    const res = NextResponse.next();
    if (!cookieLang) {
      return withLangCookie(res, "zh");
    }
    return res;
  }

  const url = request.nextUrl.clone();
  url.pathname = langPath(preferred, pathname === "/" ? "" : pathname);
  const res = NextResponse.redirect(url);
  return withLangCookie(res, preferred);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|domixi.svg|logo.svg|logo.png|apple-touch-icon.png|openapi.json).*)",
  ],
};
