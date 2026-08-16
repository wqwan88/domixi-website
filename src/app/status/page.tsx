import type { Metadata } from "next";
import StatusContent from "@/components/StatusContent";

export const metadata: Metadata = {
  title: "服务状态 · DOMIXI",
  description: "DOMIXI API 网关实时状态。",
};

export default function StatusPage() {
  return <StatusContent lang="zh" />;
}
