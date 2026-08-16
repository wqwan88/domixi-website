import type { Lang } from "@/lib/i18n";
import { brand } from "./brand";

export type LegalDocId = "terms" | "privacy" | "aup";

export type LegalSection = {
  title: string;
  paragraphs?: string[];
  bullets?: string[];
};

export type LegalDoc = {
  title: string;
  updated: string;
  intro: string;
  sections: LegalSection[];
};

const UPDATED_ZH = "2026 年 8 月 17 日";
const UPDATED_EN = "August 17, 2026";

const termsZh: LegalDoc = {
  title: "服务条款",
  updated: UPDATED_ZH,
  intro: `欢迎使用 ${brand.name}（域名 ${brand.domain}，下称「本服务」）。本服务条款（下称「本条款」）是您与 DOMIXI 之间就使用本网站、用户控制台及 API 网关所订立的协议。注册账号、充值、创建令牌或调用 API，即表示您已阅读并同意本条款。若您不同意，请立即停止使用。`,
  sections: [
    {
      title: "1. 服务内容",
      paragraphs: [
        "DOMIXI 是统一的大模型 API 网关：向您提供 OpenAI 兼容接口，将请求转发至 OpenAI、Anthropic、Google、DeepSeek 等上游模型供应商，并提供账号、令牌、用量统计与充值等配套功能。",
        `网站：https://${brand.domain}。控制台：${brand.consoleUrl}。程序调用地址：${brand.gatewayUrl}。`,
        "上游模型由第三方提供。我们不保证某一模型持续可用，也不对模型输出的正确性、完整性或适用性作出承诺。模型列表、价格与限额以控制台实时展示为准。",
      ],
    },
    {
      title: "2. 账号与令牌",
      paragraphs: [
        "您须年满 18 周岁，或以监护人同意的方式使用本服务。注册时应提供真实、有效的联系方式，并妥善保管账号、密码与 API 令牌。",
        "因令牌泄露、出借、共用或保管不善导致的调用、扣费与损失，由您自行承担。发现异常应立即在控制台禁用令牌并联系客服。",
        "您可在控制台为令牌设置过期时间、模型范围、IP 白名单与额度上限。默认速率限制为每个令牌 60 次/分钟；企业需求可联系客服评估上调。",
      ],
    },
    {
      title: "3. 费用、充值与发票",
      paragraphs: [
        "本服务按实际调用用量计费，无月租。价格随上游官方价格折算，并可能包含服务费率；具体单价以控制台「模型广场」为准。",
        "充值支持支付宝、微信支付及 Stripe 等渠道，最低充值金额以控制台展示为准（当前为人民币 10 元起）。额度到账后可用于调用，余额不过期。",
        "充值成功后，除因系统故障导致的重复扣款、或法律法规要求必须退还的情形外，已到账额度原则上不予退款、提现或转让。",
        "企业用户累计充值满人民币 500 元可申请增值税普通发票，请通过客服邮箱办理并提供开票信息。",
      ],
    },
    {
      title: "4. 使用规范",
      paragraphs: [
        "您使用本服务须同时遵守《可接受使用政策》（AUP）及上游模型供应商的使用政策。您对通过本服务提交的输入、以及基于输出所从事的行为独立承担责任。",
        "禁止利用本服务从事违法活动、侵害他人权益、攻击或滥用接口、绕过计费或限额、或生成并传播法律法规禁止的内容。我们有权对违规账号采取限制、暂停或终止措施，并配合有权机关调查。",
      ],
    },
    {
      title: "5. 数据与隐私",
      paragraphs: [
        "DOMIXI 作为网关转发请求，不将对话正文用于训练自有模型。请求日志默认仅保留计费所需的元数据（如时间、模型、token 用量、状态码）。详情见《隐私政策》。",
        "上游供应商可能按其自身政策处理请求内容。若您处理个人数据或敏感数据，应自行评估合规义务，并在必要时与我们另行约定。",
      ],
    },
    {
      title: "6. 服务可用性",
      paragraphs: [
        "我们将合理努力维持服务稳定，并在上游故障时尝试切换备用渠道，但不对无中断、无错误作出保证。维护、不可抗力、网络或上游故障可能导致延迟、失败或暂时不可用。",
        "因服务中断、错误输出、数据丢失或您依赖模型结果而产生的损失，除法律强制规定外，我们仅在已收取的对应服务费用范围内承担责任。",
      ],
    },
    {
      title: "7. 知识产权",
      paragraphs: [
        "本网站、控制台、品牌名称、标识及文档的知识产权归 DOMIXI 或合法权利人所有。未经许可，不得复制、反编译或用于暗示官方背书。",
        "您保留对自身输入内容的权利。模型输出的权利依上游供应商条款及适用法律确定；您不得声称 DOMIXI 对输出享有或担保任何权利。",
      ],
    },
    {
      title: "8. 中止与终止",
      paragraphs: [
        "您可随时停止使用并删除令牌。我们可在您严重或反复违反本条款、AUP、欠费，或应监管要求时，限制、暂停或终止服务。",
        "终止后，未消耗余额的处理以本条款第 3 条为准；我们可按隐私政策在合理期限后删除或匿名化账号数据。",
      ],
    },
    {
      title: "9. 条款变更",
      paragraphs: [
        "我们可能更新本条款，并在网站公示更新日期。重大变更将尽量通过网站或电子邮件提示。公示后继续使用，视为接受更新后的条款。",
      ],
    },
    {
      title: "10. 联系我们",
      paragraphs: [`如对本条款有疑问，请发送邮件至 ${brand.docsEmail}。`],
    },
  ],
};

