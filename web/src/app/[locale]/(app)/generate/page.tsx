"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Sparkles, Loader2, Layers, GitCompare, Wand2 } from "lucide-react";
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
import { ABVariants } from "@/components/caption/ab-variants";
import { CarouselEditor } from "@/components/caption/carousel-editor";
import { HookBodyCtaEditor } from "@/components/caption/hook-body-cta-editor";
import { PersonaPresets } from "@/components/caption/persona-presets";
import { HashtagPerformance } from "@/components/hashtag/hashtag-performance";
import { ExportButton } from "@/components/shared/export-button";
import { useGenerationStore } from "@/stores/generation-store";
import type { Language } from "@/types/platform";
import type { GeneratedCaption } from "@/types/caption";

type GenerateMode = "standard" | "ab-variant" | "carousel" | "hook-body-cta";

export default function GeneratePage() {
  const t = useTranslations("generate");
  const tCommon = useTranslations("common");
  const store = useGenerationStore();
  const [mode, setMode] = useState<GenerateMode>("standard");
  const [slideCount, setSlideCount] = useState(5);
  const [carouselSlides, setCarouselSlides] = useState<string[]>([]);
  const [abVariants, setAbVariants] = useState<{
    variantA: GeneratedCaption | null;
    variantB: GeneratedCaption | null;
  }>({ variantA: null, variantB: null });
  const [hookText, setHookText] = useState("");
  const [bodyText, setBodyText] = useState("");
  const [ctaText, setCtaText] = useState("");

  const handleGenerate = async () => {
    if (!store.topic.trim() && !store.imageDescription) return;

    store.setIsGenerating(true);
    store.setError(null);
    store.setResults(null);

    try {
      if (mode === "ab-variant") {
        const response = await fetch("/api/generate/ab-variants", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            topic: store.topic,
            platform: store.platform,
            tone: store.tone,
            language: store.language,
            includeEmojis: store.includeEmojis,
            includeCta: store.includeCta,
            persona: store.persona || undefined,
          }),
        });
        if (!response.ok) throw new Error("A/B generation failed");
        const data = await response.json();
        setAbVariants({ variantA: data.variantA, variantB: data.variantB });
      } else if (mode === "carousel") {
        const response = await fetch("/api/generate/carousel", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            topic: store.topic,
            platform: store.platform,
            tone: store.tone,
            language: store.language,
            slideCount,
            includeEmojis: store.includeEmojis,
          }),
        });
        if (!response.ok) throw new Error("Carousel generation failed");
        const data = await response.json();
        setCarouselSlides(data.slides.map((s: { text: string }) => s.text));
      } else {
        // Standard or hook-body-cta mode
        const response = await fetch("/api/generate/caption", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(store.getRequest()),
        });

        if (!response.ok) throw new Error("Generation failed");
        const data = await response.json();
        store.setResults(data);

        // Auto-fill hook/body/cta editor
        if (mode === "hook-body-cta" && data.captions?.[0]) {
          setHookText(data.captions[0].hook || "");
          setBodyText(data.captions[0].body || "");
          setCtaText(data.captions[0].cta || "");
        }

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
            store.setResults({ ...data, hashtags: hashData.hashtags });
          }
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
      // Silently handle
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
            c.text === caption.text
              ? { ...c, text: data.text, charCount: data.text.length }
              : c
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{t("title")}</h1>
          <p className="text-muted-foreground mt-1">{t("subtitle")}</p>
        </div>
        {store.results && (
          <ExportButton
            data={{
              captions: store.results.captions,
              hashtags: store.results.hashtags,
            }}
          />
        )}
      </div>

      {/* Generation Mode Selector */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant={mode === "standard" ? "default" : "outline"}
          size="sm"
          onClick={() => setMode("standard")}
        >
          <Sparkles className="h-4 w-4 mr-1" />
          {t("generateBtn")}
        </Button>
        <Button
          variant={mode === "ab-variant" ? "default" : "outline"}
          size="sm"
          onClick={() => setMode("ab-variant")}
        >
          <GitCompare className="h-4 w-4 mr-1" />
          {t("abVariant")}
        </Button>
        <Button
          variant={mode === "carousel" ? "default" : "outline"}
          size="sm"
          onClick={() => setMode("carousel")}
        >
          <Layers className="h-4 w-4 mr-1" />
          {t("carousel")}
        </Button>
        <Button
          variant={mode === "hook-body-cta" ? "default" : "outline"}
          size="sm"
          onClick={() => setMode("hook-body-cta")}
        >
          <Wand2 className="h-4 w-4 mr-1" />
          {t("hookBodyCta")}
        </Button>
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
                {mode === "carousel" ? (
                  <div>
                    <Label>{t("carouselSlides")}</Label>
                    <select
                      value={slideCount}
                      onChange={(e) => setSlideCount(Number(e.target.value))}
                      className="w-full mt-1.5 rounded-md border border-input bg-background px-3 py-2 text-sm"
                    >
                      {[2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                        <option key={n} value={n}>
                          {n} slides
                        </option>
                      ))}
                    </select>
                  </div>
                ) : (
                  <div>
                    <Label>{t("count")}</Label>
                    <select
                      value={store.count}
                      onChange={(e) =>
                        store.setCount(Number(e.target.value))
                      }
                      className="w-full mt-1.5 rounded-md border border-input bg-background px-3 py-2 text-sm"
                    >
                      {[1, 2, 3, 4, 5].map((n) => (
                        <option key={n} value={n}>
                          {n}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              {/* Persona Presets */}
              <div>
                <Label>{t("persona")}</Label>
                <div className="mt-1.5">
                  <PersonaPresets
                    selected={store.persona}
                    onSelect={store.setPersona}
                  />
                </div>
              </div>

              <div className="flex flex-wrap gap-4">
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input
                    type="checkbox"
                    checked={store.includeEmojis}
                    onChange={(e) =>
                      store.setIncludeEmojis(e.target.checked)
                    }
                    className="rounded border-input"
                  />
                  {t("includeEmojis")}
                </label>
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input
                    type="checkbox"
                    checked={store.includeCta}
                    onChange={(e) =>
                      store.setIncludeCta(e.target.checked)
                    }
                    className="rounded border-input"
                  />
                  {t("includeCta")}
                </label>
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input
                    type="checkbox"
                    checked={store.includeHashtags}
                    onChange={(e) =>
                      store.setIncludeHashtags(e.target.checked)
                    }
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
                    {mode === "ab-variant"
                      ? t("abVariant")
                      : mode === "carousel"
                        ? t("carousel")
                        : mode === "hook-body-cta"
                          ? t("hookBodyCta")
                          : t("generateBtn")}
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

      {/* A/B Variants Result */}
      {mode === "ab-variant" && abVariants.variantA && abVariants.variantB && (
        <ABVariants
          variantA={abVariants.variantA}
          variantB={abVariants.variantB}
        />
      )}

      {/* Carousel Result */}
      {mode === "carousel" && carouselSlides.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{t("carousel")}</CardTitle>
          </CardHeader>
          <CardContent>
            <CarouselEditor
              captions={carouselSlides}
              onChange={setCarouselSlides}
            />
          </CardContent>
        </Card>
      )}

      {/* Hook+Body+CTA Editor */}
      {mode === "hook-body-cta" && store.results && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{t("hookBodyCta")}</CardTitle>
          </CardHeader>
          <CardContent>
            <HookBodyCtaEditor
              hook={hookText}
              body={bodyText}
              cta={ctaText}
              onHookChange={setHookText}
              onBodyChange={setBodyText}
              onCtaChange={setCtaText}
            />
          </CardContent>
        </Card>
      )}

      {/* Standard Results */}
      {store.results && mode !== "hook-body-cta" && (
        <div className="space-y-6">
          <Tabs defaultValue="captions">
            <TabsList>
              <TabsTrigger value="captions">
                {t("captions")} ({store.results.captions.length})
              </TabsTrigger>
              {store.results.hashtags.length > 0 && (
                <>
                  <TabsTrigger value="hashtags">
                    {t("hashtags")} ({store.results.hashtags.length})
                  </TabsTrigger>
                  <TabsTrigger value="performance">
                    Performance
                  </TabsTrigger>
                </>
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
              <>
                <TabsContent value="hashtags" className="mt-4">
                  <Card>
                    <CardContent className="p-4">
                      <HashtagList hashtags={store.results.hashtags} />
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="performance" className="mt-4">
                  <HashtagPerformance hashtags={store.results.hashtags} />
                </TabsContent>
              </>
            )}
          </Tabs>
        </div>
      )}
    </div>
  );
}
