import Link from "next/link";
import type { NavigationItem as NavigationItemType } from "@/data";
import { useBlogPreload } from "@/hooks";
import { useThemeConfig } from "@/hooks/useThemeConfig";

interface NavigationItemProps {
  item: NavigationItemType;
  isActive: boolean;
}

export const NavigationItem = ({ item, isActive }: NavigationItemProps) => {
  const { preloadFirstPage } = useBlogPreload();
  const { getFocusPattern } = useThemeConfig();

  const handleMouseEnter = () => {
    if (item.href === "/blog") {
      preloadFirstPage();
    }
  };

  return (
    <Link
      href={item.href}
      className={`inline-flex items-center px-2 py-1 text-sm font-medium border-b-2 transition-colors duration-200 ${getFocusPattern()} ${
        isActive
          ? `border-orange-500 text-orange-500`
          : `border-transparent text-gray-600 dark:text-gray-400 hover:text-orange-500 hover:border-orange-500`
      }`}
      aria-current={isActive ? "page" : undefined}
      onMouseEnter={handleMouseEnter}
    >
      {item.name}
    </Link>
  );
};
