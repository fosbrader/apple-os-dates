import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";
import { siteHost } from "@/lib/site";
import type { ReleaseEventChannel } from "@/lib/types";

export const openGraphImageSize = { width: 1200, height: 630 };

/**
 * Per-release social cards render at 2x for crisp previews; every layout
 * value below goes through px() so the template reads in 1x units.
 */
const SCALE = 2;
export const releaseOpenGraphImageSize = {
  width: 1200 * SCALE,
  height: 630 * SCALE,
};

const px = (value: number) => `${value * SCALE}px`;

const SERIF = "Source Serif 4";
const MONO = "IBM Plex Mono";

const FONT_DIR = path.join(process.cwd(), "src", "assets", "fonts");

interface OgFont {
  name: string;
  data: ArrayBuffer;
  weight: 400 | 700;
  style: "normal";
}

let releaseOgFontsPromise: Promise<OgFont[]> | null = null;

async function readFont(file: string): Promise<ArrayBuffer> {
  const buffer = await readFile(path.join(FONT_DIR, file));
  return buffer.buffer.slice(
    buffer.byteOffset,
    buffer.byteOffset + buffer.byteLength,
  );
}

function loadReleaseOgFonts(): Promise<OgFont[]> {
  releaseOgFontsPromise ??= Promise.all([
    readFont("source-serif-4-latin-400-normal.woff").then((data) => ({
      name: SERIF,
      data,
      weight: 400 as const,
      style: "normal" as const,
    })),
    readFont("source-serif-4-latin-700-normal.woff").then((data) => ({
      name: SERIF,
      data,
      weight: 700 as const,
      style: "normal" as const,
    })),
    readFont("ibm-plex-mono-latin-400-normal.woff").then((data) => ({
      name: MONO,
      data,
      weight: 400 as const,
      style: "normal" as const,
    })),
    readFont("ibm-plex-mono-latin-700-normal.woff").then((data) => ({
      name: MONO,
      data,
      weight: 700 as const,
      style: "normal" as const,
    })),
  ]);

  return releaseOgFontsPromise;
}

const RELEASE_OG_PLATFORM_COLORS: Record<string, string> = {
  iOS: "#2F7CF6",
  iPadOS: "#5B52E8",
  macOS: "#A44CE6",
  tvOS: "#55C965",
  visionOS: "#6D538E",
  watchOS: "#F04B43",
};

export type ReleaseOgDotKind = "beta" | "rc" | "public";

export interface ReleaseOgCycleDot {
  label: string;
  kind: ReleaseOgDotKind;
  current?: boolean;
}

export interface ReleaseOgProps {
  platformName: string;
  /** Everything after the platform in the hero line, e.g. "26.3" or "Build 23D123". */
  heroSuffix: string;
  statusLine: string;
  detailLine: string;
  cycle: ReleaseOgCycleDot[];
}

export function releaseOgDotKind(
  channel: ReleaseEventChannel,
): ReleaseOgDotKind {
  if (channel === "public") return "public";
  if (channel === "releaseCandidate" || channel === "gm") return "rc";
  return "beta";
}

