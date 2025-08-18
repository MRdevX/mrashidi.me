import { ReactNode } from "react";

interface ContactContainerProps {
  children: ReactNode;
}

export default function ContactContainer({ children }: ContactContainerProps) {
  return (
    <div className="min-h-screen py-12 bg-gradient-to-b from-gray-900 to-black">
      <div className="max-w-4xl mx-auto px-4">{children}</div>
    </div>
  );
}
