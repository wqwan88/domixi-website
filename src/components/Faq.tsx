"use client";
import { useState } from "react";
import { type Lang, getDict } from "@/lib/i18n";

export default function Faq({ lang }: { lang: Lang }) {
  const [open, setOpen] = useState<number | null>(0);
  const t = getDict(lang);

  return (
    <section id="faq" className="max-w-3xl mx-auto px-6 py-24">
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-14">{t.faq.title}</h2>
      <div className="space-y-3">
        {t.faq.items.map((item, i) => (
          <div key={i} className="glass !transform-none overflow-hidden">
            <button
              onClick={() => setOpen(open === i ? null : i)}
              className="w-full flex items-center justify-between px-6 py-4 text-left font-medium hover:text-blue-200 transition-colors"
            >
              {item.q}
              <span className={`text-white/40 transition-transform duration-300 ${open === i ? "rotate-45" : ""}`}>＋</span>
            </button>
            <div
              className={`px-6 text-sm text-white/55 leading-relaxed transition-all duration-300 ${
                open === i ? "max-h-48 pb-5 opacity-100" : "max-h-0 opacity-0"
              } overflow-hidden`}
            >
              {item.a}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
