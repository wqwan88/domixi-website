"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { type Lang, languages, getDict, langPath, langSwitchUrl, consoleHref } from "@/lib/i18n";

export default function Navbar({ lang }: { lang: Lang }) {
  const [scrolled, setScrolled] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const pathname = usePathname();
  const t = getDict(lang);
  const current = languages.find((l) => l.code === lang);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled ? "backdrop-blur-xl bg-black/50 border-b border-white/10" : ""
      }`}
    >
      <nav className="max-w-6xl mx-auto flex items-center justify-between px-6 h-16">
        <Link href={langPath(lang)} className="flex items-center gap-2.5">
          <img src="/domixi.svg" alt="DOMIXI" className="w-8 h-8" />
          <span className="font-bold text-lg tracking-tight">DOMIXI</span>
        </Link>

        <div className="hidden md:flex items-center gap-8 text-sm text-white/70">
          <Link href={langPath(lang)} className="hover:text-white transition-colors">
            {t.nav.home}
          </Link>
          <Link href={langPath(lang, "/#models")} className="hover:text-white transition-colors">
            {t.nav.plaza}
          </Link>
          <Link href={langPath(lang, "/docs")} className="hover:text-white transition-colors">
            {t.nav.docs}
          </Link>
          <Link href={langPath(lang, "/#faq")} className="hover:text-white transition-colors">
            {t.nav.faq}
          </Link>
          <a href={consoleHref(lang, "/console")} className="hover:text-white transition-colors">
            {t.nav.console}
          </a>
        </div>

        <div className="flex items-center gap-3">
          {/* 语言切换 */}
          <div className="relative">
            <button
              onClick={() => setLangOpen(!langOpen)}
              onBlur={() => setTimeout(() => setLangOpen(false), 200)}
              className="text-sm text-white/70 hover:text-white transition-colors px-2 py-1.5 flex items-center gap-1"
            >
              {current?.flag} {current?.label}
            </button>
            {langOpen && (
              <div className="absolute right-0 top-full mt-2 w-40 glass !transform-none overflow-hidden shadow-xl z-50">
                {languages.map((l) => (
                  <Link
                    key={l.code}
                    href={langSwitchUrl(pathname, l.code)}
                    className={`block px-4 py-2.5 text-sm hover:bg-white/10 transition-colors ${
                      l.code === lang ? "text-cyan-300" : "text-white/70"
                    }`}
                  >
                    {l.flag} {l.label}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <a
            href={consoleHref(lang, "/login")}
            className="text-sm text-white/80 hover:text-white transition-colors px-3 py-2"
          >
            {t.nav.login}
          </a>
          <a
            href={consoleHref(lang, "/register")}
            className="btn-primary text-sm px-4 py-2"
          >
            {t.nav.register}
          </a>
        </div>
      </nav>
    </header>
  );
}
