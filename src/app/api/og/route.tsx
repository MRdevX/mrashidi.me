import { ImageResponse } from "@vercel/og";
import type { NextRequest } from "next/server";
import { OgImageTemplate } from "@/components/og-template";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const title = (searchParams.get("title") || "Mahdi Rashidi").slice(0, 100);
    const subtitle = (searchParams.get("subtitle") || "Software Backend Engineer").slice(0, 150);
    const description = (searchParams.get("description") || "Building reliable and maintainable systems").slice(0, 250);

    return new ImageResponse(<OgImageTemplate title={title} subtitle={subtitle} description={description} />, {
      width: 1200,
      height: 630,
    });
  } catch (error) {
    console.error("Error generating OG image:", error);
    return new Response("Failed to generate image", { status: 500 });
  }
}
