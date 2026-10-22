import type { Metadata } from "next";

// /topup 面向肯尼亚 M-Pesa 用户，使用英文 title/description
export const metadata: Metadata = {
  title: "M-Pesa Top Up · DOMIXI",
  description: "Top up your DOMIXI account via M-Pesa STK Push (Kenya).",
  openGraph: {
    title: "M-Pesa Top Up · DOMIXI",
    description: "Top up your DOMIXI account via M-Pesa STK Push (Kenya).",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "M-Pesa Top Up · DOMIXI",
    description: "Top up your DOMIXI account via M-Pesa STK Push (Kenya).",
  },
};

export default function TopUpLayout({ children }: { children: React.ReactNode }) {
  return children;
}
