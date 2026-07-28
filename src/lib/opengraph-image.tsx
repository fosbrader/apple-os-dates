import { ImageResponse } from "next/og";
import { siteHost } from "@/lib/site";

export const openGraphImageSize = { width: 1200, height: 630 };

const PLATFORMS = [
  { name: "iOS", color: "#007AFF" },
  { name: "iPadOS", color: "#5856D6" },
  { name: "macOS", color: "#A855F7" },
  { name: "watchOS", color: "#FF3B30" },
  { name: "tvOS", color: "#34C759" },
  { name: "visionOS", color: "#6E5494" },
];

export function createOpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#09090b",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "system-ui, sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Subtle gradient orb */}
        <div
          style={{
            position: "absolute",
            top: "-120px",
            right: "-80px",
            width: "500px",
            height: "500px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(0,122,255,0.15) 0%, transparent 70%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-100px",
            left: "-60px",
            width: "400px",
            height: "400px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(168,85,247,0.1) 0%, transparent 70%)",
          }}
        />

        {/* Title */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "16px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              gap: "12px",
            }}
          >
            <span
              style={{
                fontSize: "28px",
                color: "rgba(255,255,255,0.4)",
                fontWeight: 400,
                letterSpacing: "0.05em",
              }}
            >
              Beta
            </span>
            <span
              style={{
                fontSize: "56px",
                color: "#ffffff",
                fontWeight: 700,
                letterSpacing: "-0.02em",
              }}
            >
              Cadence
            </span>
          </div>

          {/* Gradient line */}
          <div
            style={{
              width: "200px",
              height: "2px",
              background:
                "linear-gradient(90deg, transparent, rgba(0,122,255,0.6), rgba(168,85,247,0.6), transparent)",
            }}
          />

          {/* Subtitle */}
          <p
            style={{
              fontSize: "22px",
              color: "rgba(255,255,255,0.5)",
              fontWeight: 400,
              marginTop: "8px",
            }}
          >
            Apple OS release history and forecast ranges
          </p>
        </div>

        {/* Platform pills */}
        <div
          style={{
            display: "flex",
            gap: "12px",
            marginTop: "48px",
          }}
        >
          {PLATFORMS.map((p) => (
            <div
              key={p.name}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "8px 20px",
                borderRadius: "999px",
                border: `1px solid ${p.color}40`,
                background: `${p.color}15`,
              }}
            >
              <div
                style={{
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  background: p.color,
                }}
              />
              <span
                style={{
                  fontSize: "16px",
                  color: "rgba(255,255,255,0.7)",
                  fontWeight: 500,
                }}
              >
                {p.name}
              </span>
            </div>
          ))}
        </div>

        {/* Domain */}
        <p
          style={{
            position: "absolute",
            bottom: "32px",
            fontSize: "16px",
            color: "rgba(255,255,255,0.25)",
            letterSpacing: "0.05em",
          }}
        >
          {siteHost}
        </p>
      </div>
    ),
    { ...openGraphImageSize }
  );
}
