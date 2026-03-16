"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Heart, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CopyButton } from "@/components/shared/copy-button";
import { CharCounter } from "@/components/caption/char-counter";
import { PLATFORMS } from "@/lib/platform-config";

interface FavoriteCaption {
  id: string;
  text: string;
  platform: string;
  charCount: number;
  hasEmojis: boolean;
  hasCta: boolean;
  createdAt: string;
}

export default function FavoritesPage() {
  const t = useTranslations("favorites");
  const [favorites, setFavorites] = useState<FavoriteCaption[]>([]);

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    const res = await fetch("/api/favorites");
    if (res.ok) setFavorites(await res.json());
  };

  const handleRemove = async (id: string) => {
    const res = await fetch("/api/favorites", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ captionId: id }),
    });
    if (res.ok) {
      setFavorites((prev) => prev.filter((f) => f.id !== id));
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{t("title")}</h1>
        <p className="text-muted-foreground mt-1">{t("subtitle")}</p>
      </div>

      {favorites.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">
          <Heart className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>{t("empty")}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {favorites.map((fav) => {
            const platform = PLATFORMS.find((p) => p.id === fav.platform);
            return (
              <Card key={fav.id} className="group hover:border-primary/30 transition-colors">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{fav.platform}</Badge>
                      <span className="text-xs text-muted-foreground">
                        {new Date(fav.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <CopyButton text={fav.text} />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemove(fav.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                  <p className="text-sm whitespace-pre-wrap mb-3">
                    {fav.text}
                  </p>
                  <CharCounter
                    current={fav.charCount}
                    limit={platform?.charLimit || 2200}
                  />
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
