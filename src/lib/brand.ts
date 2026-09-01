export const brand = {
  name: "DOMIXI",
  zh: "DOMIXI AI 网关",
  tagline: "一个密钥，调用全球大模型",
  description:
    "DOMIXI 是统一的大模型 API 网关：聚合 OpenAI、Claude、Gemini、DeepSeek 等 50+ 模型，OpenAI 兼容接口，按量计费，用量全透明。",
  domain: "ai-domixi.com",
  // 用户控制台（New API）：注册 / 登录 / 充值 / 令牌 / 用量
  consoleUrl: process.env.NEXT_PUBLIC_CONSOLE_URL ?? "http://localhost:3000",
  // 程序调用的 base_url（New API /api/status 里登记的地址）
  gatewayUrl: "https://token-service.ai-domixi.com/v1",
  docsEmail: "support@domixi.com",
  icp: "", // 备案号占位，如 "京ICP备XXXXXXXX号"

  // 定价策略：官方 API 价格 × 7.3 汇率 × 0.8（8 折），取整
  // 数据来源：OpenAI / Anthropic / DeepSeek / Kimi 官方定价页（2026-08）
  models: [
    { vendor: "OpenAI",    name: "GPT-5",                   priceIn: "¥7 / 1M tokens",   priceOut: "¥58 / 1M tokens",  tag: "热门" },
    { vendor: "OpenAI",    name: "GPT-4o",                  priceIn: "¥15 / 1M tokens",  priceOut: "¥58 / 1M tokens",  tag: "通用" },
    { vendor: "Anthropic", name: "Claude Sonnet 5",        priceIn: "¥12 / 1M tokens",  priceOut: "¥58 / 1M tokens",  tag: "最新" },
    { vendor: "Anthropic", name: "Claude Sonnet 4.5",      priceIn: "¥18 / 1M tokens",  priceOut: "¥88 / 1M tokens",  tag: "编码强" },
    { vendor: "Google",    name: "Gemini 2.5 Pro",         priceIn: "¥7 / 1M tokens",   priceOut: "¥58 / 1M tokens",  tag: "长上下文" },
    { vendor: "DeepSeek",  name: "DeepSeek V4 Pro",        priceIn: "¥3 / 1M tokens",   priceOut: "¥23 / 1M tokens",  tag: "极致性价比" },
    { vendor: "DeepSeek",  name: "DeepSeek V4 Flash · 海外", priceIn: "¥1.5 / 1M tokens", priceOut: "¥12 / 1M tokens", tag: "合规出境" },
    { vendor: "阿里",       name: "Qwen3 Max",              priceIn: "¥1 / 1M tokens",   priceOut: "¥4 / 1M tokens",   tag: "国产" },
    { vendor: "Moonshot",  name: "Kimi K3",                priceIn: "¥18 / 1M tokens",  priceOut: "¥88 / 1M tokens",  tag: "长文本" },
  ],

  features: [
    { icon: "⚡", title: "一个密钥，全网模型", desc: "聚合 OpenAI / Claude / Gemini / DeepSeek 等 50+ 模型，格式自动互转，无需为每家单独集成。" },
    { icon: "📊", title: "用量透明，分毫可查", desc: "每一次调用的 token、耗时、费用全部落盘可查，控制台实时图表，月底对账不扯皮。" },
    { icon: "🛡️", title: "多通道容灾", desc: "渠道加权轮询 + 失败自动重试，单渠道故障无感切换，SLA 不再靠运气。" },
    { icon: "💳", title: "按量计费，随充随用", desc: "无月租、无最低消费，充多少用多少。支持支付宝 / 微信 / Stripe。" },
    { icon: "🔌", title: "OpenAI 兼容", desc: "直接替换 base_url 即可迁移现有代码，兼容 OpenAI SDK、LangChain、LlamaIndex。" },
    { icon: "🚀", title: "分钟级接入", desc: "注册 → 充值 → 拿 Key → 改一行 base_url，四步完成接入。" },
  ],

  steps: [
    { n: "01", title: "注册账号", desc: "邮箱即可注册，也支持 GitHub / LinuxDO 快捷登录。" },
    { n: "02", title: "充值额度", desc: "支持支付宝、微信、Stripe，最低 ¥10 起充，实时到账。" },
    { n: "03", title: "创建令牌", desc: "在控制台一键生成 API Key，可按模型、IP、额度做细粒度限制。" },
    { n: "04", title: "开始调用", desc: "把 base_url 换成我们的网关地址，原代码零改动直接跑。" },
  ],

  faq: [
    { q: "和官方 API 有什么区别？", a: "我们是聚合网关：你在 DOMIXI 拿一个 Key，就能调所有支持的模型。所有模型定价均为官方 API 价格的 8 折（按实时汇率折算人民币），按量计费，用量全透明。" },
    { q: "DeepSeek V4 Flash 海外版是什么？", a: "从汕头物理隔离园区合规出境的 DeepSeek 推理节点，通过香港出海服务海外用户，可享受出海合规保障，适合有跨境业务的企业客户。" },
    { q: "数据安全吗？", a: "DOMIXI 只做请求转发，不存储任何对话内容。所有请求日志仅保留 token 用量元数据，用于计费。" },
    { q: "支持哪些支付方式？", a: "支付宝、微信支付（通过易支付），以及 Stripe（Visa / MasterCard）。企业客户可对公转账。" },
    { q: "余额会过期吗？", a: "不会。充值金额永久有效，用完为止。" },
    { q: "有速率限制吗？", a: "默认每个令牌 60 RPM。企业客户可联系客服提升限额。" },
    { q: "如何开发票？", a: "企业用户累计充值满 ¥500 可申请增值税普通发票，联系 support 邮箱办理。" },
  ],

  codeExample: `from openai import OpenAI

client = OpenAI(
    api_key="sk-xxxxxxxxxxxxxxxx",   # 控制台生成的令牌
    base_url="https://token-service.ai-domixi.com/v1"
)

resp = client.chat.completions.create(
    model="claude-sonnet-4-5",       # 想换模型？改这一行就够
    messages=[{"role": "user", "content": "你好"}]
)
print(resp.choices[0].message.content)`,

  curlExample: `curl https://token-service.ai-domixi.com/v1/chat/completions \\
  -H "Authorization: Bearer sk-你的密钥" \\
  -H "Content-Type: application/json" \\
  -d '{"model": "deepseek-v4", "messages": [{"role": "user", "content": "你好"}]}'`,
};
