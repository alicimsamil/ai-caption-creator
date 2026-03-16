"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface PersonaPreset {
  emoji: string;
  name: string;
  description: string;
}

const PERSONA_PRESETS: PersonaPreset[] = [
  {
    emoji: "👗",
    name: "Gen-Z Fashion Enthusiast",
    description: "Trendy, uses slang, loves aesthetic content",
  },
  {
    emoji: "🏪",
    name: "Small Business Owner",
    description: "Authentic, community-focused, value-driven",
  },
  {
    emoji: "🚀",
    name: "Tech Startup Founder",
    description: "Innovative, data-driven, growth-minded",
  },
  {
    emoji: "💪",
    name: "Fitness Coach",
    description: "Motivational, energetic, results-oriented",
  },
  {
    emoji: "🍳",
    name: "Food Blogger",
    description: "Passionate, descriptive, sensory language",
  },
  {
    emoji: "✈️",
    name: "Travel Influencer",
    description: "Adventurous, visual storyteller, wanderlust",
  },
  {
    emoji: "📊",
    name: "B2B SaaS Marketer",
    description: "Professional, ROI-focused, thought leader",
  },
  {
    emoji: "👶",
    name: "Mom/Parent Blogger",
    description: "Relatable, warm, family-oriented",
  },
  {
    emoji: "🏠",
    name: "Real Estate Agent",
    description: "Local expert, trustworthy, market-savvy",
  },
  {
    emoji: "🎨",
    name: "Artist/Creative",
    description: "Expressive, unique perspective, visually inspired",
  },
];

interface PersonaPresetsProps {
  selected: string;
  onSelect: (persona: string) => void;
}

export function PersonaPresets({ selected, onSelect }: PersonaPresetsProps) {
  const [customPersona, setCustomPersona] = useState("");

  const handleCustomSubmit = () => {
    if (customPersona.trim()) {
      onSelect(customPersona.trim());
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">Audience Persona</h3>
        {selected && (
          <Badge variant="secondary" className="text-xs">
            {selected}
          </Badge>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
        {PERSONA_PRESETS.map((preset) => (
          <Card
            key={preset.name}
            className={cn(
              "cursor-pointer transition-all hover:border-primary/50 hover:bg-accent/50",
              selected === preset.name &&
                "border-primary bg-primary/5 ring-1 ring-primary/20"
            )}
            onClick={() => onSelect(preset.name)}
          >
            <CardContent className="p-3 text-center">
              <div className="text-2xl mb-1">{preset.emoji}</div>
              <p className="text-xs font-medium leading-tight">{preset.name}</p>
              <p className="text-xs text-muted-foreground mt-1 leading-tight">
                {preset.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex items-center gap-2">
        <input
          type="text"
          value={customPersona}
          onChange={(e) => setCustomPersona(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleCustomSubmit();
          }}
          placeholder="Or type a custom persona..."
          className="flex-1 h-9 rounded-md border border-input bg-background px-3 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        />
        <Button
          variant="outline"
          size="sm"
          onClick={handleCustomSubmit}
          disabled={!customPersona.trim()}
        >
          Apply
        </Button>
      </div>
    </div>
  );
}
