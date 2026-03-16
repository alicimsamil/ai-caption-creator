"use client";

import { useTranslations } from "next-intl";
import { Sparkles, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlatformSelector } from "@/components/caption/platform-selector";
import { ToneSelector } from "@/components/caption/tone-selector";
import { CaptionResult } from "@/components/caption/caption-result";
import { HashtagList } from "@/components/hashtag/hashtag-list";
import { ImageUpload } from "@/components/image/image-upload";
import { useGenerationStore } from "@/stores/generation-store";
import type { Language } from "@/types/platform";

export default function GeneratePage() {
  const t = useTranslations("generate");
  const tCommon = useTranslations("common");
  const store = useGenerationStore();

  const handleGenerate = async () => {
    if (!store.topic.trim() && !store.imageDescription) return;

    store.setIsGenerating(true);
    store.setError(null);
    store.setResults(null);

    try {
      const response = await fetch("/api/generate/caption", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(store.getRequest()),
      });

      if (!response.ok) {
        throw new Error("Generation failed");
      }

      const data = await response.json();
      store.setResults(data);

      if (store.includeHashtags) {
        const hashResponse = await fetch("/api/generate/hashtags", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            topic: store.topic || store.imageDescription,
            platform: store.platform,
            count: 20,
            language: store.language,
          }),
        });

        if (hashResponse.ok) {
          const hashData = await hashResponse.json();
          store.setResults({
            ...data,
            hashtags: hashData.hashtags,
          });
        }
      }
    } catch (err) {
      store.setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      store.setIsGenerating(false);
    }
  };

  const handleImageSelect = async (file: File) => {
    store.setImageFile(file);
    store.setImagePreview(URL.createObjectURL(file));
    store.setIsAnalyzingImage(true);

    try {
      const formData = new FormData();
      formData.append("image", file);

      const response = await fetch("/api/generate/image-analyze", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        store.setImageDescription(data.description);
      }
    } catch {
      // Silently handle - user can still manually describe
    } finally {
      store.setIsAnalyzingImage(false);
    }
  };

  const handleImageRemove = () => {
    store.setImageFile(null);
    store.setImagePreview(null);
    store.setImageDescription(null);
  };

  const handleFavorite = async (caption: { id?: string }) => {
    if (!caption.id) return;
    await fetch(`/api/favorites/${caption.id}`, { method: "POST" });
  };

  const handleRefine = async (
    caption: { text: string },
    instruction: string
  ) => {
    try {
      const response = await fetch("/api/generate/refine", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          captionText: caption.text,
          instruction,
          platform: store.platform,
          tone: store.tone,
          language: store.language,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (store.results) {
          const updatedCaptions = store.results.captions.map((c) =>
            c.text === caption.text ? { ...c, text: data.text, charCount: data.text.length } : c
          );
          store.setResults({ ...store.results, captions: updatedCaptions });
        }
      }
    } catch {
      // Handle error
    }
  };

  const languages: { value: Language; label: string }[] = [
    { value: "tr", label: "Turkce" },
    { value: "en", label: "English" },
    { value: "de", label: "Deutsch" },
    { value: "fr", label: "Francais" },
    { value: "es", label: "Espanol" },
    { value: "ar", label: "العربية" },
    { value: "ja", label: "日本語" },
    { value: "ko", label: "한국어" },
    { value: "zh", label: "中文" },
    { value: "pt", label: "Portugues" },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{t("title")}</h1>
        <p className="text-muted-foreground mt-1">{t("subtitle")}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Form */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{t("platform")}</CardTitle>
            </CardHeader>
            <CardContent>
              <PlatformSelector
                selected={store.platform}
                onSelect={store.setPlatform}
              />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6 space-y-4">
              <div>
                <Label htmlFor="topic">{t("topic")}</Label>
                <Textarea
                  id="topic"
                  value={store.topic}
                  onChange={(e) => store.setTopic(e.target.value)}
                  placeholder={t("topicPlaceholder")}
                  rows={4}
                  className="mt-1.5"
                />
              </div>

              <div>
                <Label>{t("tone")}</Label>
                <div className="mt-1.5">
                  <ToneSelector
                    selected={store.tone}
                    onSelect={store.setTone}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>{t("language")}</Label>
                  <select
                    value={store.language}
                    onChange={(e) =>
                      store.setLanguage(e.target.value as Language)
                    }
                    className="w-full mt-1.5 rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    {languages.map((lang) => (
                      <option key={lang.value} value={lang.value}>
                        {lang.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label>{t("count")}</Label>
                  <select
                    value={store.count}
                    onChange={(e) => store.setCount(Number(e.target.value))}
                    className="w-full mt-1.5 rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    {[1, 2, 3, 4, 5].map((n) => (
                      <option key={n} value={n}>
                        {n}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <Label>{t("persona")}</Label>
                <input
                  type="text"
                  value={store.persona}
                  onChange={(e) => store.setPersona(e.target.value)}
                  placeholder={t("personaPlaceholder")}
                  className="w-full mt-1.5 rounded-md border border-input bg-background px-3 py-2 text-sm"
                />
              </div>

              <div className="flex flex-wrap gap-4">
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input
                    type="checkbox"
                    checked={store.includeEmojis}
                    onChange={(e) => store.setIncludeEmojis(e.target.checked)}
                    className="rounded border-input"
                  />
                  {t("includeEmojis")}
                </label>
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input
                    type="checkbox"
                    checked={store.includeCta}
                    onChange={(e) => store.setIncludeCta(e.target.checked)}
                    className="rounded border-input"
                  />
                  {t("includeCta")}
                </label>
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input
                    type="checkbox"
                    checked={store.includeHashtags}
                    onChange={(e) => store.setIncludeHashtags(e.target.checked)}
                    className="rounded border-input"
                  />
                  {t("includeHashtags")}
                </label>
              </div>

              <Button
                size="lg"
                className="w-full"
                onClick={handleGenerate}
                disabled={
                  store.isGenerating ||
                  (!store.topic.trim() && !store.imageDescription)
                }
              >
                {store.isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {tCommon("generating")}
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    {t("generateBtn")}
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Image Upload */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{t("uploadImage")}</CardTitle>
            </CardHeader>
            <CardContent>
              <ImageUpload
                onImageSelect={handleImageSelect}
                onRemove={handleImageRemove}
                preview={store.imagePreview}
                isAnalyzing={store.isAnalyzingImage}
                analysis={store.imageDescription}
              />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Results Section */}
      {store.error && (
        <Card className="border-destructive">
          <CardContent className="p-4">
            <p className="text-destructive text-sm">{store.error}</p>
            <Button
              variant="outline"
              size="sm"
              className="mt-2"
              onClick={handleGenerate}
            >
              {tCommon("retry")}
            </Button>
          </CardContent>
        </Card>
      )}

      {store.results && (
        <div className="space-y-6">
          <Tabs defaultValue="captions">
            <TabsList>
              <TabsTrigger value="captions">
                {t("captions")} ({store.results.captions.length})
              </TabsTrigger>
              {store.results.hashtags.length > 0 && (
                <TabsTrigger value="hashtags">
                  {t("hashtags")} ({store.results.hashtags.length})
                </TabsTrigger>
              )}
            </TabsList>

            <TabsContent value="captions" className="mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {store.results.captions.map((caption, i) => (
                  <CaptionResult
                    key={i}
                    caption={caption}
                    index={i}
                    onFavorite={handleFavorite}
                    onRefine={handleRefine}
                  />
                ))}
              </div>
            </TabsContent>

            {store.results.hashtags.length > 0 && (
              <TabsContent value="hashtags" className="mt-4">
                <Card>
                  <CardContent className="p-4">
                    <HashtagList hashtags={store.results.hashtags} />
                  </CardContent>
                </Card>
              </TabsContent>
            )}
          </Tabs>
        </div>
      )}
    </div>
  );
}