const privacyZh: LegalDoc = {
  title: "隐私政策",
  updated: UPDATED_ZH,
  intro: `本政策说明 DOMIXI（${brand.domain}）如何收集、使用和保护与您相关的信息。使用本服务即表示您了解本政策所述的处理方式。`,
  sections: [
    {
      title: "1. 我们收集的信息",
      bullets: [
        "账号信息：邮箱、登录方式（如 GitHub / LinuxDO）、昵称等您主动提供的资料。",
        "交易信息：充值金额、支付渠道回传的订单号与支付状态（我们不存储完整银行卡号）。",
        "用量信息：API 调用时间、模型名称、token 数量、延迟、状态码、令牌标识与来源 IP。",
        "技术信息：浏览器类型、访问日志、Cookie 或本地存储中的登录会话。",
      ],
    },
    {
      title: "2. 请求内容",
      paragraphs: [
        "DOMIXI 的定位是请求转发网关：默认不保存您的提示词、对话正文、上传文件或模型完整输出，也不将上述内容用于训练自有模型。",
        "为排查故障，我们可能在短时间内查看与特定错误相关的技术日志；该等日志尽可能避免包含完整正文，并在排查结束后按内部期限清理。",
        "请求会被发送至您所调用的上游模型供应商，由其按其隐私政策处理。选择模型即表示您理解内容将离开 DOMIXI 到达该供应商。",
      ],
    },
    {
      title: "3. 我们如何使用信息",
      bullets: [
        "提供账号、鉴权、计费、发票与客户支持。",
        "防止欺诈、滥用、欠费及安全攻击。",
        "改进稳定性、路由与产品体验（基于聚合后的用量统计，而非您的对话内容）。",
        "在法律要求或保护自身与用户合法权益时，向有权机关提供必要信息。",
      ],
    },
    {
      title: "4. 共享与第三方",
      paragraphs: [
        "支付：支付宝、微信（经支付聚合）及 Stripe 等处理付款，受其各自隐私条款约束。",
        "上游模型供应商：仅在您发起调用时，为完成该次请求而传输必要内容。",
        "基础设施：云主机、域名与内容分发等服务商可能处理访问日志。我们要求其仅按指令处理，并采取合理保密措施。",
        "我们不会出售您的个人信息。",
      ],
    },
    {
      title: "5. Cookie 与会话",
      paragraphs: [
        "控制台与网站可能使用 Cookie 或同类技术维持登录状态、记录语言偏好。您可通过浏览器拒绝 Cookie，但这可能影响登录与部分功能。",
      ],
    },
    {
      title: "6. 保留期限",
      paragraphs: [
        "账号与交易记录在您使用服务期间及之后，按记账、税务与争议处理需要保留。",
        "用量元数据通常保留至足以完成计费、对账与安全审计；超期后删除或匿名化。",
        "您注销账号后，我们将在合理期限内删除或匿名化与账号直接关联的个人信息，法律要求继续保留的除外。",
      ],
    },
    {
      title: "7. 您的权利",
      paragraphs: [
        "您可在控制台查阅用量与令牌，或通过客服邮箱申请更正、导出或删除账号相关信息。我们将在核实身份后处理，法律法规另有规定的除外。",
      ],
    },
    {
      title: "8. 联系我们",
      paragraphs: [`隐私相关请求请发送至 ${brand.docsEmail}，并在邮件中说明「隐私政策」。`],
    },
  ],
};

