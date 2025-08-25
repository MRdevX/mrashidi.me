import Link from "next/link";
import { Disclosure } from "@headlessui/react";
import { NavigationItem as NavigationItemType } from "@/data";
import { useThemeConfig } from "@/hooks/useThemeConfig";

interface MobileNavigationItemProps {
  item: NavigationItemType;
  isActive: boolean;
}

export const MobileNavigationItem = ({ item, isActive }: MobileNavigationItemProps) => {
  const { getFocusPattern, getTextColor, getBackgroundColor } = useThemeConfig();

  return (
    <Disclosure.Button
      as={Link}
      href={item.href}
      className={`block py-2 pl-3 pr-4 text-base font-medium border-l-4 ${getFocusPattern()} ${
        isActive
          ? `border-orange-500 text-orange-500 ${getBackgroundColor("muted")}`
          : `border-transparent ${getTextColor("secondary")} hover:text-orange-400 hover:border-orange-400 hover:${getBackgroundColor("muted")}`
      }`}
      aria-current={isActive ? "page" : undefined}
    >
      {item.name}
    </Disclosure.Button>
  );
};
