import { Disclosure } from "@headlessui/react";
import { X, Menu } from "lucide-react";
import { useThemeConfig } from "@/hooks/useThemeConfig";

interface MobileMenuButtonProps {
  isOpen: boolean;
}

export const MobileMenuButton = ({ isOpen }: MobileMenuButtonProps) => {
  const { getTextColor, getBackgroundColor, getFocusPattern } = useThemeConfig();

  return (
    <Disclosure.Button
      className={`inline-flex items-center justify-center p-2 rounded-md ${getTextColor("secondary")} hover:text-orange-500 hover:${getBackgroundColor("muted")} ${getFocusPattern()}`}
      aria-label={isOpen ? "Close main menu" : "Open main menu"}
    >
      <span className="sr-only">{isOpen ? "Close main menu" : "Open main menu"}</span>
      {isOpen ? <X className="block h-6 w-6" aria-hidden="true" /> : <Menu className="block h-6 w-6" aria-hidden="true" />}
    </Disclosure.Button>
  );
};
