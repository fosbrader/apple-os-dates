"use client";

import type { BetaMilestone } from "@/lib/types";
import { sendAnalyticsEvent } from "@/lib/analytics";

interface CalendarExportProps {
  milestones: BetaMilestone[];
  platform: string;
  version: string;
  versionName: string;
}

function formatICSDate(dateStr: string): string {
  return dateStr.replace(/-/g, "");
}

function generateICS(milestones: BetaMilestone[], versionName: string): string {
  const events = milestones.map((m) => {
    const date = formatICSDate(m.date);
    const nextDay = formatICSDate(
      new Date(new Date(m.date).getTime() + 86400000)
        .toISOString()
        .split("T")[0]
    );
    const summary = `${versionName} ${m.label}`;
    const description = m.note ? `Note: ${m.note}` : "";

    return [
      "BEGIN:VEVENT",
      `DTSTART;VALUE=DATE:${date}`,
      `DTEND;VALUE=DATE:${nextDay}`,
      `SUMMARY:${summary}`,
      description ? `DESCRIPTION:${description}` : "",
      `UID:${versionName}-${m.label}-${date}@versionrecord.com`,
      "END:VEVENT",
    ]
      .filter(Boolean)
      .join("\r\n");
  });

  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Version Record//EN",
    `X-WR-CALNAME:${versionName} Betas`,
    ...events,
    "END:VCALENDAR",
  ].join("\r\n");
}

export function CalendarExport({
  milestones,
  platform,
  version,
  versionName,
}: CalendarExportProps) {
  function handleExport() {
    const ics = generateICS(milestones, versionName);
    const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${versionName.replace(/\s+/g, "-").toLowerCase()}-betas.ics`;
    a.click();
    URL.revokeObjectURL(url);
    sendAnalyticsEvent("calendar_export", {
      platform,
      version,
      calendar_format: "ics",
    });
  }

  return (
    <button
      onClick={handleExport}
      type="button"
      className="button button--primary"
    >
      Export calendar
      <span aria-hidden="true">↓</span>
      <span className="sr-only">as an ICS file</span>
    </button>
  );
}
