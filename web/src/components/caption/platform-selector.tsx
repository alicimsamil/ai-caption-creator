"use client";

import { useTranslations } from "next-intl";
import { Instagram, Music2, Twitter, Linkedin, Facebook, Youtube, Pin } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Platform } from "@/types/platform";

const platformIcons: Record<Platform, React.ElementType> = {
  instagram: Instagram,
  tiktok: Music2,
  twitter: Twitter,
  linkedin: Linkedin,
  facebook: Facebook,
  youtube: Youtube,
  pinterest: Pin,
};

const platformColors: Record<Platform, string> = {
  instagram: "hover:border-pink-500 data-[active=true]:border-pink-500 data-[active=true]:bg-pink-500/10",
  tiktok: "hover:border-cyan-500 data-[active=true]:border-cyan-500 data-[active=true]:bg-cyan-500/10",
  twitter: "hover:border-blue-400 data-[active=true]:border-blue-400 data-[active=true]:bg-blue-400/10",
  linkedin: "hover:border-blue-600 data-[active=true]:border-blue-600 data-[active=true]:bg-blue-600/10",
  facebook: "hover:border-blue-500 data-[active=true]:border-blue-500 data-[active=true]:bg-blue-500/10",
  youtube: "hover:border-red-500 data-[active=true]:border-red-500 data-[active=true]:bg-red-500/10",
  pinterest: "hover:border-red-600 data-[active=true]:border-red-600 data-[active=true]:bg-red-600/10",
};

interface PlatformSelectorProps {
  selected: Platform;
  onSelect: (platform: Platform) => void;
}

export function PlatformSelector({ selected, onSelect }: PlatformSelectorProps) {
  const t = useTranslations("platforms");
  const platforms: Platform[] = [
    "instagram", "tiktok", "twitter", "linkedin", "facebook", "youtube", "pinterest",
  ];

  return (
    <div className="grid grid-cols-4 md:grid-cols-7 gap-2">
      {platforms.map((platform) => {
        const Icon = platformIcons[platform];
        const isActive = selected === platform;
        return (
          <button
            key={platform}
            data-active={isActive}
            onClick={() => onSelect(platform)}
            className={cn(
              "flex flex-col items-center gap-1.5 p-3 rounded-lg border-2 border-transparent transition-all",
              platformColors[platform],
              isActive && "ring-1 ring-offset-1 ring-offset-background"
            )}
          >
            <Icon className="h-5 w-5" />
            <span className="text-xs font-medium">{t(platform)}</span>
          </button>
        );
      })}
    </div>
  );
}
