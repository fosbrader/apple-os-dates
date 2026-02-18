interface PlatformBadgeProps {
  name: string;
  color: string;
  size?: "sm" | "md" | "lg";
}

export function PlatformBadge({
  name,
  color,
  size = "md",
}: PlatformBadgeProps) {
  const sizeClass =
    size === "sm"
      ? "text-[0.625rem] px-2 py-0.5"
      : size === "lg"
        ? "text-sm px-4 py-1.5"
        : "text-xs px-2.5 py-1";

  return (
    <span
      className={`badge badge-platform ${sizeClass}`}
      style={{ "--platform-color": color } as React.CSSProperties}
    >
      {name}
    </span>
  );
}
