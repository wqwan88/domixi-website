import { NextRequest, NextResponse } from "next/server";
import { stkPush } from "@/lib/daraja/client";
import { createOrder } from "@/lib/db";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  try {
    const { phone, amount } = await req.json();

    // 验证参数
    if (!phone || !amount) {
      return NextResponse.json(
        { success: false, error: "缺少手机号或金额" },
        { status: 400 }
      );
    }

    const cleanPhone = phone.replace(/\D/g, "");
    if (!cleanPhone.startsWith("254") || cleanPhone.length !== 12) {
      return NextResponse.json(
        { success: false, error: "手机号格式错误，需要 2547XXXXXXXX" },
        { status: 400 }
      );
    }

    const amountNum = Number(amount);
    if (!Number.isFinite(amountNum) || amountNum < 1 || amountNum > 150000) {
      return NextResponse.json(
        { success: false, error: "金额范围 1-150000 KES" },
        { status: 400 }
      );
    }

    // 生成唯一订单号
    const accountRef = "DMX" + crypto.randomBytes(4).toString("hex").toUpperCase();

    // 发起 STK Push
    const result = await stkPush(cleanPhone, amountNum, accountRef);

    if (result.ResponseCode !== "0") {
      return NextResponse.json(
        {
          success: false,
          error: result.ResponseDescription || result.CustomerMessage,
        },
        { status: 400 }
      );
    }

    // 写入数据库
    createOrder({
      checkout_request_id: result.CheckoutRequestID,
      merchant_request_id: result.MerchantRequestID,
      phone: cleanPhone,
      amount: amountNum,
      account_ref: accountRef,
    });

    return NextResponse.json({
      success: true,
      data: {
        checkout_request_id: result.CheckoutRequestID,
        merchant_request_id: result.MerchantRequestID,
        account_ref: accountRef,
        customer_message: result.CustomerMessage,
      },
    });
  } catch (err: any) {
    console.error("[MPESA STK Push]", err);
    return NextResponse.json(
      { success: false, error: err.message || "服务器内部错误" },
      { status: 500 }
    );
  }
}