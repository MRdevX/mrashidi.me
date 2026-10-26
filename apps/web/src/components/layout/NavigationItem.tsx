import Link from "next/link";
import type { NavigationItem as NavigationItemType } from "@/data/navigation";
import { preloadFirstBlogPage } from "@/features/blog";

interface NavigationItemProps {
  item: NavigationItemType;
  isActive: boolean;
}

export const NavigationItem = ({ item, isActive }: NavigationItemProps) => {
  const handleMouseEnter = () => {
    if (item.href === "/blog") {
      preloadFirstBlogPage();
    }
  };

  return (
    <Link
      href={item.href}
      className={`nav-item-hover-effect focus-ring ${isActive ? "nav-item-active" : "nav-item-inactive"}`}
      aria-current={isActive ? "page" : undefined}
      onMouseEnter={handleMouseEnter}
    >
      <span className="nav-item-text">{item.name}</span>
      <span className="nav-item-border" />
      <span className="nav-item-background" />
    </Link>
  );
};
