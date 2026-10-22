import { type NextRequest, NextResponse } from "next/server";
import { getLang, type Lang } from "@/lib/i18n";
import { LANG_COOKIE, isLangCode, geoLangFromCountry } from "@/lib/locale-geo";
import { buildOpenApi } from "@/lib/openapi";

/** Resolve the site language for this request: ?lang= > cookie > geo > default. */
function resolveLang(request: NextRequest): Lang {
  const query = request.nextUrl.searchParams.get("lang");
  if (isLangCode(query ?? undefined)) return query as Lang;

  const cookie = request.cookies.get(LANG_COOKIE)?.value;
  if (isLangCode(cookie)) return cookie as Lang;

  const geo = geoLangFromCountry(request.headers.get("cf-ipcountry"));
  return getLang(geo);
}

export function GET(request: NextRequest) {
  const lang = resolveLang(request);
  const doc = buildOpenApi(lang);

  return NextResponse.json(doc, {
    headers: {
      "Cache-Control": "public, max-age=300",
      Vary: "Cookie, CF-IPCountry",
      "Content-Language": lang,
    },
  });
}
