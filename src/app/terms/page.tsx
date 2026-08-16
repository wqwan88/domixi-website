import type { Metadata } from "next";
import LegalContent from "@/components/LegalContent";

export const metadata: Metadata = {
  title: "服务条款 · DOMIXI",
  description: "DOMIXI 服务条款：账号、令牌、计费、使用规范与责任限制。",
};

export default function TermsPage() {
  return <LegalContent lang="zh" doc="terms" />;
}
