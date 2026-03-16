"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { TrendingUp, RefreshCw, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface TrendingHashtag {
  tag: string;
  category: string;
  relevancy: number;
  platform: string;
}

export default function TrendingPage() {
  const t = useTranslations("trending");
  const [hashtags, setHashtags] = useState<TrendingHashtag[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState("all");

  useEffect(() => {
    fetchTrending();
  }, []);

  const fetchTrending = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/trending");
      if (res.ok) setHashtags(await res.json());
    } finally {
      setLoading(false);
    }
  };

  const filtered =
    selectedPlatform === "all"
      ? hashtags
      : hashtags.filter((h) => h.platform === selectedPlatform);

  const platforms = ["all", "instagram", "tiktok", "twitter", "linkedin"];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{t("title")}</h1>
          <p className="text-muted-foreground mt-1">{t("subtitle")}</p>
        </div>
        <Button variant="outline" onClick={fetchTrending} disabled={loading}>
          {loading ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <RefreshCw className="h-4 w-4 mr-2" />
          )}
          {t("refresh")}
        </Button>
      </div>

      <div className="flex gap-2">
        {platforms.map((p) => (
          <Button
            key={p}
            variant={selectedPlatform === p ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedPlatform(p)}
          >
            {p === "all" ? "All" : p}
          </Button>
        ))}
      </div>

      {/* Hashtag Cloud */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{t("hashtagCloud")}</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="flex flex-wrap gap-2 justify-center">
              {filtered.map((h, i) => {
                const size = h.relevancy > 0.8 ? "text-2xl" : h.relevancy > 0.6 ? "text-xl" : h.relevancy > 0.4 ? "text-lg" : "text-base";
                const opacity = Math.max(0.4, h.relevancy);
                return (
                  <button
                    key={i}
                    onClick={() => navigator.clipboard.writeText(`#${h.tag}`)}
                    className={cn(
                      "px-3 py-1 rounded-full border hover:bg-primary/10 hover:border-primary transition-colors cursor-pointer font-medium",
                      size
                    )}
                    style={{ opacity }}
                  >
                    #{h.tag}
                  </button>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Top Hashtags List */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{t("topHashtags")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {filtered
              .sort((a, b) => b.relevancy - a.relevancy)
              .slice(0, 20)
              .map((h, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between py-2 border-b last:border-0"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-mono text-muted-foreground w-6">
                      {i + 1}
                    </span>
                    <span className="font-medium">#{h.tag}</span>
                    <Badge variant="outline" className="text-xs capitalize">
                      {h.category}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">
                      {h.platform}
                    </Badge>
                    <div className="w-20 h-2 rounded-full bg-secondary overflow-hidden">
                      <div
                        className="h-full rounded-full bg-primary"
                        style={{ width: `${h.relevancy * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
