import { Disclosure } from "@headlessui/react";
import Link from "next/link";
import type { NavigationItem as NavigationItemType } from "@/data";
import { useThemeConfig } from "@/hooks/useThemeConfig";

interface MobileNavigationItemProps {
  item: NavigationItemType;
  isActive: boolean;
}

export const MobileNavigationItem = ({ item, isActive }: MobileNavigationItemProps) => {
  return (
    <Disclosure.Button
      as={Link}
      href={item.href}
      className={`nav-item-mobile ${isActive ? "nav-item-active" : "nav-item-inactive hover:nav-item-hover"}`}
      aria-current={isActive ? "page" : undefined}
    >
      {item.name}
    </Disclosure.Button>
  );
};
