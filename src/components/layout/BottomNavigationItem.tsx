"use client";

import type { LucideIcon } from "lucide-react";
import Link from "next/link";

interface BottomNavigationItemProps {
  name: string;
  href: string;
  icon: LucideIcon;
  isActive: boolean;
  onClick?: () => void;
}

export function BottomNavigationItem({ name, href, icon: Icon, isActive, onClick }: BottomNavigationItemProps) {
  return (
    <Link href={href} onClick={onClick} className="bottom-nav-item nav-item-state" aria-label={name}>
      <Icon
        className={`bottom-nav-item-icon icon-container small ${isActive ? "active" : "inactive"}`}
        aria-hidden="true"
      />
      <span className={`bottom-nav-item-text text-container small ${isActive ? "active" : "inactive"}`}>{name}</span>
    </Link>
  );
}
