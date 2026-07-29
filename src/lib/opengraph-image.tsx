import { ImageResponse } from "next/og";
import { siteHost } from "@/lib/site";

export const openGraphImageSize = { width: 1200, height: 630 };

const PLATFORMS = [
  { name: "iOS", color: "#1685FF" },
  { name: "iPadOS", color: "#7069FF" },
  { name: "macOS", color: "#FF9F2E" },
  { name: "watchOS", color: "#FF554D" },
  { name: "tvOS", color: "#4BC8EA" },
  { name: "visionOS", color: "#C273FF" },
];

export function createOpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          position: "relative",
          display: "flex",
          width: "100%",
          height: "100%",
          overflow: "hidden",
          background: "#0B0D0F",
          color: "#F4F1E8",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            opacity: 0.2,
            backgroundImage:
              "linear-gradient(rgba(86,99,108,.32) 1px, transparent 1px), linear-gradient(90deg, rgba(86,99,108,.32) 1px, transparent 1px)",
            backgroundSize: "72px 72px",
          }}
        />

        <div
          style={{
            position: "absolute",
            top: "-360px",
            left: "120px",
            display: "flex",
            width: "820px",
            height: "820px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(216,255,98,.12), transparent 64%)",
          }}
        />

        <div
          style={{
            position: "relative",
            display: "flex",
            width: "100%",
            height: "100%",
            padding: "68px 72px 58px",
          }}
        >
          <div
            style={{
              display: "flex",
              width: "64%",
              flexDirection: "column",
              justifyContent: "space-between",
              paddingRight: "58px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "15px",
              }}
            >
              <div
                style={{
                  position: "relative",
                  display: "flex",
                  width: "38px",
                  height: "38px",
                  alignItems: "center",
                  justifyContent: "center",
                  border: "1px solid #5C6872",
                  borderRadius: "50%",
                }}
              >
                <div
                  style={{
                    width: "7px",
                    height: "7px",
                    borderRadius: "50%",
                    background: "#F4F1E8",
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    top: "-4px",
                    width: "8px",
                    height: "8px",
                    borderRadius: "50%",
                    background: "#D8FF62",
                  }}
                />
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "baseline",
                  gap: "7px",
                  fontSize: "24px",
                  letterSpacing: "-0.04em",
                }}
              >
                <span style={{ color: "#858B8F" }}>Beta</span>
                <strong>Cadence</strong>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column" }}>
              <p
                style={{
                  margin: "0 0 20px",
                  color: "#8BB5FF",
                  fontSize: "14px",
                  fontWeight: 700,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                }}
              >
                Apple OS release intelligence
              </p>
              <h1
                style={{
                  margin: 0,
                  fontFamily: "Georgia, serif",
                  fontSize: "78px",
                  fontWeight: 400,
                  lineHeight: 0.96,
                  letterSpacing: "-0.055em",
                }}
              >
                Every beta.
                <br />
                <span style={{ color: "#858B8F" }}>Every beat.</span>
              </h1>
              <p
                style={{
                  maxWidth: "580px",
                  margin: "27px 0 0",
                  color: "#B8B7B1",
                  fontSize: "21px",
                  lineHeight: 1.45,
                }}
              >
                Release history, active cycles, and evidence-based forecast
                ranges across the Apple OS ecosystem.
              </p>
            </div>

            <p
              style={{
                margin: 0,
                color: "#858B8F",
                fontSize: "14px",
                letterSpacing: "0.08em",
              }}
            >
              {siteHost} · INDEPENDENT &amp; UNOFFICIAL
            </p>
          </div>

          <div
            style={{
              display: "flex",
              width: "36%",
              flexDirection: "column",
              alignSelf: "stretch",
              border: "1px solid #293138",
              borderRadius: "24px",
              background: "rgba(17,21,25,.84)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "22px 24px",
                borderBottom: "1px solid #293138",
                color: "#858B8F",
                fontSize: "12px",
                fontWeight: 700,
                letterSpacing: "0.12em",
              }}
            >
              <span>PLATFORM INDEX</span>
              <span
                style={{
                  width: "7px",
                  height: "7px",
                  borderRadius: "50%",
                  background: "#54D982",
                }}
              />
            </div>
            <div
              style={{
                display: "flex",
                flex: 1,
                flexDirection: "column",
              }}
            >
              {PLATFORMS.map((platform, index) => (
                <div
                  key={platform.name}
                  style={{
                    display: "flex",
                    flex: 1,
                    alignItems: "center",
                    gap: "15px",
                    padding: "0 24px",
                    borderBottom:
                      index === PLATFORMS.length - 1
                        ? "none"
                        : "1px solid #293138",
                  }}
                >
                  <span
                    style={{
                      width: "9px",
                      height: "9px",
                      borderRadius: "50%",
                      background: platform.color,
                    }}
                  />
                  <strong style={{ fontSize: "18px" }}>{platform.name}</strong>
                  <span
                    style={{
                      marginLeft: "auto",
                      color: "#858B8F",
                      fontSize: "10px",
                      fontWeight: 700,
                      letterSpacing: "0.12em",
                    }}
                  >
                    VIEW
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    ),
    { ...openGraphImageSize },
  );
}
