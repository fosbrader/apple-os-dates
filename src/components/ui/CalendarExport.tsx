"use client";

import type { BetaMilestone } from "@/lib/types";

interface CalendarExportProps {
  milestones: BetaMilestone[];
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
      `UID:${versionName}-${m.label}-${date}@apple-release-tracker`,
      "END:VEVENT",
    ]
      .filter(Boolean)
      .join("\r\n");
  });

  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Apple Release Tracker//EN",
    `X-WR-CALNAME:${versionName} Betas`,
    ...events,
    "END:VCALENDAR",
  ].join("\r\n");
}

export function CalendarExport({ milestones, versionName }: CalendarExportProps) {
  function handleExport() {
    const ics = generateICS(milestones, versionName);
    const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${versionName.replace(/\s+/g, "-").toLowerCase()}-betas.ics`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <button
      onClick={handleExport}
      className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg surface text-[var(--accent)] hover:bg-[var(--bg-subtle)] transition-colors"
    >
      Export to Calendar (.ics)
    </button>
  );
}
