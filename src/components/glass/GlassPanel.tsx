"use client";

import { clsx } from "clsx";
import { useGlassEffect } from "./useGlassEffect";
import styles from "./glass.module.css";

interface GlassPanelProps {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "card" | "nav";
  enableWebGL?: boolean;
  quality?: "low" | "medium" | "high";
}

export function GlassPanel({
  children,
  className,
  variant = "default",
  enableWebGL = true,
  quality = "medium",
}: GlassPanelProps) {
  const { panelRef, canvasRef, webglAvailable } = useGlassEffect({
    enabled: enableWebGL,
    quality,
  });

  return (
    <div
      ref={panelRef}
      className={clsx(
        styles.glassPanel,
        variant === "card" && styles.glassCard,
        variant === "nav" && styles.glassNav,
        className
      )}
    >
      {/* WebGL canvas layer (hidden if not available) */}
      {webglAvailable && (
        <canvas
          ref={canvasRef}
          className={styles.glassCanvas}
          aria-hidden="true"
        />
      )}

      {/* CSS glass fallback (always present) */}
      <div className={styles.glassFallback} />

      {/* Rim light overlay */}
      <div className={styles.glassRimLight} />

      {/* Content */}
      <div className={styles.glassContent}>{children}</div>
    </div>
  );
}
