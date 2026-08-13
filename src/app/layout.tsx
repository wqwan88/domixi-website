import type { Metadata } from "next";
import "./globals.css";
import { brand } from "@/lib/brand";

export const metadata: Metadata = {
  title: `${brand.name} · ${brand.tagline}`,
  description: brand.description,
  icons: { icon: "/logo.svg", apple: "/logo.svg" },
  openGraph: {
    title: `${brand.name} · ${brand.tagline}`,
    description: brand.description,
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body>
        <div className="aurora" />
        {children}
      </body>
    </html>
  );
}
