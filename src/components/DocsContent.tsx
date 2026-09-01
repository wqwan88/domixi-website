import { type Lang, getDict, consoleHref } from "@/lib/i18n";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { brand } from "@/lib/brand";
import ScalarDocs from "@/components/ScalarDocs";

export default function DocsContent({ lang }: { lang: Lang }) {
  const t = getDict(lang);
  const consoleLabel = lang === "zh" || lang === "zh-TW" ? "控制台 → 令牌" : "Console → Tokens";

  const endpoints = [
    { method: "POST", path: "/v1/chat/completions", desc: t.docs.epChat },
    { method: "POST", path: "/v1/messages", desc: t.docs.epClaude },
    { method: "POST", path: "/v1/embeddings", desc: t.docs.epEmbed },
    { method: "POST", path: "/v1/images/generations", desc: t.docs.epImage },
    { method: "POST", path: "/v1/rerank", desc: "Rerank API" },
    { method: "GET", path: "/v1/models", desc: t.docs.epModels },
  ];

  return (
    <main>
      <Navbar lang={lang} />
      <div className="max-w-5xl mx-auto px-6 pt-32 pb-24">
        <h1 className="text-4xl font-bold">{t.docs.title}</h1>
        <p className="text-white/50 mt-4 mb-4">{t.docs.subtitle}</p>
        <p className="text-sm text-white/40 mb-12">
          Base URL{" "}
          <code className="text-cyan-300">{brand.gatewayUrl}</code>
        </p>

        <h2 className="text-xl font-semibold mb-4">{t.docs.auth}</h2>
        <div className="glass p-5 mb-10 !transform-none">
          <code className="text-sm text-cyan-300">Authorization: Bearer sk-***</code>
          <p className="text-white/50 text-sm mt-3">
            {t.docs.authDesc}{" "}
            <a href={consoleHref(lang, "/token")} className="text-blue-300 underline underline-offset-4">
              {consoleLabel}
            </a>
          </p>
        </div>

        <h2 className="text-xl font-semibold mb-4">{t.docs.endpoints}</h2>
        <div className="glass !transform-none overflow-hidden mb-10">
          {endpoints.map((e) => (
            <div key={e.path} className="flex items-center gap-4 px-5 py-3.5 border-b border-white/5 last:border-0 text-sm">
              <span className={`font-mono text-xs px-2 py-1 rounded ${
                e.method === "GET" ? "bg-emerald-500/15 text-emerald-300" : "bg-blue-500/15 text-blue-300"
              }`}>{e.method}</span>
              <code className="text-cyan-200">{e.path}</code>
              <span className="text-white/40 ml-auto hidden sm:inline">{e.desc}</span>
            </div>
          ))}
        </div>

        <h2 className="text-xl font-semibold mb-4">{t.docs.pythonExample}</h2>
        <pre className="codeblock p-5 overflow-x-auto text-white/85 mb-10">{brand.codeExample}</pre>

        <h2 className="text-xl font-semibold mb-4">{t.docs.curlExample}</h2>
        <pre className="codeblock p-5 overflow-x-auto text-white/85 mb-10">{brand.curlExample}</pre>

        <h2 className="text-xl font-semibold mb-4">{t.docs.errors}</h2>
        <div className="glass !transform-none overflow-hidden mb-14">
          {t.docs.errorsList.map(([code, msg]) => (
            <div key={code} className="flex gap-4 px-5 py-3.5 border-b border-white/5 last:border-0 text-sm">
              <code className="text-red-300 font-mono">{code}</code>
              <span className="text-white/50">{msg}</span>
            </div>
          ))}
        </div>

        <h2 className="text-xl font-semibold mb-2">{t.docs.interactive}</h2>
        <p className="text-white/40 text-sm mb-4">{t.docs.tryHint}</p>
        <ScalarDocs />
      </div>
      <Footer lang={lang} />
    </main>
  );
}