const aupZh: LegalDoc = {
  title: "可接受使用政策",
  updated: UPDATED_ZH,
  intro: "本政策是《服务条款》的一部分，用于说明使用 DOMIXI 时禁止的行为。违反本政策可能导致限流、封禁令牌或终止账号，并可能向有权机关报告。",
  sections: [
    {
      title: "1. 合法使用",
      paragraphs: [
        "您必须遵守所适用的法律法规，以及上游模型供应商公布的使用政策。不得利用本服务从事或协助任何违法活动。",
      ],
    },
    {
      title: "2. 禁止的内容与用途",
      bullets: [
        "生成、传播或协助淫秽、色情（含儿童性剥削材料）、暴力恐怖、赌博、毒品或违禁品相关内容。",
        "诈骗、钓鱼、社会工程、冒充他人或机构、传播恶意软件或未经授权的广告。",
        "侵犯他人知识产权、隐私、肖像或商业秘密。",
        "歧视、骚扰、或针对个人的恶意中伤。",
        "用于武器、网络攻击、未授权渗透测试，或明显可能造成人身伤害的活动。",
      ],
    },
    {
      title: "3. 禁止滥用接口",
      bullets: [
        "绕过计费、伪造用量、共享或转售令牌（除非我们书面同意的转售/代理安排）。",
        "对服务实施 DDoS、扫描、破解或干扰其他用户。",
        "使用自动化手段批量注册、刷取体验额度或规避速率限制。",
        "将本服务用于垃圾信息、未经同意的大规模外呼或骚扰。",
      ],
    },
    {
      title: "4. 未成年人",
      paragraphs: [
        "不得使用本服务制作、索取或传播涉及未成年人的性内容。我们发现此类行为将立即终止服务并配合执法。",
      ],
    },
    {
      title: "5. 处理措施",
      paragraphs: [
        "我们可依据日志、上游投诉或监管通知进行调查，并采取警告、限制模型、暂停令牌、冻结余额或关闭账号等措施。因违规导致的损失与法律责任由您自行承担。",
        `如需举报滥用，请发送邮件至 ${brand.docsEmail}，标题注明「AUP」。`,
      ],
    },
  ],
};

