declare module "next-pwa" {
  import type { NextConfig } from "next";

  /** Loose options object — matches next-pwa + Workbox surface without pinning versions. */
  export default function withPWA(options?: Record<string, unknown>): (nextConfig: NextConfig) => NextConfig;
}
