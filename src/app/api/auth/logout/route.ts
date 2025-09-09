import { type NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  // For now, redirect to home page
  // In a full implementation, you would clear the session
  const baseUrl = process.env.AUTH0_BASE_URL || "http://localhost:3000";
  return NextResponse.redirect(baseUrl);
}
