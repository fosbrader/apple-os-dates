"use client";

import { useRef, useEffect, useCallback, useState } from "react";
import { WebGLGlassManager, type GlassUniforms } from "./webgl-manager";

interface UseGlassEffectOptions {
  enabled?: boolean;
  blurRadius?: number;
  refractionStrength?: number;
  specularIntensity?: number;
  chromaticAberration?: number;
  tintColor?: [number, number, number, number];
  tintOpacity?: number;
  quality?: "low" | "medium" | "high";
}

const QUALITY_MAP = {
  low: { blur: 2, refraction: 0.3, specular: 0.1, chromatic: 0 },
  medium: { blur: 4, refraction: 0.6, specular: 0.2, chromatic: 0.5 },
  high: { blur: 6, refraction: 1.0, specular: 0.3, chromatic: 1.0 },
};

let sharedManager: WebGLGlassManager | null = null;
let sharedCanvas: HTMLCanvasElement | null = null;
let managerRefCount = 0;

function getSharedManager(): WebGLGlassManager | null {
  if (!sharedManager) {
    if (typeof document === "undefined") return null;

    sharedCanvas = document.createElement("canvas");
    sharedCanvas.style.display = "none";
    document.body.appendChild(sharedCanvas);

    sharedManager = new WebGLGlassManager();
    if (!sharedManager.init(sharedCanvas)) {
      sharedManager = null;
      sharedCanvas.remove();
      sharedCanvas = null;
      return null;
    }
  }
  managerRefCount++;
  return sharedManager;
}

function releaseSharedManager() {
  managerRefCount--;
  if (managerRefCount <= 0 && sharedManager) {
    sharedManager.destroy();
    sharedManager = null;
    sharedCanvas?.remove();
    sharedCanvas = null;
    managerRefCount = 0;
  }
}

export function useGlassEffect(options: UseGlassEffectOptions = {}) {
  const {
    enabled = true,
    quality = "medium",
    tintColor = [1, 1, 1, 1],
    tintOpacity = 0.08,
  } = options;

  const panelRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const managerRef = useRef<WebGLGlassManager | null>(null);
  const rafRef = useRef<number>(0);
  const [webglAvailable, setWebglAvailable] = useState(false);

  const qualitySettings = QUALITY_MAP[quality];

  const blurRadius = options.blurRadius ?? qualitySettings.blur;
  const refractionStrength =
    options.refractionStrength ?? qualitySettings.refraction;
  const specularIntensity =
    options.specularIntensity ?? qualitySettings.specular;
  const chromaticAberration =
    options.chromaticAberration ?? qualitySettings.chromatic;

  const captureBackground = useCallback(() => {
    if (!panelRef.current || !managerRef.current?.ready) return;

    // Capture the area behind the panel using a simple approach:
    // Take a screenshot of the body and crop to the panel's area
    // For performance, we use a reduced-quality canvas capture
    const dpr = Math.min(window.devicePixelRatio, 2);

    // Create an offscreen canvas with the page content
    // In a real implementation, this would use html2canvas or similar
    // For now, we capture a solid color + gradient that simulates the background
    const offscreen = new OffscreenCanvas(
      Math.ceil(window.innerWidth * dpr),
      Math.ceil(window.innerHeight * dpr)
    );
    const ctx = offscreen.getContext("2d");
    if (!ctx) return;

    // Sample the computed background color
    const bgColor = getComputedStyle(document.body).backgroundColor;
    ctx.fillStyle = bgColor || "#0a0a0a";
    ctx.fillRect(0, 0, offscreen.width, offscreen.height);

    // Add a subtle gradient to make the glass interesting
    const gradient = ctx.createLinearGradient(
      0,
      0,
      offscreen.width,
      offscreen.height
    );
    gradient.addColorStop(0, "rgba(0, 122, 255, 0.05)");
    gradient.addColorStop(0.5, "rgba(175, 82, 222, 0.03)");
    gradient.addColorStop(1, "rgba(88, 86, 214, 0.05)");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, offscreen.width, offscreen.height);

    managerRef.current.updateBackgroundTexture(offscreen);
  }, []);

  const renderFrame = useCallback(function renderGlassFrame() {
    if (
      !managerRef.current?.ready ||
      !canvasRef.current ||
      !panelRef.current
    ) {
      return;
    }

    const panel = panelRef.current;
    const canvas = canvasRef.current;
    const rect = panel.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio, 2);

    canvas.width = Math.ceil(rect.width * dpr);
    canvas.height = Math.ceil(rect.height * dpr);

    const uniforms: GlassUniforms = {
      panelSize: [rect.width * dpr, rect.height * dpr],
      panelOffset: [rect.left * dpr, rect.top * dpr],
      blurRadius,
      refractionStrength,
      specularIntensity,
      chromaticAberration,
      tintOpacity,
      tintColor,
      lightPosition: [0.5, 0.3],
    };

    managerRef.current.render(canvas, uniforms);
    rafRef.current = requestAnimationFrame(renderGlassFrame);
  }, [
    blurRadius,
    refractionStrength,
    specularIntensity,
    chromaticAberration,
    tintOpacity,
    tintColor,
  ]);

  useEffect(() => {
    if (!enabled) return;

    // Check for prefers-reduced-motion
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (motionQuery.matches) return;

    const manager = getSharedManager();
    if (!manager) return;

    managerRef.current = manager;
    setWebglAvailable(true);

    // Initial capture and render
    captureBackground();
    rafRef.current = requestAnimationFrame(renderFrame);

    // Re-capture on scroll/resize (debounced)
    let debounceTimer: ReturnType<typeof setTimeout>;
    const handleChange = () => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(captureBackground, 200);
    };

    window.addEventListener("scroll", handleChange, { passive: true });
    window.addEventListener("resize", handleChange, { passive: true });

    return () => {
      cancelAnimationFrame(rafRef.current);
      clearTimeout(debounceTimer);
      window.removeEventListener("scroll", handleChange);
      window.removeEventListener("resize", handleChange);
      releaseSharedManager();
      managerRef.current = null;
      setWebglAvailable(false);
    };
  }, [enabled, captureBackground, renderFrame]);

  return { panelRef, canvasRef, webglAvailable };
}
