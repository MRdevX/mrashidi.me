"use client";

import { useTheme } from "@/context/ThemeContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./Card";
import { Button } from "./Button";
import { ThemeToggle } from "./ThemeToggle";

export function ThemeDemo() {
  const { theme, resolvedTheme } = useTheme();

  return (
    <div className="space-y-6 p-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Theme Demo
            <ThemeToggle size="sm" />
          </CardTitle>
          <CardDescription>
            Current theme: <span className="font-mono">{theme}</span>
            {theme === "system" && <span className="ml-2 text-sm text-muted-foreground">(resolved: {resolvedTheme})</span>}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h3 className="font-semibold">Typography</h3>
              <div className="space-y-1 text-sm">
                <p className="cyberpunk-h1 text-base">Cyberpunk Heading</p>
                <p className="cyberpunk-h2 text-sm">Cyberpunk Subheading</p>
                <p className="cyberpunk-body-text text-sm">Body text with cyberpunk styling</p>
                <p className="terminal-text text-sm">Terminal text style</p>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold">Components</h3>
              <div className="space-y-2">
                <Button variant="default">Default Button</Button>
                <Button variant="outline">Outline Button</Button>
                <Button variant="secondary">Secondary Button</Button>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold">Cards & Effects</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="glass-card p-4">
                <h4 className="font-semibold mb-2">Glass Card</h4>
                <p className="text-sm">This card uses the glass effect</p>
              </div>
              <div className="feature-card">
                <h4 className="font-semibold mb-2">Feature Card</h4>
                <p className="text-sm">This card uses the feature card styling</p>
              </div>
              <div className="terminal-card p-4">
                <h4 className="font-semibold mb-2">Terminal Card</h4>
                <p className="text-sm">This card uses terminal styling</p>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold">Color Palette</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              <div className="h-12 bg-primary rounded flex items-center justify-center text-primary-foreground text-xs">
                Primary
              </div>
              <div className="h-12 bg-secondary rounded flex items-center justify-center text-secondary-foreground text-xs">
                Secondary
              </div>
              <div className="h-12 bg-accent rounded flex items-center justify-center text-accent-foreground text-xs">
                Accent
              </div>
              <div className="h-12 bg-muted rounded flex items-center justify-center text-muted-foreground text-xs">
                Muted
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
