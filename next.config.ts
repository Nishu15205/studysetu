import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  // Bundle the seeded SQLite database into serverless functions (Vercel),
  // so the app has data even without an external DATABASE_URL.
  outputFileTracingIncludes: {
    "/api/:path*": ["./db/custom.db"],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
};

export default nextConfig;
