import { withSentryConfig } from "@sentry/nextjs/config";
import { withSerwist } from "@serwist/turbopack";
import { withBotId } from "botid/next/config";

const withBundleAnalyzer =
  process.env.ANALYZE === "true"
    ? (await import("@next/bundle-analyzer")).default({ enabled: true })
    : (config) => config;

const REQUIRED_PRODUCTION_ENV = ["CV_LINK_SECRET"];

if (process.env.VERCEL_ENV === "production") {
  const missing = REQUIRED_PRODUCTION_ENV.filter((key) => !process.env[key]);
  if (missing.length > 0) {
    throw new Error(`Missing production env: ${missing.join(", ")}. Set them in the Vercel dashboard.`);
  }
}

const RECAPTCHA = "https://www.google.com https://www.gstatic.com";
const BUY_ME_A_COFFEE = "https://www.buymeacoffee.com https://buymeacoffee.com";

const CONTENT_SECURITY_POLICY = [
  "default-src 'self'",
  // React Refresh evaluates code in development only.
  `script-src 'self' 'unsafe-inline'${process.env.NODE_ENV === "development" ? " 'unsafe-eval'" : ""} ${RECAPTCHA} https://cdnjs.buymeacoffee.com`,
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com",
  "img-src 'self' data: blob: https:",
  "media-src 'self'",
  `connect-src 'self' ${RECAPTCHA} ${BUY_ME_A_COFFEE}`,
  `frame-src 'self' https://adplist.org ${RECAPTCHA} ${BUY_ME_A_COFFEE}`,
  "worker-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'self'",
  "upgrade-insecure-requests",
].join("; ");

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
          { key: "Content-Security-Policy", value: CONTENT_SECURITY_POLICY },
          // BotID frames its own same-origin route, so framing is limited to the site, not denied.
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(self), geolocation=(), payment=()" },
          { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains; preload" },
        ],
      },
      {
        // Serwist's runtime cache refetches cross-origin images from inside the worker, and the
        // worker's own CSP governs those fetches.
        source: "/serwist/:path*",
        headers: [{ key: "Content-Security-Policy", value: "default-src 'self'; connect-src 'self' https:" }],
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
