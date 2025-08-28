"use client";

import Link from "next/link";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface BottomNavigationItemProps {
  name: string;
  href: string;
  icon: LucideIcon;
  isActive: boolean;
  onClick?: () => void;
}

export function BottomNavigationItem({ name, href, icon: Icon, isActive, onClick }: BottomNavigationItemProps) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        "nav-item flex flex-col items-center justify-center min-w-0 flex-1 px-2 py-2 rounded-lg transition-all duration-200",
        "hover:bg-gray-100 dark:hover:bg-gray-800",
        "focus:outline-none"
      )}
      aria-label={name}
    >
      <Icon
        className={cn(
          "w-5 h-5 mb-1 transition-colors duration-200",
          isActive ? "text-orange-600 dark:text-orange-400" : "text-gray-500 dark:text-gray-400"
        )}
        aria-hidden="true"
      />
      <span
        className={cn(
          "text-xs font-medium transition-colors duration-200 truncate",
          isActive ? "text-orange-600 dark:text-orange-400" : "text-gray-600 dark:text-gray-300"
        )}
      >
        {name}
      </span>
    </Link>
  );
}
