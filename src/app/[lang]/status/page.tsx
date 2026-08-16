import type { Metadata } from "next";
import { getLang, getDict } from "@/lib/i18n";
import StatusContent from "@/components/StatusContent";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang: raw } = await params;
  const t = getDict(getLang(raw));
  return { title: `${t.statusPage.title} · DOMIXI`, description: t.statusPage.subtitle };
}

export default async function LangStatusPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang: raw } = await params;
  return <StatusContent lang={getLang(raw)} />;
}
