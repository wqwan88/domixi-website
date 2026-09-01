import { type Lang, getDict, langPath, consoleHref } from "@/lib/i18n";
import { brand } from "@/lib/brand";

export default function Hero({ lang }: { lang: Lang }) {
  const t = getDict(lang);

  return (
    <section className="relative min-h-[92vh] flex items-center justify-center px-6 overflow-hidden">
      {/* 分光装饰线 */}
      <div className="light-beam w-[70vw] top-[30%] left-[15%] -rotate-6" />
      <div className="light-beam w-[50vw] top-[55%] left-[30%] rotate-3 opacity-40" />

      <div className="max-w-4xl mx-auto text-center pt-24 pb-16">
        <div className="inline-flex items-center gap-2 glass px-4 py-1.5 text-xs text-white/60 mb-8">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          {t.hero.badge}
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold leading-[1.1] tracking-tight">
          {t.hero.title}
          <br />
          <span className="prism-text">{t.hero.title2}</span>
        </h1>

        <p className="mt-8 text-lg md:text-xl text-white/55 max-w-2xl mx-auto leading-relaxed">
          {t.hero.subtitle}
        </p>

        <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href={consoleHref(lang, "/register")}
            className="btn-primary px-8 py-3.5 text-base w-full sm:w-auto"
          >
            {t.hero.cta} →
          </a>
          <a
            href={langPath(lang, "/#quickstart")}
            className="glass px-8 py-3.5 text-base text-white/80 hover:text-white w-full sm:w-auto text-center"
          >
            {t.hero.cta2}
          </a>
        </div>

        <div className="mt-16 glass inline-block text-left px-6 py-4 codeblock max-w-full overflow-x-auto">
          <div className="flex gap-1.5 mb-3">
            <span className="w-3 h-3 rounded-full bg-red-500/70" />
            <span className="w-3 h-3 rounded-full bg-yellow-500/70" />
            <span className="w-3 h-3 rounded-full bg-green-500/70" />
          </div>
          <pre className="text-white/85 whitespace-pre text-sm">
            <span className="text-white/40">{t.hero.codeComment}</span>
            {"\n"}
            {brand.curlExample.split('\n').slice(0, 3).join('\n')}
          </pre>
        </div>
      </div>
    </section>
  );
}
