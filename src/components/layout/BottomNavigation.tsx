"use client";

import { ThemeToggle } from "@/components/ui";
import { mobileNavigationItems } from "@/data/navigation";
import { BottomNavigationItem } from "./BottomNavigationItem";
import { FloatingActionButton } from "./FloatingActionButton";
import { useBottomNavigation } from "./useBottomNavigation";

export function BottomNavigation() {
  const { isActive } = useBottomNavigation({
    items: mobileNavigationItems,
  });

  return (
    <>
      <nav className="mobile-nav bottom-nav-glass sm:hidden" aria-label="Mobile primary navigation">
        <div className="nav-container">
          {mobileNavigationItems.map((item) => (
            <BottomNavigationItem
              key={item.name}
              name={item.name}
              href={item.href}
              icon={item.icon}
              isActive={isActive(item.href)}
            />
          ))}
        </div>
      </nav>

      <FloatingActionButton position="bottom-left" asButton={false}>
        <ThemeToggle size="sm" />
      </FloatingActionButton>
    </>
  );
}
