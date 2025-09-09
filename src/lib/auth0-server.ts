import { Auth0Client } from "@auth0/nextjs-auth0/server";

function getAuth0Scope(): string {
  const envScope = process.env.AUTH0_SCOPE;

  if (!envScope) {
    return "openid";
  }

  if (!envScope.includes("openid")) {
    return `${envScope} openid`;
  }

  return envScope;
}

const auth0Server = new Auth0Client({
  authorizationParameters: {
    scope: getAuth0Scope(),
    ...(process.env.AUTH0_AUDIENCE &&
      process.env.AUTH0_AUDIENCE !== "your_auth0_api_identifier_here" && { audience: process.env.AUTH0_AUDIENCE }),
  },
});

/**
 * Server-side session helper for Auth0
 * This should only be used in server components and API routes
 */
export async function getServerSession() {
  return await auth0Server.getSession();
}

/**
 * Get Auth0 scope with openid fallback
 */
export function getAuth0ScopeValue(): string {
  return getAuth0Scope();
}
