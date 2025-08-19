import { ReactNode } from "react";

interface BlogContainerProps {
  children: ReactNode;
}

export default function BlogContainer({ children }: BlogContainerProps) {
  return (
    <div className="min-h-screen py-12 bg-linear-to-b from-gray-900 to-black">
      <div className="max-w-4xl mx-auto px-4">{children}</div>
    </div>
  );
}
