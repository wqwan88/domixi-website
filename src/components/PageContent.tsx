import { type Lang, getDict, langPath } from "@/lib/i18n";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import ModelsTable from "@/components/ModelsTable";
import QuickStart from "@/components/QuickStart";
import Faq from "@/components/Faq";
import Cta from "@/components/Cta";
import Footer from "@/components/Footer";

export default function PageContent({ lang }: { lang: Lang }) {
  return (
    <main>
      <Navbar lang={lang} />
      <Hero lang={lang} />
      <ModelsTable lang={lang} />
      <Features lang={lang} />
      <QuickStart lang={lang} />
      <Faq lang={lang} />
      <Cta lang={lang} />
      <Footer lang={lang} />
    </main>
  );
}
