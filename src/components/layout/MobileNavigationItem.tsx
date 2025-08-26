import Link from "next/link";
import { Disclosure } from "@headlessui/react";
import { NavigationItem as NavigationItemType } from "@/data";
import { useThemeConfig } from "@/hooks/useThemeConfig";

interface MobileNavigationItemProps {
  item: NavigationItemType;
  isActive: boolean;
}

export const MobileNavigationItem = ({ item, isActive }: MobileNavigationItemProps) => {
  const { getFocusPattern } = useThemeConfig();

  return (
    <Disclosure.Button
      as={Link}
      href={item.href}
      className={`block py-2 pl-3 pr-4 text-sm font-medium border-l-2 transition-colors duration-200 ${getFocusPattern()} ${
        isActive
          ? `border-orange-500 text-orange-500`
          : `border-transparent text-gray-600 dark:text-gray-400 hover:text-orange-500 hover:border-orange-500`
      }`}
      aria-current={isActive ? "page" : undefined}
    >
      {item.name}
    </Disclosure.Button>
  );
};
