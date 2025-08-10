import { Disclosure } from "@headlessui/react";

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
        <svg
          className="block h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      ) : (
        <svg
          className="block h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
        </svg>
      )}
    </Disclosure.Button>
  );
};
