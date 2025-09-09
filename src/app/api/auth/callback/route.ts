import { type NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  // For now, redirect to admin panel
  // In a full implementation, you would handle the Auth0 callback
  const baseUrl = process.env.AUTH0_BASE_URL || "http://localhost:3000";
  return NextResponse.redirect(`${baseUrl}/admin`);
}
