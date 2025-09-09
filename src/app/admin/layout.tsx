"use client";

import { useUser } from "@auth0/nextjs-auth0";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";

export default function AdminLayoutWrapper({ children }: { children: React.ReactNode }) {
  const { user, isLoading, error } = useUser();
  const router = useRouter();

  console.log("Admin layout - user:", user, "isLoading:", isLoading, "error:", error);

  useEffect(() => {
    if (!isLoading && !user) {
      console.log("No user found, redirecting to login");
      router.push("/admin/login");
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return <AdminLayout>{children}</AdminLayout>;
}
