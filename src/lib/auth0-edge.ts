import { Auth0Client } from "@auth0/nextjs-auth0/edge";

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

export const auth0Edge = new Auth0Client({
  authorizationParameters: {
    scope: getAuth0Scope(),

    ...(process.env.AUTH0_AUDIENCE &&
      process.env.AUTH0_AUDIENCE !== "your_auth0_api_identifier_here" && { audience: process.env.AUTH0_AUDIENCE }),
  },
});
