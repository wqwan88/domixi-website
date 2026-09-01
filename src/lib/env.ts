/**
 * 环境变量读取工具
 * 所有敏感凭证统一从这里读取，不要在代码里硬编码
 */

export function env(key: string, fallback?: string): string {
  const val = process.env[key] ?? fallback;
  if (val === undefined) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return val;
}

export function envInt(key: string, fallback: number): number {
  const raw = process.env[key];
  if (raw === undefined) return fallback;
  const n = Number.parseInt(raw, 10);
  return Number.isFinite(n) ? n : fallback;
}

export function envBool(key: string, fallback = false): boolean {
  const raw = process.env[key];
  if (raw === undefined) return fallback;
  return raw === "1" || raw === "true" || raw === "yes";
}

/* ── Daraja / M-Pesa ── */

export const MPESA_CONSUMER_KEY = () => env("MPESA_CONSUMER_KEY");
export const MPESA_CONSUMER_SECRET = () => env("MPESA_CONSUMER_SECRET");
export const MPESA_PASSKEY = () => env("MPESA_PASSKEY");
export const MPESA_SHORTCODE = () => env("MPESA_SHORTCODE", "174379");
export const MPESA_ENV = () => env("MPESA_ENV", "sandbox"); // sandbox | production
export const MPESA_CALLBACK_URL = () => env("MPESA_CALLBACK_URL");
export const MPESA_BASE_URL = () =>
  MPESA_ENV() === "production"
    ? "https://api.safaricom.co.ke"
    : "https://sandbox.safaricom.co.ke";