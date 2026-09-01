import { type Lang, getDict, langPath, consoleHref } from "@/lib/i18n";
import { brand } from "@/lib/brand";

export default function Footer({ lang }: { lang: Lang }) {
  const t = getDict(lang);

  return (
    <footer className="border-t border-white/10 mt-12">
      <div className="max-w-6xl mx-auto px-6 py-12 grid md:grid-cols-4 gap-8 text-sm">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <img src="/domixi.svg" alt="" className="w-6 h-6" />
            <span className="font-bold">DOMIXI</span>
          </div>
          <p className="text-white/40 leading-relaxed">{brand.tagline}</p>
        </div>
        <div>
          <h4 className="text-white/70 font-medium mb-3">{t.footer.product}</h4>
          <ul className="space-y-2 text-white/40">
            <li><a href={langPath(lang, "/#models")} className="hover:text-white transition-colors">{t.footer.models}</a></li>
            <li><a href={langPath(lang, "/docs")} className="hover:text-white transition-colors">{t.footer.docs}</a></li>
            <li><a href={consoleHref(lang)} className="hover:text-white transition-colors">{t.footer.console}</a></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white/70 font-medium mb-3">{t.footer.support}</h4>
          <ul className="space-y-2 text-white/40">
            <li><a href={langPath(lang, "/#faq")} className="hover:text-white transition-colors">{t.footer.faq}</a></li>
            <li><a href={`mailto:${brand.docsEmail}`} className="hover:text-white transition-colors">{brand.docsEmail}</a></li>
            <li><a href={langPath(lang, "/status")} className="hover:text-white transition-colors">{t.footer.status}</a></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white/70 font-medium mb-3">{t.footer.legal}</h4>
          <ul className="space-y-2 text-white/40">
            <li><a href={langPath(lang, "/terms")} className="hover:text-white transition-colors">{t.footer.terms}</a></li>
            <li><a href={langPath(lang, "/privacy")} className="hover:text-white transition-colors">{t.footer.privacy}</a></li>
            <li><a href={langPath(lang, "/aup")} className="hover:text-white transition-colors">{t.footer.aup}</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/5 py-6 text-center text-xs text-white/30">
        {t.footer.copyright} {brand.icp && <span className="ml-2">{brand.icp}</span>}
      </div>
    </footer>
  );
}
