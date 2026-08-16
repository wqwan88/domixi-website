import type { Metadata } from "next";
import "./globals.css";
import { brand } from "@/lib/brand";

/**
 * 被 New API 控制台以沙箱 iframe 内嵌为「主页」时：
 * 隐藏本站导航（顶部由控制台导航接管），并把所有链接点击提升为
 * 顶层窗口跳转，让用户借助点击手势无缝跳出到真正的官网/控制台。
 * 用内联原生脚本实现：沙箱缺少 allow-same-origin 时 Next 客户端
 * 运行时无法水合，React 组件里的逻辑不会执行，而内联脚本不受影响。
 */
const frameBridgeScript = `(function(){
  try {
    if (window.self === window.top) return;
    document.documentElement.classList.add('framed');
    document.addEventListener('click', function(e){
      var t = e.target;
      var a = t && t.closest ? t.closest('a[href]') : null;
      if (!a) return;
      var href = a.href;
      if (!href || href.indexOf('javascript:') === 0) return;
      e.preventDefault();
      e.stopPropagation();
      try { window.top.location.href = href; }
      catch (err) { window.open(href, '_blank'); }
    }, true);
  } catch (e) {}
})();`;

export const metadata: Metadata = {
  title: `${brand.name} · ${brand.tagline}`,
  description: brand.description,
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/domixi.svg", type: "image/svg+xml" },
    ],
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    title: `${brand.name} · ${brand.tagline}`,
    description: brand.description,
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <head>
        <script dangerouslySetInnerHTML={{ __html: frameBridgeScript }} />
      </head>
      <body>
        <div className="aurora" />
        {children}
      </body>
    </html>
  );
}
