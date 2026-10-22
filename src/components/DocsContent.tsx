import { type Lang, getDict, consoleHref } from "@/lib/i18n";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { brand } from "@/lib/brand";
import { pythonExample, curlExample } from "@/lib/code-examples";
import ScalarDocs from "@/components/ScalarDocs";

export default function DocsContent({ lang }: { lang: Lang }) {
  const t = getDict(lang);
  const consoleLabel = t.api.consoleLabel;

  const endpoints = [
    { method: "POST", path: "/v1/chat/completions", desc: t.docs.epChat },
    { method: "POST", path: "/v1/messages", desc: t.docs.epClaude },
    { method: "POST", path: "/v1/embeddings", desc: t.docs.epEmbed },
    { method: "POST", path: "/v1/images/generations", desc: t.docs.epImage },
    { method: "POST", path: "/v1/videos", desc: t.docs.epVideo },
    { method: "GET", path: "/v1/videos/{task_id}", desc: t.docs.epVideoGet },
    { method: "POST", path: "/v1/rerank", desc: "Rerank API" },
    { method: "GET", path: "/v1/models", desc: t.docs.epModels },
  ];

  return (
    <main>
      <Navbar lang={lang} />
      <div className="max-w-5xl mx-auto px-6 pt-32 pb-24">
        <h1 className="text-4xl font-bold">{t.docs.title}</h1>
        <p className="text-slate-500 mt-4 mb-4">{t.docs.subtitle}</p>
        <p className="text-sm text-slate-500 mb-12">
          Base URL{" "}
          <code className="text-cyan-700">{brand.gatewayUrl}</code>
        </p>

        <h2 className="text-xl font-semibold mb-4">{t.docs.auth}</h2>
        <div className="glass p-5 mb-10 !transform-none">
          <code className="text-sm text-cyan-700">Authorization: Bearer sk-***</code>
          <p className="text-slate-500 text-sm mt-3">
            {t.docs.authDesc}{" "}
            <a href={consoleHref(lang, "/token")} className="text-blue-600 underline underline-offset-4">
              {consoleLabel}
            </a>
          </p>
        </div>

        <h2 className="text-xl font-semibold mb-4">{t.docs.endpoints}</h2>
        <div className="glass !transform-none overflow-hidden mb-10">
          {endpoints.map((e) => (
            <div key={e.path} className="flex items-center gap-4 px-5 py-3.5 border-b border-slate-900/5 last:border-0 text-sm">
              <span className={`font-mono text-xs px-2 py-1 rounded ${
                e.method === "GET" ? "bg-emerald-500/10 text-emerald-700" : "bg-blue-500/10 text-blue-600"
              }`}>{e.method}</span>
              <code className="text-cyan-700">{e.path}</code>
              <span className="text-slate-500 ml-auto hidden sm:inline">{e.desc}</span>
            </div>
          ))}
        </div>

        <h2 className="text-xl font-semibold mb-4">{t.docs.pythonExample}</h2>
        <pre className="codeblock p-5 overflow-x-auto text-white/85 mb-10">{pythonExample(lang)}</pre>

        <h2 className="text-xl font-semibold mb-4">{t.docs.curlExample}</h2>
        <pre className="codeblock p-5 overflow-x-auto text-white/85 mb-10">{curlExample(lang)}</pre>

        <h2 className="text-xl font-semibold mb-4">{t.docs.videoTitle}</h2>
        <p className="text-slate-500 text-sm mb-4">{t.docs.videoDesc}</p>
        <div className="glass !transform-none overflow-hidden mb-10">
          <div className="px-5 py-3.5 border-b border-slate-900/5 text-sm flex flex-wrap gap-2 items-baseline">
            <span className="text-slate-500">{t.docs.videoRatiosLabel}</span>
            <code className="text-cyan-700">{t.docs.videoRatios}</code>
          </div>
          <div className="px-5 py-3.5 text-sm">
            <div className="text-slate-500 mb-2">{t.docs.videoResLabel}</div>
            {t.docs.videoResolutions.map(([res, lanes]) => (
              <div key={res} className="flex gap-4 py-1.5 text-sm">
                <code className="text-cyan-700 min-w-[11rem]">{res}</code>
                <span className="text-slate-500">{lanes}</span>
              </div>
            ))}
          </div>
        </div>
        <p className="text-amber-700 text-sm mb-12">{t.docs.videoWarn}</p>

        <h2 className="text-xl font-semibold mb-4">{t.docs.errors}</h2>
        <div className="glass !transform-none overflow-hidden mb-14">
          {t.docs.errorsList.map(([code, msg]) => (
            <div key={code} className="flex gap-4 px-5 py-3.5 border-b border-slate-900/5 last:border-0 text-sm">
              <code className="text-red-700 font-mono">{code}</code>
              <span className="text-slate-500">{msg}</span>
            </div>
          ))}
        </div>

        <h2 className="text-xl font-semibold mb-2">{t.docs.interactive}</h2>
        <p className="text-slate-500 text-sm mb-4">{t.docs.tryHint}</p>
        <ScalarDocs lang={lang} />
      </div>
      <Footer lang={lang} />
    </main>
  );
}
