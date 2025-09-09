"use client";

import { useUser } from "@auth0/nextjs-auth0";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AdminLoginPage() {
  const { user, isLoading, error } = useUser();
  const router = useRouter();

  console.log("Login page - user:", user, "isLoading:", isLoading, "error:", error);

  useEffect(() => {
    if (user && !isLoading) {
      console.log("User is authenticated, redirecting to admin");
      router.push("/admin");
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="fixed inset-0 z-50 min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center">
        <div className="text-white text-xl">Loading authentication...</div>
      </div>
    );
  }

  if (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error("Auth0 login error:", error);
    }

    if (process.env.NODE_ENV === "production") {
      console.error("Auth0 login error:", error);
    }

    return (
      <div className="fixed inset-0 z-50 min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center">
        <div className="max-w-md w-full space-y-8 p-8 bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 shadow-2xl">
          <div className="text-center">
            <h2 className="mt-6 text-3xl font-bold text-red-500 font-cyberpunk">Authentication Error</h2>
            <p className="mt-2 text-sm text-gray-300">An error occurred while signing in. Please try again.</p>
            {process.env.NODE_ENV !== "production" && (
              <details className="mt-4 text-left">
                <summary className="text-xs text-gray-400 cursor-pointer hover:text-gray-300">
                  Developer Details
                </summary>
                <pre className="mt-2 text-xs text-red-400 bg-gray-900 p-2 rounded overflow-auto">{error.message}</pre>
              </details>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (user) {
    return (
      <div className="fixed inset-0 z-50 min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center">
        <div className="text-white text-xl">Redirecting...</div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center">
      <div className="max-w-md w-full space-y-8 p-8 bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 shadow-2xl">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold text-white font-cyberpunk text-neon-orange">Admin Access</h2>
          <p className="mt-2 text-sm text-gray-300">Sign in to access the admin panel</p>
        </div>
        <div className="mt-8 space-y-6">
          <a
            href="/api/auth/login?returnTo=/admin"
            className="group relative w-full flex justify-center py-4 px-6 border border-transparent text-sm font-medium rounded-lg text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-200 shadow-lg hover:shadow-neon"
          >
            <span className="relative z-10">Sign in with Auth0</span>
          </a>
        </div>
      </div>
    </div>
  );
}
