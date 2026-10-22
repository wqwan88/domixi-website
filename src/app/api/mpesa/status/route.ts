import { NextRequest, NextResponse } from "next/server";
import { getOrderByCheckoutId } from "@/lib/db";

export async function GET(req: NextRequest) {
  const checkoutRequestId = req.nextUrl.searchParams.get("checkout_request_id");

  if (!checkoutRequestId) {
    return NextResponse.json(
      { success: false, error: "Missing checkout_request_id parameter" },
      { status: 400 }
    );
  }

  const order = getOrderByCheckoutId(checkoutRequestId);

  if (!order) {
    return NextResponse.json(
      { success: false, error: "Order not found" },
      { status: 404 }
    );
  }

  return NextResponse.json({
    success: true,
    data: {
      status: order.status,
      result_code: order.result_code,
      result_desc: order.result_desc,
      mpesa_receipt: order.mpesa_receipt,
      transaction_date: order.transaction_date,
      amount: order.amount,
      phone: order.phone,
      account_ref: order.account_ref,
      created_at: order.created_at,
      updated_at: order.updated_at,
    },
  });
}