import { type Lang, getDict } from "./i18n";
import { brand } from "./brand";

/**
 * Python / cURL quick-start snippets.
 *
 * The code skeleton is identical everywhere; only the inline comments and the
 * sample user message are translated, so the examples stay single-sourced and
 * follow the site language.
 */
export function pythonExample(lang: Lang): string {
  const c = getDict(lang).code;
  return `from openai import OpenAI

client = OpenAI(
    api_key="sk-xxx…xxxx",   ${c.pyApiKeyComment}
    base_url="${brand.gatewayUrl}"
)

resp = client.chat.completions.create(
    model="claude-sonnet-4-5",       ${c.pyModelComment}
    messages=[{"role": "user", "content": "${c.userMessage}"}]
)
print(resp.choices[0].message.content)`;
}

export function curlExample(lang: Lang): string {
  const c = getDict(lang).code;
  return `curl ${brand.gatewayUrl}/chat/completions \\
  -H "Authorization: Bearer ***" \\
  -H "Content-Type: application/json" \\
  -d '{"model": "deepseek-v4", "messages": [{"role": "user", "content": "${c.userMessage}"}]}'`;
}
