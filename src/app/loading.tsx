import { LoadingAnimation } from "@components/ui/LoadingAnimation";

export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <LoadingAnimation />
    </div>
  );
}
