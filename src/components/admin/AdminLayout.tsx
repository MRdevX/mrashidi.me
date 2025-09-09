"use client";

import { useState } from "react";
import { AdminNavbar } from "./AdminNavbar";
import { AdminSidebar } from "./AdminSidebar";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const [toggleSidebar, setToggleSidebar] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black dark:from-gray-900 dark:via-gray-800 dark:to-black">
      <div className="flex">
        {/* Sidebar */}
        <AdminSidebar toggleSidebar={toggleSidebar} setToggleSidebar={setToggleSidebar} />

        {/* Main Content Area */}
        <div className="flex-1 min-h-screen ml-0 lg:ml-72 transition-all duration-300">
          {/* Navbar */}
          <AdminNavbar onToggleSidebar={() => setToggleSidebar(!toggleSidebar)} />

          {/* Page Content */}
          <div className="p-4 md:p-6" style={{ paddingTop: "120px" }}>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
