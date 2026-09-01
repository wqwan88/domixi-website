import { NextRequest, NextResponse } from "next/server";
import { getOrderByCheckoutId, updateOrderStatus, saveRawCallback } from "@/lib/db";
import { extractCallbackMeta } from "@/lib/daraja/client";
import type { CallbackPayload } from "@/lib/daraja/types";

/**
 * Safaricom STK Push 回调端点
 *
 * 要求：
 * 1. HTTPS 公网可访问（开发期用 ngrok）
 * 2. 立刻返回 200，业务异步处理
 * 3. 用 CheckoutRequestID 做幂等去重
 * 4. 完整保存原始回调 JSON
 */
export async function POST(req: NextRequest) {
  const rawBody = await req.text();

  // 4. 完整保存原始回调 JSON（哪怕还没解析）
  //    先存初步记录，CheckoutRequestID 可能为空
  saveRawCallback(null, rawBody);

  try {
    const payload: CallbackPayload = JSON.parse(rawBody);
    const callback = payload.Body?.stkCallback;

    if (!callback) {
      console.warn("[MPESA Callback] 无效回调结构，已保存原始数据");
      return new NextResponse("OK", { status: 200 });
    }

    const { CheckoutRequestID, ResultCode, ResultDesc, CallbackMetadata } = callback;
    const meta = extractCallbackMeta(CallbackMetadata);

    // 2. 幂等去重
    const existing = getOrderByCheckoutId(CheckoutRequestID);
    if (!existing) {
      console.warn(`[MPESA Callback] 未知 CheckoutRequestID: ${CheckoutRequestID}`);
      return new NextResponse("OK", { status: 200 });
    }

    if (existing.status !== "pending") {
      console.log(`[MPESA Callback] 订单 ${CheckoutRequestID} 已处理 (${existing.status})，跳过`);
      return new NextResponse("OK", { status: 200 });
    }

    // 3. 更新订单状态
    const isSuccess = ResultCode === 0;
    updateOrderStatus(CheckoutRequestID, {
      status: isSuccess ? "success" : "failed",
      result_code: ResultCode,
      result_desc: ResultDesc,
      mpesa_receipt: isSuccess ? (String(meta.MpesaReceiptNumber ?? "") || null) : null,
      transaction_date: isSuccess ? (String(meta.TransactionDate ?? "") || null) : null,
      raw_callback: rawBody,
    });

    // 更新原始回调记录的 CheckoutRequestID
    saveRawCallback(CheckoutRequestID, rawBody);

    console.log(
      `[MPESA Callback] ${isSuccess ? "✅ 支付成功" : "❌ 支付失败"} ` +
      `CheckoutRequestID=${CheckoutRequestID} ` +
      `ResultDesc=${ResultDesc} ` +
      `Receipt=${meta.MpesaReceiptNumber ?? "N/A"}`
    );

    return new NextResponse("OK", { status: 200 });
  } catch (err: any) {
    console.error("[MPESA Callback] 处理异常:", err);
    // 始终返回 200，避免 Safaricom 重试
    return new NextResponse("OK", { status: 200 });
  }
}