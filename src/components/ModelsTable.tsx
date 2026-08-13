import { type Lang, getDict, langPath } from "@/lib/i18n";
import { brand } from "@/lib/brand";

export default function ModelsTable({ lang }: { lang: Lang }) {
  const t = getDict(lang);

  return (
    <section id="models" className="max-w-6xl mx-auto px-6 py-24">
      <h2 className="text-3xl md:text-4xl font-bold text-center">{t.models.title}</h2>
      <p className="text-center text-white/50 mt-4 mb-4">{t.models.subtitle}</p>
      <p className="text-center text-white/30 text-sm mb-12">{t.models.note}</p>

      <div className="glass overflow-hidden !transform-none">
        <div className="overflow-x-auto">
          <table className="price-table w-full text-sm">
            <thead>
              <tr className="text-white/40 text-xs uppercase tracking-wider">
                <th>{t.models.vendor}</th>
                <th>{t.models.model}</th>
                <th>{t.models.input}</th>
                <th>{t.models.output}</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {brand.models.map((m) => (
                <tr key={m.name}>
                  <td className="text-white/60">{m.vendor}</td>
                  <td className="font-medium">{m.name}</td>
                  <td className="text-cyan-300">{m.priceIn}</td>
                  <td className="text-violet-300">{m.priceOut}</td>
                  <td>
                    <span className="text-xs px-2.5 py-1 rounded-full bg-blue-500/15 text-blue-300 border border-blue-500/25">
                      {m.tag}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <p className="text-center mt-10">
        <a href={brand.consoleUrl + "/pricing"} className="text-sm text-blue-300 hover:text-blue-200 underline underline-offset-4">
          {t.models.viewAll}
        </a>
      </p>
    </section>
  );
}
