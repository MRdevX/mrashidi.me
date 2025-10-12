import fs from "node:fs";
import path from "node:path";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { apiMiddleware } from "@/lib/api/middleware";
import { APIError } from "@/lib/errors";

async function handleVersion(_request: NextRequest) {
  try {
    const packageJsonPath = path.join(process.cwd(), "package.json");
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));

    return NextResponse.json({
      version: packageJson.version,
      timestamp: new Date().toISOString(),
    });
  } catch (_error) {
    throw new APIError("Failed to read version information", 500);
  }
}

export const GET = apiMiddleware.simple(handleVersion);
