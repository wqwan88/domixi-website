import { type Lang, getDict } from "@/lib/i18n";
import { brand } from "@/lib/brand";

export default function Cta({ lang }: { lang: Lang }) {
  const t = getDict(lang);

  return (
    <section className="max-w-4xl mx-auto px-6 py-24 text-center">
      <div className="glass !transform-none px-8 py-16 relative overflow-hidden">
        <div className="light-beam w-full top-0 left-0" />
        <h2 className="text-3xl md:text-4xl font-bold">
          {t.cta.title} <span className="prism-text">DOMIXI</span>
        </h2>
        <p className="text-white/50 mt-4 mb-10">{t.cta.subtitle}</p>
        <a href={brand.consoleUrl + "/register"} className="btn-primary px-10 py-4 text-lg inline-block">
          {t.cta.button}
        </a>
      </div>
    </section>
  );
}