export async function createReleaseOpenGraphImage({
  platformName,
  heroSuffix,
  statusLine,
  detailLine,
  cycle,
}: ReleaseOgProps) {
  const fonts = await loadReleaseOgFonts();
  const accent =
    RELEASE_OG_PLATFORM_COLORS[platformName] ?? "#8BB5E8";
  const title = `${platformName} ${heroSuffix}`.trim();
  // Fit the serif hero on one line within the ~1084px content width.
  const titleSize = Math.max(
    58,
    Math.min(132, Math.floor(1084 / (0.58 * title.length))),
  );
  const firstDot = cycle[0];
  const lastDot = cycle[cycle.length - 1];

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          width: "100%",
          height: "100%",
          flexDirection: "column",
          padding: `${px(50)} ${px(58)} ${px(46)}`,
          background: "#111210",
          color: "#EFEEE8",
          fontFamily: SERIF,
        }}
      >
        <div
          style={{
            display: "flex",
            height: px(40),
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: px(14),
            }}
          >
            <strong
              style={{
                fontSize: px(26),
                fontWeight: 700,
                letterSpacing: "-0.01em",
              }}
            >
              Version Record
            </strong>
            <span
              style={{
                width: px(1),
                height: px(22),
                margin: `0 ${px(3)}`,
                background: "#343632",
              }}
            />
            <span
              style={{
                color: "#979891",
                fontFamily: MONO,
                fontSize: px(12),
                letterSpacing: "0.08em",
              }}
            >
              INDEPENDENT RELEASE ARCHIVE
            </span>
          </div>
          <span
            style={{
              color: "#979891",
              fontFamily: MONO,
              fontSize: px(12),
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
            flexDirection: "column",
            justifyContent: "center",
            marginTop: px(30),
            padding: `${px(10)} 0 ${px(12)}`,
            borderTop: `${px(1)} solid #5B5E57`,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: px(12),
              color: "#979891",
              fontFamily: MONO,
              fontSize: px(15),
              fontWeight: 700,
              letterSpacing: "0.12em",
            }}
          >
            <span
              style={{
                width: px(12),
                height: px(12),
                borderRadius: "50%",
                background: accent,
              }}
            />
            APPLE · RELEASE RECORD
          </div>
          <div
            style={{
              display: "flex",
              margin: `${px(14)} 0 0`,
              fontSize: px(titleSize),
              fontWeight: 700,
              lineHeight: 1,
              letterSpacing: "-0.02em",
              whiteSpace: "nowrap",
            }}
          >
            {title}
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              gap: px(18),
              margin: `${px(26)} 0 0`,
            }}
          >
            <span
              style={{
                fontSize: px(30),
                fontWeight: 700,
                color: "#EFEEE8",
              }}
            >
              {statusLine}
            </span>
            <span
              style={{
                fontFamily: MONO,
                fontSize: px(19),
                color: "#979891",
              }}
            >
              {detailLine}
            </span>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            paddingTop: px(26),
            borderTop: `${px(1)} solid #343632`,
          }}
        >
          <div
            style={{
              position: "relative",
              display: "flex",
              width: "100%",
              height: px(30),
              alignItems: "center",
            }}
          >
            <span
              style={{
                position: "absolute",
                right: 0,
                left: 0,
                height: px(2),
                background: "#5B5E57",
              }}
            />
            {cycle.map((dot, index) => {
              const position =
                cycle.length === 1
                  ? 0
                  : (index / (cycle.length - 1)) * 100;
              const emphasized = dot.current || dot.kind === "public";
              const isRc = dot.kind === "rc";
              const size = emphasized ? 22 : isRc ? 16 : 12;
              return (
                <span
                  key={index}
                  style={{
                    position: "absolute",
                    left: `${position}%`,
                    width: px(size),
                    height: px(size),
                    borderRadius: "50%",
                    background: emphasized
                      ? accent
                      : isRc
                        ? "#BEBDB7"
                        : "#111210",
                    border: emphasized
                      ? "none"
                      : `${px(2)} solid #979891`,
                    transform: `translateX(-${position > 0 ? (position === 100 ? 100 : 50) : 0}%)`,
                  }}
                />
              );
            })}
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: px(12),
              color: "#979891",
              fontFamily: MONO,
              fontSize: px(13),
              letterSpacing: "0.06em",
            }}
          >
            <span>{firstDot ? firstDot.label.toUpperCase() : ""}</span>
            <span style={{ color: "#BEBDB7" }}>
              {lastDot && lastDot !== firstDot
                ? lastDot.label.toUpperCase()
                : ""}
            </span>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: px(24),
            paddingTop: px(20),
            borderTop: `${px(1)} solid #343632`,
            color: "#979891",
            fontFamily: MONO,
            fontSize: px(11),
            letterSpacing: "0.05em",
          }}
        >
          <span>SOURCE-BACKED · EVERY DATE CITED · CORRECTIONS PUBLIC</span>
          <span>INDEPENDENT · NOT AFFILIATED WITH APPLE</span>
        </div>
      </div>
    ),
    { ...releaseOpenGraphImageSize, fonts },
  );
}

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
              Version Record
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
              INDEPENDENT RELEASE ARCHIVE
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
              Apple is the first catalog
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
              <span>Release histories,</span>
              <span>notes, and sources</span>
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
              A cited archive of versions, builds, changes, and corrections.
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
              Research tools
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
              <span>Searchable, sourced</span>
              <span>release records</span>
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
