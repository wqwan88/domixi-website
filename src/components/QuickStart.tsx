import { type Lang, getDict } from "@/lib/i18n";
import { brand } from "@/lib/brand";

export default function QuickStart({ lang }: { lang: Lang }) {
  const t = getDict(lang);

  return (
    <section id="quickstart" className="max-w-6xl mx-auto px-6 py-24">
      <h2 className="text-3xl md:text-4xl font-bold text-center">{t.quickstart.title}</h2>
      <p className="text-center text-white/50 mt-4 mb-14">{t.quickstart.subtitle}</p>

      <div className="grid md:grid-cols-4 gap-5 mb-10">
        {t.quickstart.steps.map((s) => (
          <div key={s.n} className="glass p-6 relative">
            <div className="prism-text font-extrabold text-4xl opacity-80">{s.n}</div>
            <h3 className="font-semibold mt-3 mb-2">{s.title}</h3>
            <p className="text-white/50 text-sm leading-relaxed">{s.desc}</p>
          </div>
        ))}
      </div>

      <div className="glass overflow-hidden !transform-none">
        <div className="flex items-center justify-between px-5 py-3 border-b border-white/10">
          <span className="text-xs text-white/40">{t.quickstart.codeTitle}</span>
          <span className="text-xs text-white/40">{t.quickstart.codeTag}</span>
        </div>
        <pre className="codeblock !border-0 !rounded-none p-5 overflow-x-auto text-white/85 text-sm">{brand.codeExample}</pre>
      </div>
    </section>
  );
}
