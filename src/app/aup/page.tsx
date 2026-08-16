import type { Metadata } from "next";
import LegalContent from "@/components/LegalContent";

export const metadata: Metadata = {
  title: "可接受使用政策 · DOMIXI",
  description: "DOMIXI 可接受使用政策：禁止违法、滥用接口与有害内容。",
};

export default function AupPage() {
  return <LegalContent lang="zh" doc="aup" />;
}
