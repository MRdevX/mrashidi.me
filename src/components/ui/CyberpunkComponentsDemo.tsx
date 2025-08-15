import React from "react";
import { motion } from "framer-motion";
import {
  CyberpunkButton,
  CyberpunkCard,
  CyberpunkCardHeader,
  CyberpunkCardTitle,
  CyberpunkCardContent,
  CyberpunkCardFooter,
  CyberpunkInput,
  CyberpunkTextarea,
  CyberpunkBadge,
  CyberpunkDialog,
  CyberpunkDialogContent,
  CyberpunkDialogHeader,
  CyberpunkDialogTitle,
  CyberpunkDialogFooter,
  CyberpunkDialogTrigger,
} from "./index";
import { Download, Send, User, Mail, MessageSquare } from "lucide-react";

export const CyberpunkComponentsDemo = () => {
  const [dialogOpen, setDialogOpen] = React.useState(false);

  return (
    <div className="space-y-8 p-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
        <h2 className="text-3xl font-bold text-orange-500 font-cyberpunk glow-text mb-4">Cyberpunk shadcn/ui Components</h2>
        <p className="text-gray-400 mb-8">Enhanced UX with your cyberpunk aesthetic preserved</p>
      </motion.div>

      {/* Buttons Section */}
      <CyberpunkCard variant="feature" hover>
        <CyberpunkCardHeader>
          <CyberpunkCardTitle>Buttons</CyberpunkCardTitle>
        </CyberpunkCardHeader>
        <CyberpunkCardContent>
          <div className="flex flex-wrap gap-4">
            <CyberpunkButton variant="neon" icon={<Download className="w-4 h-4" />}>
              Neon Button
            </CyberpunkButton>
            <CyberpunkButton variant="primary" icon={<Send className="w-4 h-4" />}>
              Primary Button
            </CyberpunkButton>
            <CyberpunkButton variant="secondary">Secondary Button</CyberpunkButton>
            <CyberpunkButton variant="outline">Outline Button</CyberpunkButton>
            <CyberpunkButton variant="ghost">Ghost Button</CyberpunkButton>
            <CyberpunkButton variant="destructive">Destructive Button</CyberpunkButton>
          </div>
        </CyberpunkCardContent>
      </CyberpunkCard>

      {/* Form Elements Section */}
      <CyberpunkCard variant="feature" hover>
        <CyberpunkCardHeader>
          <CyberpunkCardTitle>Form Elements</CyberpunkCardTitle>
        </CyberpunkCardHeader>
        <CyberpunkCardContent>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Default Input</label>
              <CyberpunkInput placeholder="Enter your name..." icon={<User className="w-4 h-4" />} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Neon Input</label>
              <CyberpunkInput variant="neon" placeholder="Enter your email..." icon={<Mail className="w-4 h-4" />} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Terminal Input</label>
              <CyberpunkInput variant="terminal" placeholder="Enter command..." />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Textarea</label>
              <CyberpunkTextarea placeholder="Enter your message..." rows={4} />
            </div>
          </div>
        </CyberpunkCardContent>
      </CyberpunkCard>

      {/* Badges Section */}
      <CyberpunkCard variant="feature" hover>
        <CyberpunkCardHeader>
          <CyberpunkCardTitle>Badges</CyberpunkCardTitle>
        </CyberpunkCardHeader>
        <CyberpunkCardContent>
          <div className="flex flex-wrap gap-2">
            <CyberpunkBadge variant="neon">Neon Badge</CyberpunkBadge>
            <CyberpunkBadge variant="tech">Tech Badge</CyberpunkBadge>
            <CyberpunkBadge variant="status">Status Badge</CyberpunkBadge>
            <CyberpunkBadge variant="outline">Outline Badge</CyberpunkBadge>
            <CyberpunkBadge variant="secondary">Secondary Badge</CyberpunkBadge>
            <CyberpunkBadge variant="destructive">Destructive Badge</CyberpunkBadge>
          </div>
        </CyberpunkCardContent>
      </CyberpunkCard>

      {/* Dialog Section */}
      <CyberpunkCard variant="feature" hover>
        <CyberpunkCardHeader>
          <CyberpunkCardTitle>Dialog</CyberpunkCardTitle>
        </CyberpunkCardHeader>
        <CyberpunkCardContent>
          <CyberpunkDialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <CyberpunkDialogTrigger asChild>
              <CyberpunkButton variant="neon">Open Cyberpunk Dialog</CyberpunkButton>
            </CyberpunkDialogTrigger>
            <CyberpunkDialogContent>
              <CyberpunkDialogHeader>
                <CyberpunkDialogTitle>Cyberpunk Dialog</CyberpunkDialogTitle>
              </CyberpunkDialogHeader>
              <div className="space-y-4">
                <p className="text-gray-300">
                  This is a cyberpunk-styled dialog with enhanced accessibility and animations.
                </p>
                <CyberpunkInput placeholder="Enter something..." />
              </div>
              <CyberpunkDialogFooter>
                <CyberpunkButton variant="ghost" onClick={() => setDialogOpen(false)}>
                  Cancel
                </CyberpunkButton>
                <CyberpunkButton variant="neon">Confirm</CyberpunkButton>
              </CyberpunkDialogFooter>
            </CyberpunkDialogContent>
          </CyberpunkDialog>
        </CyberpunkCardContent>
      </CyberpunkCard>

      {/* Features List */}
      <CyberpunkCard variant="feature" hover>
        <CyberpunkCardHeader>
          <CyberpunkCardTitle>What's Improved</CyberpunkCardTitle>
        </CyberpunkCardHeader>
        <CyberpunkCardContent>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-gray-300">Better accessibility with ARIA labels</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-gray-300">Consistent keyboard navigation</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-gray-300">Enhanced form validation states</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-gray-300">Smooth animations and transitions</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-gray-300">Preserved cyberpunk aesthetic</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-gray-300">Better TypeScript support</span>
            </div>
          </div>
        </CyberpunkCardContent>
      </CyberpunkCard>
    </div>
  );
};
