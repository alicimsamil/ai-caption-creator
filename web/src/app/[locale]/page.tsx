"use client";

import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import {
  Sparkles,
  Instagram,
  Hash,
  Image,
  Zap,
  Globe,
  BarChart3,
  Palette,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
  const t = useTranslations();
  const router = useRouter();

  const features = [
    {
      icon: Sparkles,
      title: "AI Caption Generation",
      desc: "Generate engaging captions tailored for each platform",
    },
    {
      icon: Hash,
      title: "Smart Hashtags",
      desc: "Get relevant hashtags with relevancy scores",
    },
    {
      icon: Image,
      title: "Image Analysis",
      desc: "Upload images and let AI describe your content",
    },
    {
      icon: Globe,
      title: "Multi-Language",
      desc: "Generate captions in Turkish, English, and more",
    },
    {
      icon: Palette,
      title: "Tone Control",
      desc: "Professional, casual, funny, inspirational & more",
    },
    {
      icon: Zap,
      title: "Self-Hosted",
      desc: "100% on your server. No external API calls.",
    },
    {
      icon: BarChart3,
      title: "A/B Variants",
      desc: "Compare different caption styles side by side",
    },
    {
      icon: Instagram,
      title: "7 Platforms",
      desc: "Instagram, TikTok, X, LinkedIn, Facebook, YouTube, Pinterest",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <header className="container mx-auto px-4 py-6 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Sparkles className="h-8 w-8 text-primary" />
          <span className="text-2xl font-bold">{t("common.appName")}</span>
        </div>
        <Button
          variant="outline"
          onClick={() => router.push("/generate")}
        >
          {t("nav.generate")}
        </Button>
      </header>

      <main className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-8">
            <Zap className="h-4 w-4" />
            Self-Hosted AI - No External APIs
          </div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
            <span className="bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent">
              {t("common.appName")}
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-2xl mx-auto">
            {t("common.tagline")}
          </p>

          <div className="flex gap-4 justify-center mb-20">
            <Button
              size="lg"
              className="text-lg px-8 py-6"
              onClick={() => router.push("/generate")}
            >
              <Sparkles className="mr-2 h-5 w-5" />
              {t("generate.generateBtn")}
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-lg px-8 py-6"
              onClick={() => router.push("/templates")}
            >
              {t("nav.templates")}
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, i) => (
              <div
                key={i}
                className="p-6 rounded-xl border bg-card hover:border-primary/50 transition-colors"
              >
                <feature.icon className="h-10 w-10 text-primary mb-4 mx-auto" />
                <h3 className="font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
