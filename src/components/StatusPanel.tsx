"use client";

import { useEffect, useState } from "react";

type Health = {
  ok: boolean;
  latency_ms?: number;
  version?: string;
  system_name?: string;
  server_address?: string;
  start_time?: number;
  model_count?: number;
  checked_at?: string;
};

function uptimeLabel(start: number, lang: string) {
  if (!start) return "—";
  const sec = Math.max(0, Math.floor(Date.now() / 1000 - start));
  const d = Math.floor(sec / 86400);
  const h = Math.floor((sec % 86400) / 3600);
  const m = Math.floor((sec % 3600) / 60);
  if (lang.startsWith("zh")) {
    if (d > 0) return `${d} 天 ${h} 小时`;
    if (h > 0) return `${h} 小时 ${m} 分钟`;
    return `${m} 分钟`;
  }
  if (d > 0) return `${d}d ${h}h`;
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
}

export default function StatusPanel({
  labels,
  lang,
}: {
  lang: string;
  labels: {
    checking: string;
    operational: string;
    down: string;
    gateway: string;
    latency: string;
    version: string;
    models: string;
    uptime: string;
    endpoint: string;
    lastChecked: string;
  };
}) {
  const [health, setHealth] = useState<Health | null>(null);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const res = await fetch("/api/gateway-health", { cache: "no-store" });
        const data = (await res.json()) as Health;
        if (!cancelled) setHealth({ ...data, ok: res.ok && data.ok });
      } catch {
        if (!cancelled) setHealth({ ok: false, checked_at: new Date().toISOString() });
      }
    };
    load();
    const id = setInterval(load, 30000);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, []);

  if (!health) {
    return <p className="text-white/40">{labels.checking}</p>;
  }

  const ok = health.ok;
  const cards = [
    { k: labels.gateway, v: ok ? labels.operational : labels.down },
    { k: labels.latency, v: health.latency_ms != null ? `${health.latency_ms} ms` : "—" },
    { k: labels.version, v: health.version || "—" },
    { k: labels.models, v: health.model_count != null ? String(health.model_count) : "—" },
    { k: labels.uptime, v: uptimeLabel(health.start_time ?? 0, lang) },
  ];

  return (
    <div>
      <div
        className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm mb-8 ${
          ok ? "bg-emerald-500/15 text-emerald-300" : "bg-red-500/15 text-red-300"
        }`}
      >
        <span className={`w-2 h-2 rounded-full ${ok ? "bg-emerald-400" : "bg-red-400"}`} />
        {ok ? labels.operational : labels.down}
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.map((c) => (
          <div key={c.k} className="glass !transform-none p-5">
            <div className="text-xs text-white/40 mb-1">{c.k}</div>
            <div className="text-lg font-semibold">{c.v}</div>
          </div>
        ))}
      </div>
      {health.server_address && (
        <p className="text-sm text-white/40 mt-8">
          {labels.endpoint}{" "}
          <code className="text-cyan-300">{health.server_address}</code>
        </p>
      )}
      {health.checked_at && (
        <p className="text-xs text-white/30 mt-2">
          {labels.lastChecked} {new Date(health.checked_at).toLocaleString()}
        </p>
      )}
    </div>
  );
}
