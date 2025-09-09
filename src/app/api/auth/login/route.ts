import { type NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  // For now, redirect to Auth0 login
  const auth0Domain = process.env.AUTH0_ISSUER_BASE_URL;
  const clientId = process.env.AUTH0_CLIENT_ID;
  const baseUrl = process.env.AUTH0_BASE_URL;

  if (!auth0Domain || !clientId || !baseUrl) {
    return NextResponse.json({ error: "Auth0 configuration missing" }, { status: 500 });
  }

  const redirectUri = `${baseUrl}/api/auth/callback`;
  const authUrl =
    `${auth0Domain}/authorize?` +
    new URLSearchParams({
      response_type: "code",
      client_id: clientId,
      redirect_uri: redirectUri,
      scope: "openid profile email",
      state: "admin-panel",
    });

  return NextResponse.redirect(authUrl);
}
