/* ── Daraja OAuth ── */

export interface OAuthTokenResponse {
  access_token: string;
  expires_in: string; // "3599"
}

/* ── STK Push Request ── */

export interface STKPushRequest {
  BusinessShortCode: string;
  Password: string;
  Timestamp: string;
  TransactionType: "CustomerPayBillOnline";
  Amount: string;
  PartyA: string;
  PartyB: string;
  PhoneNumber: string;
  CallBackURL: string;
  AccountReference: string;
  TransactionDesc: string;
}

/* ── STK Push Response ── */

export interface STKPushResponse {
  MerchantRequestID: string;
  CheckoutRequestID: string;
  ResponseCode: string;
  ResponseDescription: string;
  CustomerMessage: string;
}

/* ── STK Query Request ── */

export interface STKQueryRequest {
  BusinessShortCode: string;
  Password: string;
  Timestamp: string;
  CheckoutRequestID: string;
}

/* ── STK Query Response ── */

export interface STKQueryResponse {
  ResponseCode: string;
  ResponseDescription: string;
  MerchantRequestID: string;
  CheckoutRequestID: string;
  ResultCode: string;
  ResultDesc: string;
}

/* ── Callback Payload ── */

export interface CallbackPayload {
  Body: {
    stkCallback: {
      MerchantRequestID: string;
      CheckoutRequestID: string;
      ResultCode: number;
      ResultDesc: string;
      CallbackMetadata?: {
        Item: Array<{
          Name: string;
          Value?: string | number;
        }>;
      };
    };
  };
}

/** 从 CallbackMetadata 中提取便捷字段 */
export function extractCallbackMeta(
  item: CallbackPayload["Body"]["stkCallback"]["CallbackMetadata"]
): Record<string, string | number | undefined> {
  const map: Record<string, string | number | undefined> = {};
  if (!item) return map;
  for (const entry of item.Item) {
    map[entry.Name] = entry.Value;
  }
  return map;
}