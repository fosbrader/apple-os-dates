"use client";

import { GlassPanel } from "./GlassPanel";

interface GlassNavProps {
  children: React.ReactNode;
  className?: string;
}

export function GlassNav({ children, className }: GlassNavProps) {
  return (
    <GlassPanel variant="nav" className={className} quality="medium">
      <div className="px-6 py-3">{children}</div>
    </GlassPanel>
  );
}
