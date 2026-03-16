"use client";

import { useEffect, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { LayoutTemplate, Plus, Search } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Template } from "@/types/template";
import type { Platform } from "@/types/platform";

const categoryLabels: Record<string, string> = {
  "product-launch": "Product Launch",
  "behind-the-scenes": "Behind the Scenes",
  quote: "Quote",
  tutorial: "Tutorial",
  announcement: "Announcement",
  engagement: "Engagement",
  storytelling: "Storytelling",
  promotion: "Promotion",
  seasonal: "Seasonal",
  "user-generated": "User Generated",
  collaboration: "Collaboration",
  milestone: "Milestone",
  "tips-tricks": "Tips & Tricks",
  "before-after": "Before & After",
  question: "Question",
  contest: "Contest",
};

export default function TemplatesPage() {
  const t = useTranslations("templates");
  const locale = useLocale();
  const router = useRouter();
  const [templates, setTemplates] = useState<Template[]>([]);
  const [filter, setFilter] = useState({ platform: "all", category: "all" });
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchTemplates();
  }, [filter]);

  const fetchTemplates = async () => {
    const params = new URLSearchParams();
    if (filter.platform !== "all") params.set("platform", filter.platform);
    if (filter.category !== "all") params.set("category", filter.category);
    const res = await fetch(`/api/templates?${params}`);
    if (res.ok) setTemplates(await res.json());
  };

  const handleUseTemplate = (template: Template) => {
    router.push(`/generate?templateId=${template.id}`);
  };

  const filtered = templates.filter((t) => {
    const name = locale === "tr" && t.nameTr ? t.nameTr : t.name;
    return name.toLowerCase().includes(search.toLowerCase());
  });

  const platforms: (Platform | "all")[] = [
    "all", "instagram", "tiktok", "twitter", "linkedin", "facebook", "youtube", "pinterest",
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{t("title")}</h1>
          <p className="text-muted-foreground mt-1">{t("subtitle")}</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          {t("createCustom")}
        </Button>
      </div>

      <div className="flex flex-wrap gap-2">
        {platforms.map((p) => (
          <Button
            key={p}
            variant={filter.platform === p ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter({ ...filter, platform: p })}
          >
            {p === "all" ? t("allPlatforms") : p}
          </Button>
        ))}
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t("allCategories")}
          className="w-full pl-10 pr-4 py-2 rounded-md border border-input bg-background text-sm"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((template) => (
          <Card
            key={template.id}
            className="hover:border-primary/50 transition-colors cursor-pointer"
            onClick={() => handleUseTemplate(template)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <CardTitle className="text-base">
                  {locale === "tr" && template.nameTr
                    ? template.nameTr
                    : template.name}
                </CardTitle>
                <div className="flex gap-1">
                  <Badge variant="outline" className="text-xs">
                    {template.platform}
                  </Badge>
                  {template.isBuiltIn && (
                    <Badge variant="secondary" className="text-xs">
                      {t("builtIn")}
                    </Badge>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {locale === "tr" && template.descriptionTr
                  ? template.descriptionTr
                  : template.description}
              </p>
              <div className="flex items-center gap-2 mt-3">
                <Badge variant="outline" className="text-xs capitalize">
                  {categoryLabels[template.category] || template.category}
                </Badge>
                <Badge variant="outline" className="text-xs capitalize">
                  {template.tone}
                </Badge>
              </div>
              <Button size="sm" className="w-full mt-4">
                <LayoutTemplate className="h-3 w-3 mr-1" />
                {t("useTemplate")}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <LayoutTemplate className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>No templates found</p>
        </div>
      )}
    </div>
  );
}
