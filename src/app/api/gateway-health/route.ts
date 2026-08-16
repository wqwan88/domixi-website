export const dynamic = "force-dynamic";

const STATUS_BASE =
  process.env.NEW_API_STATUS_URL ?? "https://console.ai-domixi.com";

export async function GET() {
  const started = Date.now();
  try {
    const [statusRes, pricingRes] = await Promise.all([
      fetch(`${STATUS_BASE}/api/status`, { cache: "no-store" }),
      fetch(`${STATUS_BASE}/api/pricing`, { cache: "no-store" }),
    ]);
    const latency = Date.now() - started;
    if (!statusRes.ok) {
      return Response.json(
        { ok: false, latency_ms: latency, checked_at: new Date().toISOString() },
        { status: 503 },
      );
    }
    const statusJson = (await statusRes.json()) as {
      data?: {
        version?: string;
        system_name?: string;
        server_address?: string;
        start_time?: number;
      };
    };
    const pricingJson = pricingRes.ok
      ? ((await pricingRes.json()) as { data?: unknown[] })
      : { data: [] };
    const data = statusJson.data ?? {};
    const models = Array.isArray(pricingJson.data) ? pricingJson.data : [];
    return Response.json({
      ok: true,
      latency_ms: latency,
      version: data.version ?? "",
      system_name: data.system_name ?? "DOMIXI",
      server_address: data.server_address ?? "",
      start_time: data.start_time ?? 0,
      model_count: models.length,
      checked_at: new Date().toISOString(),
    });
  } catch {
    return Response.json(
      {
        ok: false,
        latency_ms: Date.now() - started,
        checked_at: new Date().toISOString(),
      },
      { status: 503 },
    );
  }
}