const termsEn: LegalDoc = {
  title: "Terms of Service",
  updated: UPDATED_EN,
  intro: `Welcome to ${brand.name} (${brand.domain}). These Terms of Service (“Terms”) govern your use of the website, console, and API gateway. By registering, topping up, creating a token, or calling the API, you agree to these Terms. If you do not agree, do not use the service.`,
  sections: [
    {
      title: "1. The service",
      paragraphs: [
        "DOMIXI is a unified LLM API gateway. We provide an OpenAI-compatible interface that forwards your requests to upstream providers (including OpenAI, Anthropic, Google, and DeepSeek) and offer accounts, tokens, usage dashboards, and billing.",
        `Website: https://${brand.domain}. Console: ${brand.consoleUrl}. API base URL: ${brand.gatewayUrl}.`,
        "Upstream models are provided by third parties. We do not warrant that any model will remain available, or that outputs will be accurate or fit for a particular purpose. Live models, prices, and limits are those shown in the console.",
      ],
    },
    {
      title: "2. Accounts and API keys",
      paragraphs: [
        "You must be at least 18 years old, or use the service with a guardian’s consent. Keep your password and API tokens secret.",
        "You are responsible for all usage and charges incurred with your tokens, including leaked or shared keys. Disable compromised tokens immediately and contact support.",
        "You may set expiry, model scope, IP allowlists, and quotas on each token. The default rate limit is 60 requests per minute per token; enterprises may request a higher limit.",
      ],
    },
    {
      title: "3. Fees, credits, and invoices",
      paragraphs: [
        "Billing is pay-as-you-go with no monthly fee. Prices track upstream list rates and may include a service fee. The console “Model Plaza” is authoritative.",
        "Top-ups via Alipay, WeChat Pay, Stripe, and other listed methods are credited to your balance (currently from ¥10). Credits do not expire.",
        "Successful top-ups are non-refundable and non-transferable, except for duplicate charges caused by a system error or where a refund is required by law.",
        "Business customers with cumulative top-ups of ¥500 or more may request a VAT invoice via the support email.",
      ],
    },
    {
      title: "4. Acceptable use",
      paragraphs: [
        "You must comply with the Acceptable Use Policy and the policies of upstream model providers. You are solely responsible for inputs you submit and for how you use outputs.",
        "You must not use the service for illegal activity, abuse, billing evasion, or prohibited content. We may throttle, suspend, or terminate accounts and cooperate with authorities.",
      ],
    },
    {
      title: "5. Data and privacy",
      paragraphs: [
        "DOMIXI forwards requests and does not use conversation content to train our own models. Logs retain billing metadata (time, model, token usage, status). See the Privacy Policy.",
        "Upstream providers process request content under their own policies. If you handle personal or sensitive data, you must assess your own compliance obligations.",
      ],
    },
    {
      title: "6. Availability and liability",
      paragraphs: [
        "We will use reasonable efforts to keep the service available and to fail over when an upstream channel fails, but we do not guarantee uninterrupted or error-free service.",
        "To the maximum extent permitted by law, our aggregate liability arising from the service is limited to the fees you paid for the affected usage.",
      ],
    },
    {
      title: "7. Intellectual property",
      paragraphs: [
        "The site, console, brand, and documentation are owned by DOMIXI or its licensors. You retain rights in your inputs. Rights in model outputs follow upstream terms and applicable law.",
      ],
    },
    {
      title: "8. Suspension and termination",
      paragraphs: [
        "You may stop using the service at any time. We may suspend or terminate for material breach, AUP violations, non-payment, or legal requirements. Unused credits are handled under Section 3.",
      ],
    },
    {
      title: "9. Changes",
      paragraphs: [
        "We may update these Terms and will post the new date on this page. Continued use after the update constitutes acceptance.",
      ],
    },
    {
      title: "10. Contact",
      paragraphs: [`Questions: ${brand.docsEmail}.`],
    },
  ],
};

