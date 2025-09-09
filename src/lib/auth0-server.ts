import { Auth0Client } from "@auth0/nextjs-auth0/server";

const auth0Server = new Auth0Client();

export async function getServerSession() {
  return await auth0Server.getSession();
}
