import { type Lang, getDict, langPath } from "@/lib/i18n";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { brand } from "@/lib/brand";

export default function DocsContent({ lang }: { lang: Lang }) {
  const t = getDict(lang);
  const consoleLabel = lang === "zh" ? "控制台 → 令牌" : lang === "zh-TW" ? "控制台 → 令牌" : "Console → Tokens";

  const endpoints = [
    { method: "POST", path: "/v1/chat/completions", desc: lang === "zh" ? "对话补全" : lang === "zh-TW" ? "對話補全" : "Chat completions" },
    { method: "POST", path: "/v1/messages", desc: lang === "zh" ? "Claude 原生格式" : lang === "zh-TW" ? "Claude 原生格式" : "Claude native format" },
    { method: "POST", path: "/v1/responses", desc: "OpenAI Responses API" },
    { method: "POST", path: "/v1/embeddings", desc: lang === "zh" ? "文本向量化" : lang === "zh-TW" ? "文本向量化" : "Text embeddings" },
    { method: "POST", path: "/v1/images/generations", desc: lang === "zh" ? "图像生成" : lang === "zh-TW" ? "圖像生成" : "Image generation" },
    { method: "POST", path: "/v1/rerank", desc: "Rerank API" },
    { method: "GET", path: "/v1/models", desc: lang === "zh" ? "列出当前可用模型" : lang === "zh-TW" ? "列出當前可用模型" : "List available models" },
  ];

  return (
    <main>
      <Navbar lang={lang} />
      <div className="max-w-4xl mx-auto px-6 pt-32 pb-24">
        <h1 className="text-4xl font-bold">{t.docs.title}</h1>
        <p className="text-white/50 mt-4 mb-12">{t.docs.subtitle}</p>

        <h2 className="text-xl font-semibold mb-4">{t.docs.auth}</h2>
        <div className="glass p-5 mb-10 !transform-none">
          <code className="text-sm text-cyan-300">Authorization: Bearer ***</code>
          <p className="text-white/50 text-sm mt-3">
            {lang === "zh" || lang === "zh-TW" ? (
              <>
                令牌在{" "}
                <a href={brand.consoleUrl + "/token"} className="text-blue-300 underline underline-offset-4">
                  {consoleLabel}
                </a>{" "}
                页面创建，可设置过期时间、可用模型范围、IP 白名单与额度上限。
              </>
            ) : (
              <>
                {t.docs.authDesc}{" "}
                <a href={brand.consoleUrl + "/token"} className="text-blue-300 underline underline-offset-4">
                  {consoleLabel}
                </a>
              </>
            )}
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
        <div className="glass !transform-none overflow-hidden">
          {t.docs.errorsList.map(([code, msg]) => (
            <div key={code} className="flex gap-4 px-5 py-3.5 border-b border-white/5 last:border-0 text-sm">
              <code className="text-red-300 font-mono">{code}</code>
              <span className="text-white/50">{msg}</span>
            </div>
          ))}
        </div>

        <p className="text-white/30 text-sm mt-12">{t.docs.disclaimer}</p>
      </div>
      <Footer lang={lang} />
    </main>
  );
}
