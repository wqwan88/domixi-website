import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  output: "standalone",
  async headers() {
    return [
      {
        source: "/:file(logo.svg|logo.png|logo-full.svg|domixi.svg|domixi.png|favicon.ico|apple-touch-icon.png)",
        headers: [{ key: "Cache-Control", value: "public, max-age=60, must-revalidate" }],
      },
    ];
  },
};

export default nextConfig;
