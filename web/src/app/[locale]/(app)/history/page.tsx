"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { History, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CopyButton } from "@/components/shared/copy-button";
import type { GenerationResult } from "@/types/caption";

export default function HistoryPage() {
  const t = useTranslations("history");
  const [generations, setGenerations] = useState<GenerationResult[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, [page]);

  const fetchHistory = async () => {
    const res = await fetch(`/api/history?page=${page}&limit=20`);
    if (res.ok) {
      const data = await res.json();
      setGenerations((prev) =>
        page === 1 ? data.generations : [...prev, ...data.generations]
      );
      setHasMore(data.hasMore);
    }
  };

  const handleDelete = async (id: string) => {
    const res = await fetch(`/api/history?id=${id}`, { method: "DELETE" });
    if (res.ok) {
      setGenerations((prev) => prev.filter((g) => g.id !== id));
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{t("title")}</h1>
        <p className="text-muted-foreground mt-1">{t("subtitle")}</p>
      </div>

      {generations.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">
          <History className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>{t("empty")}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {generations.map((gen) => (
            <Card key={gen.id} className="hover:border-primary/30 transition-colors">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline">{gen.platform}</Badge>
                      <Badge variant="secondary">{gen.tone}</Badge>
                      <Badge variant="secondary">{gen.language}</Badge>
                      <span className="text-xs text-muted-foreground">
                        {gen.createdAt &&
                          new Date(gen.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm font-medium line-clamp-2">
                      {gen.captions[0]?.text || "No caption"}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {gen.captions.length} captions, {gen.hashtags.length}{" "}
                      hashtags
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() =>
                        setExpandedId(
                          expandedId === gen.id ? null : gen.id || null
                        )
                      }
                    >
                      {expandedId === gen.id ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => gen.id && handleDelete(gen.id)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>

                {expandedId === gen.id && (
                  <div className="mt-4 pt-4 border-t space-y-3">
                    {gen.captions.map((caption, i) => (
                      <div
                        key={i}
                        className="flex items-start justify-between p-3 rounded-lg bg-secondary/50"
                      >
                        <p className="text-sm flex-1 whitespace-pre-wrap">
                          {caption.text}
                        </p>
                        <CopyButton text={caption.text} />
                      </div>
                    ))}
                    {gen.hashtags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-2">
                        {gen.hashtags.map((h, i) => (
                          <Badge key={i} variant="outline" className="text-xs">
                            #{h.tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}

          {hasMore && (
            <Button
              variant="outline"
              className="w-full"
              onClick={() => setPage((p) => p + 1)}
            >
              Load More
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
