import withPWA from "next-pwa";

/** @type {import('next').NextConfig} */
const nextConfig = {
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
  webpack: (config) => {
    // Handle MJML critical dependency warnings
    config.module.rules.push({
      test: /mjml/,
      type: "javascript/auto",
    });

    // Ignore MJML warnings during build
    config.ignoreWarnings = [/Critical dependency: the request of a dependency is an expression/];

    return config;
  },
};

const config = withPWA({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",
})(nextConfig);

export default config;
