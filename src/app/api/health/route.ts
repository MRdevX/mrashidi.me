import { NextResponse } from "next/server";
import { env } from "@/lib/core";

export async function GET() {
  const health = {
    status: "ok",
    timestamp: new Date().toISOString(),
    environment: env.NODE_ENV,
    version: process.env.npm_package_version || "unknown",
    uptime: process.uptime(),
  };

  return NextResponse.json(health);
}
