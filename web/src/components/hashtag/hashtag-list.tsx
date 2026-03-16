"use client";

import { Badge } from "@/components/ui/badge";
import { CopyButton } from "@/components/shared/copy-button";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { cn } from "@/lib/utils";
import type { GeneratedHashtag } from "@/types/caption";

const categoryColors: Record<string, string> = {
  niche: "bg-purple-500/10 text-purple-500 border-purple-500/30",
  broad: "bg-blue-500/10 text-blue-500 border-blue-500/30",
  trending: "bg-orange-500/10 text-orange-500 border-orange-500/30",
  branded: "bg-green-500/10 text-green-500 border-green-500/30",
};

interface HashtagListProps {
  hashtags: GeneratedHashtag[];
}

export function HashtagList({ hashtags }: HashtagListProps) {
  const allHashtags = hashtags.map((h) => `#${h.tag}`).join(" ");

  const groupedHashtags = hashtags.reduce(
    (acc, h) => {
      if (!acc[h.category]) acc[h.category] = [];
      acc[h.category].push(h);
      return acc;
    },
    {} as Record<string, GeneratedHashtag[]>
  );

  const handleCopyAll = async () => {
    await navigator.clipboard.writeText(allHashtags);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium">Hashtags ({hashtags.length})</h4>
        <Button variant="outline" size="sm" onClick={handleCopyAll}>
          <Copy className="h-3 w-3 mr-1" />
          Copy All
        </Button>
      </div>

      {Object.entries(groupedHashtags).map(([category, tags]) => (
        <div key={category}>
          <div className="flex items-center gap-2 mb-2">
            <Badge
              variant="outline"
              className={cn("text-xs capitalize", categoryColors[category])}
            >
              {category}
            </Badge>
          </div>
          <div className="flex flex-wrap gap-2">
            {tags
              .sort((a, b) => b.relevancy - a.relevancy)
              .map((hashtag, i) => (
                <button
                  key={i}
                  onClick={() =>
                    navigator.clipboard.writeText(`#${hashtag.tag}`)
                  }
                  className={cn(
                    "inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-sm border transition-colors hover:bg-accent cursor-pointer",
                    categoryColors[hashtag.category] || "border-border"
                  )}
                >
                  <span>#{hashtag.tag}</span>
                  <span className="text-xs opacity-60">
                    {Math.round(hashtag.relevancy * 100)}%
                  </span>
                </button>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
}
