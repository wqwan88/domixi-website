import { NextRequest, NextResponse } from "next/server";
import { stkPush } from "@/lib/daraja/client";
import { createOrder } from "@/lib/db";
import { validateNewApiUser } from "@/lib/newapi";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  try {
    const { phone, amount, user_id } = await req.json();

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

    // 校验用户（可选；从控制台钱包页充值时传入，校验不通过拒绝，避免充值丢单）
    let userId: number | null = null;
    if (user_id !== undefined && user_id !== null && user_id !== "") {
      const n = Number(user_id);
      if (!Number.isInteger(n) || n < 1) {
        return NextResponse.json(
          { success: false, error: "user_id 非法" },
          { status: 400 }
        );
      }
      if (!validateNewApiUser(n)) {
        return NextResponse.json(
          { success: false, error: "账户校验失败，请刷新页面后重试" },
          { status: 400 }
        );
      }
      userId = n;
    }

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
      user_id: userId,
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