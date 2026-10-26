import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import { createMiddleware } from "@/lib/api/middleware";
import { CONTENT_TAG } from "@/lib/content/server";
import { getRequiredEnv } from "@/lib/core";

const getRevalidateSecret = (): string => getRequiredEnv("REVALIDATE_SECRET");

async function handleRevalidate() {
  revalidateTag(CONTENT_TAG, "max");
  return NextResponse.json({ revalidated: CONTENT_TAG });
}

export const POST = createMiddleware("generalApi").auth(getRevalidateSecret).build(handleRevalidate);
