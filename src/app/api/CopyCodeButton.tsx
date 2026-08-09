"use client";

import { useState } from "react";

interface CopyCodeButtonProps {
  value: string;
  label: string;
  className: string;
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
  const [status, setStatus] = useState<"idle" | "copied" | "failed">("idle");

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
    <button
      type="button"
      className={className}
      onClick={copy}
      aria-label={`Copy ${label}`}
    >
      {statusText}
    </button>
  );
}
