import { Disclosure } from "@headlessui/react";
import { Menu, X } from "lucide-react";
import { useThemeConfig } from "@/hooks/useThemeConfig";

interface MobileMenuButtonProps {
  isOpen: boolean;
}

export const MobileMenuButton = ({ isOpen }: MobileMenuButtonProps) => {
  return (
    <Disclosure.Button
      className="button-base button-secondary hover:button-hover focus-visible-orange"
      aria-label={isOpen ? "Close main menu" : "Open main menu"}
    >
      <span className="sr-only">{isOpen ? "Close main menu" : "Open main menu"}</span>
      {isOpen ? <X className="icon-size-md" aria-hidden="true" /> : <Menu className="icon-size-md" aria-hidden="true" />}
    </Disclosure.Button>
  );
};
