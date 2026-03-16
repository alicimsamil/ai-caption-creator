"use client";

import { cn } from "@/lib/utils";

interface CharCounterProps {
  current: number;
  limit: number;
}

export function CharCounter({ current, limit }: CharCounterProps) {
  const percentage = (current / limit) * 100;
  const isOver = current > limit;
  const isNear = percentage > 80;

  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 rounded-full bg-secondary overflow-hidden">
        <div
          className={cn(
            "h-full rounded-full transition-all",
            isOver ? "bg-destructive" : isNear ? "bg-yellow-500" : "bg-primary"
          )}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>
      <span
        className={cn(
          "text-xs font-mono tabular-nums",
          isOver ? "text-destructive" : "text-muted-foreground"
        )}
      >
        {current}/{limit}
      </span>
    </div>
  );
}
