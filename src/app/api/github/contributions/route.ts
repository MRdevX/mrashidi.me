import { NextResponse } from "next/server";
import { CONTRIBUTIONS_TTL_SECONDS, fetchContributions } from "@/features/home/server";
import { createMiddleware } from "@/lib/api/middleware";

const STALE_WHILE_REVALIDATE_SECONDS = 3_600;

async function handler(): Promise<NextResponse> {
  return NextResponse.json(await fetchContributions());
}

export const GET = createMiddleware("generalApi")
  .cache(CONTRIBUTIONS_TTL_SECONDS, STALE_WHILE_REVALIDATE_SECONDS)
  .build(handler);
