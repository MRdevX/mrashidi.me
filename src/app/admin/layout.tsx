import { redirect } from "next/navigation";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { getServerSession } from "@/lib/auth0-server";

export default async function AdminLayoutWrapper({ children }: { children: React.ReactNode }) {
  try {
    const session = await getServerSession();

    if (!session || !session.user) {
      redirect("/api/auth/login?returnTo=/admin");
    }

    // TODO: Re-enable role checking later

    return <AdminLayout>{children}</AdminLayout>;
  } catch (error) {
    console.error("Error in admin layout:", error);
    redirect("/api/auth/login?returnTo=/admin");
  }
}
