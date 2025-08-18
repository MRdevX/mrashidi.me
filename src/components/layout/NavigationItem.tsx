import Link from "next/link";
import { NavigationItem as NavigationItemType } from "@/data";

interface NavigationItemProps {
  item: NavigationItemType;
  isActive: boolean;
}

export const NavigationItem = ({ item, isActive }: NavigationItemProps) => {
  return (
    <Link
      href={item.href}
      className={`inline-flex items-center px-1 pt-1 text-sm font-medium border-b-2 transition-colors duration-200 focus-visible:outline-offset-4 focus-visible:outline-orange-500 ${
        isActive
          ? "border-orange-500 text-orange-500"
          : "border-transparent text-gray-400 hover:text-orange-400 hover:border-orange-400"
      }`}
      aria-current={isActive ? "page" : undefined}
    >
      {item.name}
    </Link>
  );
};
