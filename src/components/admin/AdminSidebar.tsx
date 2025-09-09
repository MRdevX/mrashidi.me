"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MdAnalytics, MdDashboard, MdMenu, MdPeople, MdSettings } from "react-icons/md";

interface AdminSidebarProps {
  toggleSidebar: boolean;
  setToggleSidebar: (value: boolean) => void;
}

const menuItems = [
  {
    name: "Dashboard",
    path: "/admin",
    icon: MdDashboard,
  },
  {
    name: "Analytics",
    path: "/admin/analytics",
    icon: MdAnalytics,
  },
  {
    name: "Users",
    path: "/admin/users",
    icon: MdPeople,
  },
  {
    name: "Settings",
    path: "/admin/settings",
    icon: MdSettings,
  },
];

const SidebarContent = ({ pathname }: { pathname: string }) => (
  <div className="flex flex-col h-full">
    {/* Logo/Brand */}
    <div className="p-6 border-b border-primary/20">
      <h1 className="text-xl font-bold text-primary font-cyberpunk text-neon-orange">Admin Panel</h1>
    </div>

    {/* Menu Items */}
    <div className="flex-1 p-4 space-y-1">
      {menuItems.map((item) => {
        const isActive = pathname === item.path;
        return (
          <Link key={item.path} href={item.path}>
            <div
              className={`
                  flex items-center p-3 rounded-md transition-all duration-200
                  ${
                    isActive
                      ? "bg-primary/10 text-primary border-l-4 border-primary text-neon-orange"
                      : "text-gray-300 hover:bg-primary/5 hover:text-primary/80"
                  }
                `}
            >
              <item.icon className="mr-3 text-lg" />
              <span className={`font-${isActive ? "semibold" : "normal"}`}>{item.name}</span>
            </div>
          </Link>
        );
      })}
    </div>
  </div>
);

export function AdminSidebar({ toggleSidebar, setToggleSidebar }: AdminSidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:block fixed left-0 top-0 w-72 h-screen bg-gray-900/95 backdrop-blur-sm border-r border-primary/20 z-10">
        <SidebarContent pathname={pathname} />
      </div>

      {/* Mobile Sidebar Overlay */}
      {toggleSidebar && (
        <div className="lg:hidden fixed inset-0 z-50">
          <button
            type="button"
            className="fixed inset-0 bg-black bg-opacity-50"
            onClick={() => setToggleSidebar(false)}
            onKeyDown={(e) => e.key === "Escape" && setToggleSidebar(false)}
            aria-label="Close sidebar"
          />
          <div className="fixed left-0 top-0 w-72 h-full bg-gray-900/95 backdrop-blur-sm border-r border-primary/20">
            <div className="flex justify-end p-4">
              <button
                type="button"
                onClick={() => setToggleSidebar(false)}
                className="text-gray-400 hover:text-primary"
              >
                <MdMenu className="text-xl" />
              </button>
            </div>
            <SidebarContent pathname={pathname} />
          </div>
        </div>
      )}
    </>
  );
}
