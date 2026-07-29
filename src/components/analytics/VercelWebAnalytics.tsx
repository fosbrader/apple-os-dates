"use client";

import { Analytics, type BeforeSendEvent } from "@vercel/analytics/next";
import { usePathname } from "next/navigation";

function isStudioPath(pathname: string) {
  return pathname === "/studio" || pathname.startsWith("/studio/");
}

function minimizePageView(event: BeforeSendEvent): BeforeSendEvent | null {
  let url: URL;

  try {
    url = new URL(event.url);
  } catch {
    return null;
  }

  if (isStudioPath(url.pathname)) {
    return null;
  }

  // Keep analytics useful for content decisions without retaining query
  // strings or fragments that could contain visitor-supplied values.
  url.search = "";
  url.hash = "";

  return {
    ...event,
    url: url.toString(),
  };
}

export function VercelWebAnalytics() {
  const pathname = usePathname();

  // Avoid loading the analytics script at all on a direct Studio visit.
  // beforeSend remains a backstop for unexpected client-side transitions.
  if (isStudioPath(pathname)) {
    return null;
  }

  return <Analytics beforeSend={minimizePageView} />;
}
