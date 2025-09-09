import { Auth0Client } from "@auth0/nextjs-auth0/server";

export const auth0 = new Auth0Client({
  authorizationParameters: {
    scope: process.env.AUTH0_SCOPE,

    ...(process.env.AUTH0_AUDIENCE &&
      process.env.AUTH0_AUDIENCE !== "your_auth0_api_identifier_here" && { audience: process.env.AUTH0_AUDIENCE }),
  },
});
