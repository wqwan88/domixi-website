import { getLang } from "@/lib/i18n";
import DocsContent from "@/components/DocsContent";

export default async function LangDocsPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang: raw } = await params;
  const lang = getLang(raw);
  return <DocsContent lang={lang} />;
}
