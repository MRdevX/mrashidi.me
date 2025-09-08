import Link from "next/link";
import type { NavigationItem as NavigationItemType } from "@/data/navigation";
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
      className={`nav-item-hover-effect ${isActive ? "nav-item-active" : "nav-item-inactive"}`}
      aria-current={isActive ? "page" : undefined}
      onMouseEnter={handleMouseEnter}
    >
      {/* Link text */}
      <span className="nav-item-text">{item.name}</span>
      {/* Top & bottom border animation */}
      <span className="nav-item-border" />
      {/* Background fill animation */}
      <span className="nav-item-background" />
    </Link>
  );
};
