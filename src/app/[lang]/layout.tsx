import { getLang, getHtmlLang, getDict } from "@/lib/i18n";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang: raw } = await params;
  const lang = getLang(raw);
  const t = getDict(lang);
  return {
    title: `DOMIXI · ${t.hero.title} ${t.hero.title2}`,
    description: t.hero.subtitle,
    openGraph: {
      title: `DOMIXI · ${t.hero.title} ${t.hero.title2}`,
      description: t.hero.subtitle,
      type: "website",
    },
  };
}

export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang: raw } = await params;
  const lang = getLang(raw);
  return <div lang={getHtmlLang(lang)}>{children}</div>;
}
