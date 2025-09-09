import { redirect } from "next/navigation";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { getServerSession } from "@/lib/auth0-server";

export default async function AdminLayoutWrapper({ children }: { children: React.ReactNode }) {
  const session = await getServerSession();

  if (!session || !session.user) {
    redirect("/admin/login?returnTo=/admin");
  }

  if (!session.user || typeof session.user !== "object") {
    redirect("/admin/login?returnTo=/admin");
  }

  const preferredRoleClaim = process.env.PREFERRED_ROLE_CLAIM;
  const fallbackRoleClaims = [
    "https://mrashidi.eu.auth0.com/roles",
    "roles",
    "https://mrashidi.me/roles",
    "user_roles",
    "app_metadata.roles",
  ];

  const roleClaimNames = preferredRoleClaim ? [preferredRoleClaim, ...fallbackRoleClaims] : fallbackRoleClaims;

  let rawRoles: unknown = null;
  for (const claimName of roleClaimNames) {
    if (session.user[claimName] !== undefined) {
      rawRoles = session.user[claimName];
      break;
    }
  }

  const normalizeRoles = (roles: unknown): string[] => {
    if (!roles) {
      return [];
    }

    if (Array.isArray(roles)) {
      return roles.map((role) => String(role).trim().toLowerCase()).filter((role) => role.length > 0);
    }

    return [String(roles).trim().toLowerCase()].filter((role) => role.length > 0);
  };

  const normalizedRoles = normalizeRoles(rawRoles);

  const isAdmin = normalizedRoles.includes("admin");

  if (!isAdmin) {
    redirect("/");
  }

  return <AdminLayout>{children}</AdminLayout>;
}
