import Link from "next/link";
import { PageWrapper } from "@/components/ui";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <PageWrapper>
      <div className="content-section text-center">
        <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-body mb-4">Page Not Found</h2>
        <p className="text-muted mb-8 max-w-md mx-auto">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Button asChild>
          <Link href="/">Go Home</Link>
        </Button>
      </div>
    </PageWrapper>
  );
}
