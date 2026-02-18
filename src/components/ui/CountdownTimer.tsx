"use client";

import { useState, useEffect } from "react";
import { differenceInDays, differenceInHours, differenceInMinutes, parseISO } from "date-fns";

interface CountdownTimerProps {
  targetDate: string;
  label?: string;
}

export function CountdownTimer({ targetDate, label }: CountdownTimerProps) {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(interval);
  }, []);

  const target = parseISO(targetDate);
  const days = differenceInDays(target, now);
  const hours = differenceInHours(target, now) % 24;
  const minutes = differenceInMinutes(target, now) % 60;
  const isPast = days < 0;

  return (
    <div className="text-center">
      {label && <p className="text-label mb-1">{label}</p>}
      {isPast ? (
        <p className="text-sm milestone-public font-medium">Released</p>
      ) : (
        <div className="flex gap-3 justify-center">
          <div>
            <span className="text-2xl font-bold font-mono tabular-nums">{days}</span>
            <span className="text-xs text-[var(--text-tertiary)] ml-0.5">d</span>
          </div>
          <div>
            <span className="text-2xl font-bold font-mono tabular-nums">{hours}</span>
            <span className="text-xs text-[var(--text-tertiary)] ml-0.5">h</span>
          </div>
          <div>
            <span className="text-2xl font-bold font-mono tabular-nums">{minutes}</span>
            <span className="text-xs text-[var(--text-tertiary)] ml-0.5">m</span>
          </div>
        </div>
      )}
    </div>
  );
}
