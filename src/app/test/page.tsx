import { CyberpunkComponentsDemo } from "@/components/ui";

export default function TestPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto py-8">
        <h1 className="text-4xl font-bold text-orange-500 font-cyberpunk glow-text mb-8 text-center">
          Cyberpunk Components Test
        </h1>
        <CyberpunkComponentsDemo />
      </div>
    </div>
  );
}
