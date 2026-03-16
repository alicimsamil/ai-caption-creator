"use client";

import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import type { Tone } from "@/types/platform";

const toneEmojis: Record<Tone, string> = {
  professional: "💼",
  casual: "😊",
  funny: "😂",
  inspirational: "✨",
  educational: "📚",
  motivational: "💪",
  storytelling: "📖",
  provocative: "🔥",
};

interface ToneSelectorProps {
  selected: Tone;
  onSelect: (tone: Tone) => void;
}

export function ToneSelector({ selected, onSelect }: ToneSelectorProps) {
  const t = useTranslations("tones");
  const tones: Tone[] = [
    "professional", "casual", "funny", "inspirational",
    "educational", "motivational", "storytelling", "provocative",
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {tones.map((tone) => (
        <button
          key={tone}
          onClick={() => onSelect(tone)}
          className={cn(
            "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-colors border",
            selected === tone
              ? "bg-primary text-primary-foreground border-primary"
              : "bg-secondary text-secondary-foreground border-transparent hover:border-primary/50"
          )}
        >
          <span>{toneEmojis[tone]}</span>
          <span>{t(tone)}</span>
        </button>
      ))}
    </div>
  );
}
