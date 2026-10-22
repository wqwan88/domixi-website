"use client";

import { useEffect, useRef } from "react";

export default function ScalarDocs({ lang }: { lang: string }) {
  const host = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = host.current;
    if (!el) return;
    el.innerHTML = "";
    const script = document.createElement("script");
    script.id = "api-reference";
    script.src = "https://cdn.jsdelivr.net/npm/@scalar/api-reference";
    script.setAttribute("data-url", `/openapi.json?lang=${encodeURIComponent(lang)}`);
    script.setAttribute(
      "data-configuration",
      JSON.stringify({
        theme: "kepler",
        darkMode: true,
        hideDarkModeToggle: true,
        defaultOpenAllTags: true,
      }),
    );
    el.appendChild(script);
    return () => {
      el.innerHTML = "";
    };
  }, [lang]);

  return (
    <div
      ref={host}
      className="mt-4 rounded-2xl overflow-hidden border border-white/10 bg-[#0b1120] min-h-[70vh]"
    />
  );
}
