"use client";

import { useState } from "react";
import { Heart, Edit3, RefreshCw } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { CopyButton } from "@/components/shared/copy-button";
import { CharCounter } from "./char-counter";
import { cn } from "@/lib/utils";
import type { GeneratedCaption } from "@/types/caption";
import type { Platform } from "@/types/platform";
import { PLATFORMS } from "@/lib/platform-config";

interface CaptionResultProps {
  caption: GeneratedCaption;
  index: number;
  onFavorite?: (caption: GeneratedCaption) => void;
  onRefine?: (caption: GeneratedCaption, instruction: string) => void;
}

export function CaptionResult({
  caption,
  index,
  onFavorite,
  onRefine,
}: CaptionResultProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [refineInstruction, setRefineInstruction] = useState("");
  const [isFavorite, setIsFavorite] = useState(caption.isFavorite || false);
  const platformConfig = PLATFORMS.find((p) => p.id === caption.platform);
  const charLimit = platformConfig?.charLimit || 2200;

  const handleFavorite = () => {
    setIsFavorite(!isFavorite);
    onFavorite?.(caption);
  };

  const handleRefine = () => {
    if (refineInstruction.trim()) {
      onRefine?.(caption, refineInstruction);
      setRefineInstruction("");
      setIsEditing(false);
    }
  };

  return (
    <Card className="group hover:border-primary/30 transition-colors">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-2 mb-3">
          <Badge variant="secondary" className="text-xs">
            Caption {index + 1}
          </Badge>
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <CopyButton text={caption.text} />
            <Button
              variant="ghost"
              size="icon"
              onClick={handleFavorite}
              className={cn(isFavorite && "text-red-500")}
            >
              <Heart
                className={cn("h-4 w-4", isFavorite && "fill-current")}
              />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsEditing(!isEditing)}
            >
              <Edit3 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <p className="text-sm leading-relaxed whitespace-pre-wrap mb-3">
          {caption.text}
        </p>

        <div className="flex items-center gap-2 mb-2">
          {caption.hasEmojis && (
            <Badge variant="outline" className="text-xs">
              Emoji
            </Badge>
          )}
          {caption.hasCta && (
            <Badge variant="outline" className="text-xs">
              CTA
            </Badge>
          )}
        </div>

        <CharCounter current={caption.charCount} limit={charLimit} />

        {caption.hook && (
          <div className="mt-3 space-y-2 border-t pt-3">
            <div>
              <span className="text-xs font-medium text-muted-foreground">Hook:</span>
              <p className="text-sm">{caption.hook}</p>
            </div>
            {caption.body && (
              <div>
                <span className="text-xs font-medium text-muted-foreground">Body:</span>
                <p className="text-sm">{caption.body}</p>
              </div>
            )}
            {caption.cta && (
              <div>
                <span className="text-xs font-medium text-muted-foreground">CTA:</span>
                <p className="text-sm">{caption.cta}</p>
              </div>
            )}
          </div>
        )}

        {isEditing && (
          <div className="mt-3 space-y-2 border-t pt-3">
            <Textarea
              value={refineInstruction}
              onChange={(e) => setRefineInstruction(e.target.value)}
              placeholder="e.g., make it shorter, add emojis, change tone..."
              className="text-sm"
              rows={2}
            />
            <div className="flex gap-2">
              <Button size="sm" onClick={handleRefine}>
                <RefreshCw className="h-3 w-3 mr-1" />
                Refine
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
