import { createSerwistRoute } from "@serwist/turbopack";

export const { dynamic, dynamicParams, revalidate, generateStaticParams, GET } = createSerwistRoute({
  swSrc: "src/lib/pwa/sw.ts",
  globPatterns: [".next/static/**/*.{js,css}"],
  useNativeEsbuild: true,
  // esbuild cannot lower Serwist's worker to the .browserslistrc targets (Safari 12).
  esbuildOptions: { target: "es2022" },
});
