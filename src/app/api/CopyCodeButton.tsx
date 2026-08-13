"use client";

import { useState } from "react";

interface CopyCodeButtonProps {
  value: string;
  label: string;
  className: string;
}

type CopyStatus = "idle" | "copied" | "failed";

export function copyStatusAnnouncement(
  status: CopyStatus,
  label: string,
): string {
  if (status === "copied") return `Copied ${label}.`;
  if (status === "failed") return `Could not copy ${label}.`;
  return "";
}

function copyWithFallback(value: string): boolean {
  const textarea = document.createElement("textarea");
  textarea.value = value;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.append(textarea);
  textarea.select();
  const copied = document.execCommand("copy");
  textarea.remove();
  return copied;
}

export function CopyCodeButton({
  value,
  label,
  className,
}: CopyCodeButtonProps) {
  const [status, setStatus] = useState<CopyStatus>("idle");

  async function copy() {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(value);
      } else if (!copyWithFallback(value)) {
        throw new Error("Copy command failed");
      }
      setStatus("copied");
    } catch {
      setStatus("failed");
    }
  }

  const statusText =
    status === "copied" ? "Copied" : status === "failed" ? "Copy failed" : "Copy";

  return (
    <>
      <button
        type="button"
        className={className}
        onClick={copy}
        aria-label={`Copy ${label}`}
      >
        {statusText}
      </button>
      <span
        className="sr-only"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        {copyStatusAnnouncement(status, label)}
      </span>
    </>
  );
}
