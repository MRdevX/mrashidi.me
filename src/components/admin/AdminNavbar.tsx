"use client";

import { useUser } from "@auth0/nextjs-auth0";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { MdAccountCircle, MdMenu, MdNotifications } from "react-icons/md";

interface AdminNavbarProps {
  onToggleSidebar: () => void;
}

export function AdminNavbar({ onToggleSidebar }: AdminNavbarProps) {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const pathname = usePathname();
  const { user, isLoading } = useUser();

  const getPageTitle = () => {
    switch (pathname) {
      case "/admin":
        return "Dashboard";
      case "/admin/analytics":
        return "Analytics";
      case "/admin/users":
        return "User Management";
      case "/admin/settings":
        return "Settings";
      default:
        return "Admin Panel";
    }
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-20 bg-gray-900/95 backdrop-blur-sm border-b border-primary/20 px-4 md:px-6 py-4 lg:left-72 transition-all duration-300">
      <div className="flex items-center justify-between">
        {/* Mobile Menu Button */}
        <button
          type="button"
          onClick={onToggleSidebar}
          className="lg:hidden flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-primary hover:bg-primary/10"
        >
          <MdMenu className="text-xl" />
        </button>

        {/* Page Title */}
        <h2 className="text-lg font-semibold text-white font-cyberpunk">{getPageTitle()}</h2>

        {/* Right Side Actions */}
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <button type="button" className="p-2 text-gray-400 hover:text-primary hover:bg-primary/10 rounded-md">
            <MdNotifications className="text-xl" />
          </button>

          {/* User Menu */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center space-x-2 p-2 rounded-md hover:bg-primary/10"
            >
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-sm font-medium">
                {isLoading ? "..." : user?.name?.charAt(0).toUpperCase() || "U"}
              </div>
            </button>

            {/* Dropdown Menu */}
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-md shadow-lg border border-primary/20 py-1 z-50">
                <div className="px-4 py-2 text-sm text-gray-300 border-b border-primary/20">
                  <div className="font-medium">{user?.name || "User"}</div>
                  <div className="text-xs text-gray-400">{user?.email}</div>
                </div>
                <button
                  type="button"
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-300 hover:bg-primary/10 hover:text-primary"
                >
                  <MdAccountCircle className="mr-3 text-lg" />
                  Profile
                </button>
                <button
                  type="button"
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-300 hover:bg-primary/10 hover:text-primary"
                >
                  Settings
                </button>
                <hr className="my-1 border-primary/20" />
                <a
                  href="/api/auth/logout"
                  className="flex items-center w-full px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300"
                >
                  Logout
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
