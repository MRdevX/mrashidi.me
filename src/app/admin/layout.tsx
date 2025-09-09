import { redirect } from "next/navigation";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { getServerSession } from "@/lib/auth0-server";

export default async function AdminLayoutWrapper({ children }: { children: React.ReactNode }) {
  const session = await getServerSession();

  if (!session || !session.user) {
    redirect("/auth/login?returnTo=/admin");
  }

  const userRoles =
    session.user["https://mrashidi.eu.auth0.com/roles"] ||
    session.user.roles ||
    session.user["https://mrashidi.me/roles"] ||
    [];

  const isAdmin = Array.isArray(userRoles)
    ? userRoles.includes("admin") || userRoles.includes("Admin") || userRoles.includes("ADMIN")
    : userRoles === "admin" || userRoles === "Admin" || userRoles === "ADMIN";

  if (!isAdmin) {
    redirect("/");
  }

  return <AdminLayout>{children}</AdminLayout>;
}
