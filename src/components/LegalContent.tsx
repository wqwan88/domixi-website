import { type Lang, getDict, langPath } from "@/lib/i18n";
import { getLegalDoc, legalPaths, type LegalDocId } from "@/lib/legal";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function LegalContent({
  lang,
  doc,
}: {
  lang: Lang;
  doc: LegalDocId;
}) {
  const t = getDict(lang);
  const page = getLegalDoc(lang, doc);
  const related: { id: LegalDocId; label: string }[] = [
    { id: "terms", label: t.footer.terms },
    { id: "privacy", label: t.footer.privacy },
    { id: "aup", label: t.footer.aup },
  ];

  return (
    <main>
      <Navbar lang={lang} />
      <article className="max-w-3xl mx-auto px-6 pt-32 pb-24">
        <p className="text-xs tracking-widest text-white/40 uppercase mb-3">{t.footer.legal}</p>
        <h1 className="text-4xl font-bold">{page.title}</h1>
        <p className="text-white/40 text-sm mt-3">
          {t.legal.updatedPrefix}
          {page.updated}
        </p>
        <p className="text-white/65 leading-relaxed mt-8">{page.intro}</p>

        <nav className="flex flex-wrap gap-3 mt-8 text-sm">
          {related.map((item) => (
            <a
              key={item.id}
              href={langPath(lang, legalPaths[item.id])}
              className={`px-3 py-1.5 rounded-lg border transition-colors ${
                item.id === doc
                  ? "border-white/25 text-white bg-white/8"
                  : "border-white/10 text-white/50 hover:text-white hover:border-white/25"
              }`}
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="mt-12 space-y-10">
          {page.sections.map((section) => (
            <section key={section.title}>
              <h2 className="text-xl font-semibold mb-4">{section.title}</h2>
              {section.paragraphs?.map((p) => (
                <p key={p.slice(0, 48)} className="text-white/60 leading-relaxed mb-3">
                  {p}
                </p>
              ))}
              {section.bullets && (
                <ul className="list-disc pl-5 space-y-2 text-white/60 leading-relaxed">
                  {section.bullets.map((b) => (
                    <li key={b.slice(0, 48)}>{b}</li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </div>
      </article>
      <Footer lang={lang} />
    </main>
  );
}
