"use client";

import { GlassPanel } from "./GlassPanel";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  padding?: string;
}

export function GlassCard({
  children,
  className,
  padding = "p-6",
}: GlassCardProps) {
  return (
    <GlassPanel variant="card" className={className} quality="low">
      <div className={padding}>{children}</div>
    </GlassPanel>
  );
}
