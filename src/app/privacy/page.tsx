import type { Metadata } from "next";
import LegalContent from "@/components/LegalContent";

export const metadata: Metadata = {
  title: "隐私政策 · DOMIXI",
  description: "DOMIXI 隐私政策：我们收集哪些信息、如何使用，以及请求内容如何处理。",
};

export default function PrivacyPage() {
  return <LegalContent lang="zh" doc="privacy" />;
}
