import { withSentryConfig } from "@sentry/nextjs";
import withPWA from "next-pwa";

const withBundleAnalyzer =
  process.env.ANALYZE === "true"
    ? (await import("@next/bundle-analyzer")).default({ enabled: true })
    : (config) => config;

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    optimizePackageImports: ["framer-motion", "lucide-react", "react-icons"],
  },

  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },

  
  productionBrowserSourceMaps: false,
  compress: true,
  
  eslint: {
    ignoreDuringBuilds: true,
  },

  modularizeImports: {
    "framer-motion": {
      transform: "framer-motion/{{member}}",
    },
    "react-icons": {
      transform: "react-icons/{{member}}",
    },
  },

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn-images-1.medium.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "miro.medium.com",
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
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net https://unpkg.com",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdn.jsdelivr.net",
              "font-src 'self' https://fonts.gstatic.com https://cdn.jsdelivr.net",
              "img-src 'self' data: https: blob:",
              "media-src 'self' https:",
              "connect-src 'self' https: wss:",
              "frame-src 'self' https://git-graph.vercel.app https://adplist.org",
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
            value: "camera=(), microphone=(), geolocation=(), payment=()",
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

const pwaConfig =
  process.env.SKIP_PWA === "true"
    ? (config) => config
    : withPWA({
        dest: "public",
        register: true,
        skipWaiting: true,
        disable: process.env.NODE_ENV === "development",

        
        exclude: [
          /\.map$/,
          /_manifest\.js$/,
          /\.(jpg|jpeg|png|gif|webp|svg|ico)$/,
          /\.(txt|xml|json)$/,
          /\.(woff|woff2|ttf|eot)$/,
          /sw\.js$/,
          /workbox-.*\.js$/,
          /\.ts$/,
          /\.tsx$/,
          /\.js\.map$/,
          /\.css\.map$/,
        ],

        buildExcludes: [
          /middleware-manifest\.json$/,
          /build-manifest\.json$/,
          /react-loadable-manifest\.json$/,
          /\.js\.map$/,
          /\.css\.map$/,
        ],

        runtimeCaching: [
          {
            urlPattern: /^https:\/\/(fonts\.googleapis\.com|fonts\.gstatic\.com)\/.*/i,
            handler: "CacheFirst",
            options: {
              cacheName: "google-fonts",
              expiration: {
                maxEntries: 5,
                maxAgeSeconds: 60 * 60 * 24 * 30,
              },
            },
          },
        ],
      });

const config = withBundleAnalyzer(pwaConfig(nextConfig));

export default withSentryConfig(config, {
  org: "notable-nomads",

  project: "mrashidi-me",

  silent: !process.env.CI,

  tunnelRoute: "/monitoring",

  disableLogger: true,

  automaticVercelMonitors: true,

  
  hideSourceMaps: true,
  disableServerWebpackPlugin: process.env.NODE_ENV !== "production",
  disableClientWebpackPlugin: process.env.NODE_ENV !== "production",
  widenClientFileUpload: process.env.NODE_ENV === "production",
});
