import type { ReactNode } from "react";
import { PageWrapper } from "@/components/ui";

interface ContactContainerProps {
  children: ReactNode;
}

export function ContactContainer({ children }: ContactContainerProps) {
  return <PageWrapper>{children}</PageWrapper>;
}
