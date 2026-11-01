import { withSentryConfig } from "@sentry/nextjs/config";
import { withSerwist } from "@serwist/turbopack";
import { withBotId } from "botid/next/config";

const withBundleAnalyzer =
  process.env.ANALYZE === "true"
    ? (await import("@next/bundle-analyzer")).default({ enabled: true })
    : (config) => config;

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    optimizePackageImports: [
      "date-fns",
      "framer-motion",
      "lucide-react",
      "@radix-ui/react-dialog",
      "@radix-ui/react-slot",
      "react-icons",
    ],
  },

  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },

  // Client prod maps widen attack surface — use SOURCE_BROWSER_MAPS=true to enable temporarily or rely on Sentry upload.
  productionBrowserSourceMaps: process.env.SOURCE_BROWSER_MAPS === "true",
  compress: true,

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.medium.com",
        pathname: "/**",
      },
    ],
  },

  turbopack: {
    resolveExtensions: [".tsx", ".ts", ".jsx", ".js", ".mjs", ".json", ".css", ".scss"],
    resolveAlias: {},
  },

  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net https://cdnjs.buymeacoffee.com https://unpkg.com https://www.google.com https://www.gstatic.com",
              "script-src-elem 'self' 'unsafe-inline' https://cdn.jsdelivr.net https://cdnjs.buymeacoffee.com https://unpkg.com https://www.google.com https://www.gstatic.com",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdn.jsdelivr.net",
              "font-src 'self' https://fonts.gstatic.com https://cdn.jsdelivr.net",
              "img-src 'self' data: https: blob:",
              "media-src 'self' https:",
              "connect-src 'self' https: wss: https://www.google.com https://mrdevx.medium.com https://medium.com https://*.medium.com https://www.buymeacoffee.com https://buymeacoffee.com",
              "frame-src 'self' https://adplist.org https://www.google.com https://www.buymeacoffee.com https://buymeacoffee.com",
              "object-src 'none'",
              "base-uri 'self'",
              "form-action 'self'",
              "frame-ancestors 'self'",
              "upgrade-insecure-requests",
            ].join("; "),
          },

          {
            key: "X-Frame-Options",
            value: "DENY",
          },

          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },

          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },

          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },

          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(self), geolocation=(), payment=()",
          },

          {
            key: "Strict-Transport-Security",
            value: "max-age=31536000; includeSubDomains; preload",
          },
        ],
      },
    ];
  },
};

const config = withBotId(withBundleAnalyzer(withSerwist(nextConfig)));

export default withSentryConfig(config, {
  org: "notable-nomads",

  project: "mrashidi-me",

  silent: !process.env.CI,

  tunnelRoute: "/monitoring",

  webpack: {
    treeshake: {
      removeDebugLogging: true,
    },
    automaticVercelMonitors: true,
  },

  hideSourceMaps: false,
  disableServerWebpackPlugin: process.env.NODE_ENV !== "production",
  disableClientWebpackPlugin: process.env.NODE_ENV !== "production",
  widenClientFileUpload: process.env.NODE_ENV === "production",
  sourcemaps: {
    assets: [".next/static/**/*.js", ".next/static/**/*.js.map"],
  },
});
