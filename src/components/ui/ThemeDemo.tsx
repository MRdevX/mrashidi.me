import React from "react";
import { useThemeConfig } from "@/hooks/useThemeConfig";
import { CyberpunkButton } from "./CyberpunkButton";
import { CyberpunkInput } from "./CyberpunkInput";
import { CyberpunkBadge } from "./CyberpunkBadge";
import { CyberpunkCard } from "./CyberpunkCard";
import type { ButtonVariant, InputVariant, BadgeVariant, CardVariant } from "@/config/theme.config";

export const ThemeDemo: React.FC = () => {
  const { colors, fonts, variants, animations, getColor, getFont, getSpacing, getBorderRadius, getShadow } =
    useThemeConfig();

  return (
    <div className="p-8 space-y-8">
      <h1 className="text-3xl font-bold mb-6">Theme System Demo</h1>

      {/* Colors Section */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Colors</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(colors).map(([name, color]) => (
            <div key={name} className="text-center">
              <div className="w-16 h-16 mx-auto rounded-lg mb-2" style={{ backgroundColor: color.DEFAULT }} />
              <p className="text-sm font-mono">{name}</p>
              <p className="text-xs text-gray-500">{color.DEFAULT}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Typography Section */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Typography</h2>
        <div className="space-y-2">
          {Object.entries(fonts).map(([name, font]) => (
            <div key={name} className="p-4 border rounded">
              <p className="text-sm text-gray-500 mb-1">{name}</p>
              <p style={{ fontFamily: font }} className="text-lg">
                The quick brown fox jumps over the lazy dog
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Component Variants Section */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">Component Variants</h2>

        {/* Buttons */}
        <div>
          <h3 className="text-xl font-medium mb-3">Buttons</h3>
          <div className="flex flex-wrap gap-3">
            {Object.keys(variants.button).map((variant) => (
              <CyberpunkButton key={variant} variant={variant as ButtonVariant}>
                {variant}
              </CyberpunkButton>
            ))}
          </div>
        </div>

        {/* Inputs */}
        <div>
          <h3 className="text-xl font-medium mb-3">Inputs</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.keys(variants.input).map((variant) => (
              <div key={variant}>
                <label className="block text-sm font-medium mb-2">{variant}</label>
                <CyberpunkInput variant={variant as InputVariant} placeholder={`${variant} input`} />
              </div>
            ))}
          </div>
        </div>

        {/* Badges */}
        <div>
          <h3 className="text-xl font-medium mb-3">Badges</h3>
          <div className="flex flex-wrap gap-3">
            {Object.keys(variants.badge).map((variant) => (
              <CyberpunkBadge key={variant} variant={variant as BadgeVariant}>
                {variant}
              </CyberpunkBadge>
            ))}
          </div>
        </div>

        {/* Cards */}
        <div>
          <h3 className="text-xl font-medium mb-3">Cards</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.keys(variants.card).map((variant) => (
              <CyberpunkCard key={variant} variant={variant as CardVariant}>
                <div className="p-4">
                  <h4 className="font-semibold mb-2">{variant} Card</h4>
                  <p className="text-sm text-gray-600">This is a {variant} variant card with some content.</p>
                </div>
              </CyberpunkCard>
            ))}
          </div>
        </div>
      </section>

      {/* Utility Functions Demo */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Utility Functions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <h3 className="text-lg font-medium">Theme Values</h3>
            <div className="space-y-1 text-sm">
              <p>
                <strong>Primary Color:</strong> {getColor("primary")}
              </p>
              <p>
                <strong>Cyberpunk Font:</strong> {getFont("cyberpunk")}
              </p>
              <p>
                <strong>Large Spacing:</strong> {getSpacing("lg")}
              </p>
              <p>
                <strong>Large Border Radius:</strong> {getBorderRadius("lg")}
              </p>
              <p>
                <strong>Neon Shadow:</strong> {getShadow("neon")}
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-medium">Animation Classes</h3>
            <div className="space-y-1 text-sm">
              {Object.entries(animations).map(([name, className]) => (
                <p key={name}>
                  <strong>{name}:</strong> {className}
                </p>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Usage Examples */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Usage Examples</h2>
        <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
          <h3 className="text-lg font-medium mb-2">Component Implementation</h3>
          <pre className="text-sm overflow-x-auto">
            {`import { useThemeConfig } from "@/hooks/useThemeConfig";

const MyComponent = () => {
  const { getButtonVariant, getColor } = useThemeConfig();
  
  return (
    <button className={getButtonVariant("neon")}>
      Click me
    </button>
  );
};`}
          </pre>
        </div>
      </section>
    </div>
  );
};
