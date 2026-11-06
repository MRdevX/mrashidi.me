import { NextResponse } from "next/server";
import { createMiddleware } from "@/lib/api/middleware";

async function handleHealth() {
  return NextResponse.json({ status: "ok" });
}

export const GET = createMiddleware().build(handleHealth);
