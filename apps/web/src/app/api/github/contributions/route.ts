import { NextResponse } from "next/server";
import { createMiddleware } from "@/lib/api/middleware";
import { getGitHubContributions } from "@/lib/content/server";

const CONTRIBUTIONS_TTL_SECONDS = 3_600;
const STALE_WHILE_REVALIDATE_SECONDS = 86_400;

async function handler(): Promise<NextResponse> {
  return NextResponse.json(await getGitHubContributions());
}

export const GET = createMiddleware("generalApi")
  .cache(CONTRIBUTIONS_TTL_SECONDS, STALE_WHILE_REVALIDATE_SECONDS)
  .build(handler);
