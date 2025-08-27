import Link from "next/link";
import type { NavigationItem as NavigationItemType } from "@/data";
import { useBlogPreload } from "@/hooks";

interface NavigationItemProps {
  item: NavigationItemType;
  isActive: boolean;
}

export const NavigationItem = ({ item, isActive }: NavigationItemProps) => {
  const { preloadFirstPage } = useBlogPreload();

  const handleMouseEnter = () => {
    if (item.href === "/blog") {
      preloadFirstPage();
    }
  };

  return (
    <Link
      href={item.href}
      className={`nav-item ${isActive ? "nav-item-active" : "nav-item-inactive hover:nav-item-hover"}`}
      aria-current={isActive ? "page" : undefined}
      onMouseEnter={handleMouseEnter}
    >
      {item.name}
    </Link>
  );
};
