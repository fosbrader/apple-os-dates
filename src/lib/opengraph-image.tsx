import { ImageResponse } from "next/og";
import { siteHost } from "@/lib/site";

export const openGraphImageSize = { width: 1200, height: 630 };

const PLATFORM_SIGNALS = [
  { name: "iOS", color: "#2F7CF6" },
  { name: "iPadOS", color: "#5B52E8" },
  { name: "macOS", color: "#A44CE6" },
  { name: "tvOS", color: "#55C965" },
  { name: "visionOS", color: "#6D538E" },
  { name: "watchOS", color: "#F04B43" },
];

export function createOpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          width: "100%",
          height: "100%",
          flexDirection: "column",
          padding: "50px 58px 46px",
          background: "#111210",
          color: "#EFEEE8",
          fontFamily: "Arial, Helvetica, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            height: "40px",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "14px",
            }}
          >
            <strong
              style={{
                fontSize: "24px",
                letterSpacing: "-0.04em",
              }}
            >
              Beta Cadence
            </strong>
            <span
              style={{
                width: "1px",
                height: "22px",
                margin: "0 3px",
                background: "#343632",
              }}
            />
            <span
              style={{
                color: "#979891",
                fontFamily: "Courier New, monospace",
                fontSize: "12px",
                letterSpacing: "0.08em",
              }}
            >
              APPLE OS RELEASE INDEX
            </span>
          </div>
          <span
            style={{
              color: "#979891",
              fontFamily: "Courier New, monospace",
              fontSize: "12px",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            {siteHost}
          </span>
        </div>

        <div
          style={{
            display: "flex",
            flex: 1,
            marginTop: "34px",
            padding: "34px 0 30px",
            borderTop: "1px solid #5B5E57",
          }}
        >
          <div
            style={{
              display: "flex",
              width: "65%",
              flexDirection: "column",
              justifyContent: "center",
              paddingRight: "54px",
            }}
          >
            <p
              style={{
                margin: "0 0 17px",
                color: "#979891",
                fontFamily: "Courier New, monospace",
                fontSize: "13px",
                fontWeight: 700,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
              }}
            >
              Independent release index
            </p>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                margin: 0,
                fontSize: "66px",
                fontWeight: 700,
                lineHeight: 0.96,
                letterSpacing: "-0.058em",
              }}
            >
              <span>Apple OS beta and</span>
              <span>release dates</span>
            </div>
            <p
              style={{
                maxWidth: "640px",
                margin: "24px 0 0",
                color: "#BEBDB7",
                fontSize: "22px",
                lineHeight: 1.4,
              }}
            >
              Historical release milestones and methodology-backed forecasts.
            </p>
          </div>

          <div
            style={{
              display: "flex",
              width: "35%",
              flexDirection: "column",
              justifyContent: "center",
              paddingLeft: "38px",
              borderLeft: "1px solid #343632",
            }}
          >
            <p
              style={{
                margin: 0,
                color: "#979891",
                fontFamily: "Courier New, monospace",
                fontSize: "12px",
                fontWeight: 700,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
              }}
            >
              Forecast methodology
            </p>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                maxWidth: "340px",
                margin: "18px 0 0",
                fontSize: "31px",
                fontWeight: 650,
                lineHeight: 1.08,
                letterSpacing: "-0.04em",
              }}
            >
              <span>History-based</span>
              <span>release ranges</span>
            </div>

            <div
              style={{
                display: "flex",
                width: "100%",
                flexDirection: "column",
                marginTop: "55px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  color: "#979891",
                  fontFamily: "Courier New, monospace",
                  fontSize: "10px",
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                }}
              >
                <span>Earliest</span>
                <span>Median</span>
                <span>Latest</span>
              </div>
              <div
                style={{
                  position: "relative",
                  display: "flex",
                  width: "100%",
                  height: "28px",
                  alignItems: "center",
                  marginTop: "8px",
                }}
              >
                <span
                  style={{
                    position: "absolute",
                    right: 0,
                    left: 0,
                    height: "2px",
                    background: "#5B5E57",
                  }}
                />
                <span
                  style={{
                    position: "absolute",
                    left: 0,
                    width: "10px",
                    height: "10px",
                    border: "2px solid #BEBDB7",
                    borderRadius: "50%",
                    background: "#111210",
                  }}
                />
                <span
                  style={{
                    position: "absolute",
                    left: "50%",
                    width: "14px",
                    height: "14px",
                    borderRadius: "50%",
                    background: "#8BB5E8",
                    transform: "translateX(-50%)",
                  }}
                />
                <span
                  style={{
                    position: "absolute",
                    right: 0,
                    width: "10px",
                    height: "10px",
                    border: "2px solid #BEBDB7",
                    borderRadius: "50%",
                    background: "#111210",
                  }}
                />
              </div>
              <p
                style={{
                  margin: "14px 0 0",
                  color: "#979891",
                  fontFamily: "Courier New, monospace",
                  fontSize: "11px",
                  lineHeight: 1.45,
                }}
              >
                Comparable prior cycles · medians · backtests
              </p>
            </div>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            minHeight: "48px",
            alignItems: "flex-end",
            justifyContent: "space-between",
            paddingTop: "22px",
            borderTop: "1px solid #343632",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "20px",
            }}
          >
            {PLATFORM_SIGNALS.map((platform) => (
              <span
                key={platform.name}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "7px",
                  color: "#BEBDB7",
                  fontSize: "14px",
                  fontWeight: 600,
                }}
              >
                <i
                  style={{
                    width: "7px",
                    height: "7px",
                    borderRadius: "50%",
                    background: platform.color,
                  }}
                />
                {platform.name}
              </span>
            ))}
          </div>
          <span
            style={{
              color: "#979891",
              fontFamily: "Courier New, monospace",
              fontSize: "10px",
              letterSpacing: "0.04em",
            }}
          >
            INDEPENDENT · NOT AFFILIATED WITH APPLE
          </span>
        </div>
      </div>
    ),
    { ...openGraphImageSize },
  );
}
