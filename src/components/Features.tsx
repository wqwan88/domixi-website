import { type Lang, getDict } from "@/lib/i18n";
import { brand } from "@/lib/brand";

export default function Features({ lang }: { lang: Lang }) {
  const t = getDict(lang);

  return (
    <section id="features" className="max-w-6xl mx-auto px-6 py-24">
      <h2 className="text-3xl md:text-4xl font-bold text-center">
        {t.features.title}{" "}
        <span className="prism-text">DOMIXI</span>
      </h2>
      <p className="text-center text-white/50 mt-4 mb-14">{t.features.subtitle}</p>

      <div className="grid md:grid-cols-3 gap-5">
        {t.features.items.map((f) => (
          <div key={f.title} className="glass p-6">
            <div className="text-3xl mb-4">{f.icon}</div>
            <h3 className="font-semibold text-lg mb-2">{f.title}</h3>
            <p className="text-white/50 text-sm leading-relaxed">{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