const privacyEn: LegalDoc = {
  title: "Privacy Policy",
  updated: UPDATED_EN,
  intro: `This policy describes how DOMIXI (${brand.domain}) collects, uses, and protects information related to you.`,
  sections: [
    {
      title: "1. Information we collect",
      bullets: [
        "Account data: email, login provider (e.g. GitHub / LinuxDO), and profile details you provide.",
        "Payment data: top-up amounts and processor order IDs (we do not store full card numbers).",
        "Usage data: call time, model, token counts, latency, status codes, token ID, and source IP.",
        "Technical data: browser type, access logs, and session cookies.",
      ],
    },
    {
      title: "2. Request content",
      paragraphs: [
        "DOMIXI is a forwarding gateway. We do not store your prompts, conversation bodies, uploads, or full model outputs by default, and we do not train our own models on that content.",
        "To debug failures we may briefly inspect technical logs tied to an error; we avoid retaining full payloads and delete them after troubleshooting.",
        "Content is sent to the upstream provider you invoke, under that provider’s privacy policy.",
      ],
    },
    {
      title: "3. How we use information",
      bullets: [
        "To operate accounts, auth, billing, invoices, and support.",
        "To prevent fraud, abuse, and attacks.",
        "To improve reliability using aggregated usage metrics, not conversation text.",
        "To comply with law and protect our users and the service.",
      ],
    },
    {
      title: "4. Sharing",
      paragraphs: [
        "Payment processors (Alipay, WeChat Pay, Stripe, etc.), upstream model providers (only to fulfill your request), and infrastructure vendors may process data as needed. We do not sell personal information.",
      ],
    },
    {
      title: "5. Cookies",
      paragraphs: [
        "We use cookies or similar storage to keep you signed in and remember language. Blocking cookies may break login.",
      ],
    },
    {
      title: "6. Retention",
      paragraphs: [
        "Account and transaction records are kept as needed for accounting, tax, and disputes. Usage metadata is kept for billing and security, then deleted or anonymized. After account deletion we delete or anonymize personal data except where law requires retention.",
      ],
    },
    {
      title: "7. Your rights",
      paragraphs: [
        `You may review usage in the console or email ${brand.docsEmail} to correct, export, or delete account data, subject to identity verification and legal exceptions.`,
      ],
    },
    {
      title: "8. Contact",
      paragraphs: [`Privacy requests: ${brand.docsEmail} (subject “Privacy”).`],
    },
  ],
};

const aupEn: LegalDoc = {
  title: "Acceptable Use Policy",
  updated: UPDATED_EN,
  intro: "This policy is part of the Terms of Service. Violations may result in throttling, key revocation, account termination, and reports to authorities.",
  sections: [
    {
      title: "1. Lawful use",
      paragraphs: [
        "You must comply with applicable law and upstream provider policies. Do not use the service to commit or facilitate illegal activity.",
      ],
    },
    {
      title: "2. Prohibited content and purposes",
      bullets: [
        "Child sexual exploitation material, or any sexual content involving minors.",
        "Illegal pornography, extreme violence, terrorism, drugs, or other prohibited goods.",
        "Fraud, phishing, malware, impersonation, or spam.",
        "Infringement of IP, privacy, or trade secrets.",
        "Weapons, unauthorized hacking, or activities likely to cause physical harm.",
      ],
    },
    {
      title: "3. Infrastructure abuse",
      bullets: [
        "Evading billing or rate limits; reselling tokens without written approval.",
        "DDoS, scanning, or interfering with other users.",
        "Bulk sign-ups or farming promotional credit.",
      ],
    },
    {
      title: "4. Enforcement",
      paragraphs: [
        `We may investigate using logs, upstream complaints, or legal notices, and may warn, restrict models, freeze credits, or close accounts. Report abuse to ${brand.docsEmail} with subject “AUP”.`,
      ],
    },
  ],
};

const docsZh: Record<LegalDocId, LegalDoc> = {
  terms: termsZh,
  privacy: privacyZh,
  aup: aupZh,
};

const docsEn: Record<LegalDocId, LegalDoc> = {
  terms: termsEn,
  privacy: privacyEn,
  aup: aupEn,
};

export const legalPaths: Record<LegalDocId, string> = {
  terms: "/terms",
  privacy: "/privacy",
  aup: "/aup",
};

export function getLegalDoc(lang: Lang, id: LegalDocId): LegalDoc {
  if (lang === "zh-TW") {
    const titles: Record<LegalDocId, string> = {
      terms: "服務條款",
      privacy: "隱私政策",
      aup: "可接受使用政策",
    };
    return { ...docsZh[id], title: titles[id] };
  }
  if (lang === "zh") return docsZh[id];
  return docsEn[id];
}
