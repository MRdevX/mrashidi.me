import { ReactNode } from "react";
import { PageWrapper } from "@/components/ui";

interface BlogContainerProps {
  children: ReactNode;
}

export function BlogContainer({ children }: BlogContainerProps) {
  return <PageWrapper>{children}</PageWrapper>;
}
