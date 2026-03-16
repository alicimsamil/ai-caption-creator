"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import {
  Sparkles,
  LayoutTemplate,
  History,
  Heart,
  TrendingUp,
  Calendar,
  Settings,
  PanelLeftClose,
  PanelLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const navItems = [
  { href: "/generate", icon: Sparkles, labelKey: "generate" },
  { href: "/templates", icon: LayoutTemplate, labelKey: "templates" },
  { href: "/history", icon: History, labelKey: "history" },
  { href: "/favorites", icon: Heart, labelKey: "favorites" },
  { href: "/trending", icon: TrendingUp, labelKey: "trending" },
  { href: "/calendar", icon: Calendar, labelKey: "calendar" },
  { href: "/settings", icon: Settings, labelKey: "settings" },
];

export function AppSidebar() {
  const pathname = usePathname();
  const t = useTranslations("nav");
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        "hidden md:flex flex-col border-r bg-card h-screen sticky top-0 transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div className="p-4 flex items-center justify-between border-b">
        {!collapsed && (
          <Link href="/" className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            <span className="font-bold text-lg">CaptionAI</span>
          </Link>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className={cn(collapsed && "mx-auto")}
        >
          {collapsed ? (
            <PanelLeft className="h-4 w-4" />
          ) : (
            <PanelLeftClose className="h-4 w-4" />
          )}
        </Button>
      </div>

      <nav className="flex-1 p-2 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname.includes(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                collapsed && "justify-center px-2"
              )}
            >
              <item.icon className="h-5 w-5 flex-shrink-0" />
              {!collapsed && <span>{t(item.labelKey)}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t">
        {!collapsed && (
          <div className="text-xs text-muted-foreground text-center">
            Powered by Ollama
          </div>
        )}
      </div>
    </aside>
  );
}
