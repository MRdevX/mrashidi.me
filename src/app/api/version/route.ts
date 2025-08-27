import fs from "node:fs";
import path from "node:path";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const packageJsonPath = path.join(process.cwd(), "package.json");
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));

    return NextResponse.json({
      version: packageJson.version,
      timestamp: new Date().toISOString(),
    });
  } catch (_error) {
    return NextResponse.json(
      {
        version: "latest",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
