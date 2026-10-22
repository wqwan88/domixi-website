import { type Lang, getDict, consoleHref } from "@/lib/i18n";
import { brand } from "@/lib/brand";

export default function ModelsTable({ lang }: { lang: Lang }) {
  const t = getDict(lang);
  const unit = t.models.currencyUnit;
  const vendors = t.models.vendors as Record<string, string>;
  const tags = t.models.tags as Record<string, string>;
  const tr = (s: string) =>
    s.replaceAll("{unit}", unit).replaceAll("{per}", t.models.per);

  return (
    <section id="models" className="max-w-6xl mx-auto px-6 py-24">
      <h2 className="text-3xl md:text-4xl font-bold text-center">{t.models.title}</h2>
      <p className="text-center text-slate-500 mt-4 mb-4">{t.models.subtitle}</p>
      <p className="text-center text-slate-500 text-sm mb-12">{t.models.note}</p>

      <div className="glass overflow-hidden !transform-none">
        <div className="overflow-x-auto">
          <table className="price-table w-full text-sm">
            <thead>
              <tr className="text-slate-500 text-xs uppercase tracking-wider">
                <th>{t.models.vendor}</th>
                <th>{t.models.model}</th>
                <th>{t.models.input}</th>
                <th>{t.models.output}</th>
                <th>{t.models.cache}</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {brand.models.map((m) => (
                <tr key={m.name}>
                  <td className="text-slate-600">{vendors[m.vendor] ?? m.vendor}</td>
                  <td className="font-medium">{m.name}</td>
                  <td className="text-cyan-700">{tr(m.priceIn)}</td>
                  <td className="text-violet-600">{tr(m.priceOut)}</td>
                  <td className="text-emerald-700">{tr(m.priceCache)}</td>
                  <td>
                    <span className="text-xs px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-600 border border-blue-500/25">
                      {tags[m.tag] ?? m.tag}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <p className="text-center mt-10">
        <a href={consoleHref(lang, "/pricing")} className="text-sm text-blue-600 hover:text-blue-700 underline underline-offset-4">
          {t.models.viewAll}
        </a>
      </p>
    </section>
  );
}
