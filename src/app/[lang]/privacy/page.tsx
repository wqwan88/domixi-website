import type { Metadata } from "next";
import { getLang } from "@/lib/i18n";
import { getLegalDoc } from "@/lib/legal";
import LegalContent from "@/components/LegalContent";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang: raw } = await params;
  const lang = getLang(raw);
  const page = getLegalDoc(lang, "privacy");
  return { title: `${page.title} · DOMIXI`, description: page.intro.slice(0, 160) };
}

export default async function LangPrivacyPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang: raw } = await params;
  return <LegalContent lang={getLang(raw)} doc="privacy" />;
}
