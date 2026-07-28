"use client";

import type { ReactNode } from "react";
import { sendAnalyticsEvent } from "@/lib/analytics";

export function TrackedReleaseNotesLink({
  href,
  platform,
  version,
  className,
  children,
}: {
  href: string;
  platform: string;
  version: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      onClick={() =>
        sendAnalyticsEvent("release_notes_click", { platform, version })
      }
    >
      {children}
    </a>
  );
}
