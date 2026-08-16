import { type Lang, getDict } from "@/lib/i18n";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import StatusPanel from "@/components/StatusPanel";

export default function StatusContent({ lang }: { lang: Lang }) {
  const t = getDict(lang);
  return (
    <main>
      <Navbar lang={lang} />
      <div className="max-w-4xl mx-auto px-6 pt-32 pb-24">
        <h1 className="text-4xl font-bold">{t.statusPage.title}</h1>
        <p className="text-white/50 mt-4 mb-10">{t.statusPage.subtitle}</p>
        <StatusPanel lang={lang} labels={t.statusPage} />
      </div>
      <Footer lang={lang} />
    </main>
  );
}
