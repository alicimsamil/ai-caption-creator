"use client";

import { useState } from "react";
import { Trophy } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CopyButton } from "@/components/shared/copy-button";
import { cn } from "@/lib/utils";
import type { GeneratedCaption } from "@/types/caption";

interface ABVariantsProps {
  variantA: GeneratedCaption;
  variantB: GeneratedCaption;
  onSelectWinner?: (winner: "A" | "B") => void;
}

export function ABVariants({
  variantA,
  variantB,
  onSelectWinner,
}: ABVariantsProps) {
  const [winner, setWinner] = useState<"A" | "B" | null>(null);

  const handleSelectWinner = (variant: "A" | "B") => {
    setWinner(variant);
    onSelectWinner?.(variant);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">A/B Variant Comparison</h3>
        {winner && (
          <Badge className="bg-yellow-500/10 text-yellow-500 border-yellow-500/30">
            <Trophy className="h-3 w-3 mr-1" />
            Variant {winner} wins
          </Badge>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <VariantCard
          label="A"
          caption={variantA}
          isWinner={winner === "A"}
          onSelect={() => handleSelectWinner("A")}
        />
        <VariantCard
          label="B"
          caption={variantB}
          isWinner={winner === "B"}
          onSelect={() => handleSelectWinner("B")}
        />
      </div>
    </div>
  );
}

interface VariantCardProps {
  label: "A" | "B";
  caption: GeneratedCaption;
  isWinner: boolean;
  onSelect: () => void;
}

function VariantCard({ label, caption, isWinner, onSelect }: VariantCardProps) {
  return (
    <Card
      className={cn(
        "transition-colors",
        isWinner && "border-yellow-500/50 bg-yellow-500/5"
      )}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <Badge
            variant={label === "A" ? "default" : "secondary"}
            className="text-xs"
          >
            Variant {label}
          </Badge>
          <div className="flex items-center gap-1">
            <CopyButton text={caption.text} />
            <Button
              variant={isWinner ? "default" : "outline"}
              size="sm"
              onClick={onSelect}
              className={cn(
                "text-xs",
                isWinner && "bg-yellow-500 hover:bg-yellow-600 text-black"
              )}
            >
              <Trophy className="h-3 w-3 mr-1" />
              {isWinner ? "Winner" : "Pick"}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm leading-relaxed whitespace-pre-wrap">
          {caption.text}
        </p>

        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs">
            {caption.charCount} chars
          </Badge>
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

        {caption.hook && (
          <div className="space-y-2 border-t pt-3">
            <div>
              <span className="text-xs font-medium text-muted-foreground">
                Hook:
              </span>
              <p className="text-sm">{caption.hook}</p>
            </div>
            {caption.body && (
              <div>
                <span className="text-xs font-medium text-muted-foreground">
                  Body:
                </span>
                <p className="text-sm">{caption.body}</p>
              </div>
            )}
            {caption.cta && (
              <div>
                <span className="text-xs font-medium text-muted-foreground">
                  CTA:
                </span>
                <p className="text-sm">{caption.cta}</p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
