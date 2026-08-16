/**
 * DOMIXI console 导航修补 Worker
 *
 * 部署在 console.ai-domixi.com/* 路由上。New API 前端把顶部导航的顺序和
 * 文字写死在代码里（无配置项），本 Worker 在 HTML 响应里注入一段脚本，
 * 在浏览器端完成两件事：
 *   1. 把「文档」改名为「API文档」（英文界面 Docs → API Docs）；
 *   2. 导航顺序调整为：主页 → 模型广场 → API文档 → 排行榜 → 控制台。
 *
 * 用 MutationObserver 对抗 React 重渲染；已处于目标状态时不做任何 DOM
 * 修改，避免观察器死循环。New API 大版本升级若改了导航 DOM 结构，
 * 此脚本可能需要微调（失效时表现为回到默认顺序，不影响功能）。
 *
 * 另外把 New API 内置的 /logo.png、/favicon.ico 换成官网同一套 DOMIXI logo。
 */

const BRAND_ORIGIN = "https://ai-domixi.com";
const LOGO_PROXY = {
  "/logo.png": "/logo.png",
  "/logo.svg": "/logo.svg",
  "/favicon.ico": "/favicon.ico",
};

const NAV_FIX_SCRIPT = `<script>(function () {
  var RENAMES = { "文档": "API文档", "Docs": "API Docs" };
  // 目标顺序：主页 / 模型广场 / API文档 / 排行榜 / 控制台
  var ORDER = ["/", "/pricing", "@docs", "/rankings", "/dashboard"];

  function isDocs(a) {
    return a.hostname === "ai-domixi.com" && a.pathname.replace(/\\/+$/, "") === "/docs";
  }

  function classify(a) {
    if (isDocs(a)) return "@docs";
    var href = a.getAttribute("href");
    if (href === "/" && !a.querySelector("img,svg")) return "/"; // 排除 logo
    if (href === "/pricing" || href === "/rankings" || href === "/dashboard") return href;
    return null;
  }

  function renameDocs(a) {
    var walker = document.createTreeWalker(a, NodeFilter.SHOW_TEXT);
    var node, changed = false;
    while ((node = walker.nextNode())) {
      var text = node.nodeValue.trim();
      if (RENAMES[text]) {
        node.nodeValue = node.nodeValue.replace(text, RENAMES[text]);
        changed = true;
      }
    }
    return changed;
  }

  // 页面可能有多份导航（桌面 header + 移动端抽屉），按文档顺序分组：
  // 同一 key 再次出现时视为进入下一组导航。
  function collectGroups() {
    var groups = [];
    var current = {};
    var anchors = document.querySelectorAll("a[href]");
    for (var i = 0; i < anchors.length; i++) {
      var key = classify(anchors[i]);
      if (!key) continue;
      if (current[key]) { groups.push(current); current = {}; }
      current[key] = anchors[i];
    }
    if (Object.keys(current).length) groups.push(current);
    return groups;
  }

  function commonParent(nodes) {
    var p = nodes[0].parentElement;
    while (p) {
      var ok = nodes.every(function (n) { return p.contains(n); });
      if (ok) return p;
      p = p.parentElement;
    }
    return null;
  }

  function itemOf(anchor, container) {
    var n = anchor;
    while (n.parentElement && n.parentElement !== container) n = n.parentElement;
    return n;
  }

  var scheduled = false;

  function applyGroup(found) {
    if (found["@docs"]) renameDocs(found["@docs"]);

    var present = ORDER.filter(function (k) { return found[k]; });
    if (present.length < 2) return;

    var container = commonParent(present.map(function (k) { return found[k]; }));
    if (!container) return;

    var items = present.map(function (k) { return itemOf(found[k], container); });
    // 已按目标顺序排列则不动，避免触发观察器循环
    var inOrder = items.every(function (item, i) {
      return i === 0 || !!(items[i - 1].compareDocumentPosition(item) & Node.DOCUMENT_POSITION_FOLLOWING);
    });
    if (inOrder) return;

    var anchorPoint = items[0];
    for (var i = 1; i < items.length; i++) {
      anchorPoint.after(items[i]);
      anchorPoint = items[i];
    }
  }

  function apply() {
    scheduled = false;
    collectGroups().forEach(applyGroup);
  }

  function schedule() {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(apply);
  }

  new MutationObserver(schedule).observe(document.documentElement, {
    childList: true,
    subtree: true,
    characterData: true
  });
  schedule();
})();</script>`;

export default {
  async fetch(request) {
    const url = new URL(request.url);
    const logoPath = LOGO_PROXY[url.pathname];
    if (logoPath) {
      const upstream = await fetch(`${BRAND_ORIGIN}${logoPath}`, {
        cf: { cacheTtl: 3600, cacheEverything: true },
      });
      const headers = new Headers(upstream.headers);
      headers.set("cache-control", "public, max-age=86400");
      headers.delete("set-cookie");
      return new Response(upstream.body, { status: upstream.status, headers });
    }

    const response = await fetch(request);
    const contentType = response.headers.get("content-type") || "";
    if (!contentType.includes("text/html")) return response;
    return new HTMLRewriter()
      .on("body", {
        element(el) {
          el.append(NAV_FIX_SCRIPT, { html: true });
        },
      })
      .transform(response);
  },
};
