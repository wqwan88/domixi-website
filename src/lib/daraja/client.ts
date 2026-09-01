import axios from 'axios';
import type {
  OAuthTokenResponse,
  STKPushRequest,
  STKPushResponse,
  STKQueryRequest,
  STKQueryResponse,
  CallbackPayload,
} from "@/lib/daraja/types";
import { MPESA_BASE_URL, MPESA_CONSUMER_KEY, MPESA_CONSUMER_SECRET, MPESA_SHORTCODE, MPESA_PASSKEY, MPESA_CALLBACK_URL } from "@/lib/env";

export { extractCallbackMeta } from "@/lib/daraja/types";

/* ── Token cache (in-memory) ── */

let _token: string | null = null;
let _tokenExpiresAt = 0;

/* ── Timestamp format yyyyMMddHHmmss ── */

function timestamp(): string {
  const now = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return (
    String(now.getFullYear()) +
    pad(now.getMonth() + 1) +
    pad(now.getDate()) +
    pad(now.getHours()) +
    pad(now.getMinutes()) +
    pad(now.getSeconds())
  );
}

/* ── STK Password ── */

export function stkPassword(shortCode: string, passkey: string, ts: string): string {
  const raw = shortCode + passkey + ts;
  return Buffer.from(raw).toString("base64");
}

/* ── OAuth Access Token ── */

export async function getAccessToken(): Promise<string> {
  if (_token && Date.now() < _tokenExpiresAt - 60_000) {
    return _token;
  }

  const consumerKey = MPESA_CONSUMER_KEY();
  const consumerSecret = MPESA_CONSUMER_SECRET();
  const basicAuth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString("base64");
  const base = MPESA_BASE_URL();

  try {
    const res = await axios.get(`${base}/oauth/v1/generate?grant_type=client_credentials`, {
      headers: { 
        Authorization: `Basic ${basicAuth}`,
      },
    });

    if (res.status !== 200 || !res.data?.access_token) {
      throw new Error(`Daraja OAuth failed: status=${res.status}, data=${JSON.stringify(res.data)}`);
    }

    const data: OAuthTokenResponse = res.data;
    _token = data.access_token;
    _tokenExpiresAt = Date.now() + Number(data.expires_in) * 1000;
    return _token!;
  } catch (e: any) {
    throw new Error(`Daraja OAuth failed: ${e.message || e.toString()}`);
  }
}

/* ── STK Push ── */

export async function stkPush(
  phone: string,
  amount: number,
  accountRef: string
): Promise<STKPushResponse> {
  const token = await getAccessToken();
  const shortCode = MPESA_SHORTCODE();
  const passkey = MPESA_PASSKEY();
  const callbackUrl = MPESA_CALLBACK_URL();
  const base = MPESA_BASE_URL();

  const ts = timestamp();
  const password = stkPassword(shortCode, passkey, ts);

  // Format phone: 2547XXXXXXXX
  const clean = phone.replace(/\D/g, "");
  const partyA = clean.startsWith("254") ? clean : "254" + clean.replace(/^0+/, "");

  const body: STKPushRequest = {
    BusinessShortCode: shortCode,
    Password: password,
    Timestamp: ts,
    TransactionType: "CustomerPayBillOnline",
    Amount: String(amount),
    PartyA: partyA,
    PartyB: shortCode,
    PhoneNumber: partyA,
    CallBackURL: callbackUrl,
    AccountReference: accountRef,
    TransactionDesc: "DOMIXI Top-Up",
  };

  try {
    const res = await axios.post(
      `${base}/mpesa/stkpush/v1/processrequest`,
      body,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!res.data) {
      throw new Error(`STK Push returned no data`);
    }

    return res.data as STKPushResponse;
  } catch (e: any) {
    throw new Error(`STK Push failed: ${e.response?.data || e.message || e.toString()}`);
  }
}

/* ── STK Push Query ── */

export async function stkQuery(
  checkoutRequestId: string
): Promise<STKQueryResponse> {
  const token = await getAccessToken();
  const shortCode = MPESA_SHORTCODE();
  const passkey = MPESA_PASSKEY();
  const base = MPESA_BASE_URL();

  const ts = timestamp();
  const password = stkPassword(shortCode, passkey, ts);

  const body: STKQueryRequest = {
    BusinessShortCode: shortCode,
    Password: password,
    Timestamp: ts,
    CheckoutRequestID: checkoutRequestId,
  };

  try {
    const res = await axios.post(
      `${base}/mpesa/stkpushquery/v1/query`,
      body,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!res.data) {
      throw new Error(`STK Query returned no data`);
    }

    return res.data as STKQueryResponse;
  } catch (e: any) {
    throw new Error(`STK Query failed: ${e.response?.data || e.message || e.toString()}`);
  }
}
