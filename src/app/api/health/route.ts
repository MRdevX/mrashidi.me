import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { apiMiddleware } from "@/lib/api/middleware";
import { env } from "@/lib/core";

async function handleHealth(_request: NextRequest) {
  const health = {
    status: "ok",
    timestamp: new Date().toISOString(),
    environment: env.NODE_ENV,
    version: process.env.npm_package_version || "unknown",
    uptime: process.uptime(),
  };

  return NextResponse.json(health);
}

export const GET = apiMiddleware.simple(handleHealth);
