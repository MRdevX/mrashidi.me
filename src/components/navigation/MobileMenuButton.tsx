import { Disclosure } from "@headlessui/react";
import { X, Menu } from "lucide-react";

interface MobileMenuButtonProps {
  isOpen: boolean;
}

export const MobileMenuButton = ({ isOpen }: MobileMenuButtonProps) => {
  return (
    <Disclosure.Button
      className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-orange-500 hover:bg-gray-800/50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-orange-500"
      aria-label={isOpen ? "Close main menu" : "Open main menu"}
    >
      <span className="sr-only">{isOpen ? "Close main menu" : "Open main menu"}</span>
      {isOpen ? (
        <X className="block h-6 w-6" aria-hidden="true" />
      ) : (
        <Menu className="block h-6 w-6" aria-hidden="true" />
      )}
    </Disclosure.Button>
  );
};
