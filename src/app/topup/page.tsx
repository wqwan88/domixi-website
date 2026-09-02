"use client";

import { useState, useCallback, useRef, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";

type Status = "idle" | "loading" | "pending" | "success" | "failed";

function TopUpForm() {
  const searchParams = useSearchParams();
  // 优先同源会话自动识别；?uid= 作为回退
  const uidParam = searchParams.get("uid");
  const [userId, setUserId] = useState<number | null>(
    uidParam && /^\d+$/.test(uidParam) ? Number(uidParam) : null
  );
  const [identityResolved, setIdentityResolved] = useState(false);

  // 同源请求携带控制台 session cookie → New API /api/user/self 返回当前用户
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/user/self", { credentials: "include" });
        const json = await res.json();
        if (!cancelled && json?.success && json?.data?.id) {
          setUserId(Number(json.data.id));
        }
      } catch {
        // 未登录或不可达，保持未关联状态
      } finally {
        if (!cancelled) setIdentityResolved(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const [phone, setPhone] = useState("");
  const [amount, setAmount] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");
  const [result, setResult] = useState<{
    checkout_request_id: string;
    account_ref: string;
  } | null>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // 轮询支付结果
  const startPolling = useCallback((checkoutRequestId: string) => {
    if (pollRef.current) clearInterval(pollRef.current);
    pollRef.current = setInterval(async () => {
      try {
        const res = await fetch(
          `/api/mpesa/status?checkout_request_id=${encodeURIComponent(checkoutRequestId)}`
        );
        const json = await res.json();
        if (json.success && json.data) {
          if (json.data.status === "success") {
            setStatus("success");
            clearInterval(pollRef.current!);
            pollRef.current = null;
          } else if (json.data.status === "failed") {
            setStatus("failed");
            setError(json.data.result_desc || "支付失败");
            clearInterval(pollRef.current!);
            pollRef.current = null;
          }
        }
      } catch {
        // 轮询失败不中断
      }
    }, 3000);
  }, []);

  // 清理轮询
  useEffect(() => {
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setResult(null);
    setStatus("loading");

    try {
      const res = await fetch("/api/mpesa/stkpush", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, amount, user_id: userId }),
      });
      const json = await res.json();

      if (!json.success) {
        setStatus("idle");
        setError(json.error || "发起支付失败");
        return;
      }

      setResult(json.data);
      setStatus("pending");
      startPolling(json.data.checkout_request_id);
    } catch (err: any) {
      setStatus("idle");
      setError(err.message || "网络错误");
    }
  };

  const handleReset = () => {
    setStatus("idle");
    setError("");
    setResult(null);
    setPhone("");
    setAmount("");
    if (pollRef.current) {
      clearInterval(pollRef.current);
      pollRef.current = null;
    }
  };

  return (
    <main style={{ maxWidth: 480, margin: "80px auto", padding: "0 16px" }}>
      <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>M-Pesa 充值</h1>
      <p style={{ color: "#666", marginBottom: 24 }}>
        通过 M-Pesa STK Push 为您的 DOMIXI 账户充值
      </p>

      {identityResolved && userId ? (
        <div
          style={{
            marginBottom: 20,
            padding: "10px 14px",
            borderRadius: 8,
            backgroundColor: "#ebf5ff",
            border: "1px solid #bee3f8",
            fontSize: 14,
            color: "#2b6cb0",
          }}
        >
          ✓ 已识别控制台账户（用户 #{userId}），支付成功后余额自动到账
        </div>
      ) : identityResolved ? (
        <div
          style={{
            marginBottom: 20,
            padding: "10px 14px",
            borderRadius: 8,
            backgroundColor: "#fffaf0",
            border: "1px solid #feebc8",
            fontSize: 14,
            color: "#c05621",
          }}
        >
          未识别到控制台登录态 — 登录控制台后从「钱包」页的 M-Pesa 入口进入可自动到账
        </div>
      ) : null}

      {status === "idle" || status === "loading" ? (
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 16 }}>
            <label
              htmlFor="phone"
              style={{ display: "block", marginBottom: 4, fontWeight: 500 }}
            >
              M-Pesa 手机号
            </label>
            <input
              id="phone"
              type="tel"
              placeholder="2547XXXXXXXX"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              disabled={status === "loading"}
              style={{
                width: "100%",
                padding: "10px 12px",
                fontSize: 16,
                border: "1px solid #ccc",
                borderRadius: 6,
                boxSizing: "border-box",
              }}
            />
            <small style={{ color: "#999" }}>
              肯尼亚 Safaricom 号码，格式 2547XXXXXXXX
            </small>
          </div>

          <div style={{ marginBottom: 24 }}>
            <label
              htmlFor="amount"
              style={{ display: "block", marginBottom: 4, fontWeight: 500 }}
            >
              金额 (KES)
            </label>
            <input
              id="amount"
              type="number"
              min={1}
              max={150000}
              placeholder="例如 100"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
              disabled={status === "loading"}
              style={{
                width: "100%",
                padding: "10px 12px",
                fontSize: 16,
                border: "1px solid #ccc",
                borderRadius: 6,
                boxSizing: "border-box",
              }}
            />
          </div>

          {error && (
            <p style={{ color: "#e53e3e", marginBottom: 16 }}>{error}</p>
          )}

          <button
            type="submit"
            disabled={status === "loading"}
            style={{
              width: "100%",
              padding: "12px",
              fontSize: 16,
              fontWeight: 600,
              color: "#fff",
              backgroundColor: status === "loading" ? "#999" : "#1db954",
              border: "none",
              borderRadius: 6,
              cursor: status === "loading" ? "not-allowed" : "pointer",
            }}
          >
            {status === "loading" ? "正在发起..." : `通过 M-Pesa 支付 KES ${amount || "0"}`}
          </button>
        </form>
      ) : null}

      {status === "pending" && result ? (
        <div
          style={{
            textAlign: "center",
            padding: 32,
            border: "1px solid #e2e8f0",
            borderRadius: 8,
          }}
        >
          <div style={{ fontSize: 48, marginBottom: 16 }}>⏳</div>
          <h2 style={{ fontSize: 18, marginBottom: 8 }}>等待支付确认</h2>
          <p style={{ color: "#666", marginBottom: 8 }}>
            请在手机上输入 M-Pesa PIN 完成支付
          </p>
          <p style={{ fontSize: 12, color: "#999" }}>
            订单号: {result.account_ref}
          </p>
          <p style={{ fontSize: 12, color: "#999" }}>
            CheckoutRequestID: {result.checkout_request_id}
          </p>
          <div
            style={{
              marginTop: 16,
              width: 24,
              height: 24,
              border: "3px solid #e2e8f0",
              borderTopColor: "#1db954",
              borderRadius: "50%",
              animation: "spin 0.8s linear infinite",
              display: "inline-block",
            }}
          />
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      ) : null}

      {status === "success" ? (
        <div
          style={{
            textAlign: "center",
            padding: 32,
            border: "1px solid #c6f6d5",
            borderRadius: 8,
            backgroundColor: "#f0fff4",
          }}
        >
          <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
          <h2 style={{ fontSize: 18, marginBottom: 8, color: "#276749" }}>
            支付成功！
          </h2>
          <p style={{ color: "#666", marginBottom: 4 }}>
            订单号: {result?.account_ref}
          </p>
          {userId ? (
            <p style={{ color: "#276749", marginBottom: 4, fontSize: 14 }}>
              余额已写入控制台账户（用户 #{userId}）
            </p>
          ) : null}
          <button
            onClick={handleReset}
            style={{
              marginTop: 16,
              padding: "10px 24px",
              fontSize: 14,
              color: "#276749",
              backgroundColor: "#c6f6d5",
              border: "none",
              borderRadius: 6,
              cursor: "pointer",
            }}
          >
            继续充值
          </button>
        </div>
      ) : null}

      {status === "failed" ? (
        <div
          style={{
            textAlign: "center",
            padding: 32,
            border: "1px solid #fed7d7",
            borderRadius: 8,
            backgroundColor: "#fff5f5",
          }}
        >
          <div style={{ fontSize: 48, marginBottom: 16 }}>❌</div>
          <h2 style={{ fontSize: 18, marginBottom: 8, color: "#c53030" }}>
            支付失败
          </h2>
          <p style={{ color: "#666", marginBottom: 16 }}>{error}</p>
          <button
            onClick={handleReset}
            style={{
              padding: "10px 24px",
              fontSize: 14,
              color: "#c53030",
              backgroundColor: "#fed7d7",
              border: "none",
              borderRadius: 6,
              cursor: "pointer",
            }}
          >
            重新充值
          </button>
        </div>
      ) : null}
    </main>
  );
}

export default function TopUpPage() {
  return (
    <Suspense fallback={null}>
      <TopUpForm />
    </Suspense>
  );
}