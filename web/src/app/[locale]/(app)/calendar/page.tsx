"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Calendar as CalendarIcon, Plus, ChevronLeft, ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface CalendarEntry {
  id: string;
  title: string;
  platform: string;
  caption?: string;
  date: string;
  pillar?: string;
  status: "draft" | "scheduled" | "published";
}

const statusColors: Record<string, string> = {
  draft: "bg-yellow-500/10 text-yellow-500",
  scheduled: "bg-blue-500/10 text-blue-500",
  published: "bg-green-500/10 text-green-500",
};

export default function CalendarPage() {
  const t = useTranslations("calendar");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [entries] = useState<CalendarEntry[]>([]);

  const daysInMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  ).getDate();

  const firstDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  ).getDay();

  const monthName = currentDate.toLocaleString("default", { month: "long" });
  const year = currentDate.getFullYear();

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const blanks = Array.from({ length: firstDayOfMonth }, (_, i) => i);

  const getEntriesForDay = (day: number) => {
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return entries.filter((e) => e.date.startsWith(dateStr));
  };

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{t("title")}</h1>
          <p className="text-muted-foreground mt-1">{t("subtitle")}</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          {t("addEntry")}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="icon" onClick={prevMonth}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <CardTitle>
              {monthName} {year}
            </CardTitle>
            <Button variant="ghost" size="icon" onClick={nextMonth}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-px bg-border rounded-lg overflow-hidden">
            {dayNames.map((d) => (
              <div
                key={d}
                className="bg-muted p-2 text-center text-xs font-medium text-muted-foreground"
              >
                {d}
              </div>
            ))}
            {blanks.map((b) => (
              <div key={`blank-${b}`} className="bg-background p-2 min-h-[100px]" />
            ))}
            {days.map((day) => {
              const dayEntries = getEntriesForDay(day);
              const isToday =
                day === new Date().getDate() &&
                currentDate.getMonth() === new Date().getMonth() &&
                currentDate.getFullYear() === new Date().getFullYear();

              return (
                <div
                  key={day}
                  className={cn(
                    "bg-background p-2 min-h-[100px] border-t hover:bg-accent/50 transition-colors cursor-pointer",
                    isToday && "bg-primary/5"
                  )}
                >
                  <span
                    className={cn(
                      "text-sm font-medium",
                      isToday &&
                        "bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center"
                    )}
                  >
                    {day}
                  </span>
                  <div className="mt-1 space-y-1">
                    {dayEntries.map((entry) => (
                      <div
                        key={entry.id}
                        className={cn(
                          "text-xs px-1.5 py-0.5 rounded truncate",
                          statusColors[entry.status]
                        )}
                      >
                        {entry.title}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-4">
        {(["draft", "scheduled", "published"] as const).map((status) => (
          <div key={status} className="flex items-center gap-2">
            <div className={cn("w-3 h-3 rounded-full", statusColors[status])} />
            <span className="text-sm capitalize">{t(status)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
