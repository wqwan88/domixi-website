import { getLang } from "@/lib/i18n";
import PageContent from "@/components/PageContent";

export default async function LangPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang: raw } = await params;
  const lang = getLang(raw);
  return <PageContent lang={lang} />;
}
