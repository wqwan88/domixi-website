import { NextRequest, NextResponse } from "next/server";
import { getOrderByCheckoutId, updateOrderStatus, markOrderCredited } from "@/lib/db";
import { stkQuery } from "@/lib/daraja/client";
import { creditNewApiUser } from "@/lib/newapi";
import type { CallbackPayload, STKQueryResponse } from "@/lib/daraja/types";

export async function GET(req: NextRequest) {
  const checkoutRequestId = req.nextUrl.searchParams.get("checkout_request_id");

  if (!checkoutRequestId) {
    return NextResponse.json(
      { success: false, error: "缺少 checkout_request_id" },
      { status: 400 }
    );
  }

  try {
    const result = await stkQuery(checkoutRequestId);

    // 如果查询返回了明确的成功/失败，更新订单
    if (result.ResponseCode === "0") {
      const isSuccess = result.ResultCode === "0";
      const order = getOrderByCheckoutId(checkoutRequestId);

      if (order && order.status === "pending") {
        updateOrderStatus(checkoutRequestId, {
          status: isSuccess ? "success" : "failed",
          result_code: Number(result.ResultCode),
          result_desc: result.ResultDesc,
          mpesa_receipt: null,
          transaction_date: null,
          raw_callback: null,
        });

        // 回调没来到时的兜底：query 确认成功后同样入账（订单上的 user_id）
        if (isSuccess && order.user_id && !order.credited) {
          const ok = creditNewApiUser(
            order.user_id,
            order.amount,
            order.account_ref,
            null
          );
          if (ok) markOrderCredited(checkoutRequestId);
        }
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        response_code: result.ResponseCode,
        result_code: result.ResultCode,
        result_desc: result.ResultDesc,
      },
    });
  } catch (err: any) {
    console.error("[MPESA Query]", err);
    return NextResponse.json(
      { success: false, error: err.message || "查询失败" },
      { status: 500 }
    );
  }
}