import { GoogleTagManager } from "@next/third-parties/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { siteConfig } from "@/data";

export function AnalyticsWrapper() {
  return (
    <>
      <SpeedInsights />
      <Analytics />
      <GoogleTagManager gtmId={siteConfig.gtmId} />
    </>
  );
}
