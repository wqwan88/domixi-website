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

  // 定价策略：Credit 制，1 Credit = 1 元
  // 模型与定价同步 hon-maas（燧弘华创）上游供应商官方价格
  // vendor/tag 为字典 key（见 translations/*.ts 的 models.vendors / models.tags）
  // priceIn 里的 {unit} / {per} 占位符由组件按语言替换
  models: [
    { vendor: "zhipu",    name: "glm-5.2",           priceIn: "8 {unit} / 1M tokens",  priceOut: "28 {unit} / 1M tokens",  priceCache: "2 {unit} / 1M tokens",    tag: "flagship" },
    { vendor: "zhipu",    name: "glm-5.3",           priceIn: "8 {unit} / 1M tokens",  priceOut: "28 {unit} / 1M tokens",  priceCache: "2 {unit} / 1M tokens",    tag: "flagshipNext" },
    { vendor: "moonshot", name: "kimi-k3",          priceIn: "20 {unit} / 1M tokens", priceOut: "100 {unit} / 1M tokens", priceCache: "2 {unit} / 1M tokens",    tag: "longContext" },
    { vendor: "deepseek", name: "deepseek-v4.1-flash", priceIn: "1 {unit} / 1M tokens", priceOut: "4 {unit} / 1M tokens",   priceCache: "0.02 {unit} / 1M tokens", tag: "fast" },
    { vendor: "minimax",  name: "minimax-h3",       priceIn: "0.5 {unit} / {per}",    priceOut: "—",                     priceCache: "—",                        tag: "video" },
  ],
};
