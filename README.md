# DOMIXI 官网

DOMIXI 中转站的品牌门面站（Next.js + Tailwind）。
用户在这里了解品牌与定价 → 点击跳转 New API 控制台完成 **注册 / 登录 / 充值 / 令牌申请 / 用量查看**。

## 架构

```
┌────────────────────────────────────────────────────┐
│  ai-domixi.com (本站, Next.js :3001)              │
│  品牌首页 / 定价 / 特性 / 快速接入 / FAQ / API 文档   │
└──────────────┬─────────────────────────────────────┘
               │ "免费注册" / "登录" 按钮跳转
               ▼
┌────────────────────────────────────────────────────┐
│  console.ai-domixi.com (New API :3000)            │
│  注册 · 登录 · 充值(EPay/Stripe) · 令牌 · 用量仪表盘  │
└────────────────────────────────────────────────────┘
               ▲
               │ 程序调用 base_url
┌──────────────┴─────────────────────────────────────┐
│  token-service.ai-domixi.com/v1 (New API :3000)   │
│  实际 API 转发网关（已在 /api/status 登记）           │
└────────────────────────────────────────────────────┘
```

New API 已实现全部用户系统（注册/登录/充值/令牌/用量），
本仓库只做**品牌门面**，不重复造轮子。

## 本地开发

```bash
npm install
cp .env.example .env.local    # 按需修改控制台地址
npm run dev                   # http://localhost:3001
```

## Docker 部署

```bash
docker compose up -d --build   # 官网跑在 :3001
```

配合 `Caddyfile.example` 做域名反代 + 自动 HTTPS。

## 品牌内容修改

所有文案 / 价格 / FAQ / 代码示例都集中在 `src/lib/brand.ts`，
改这一处全站生效。Logo 是 `public/logo.svg`（SVG 矢量，可直接在 Figma 里改）。

## 上线 Checklist

- [ ] `NEXT_PUBLIC_CONSOLE_URL` 指向生产 New API 地址（https，如 console.ai-domixi.com）
- [ ] 替换占位价格（`brand.models`）为实际倍率折算价（当前汇率系数 7.3，见 /api/status price）
- [ ] 填写备案号 `brand.icp`（国内服务器必需）
- [x] 服务条款 / 隐私政策 / AUP 三个页面补内容
- [x] New API 后台 logo 已换成 DOMIXI 图标
- [x] New API 后台 → 设置 → 首页内容：嵌入官网地址或自定义 HTML
