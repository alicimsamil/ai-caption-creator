"use client";

import { useMemo } from "react";
import { TrendingUp, TrendingDown, BarChart3 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { GeneratedHashtag } from "@/types/caption";
import type { HashtagCategory } from "@/types/platform";

const competitionConfig: Record<
  HashtagCategory,
  { level: string; color: string; barColor: string; reach: string; barWidth: number }
> = {
  niche: {
    level: "Low",
    color: "text-green-500",
    barColor: "bg-green-500",
    reach: "~1K-10K",
    barWidth: 30,
  },
  branded: {
    level: "Low",
    color: "text-green-500",
    barColor: "bg-green-500",
    reach: "~1K-10K",
    barWidth: 25,
  },
  trending: {
    level: "Medium",
    color: "text-yellow-500",
    barColor: "bg-yellow-500",
    reach: "~10K-100K",
    barWidth: 60,
  },
  broad: {
    level: "High",
    color: "text-red-500",
    barColor: "bg-red-500",
    reach: "~100K-1M",
    barWidth: 90,
  },
};

interface HashtagPerformanceProps {
  hashtags: GeneratedHashtag[];
}

export function HashtagPerformance({ hashtags }: HashtagPerformanceProps) {
  const mix = useMemo(() => {
    if (hashtags.length === 0) return { niche: 0, broad: 0, trending: 0, branded: 0 };

    const counts: Record<HashtagCategory, number> = {
      niche: 0,
      broad: 0,
      trending: 0,
      branded: 0,
    };
    hashtags.forEach((h) => {
      counts[h.category]++;
    });

    const total = hashtags.length;
    return {
      niche: Math.round((counts.niche / total) * 100),
      broad: Math.round((counts.broad / total) * 100),
      trending: Math.round((counts.trending / total) * 100),
      branded: Math.round((counts.branded / total) * 100),
    };
  }, [hashtags]);

  const recommendation = useMemo(() => {
    if (hashtags.length === 0) return null;

    const nicheAndBranded = mix.niche + mix.branded;
    const hasGoodMix =
      nicheAndBranded >= 30 &&
      nicheAndBranded <= 60 &&
      mix.broad <= 40 &&
      mix.trending >= 10;

    return {
      isGood: hasGoodMix,
      message: hasGoodMix
        ? "Good hashtag mix! Balanced for reach and discoverability."
        : "Consider adjusting your mix. Aim for 30-60% niche/branded, 20-40% broad, and 10-30% trending.",
    };
  }, [hashtags.length, mix]);

  if (hashtags.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center text-sm text-muted-foreground">
          No hashtags to analyze. Generate some hashtags first.
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <BarChart3 className="h-4 w-4" />
        <h3 className="text-sm font-medium">Performance Simulator</h3>
      </div>

      <div className="space-y-2">
        {hashtags
          .sort((a, b) => b.relevancy - a.relevancy)
          .map((hashtag, i) => {
            const config = competitionConfig[hashtag.category];
            return (
              <Card key={i} className="hover:border-primary/20 transition-colors">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">#{hashtag.tag}</span>
                      <Badge
                        variant="outline"
                        className={cn("text-xs", config.color)}
                      >
                        {config.level}
                      </Badge>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {config.reach}
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-secondary overflow-hidden">
                    <div
                      className={cn(
                        "h-full rounded-full transition-all duration-500",
                        config.barColor
                      )}
                      style={{
                        width: `${Math.round(hashtag.relevancy * config.barWidth)}%`,
                      }}
                    />
                  </div>
                </CardContent>
              </Card>
            );
          })}
      </div>

      <Card>
        <CardContent className="p-4 space-y-3">
          <h4 className="text-sm font-medium">Mix Summary</h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <MixStat label="Niche" value={mix.niche} color="text-purple-500" />
            <MixStat label="Broad" value={mix.broad} color="text-blue-500" />
            <MixStat label="Trending" value={mix.trending} color="text-orange-500" />
            <MixStat label="Branded" value={mix.branded} color="text-green-500" />
          </div>

          <p className="text-xs text-muted-foreground">
            Optimal mix: {mix.niche}% niche, {mix.broad}% broad, {mix.trending}%
            trending
          </p>

          {recommendation && (
            <Badge
              variant="outline"
              className={cn(
                "text-xs",
                recommendation.isGood
                  ? "bg-green-500/10 text-green-500 border-green-500/30"
                  : "bg-yellow-500/10 text-yellow-500 border-yellow-500/30"
              )}
            >
              {recommendation.isGood ? (
                <TrendingUp className="h-3 w-3 mr-1" />
              ) : (
                <TrendingDown className="h-3 w-3 mr-1" />
              )}
              {recommendation.message}
            </Badge>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

interface MixStatProps {
  label: string;
  value: number;
  color: string;
}

function MixStat({ label, value, color }: MixStatProps) {
  return (
    <div className="text-center">
      <p className={cn("text-lg font-semibold", color)}>{value}%</p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  );
}
