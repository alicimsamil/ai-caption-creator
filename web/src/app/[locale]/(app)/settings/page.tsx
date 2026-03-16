"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import {
  Settings,
  CheckCircle,
  XCircle,
  Loader2,
  Plus,
  Trash2,
  Brain,
  Columns3,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";

interface HealthStatus {
  ollama: boolean;
  aiService: boolean;
  models: string[];
}

interface ContentPillar {
  id: string;
  name: string;
  color: string;
  count: number;
}

export default function SettingsPage() {
  const t = useTranslations("settings");
  const [health, setHealth] = useState<HealthStatus | null>(null);
  const [checking, setChecking] = useState(false);
  const [models, setModels] = useState<string[]>([]);
  const [selectedModel, setSelectedModel] = useState("llama3");
  const [ollamaUrl, setOllamaUrl] = useState("http://localhost:11434");
  const [aiServiceUrl, setAiServiceUrl] = useState("http://localhost:8000");
  const [brandSamples, setBrandSamples] = useState<string[]>([""]);
  const [brandAnalysis, setBrandAnalysis] = useState<string | null>(null);
  const [pillars, setPillars] = useState<ContentPillar[]>([]);
  const [newPillarName, setNewPillarName] = useState("");

  const checkHealth = async () => {
    setChecking(true);
    try {
      const res = await fetch("/api/health");
      if (res.ok) {
        const data = await res.json();
        setHealth(data);
        setModels(data.models || []);
      }
    } finally {
      setChecking(false);
    }
  };

  useEffect(() => {
    checkHealth();
  }, []);

  const addBrandSample = () => setBrandSamples([...brandSamples, ""]);

  const updateBrandSample = (index: number, value: string) => {
    const updated = [...brandSamples];
    updated[index] = value;
    setBrandSamples(updated);
  };

  const removeBrandSample = (index: number) => {
    setBrandSamples(brandSamples.filter((_, i) => i !== index));
  };

  const [analyzingVoice, setAnalyzingVoice] = useState(false);

  const analyzeBrandVoice = async () => {
    const validSamples = brandSamples.filter((s) => s.trim());
    if (validSamples.length < 3) return;
    setAnalyzingVoice(true);
    try {
      const res = await fetch("/api/generate/brand-voice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ samples: validSamples }),
      });
      if (res.ok) {
        const data = await res.json();
        setBrandAnalysis(data.summary || JSON.stringify(data, null, 2));
      }
    } catch {
      setBrandAnalysis("Analysis failed. Please check your connection.");
    } finally {
      setAnalyzingVoice(false);
    }
  };

  const addPillar = () => {
    if (!newPillarName.trim()) return;
    const colors = ["#8B5CF6", "#EC4899", "#06B6D4", "#10B981", "#F59E0B"];
    setPillars([
      ...pillars,
      {
        id: Date.now().toString(),
        name: newPillarName,
        color: colors[pillars.length % colors.length],
        count: 0,
      },
    ]);
    setNewPillarName("");
  };

  const removePillar = (id: string) => {
    setPillars(pillars.filter((p) => p.id !== id));
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{t("title")}</h1>
        <p className="text-muted-foreground mt-1">{t("subtitle")}</p>
      </div>

      {/* Connection Status */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{t("connectionStatus")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-medium">Ollama</span>
              {health && (
                health.ollama ? (
                  <Badge className="bg-green-500/10 text-green-500">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    {t("connected")}
                  </Badge>
                ) : (
                  <Badge variant="destructive">
                    <XCircle className="h-3 w-3 mr-1" />
                    {t("disconnected")}
                  </Badge>
                )
              )}
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-medium">AI Service (BLIP)</span>
              {health && (
                health.aiService ? (
                  <Badge className="bg-green-500/10 text-green-500">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    {t("connected")}
                  </Badge>
                ) : (
                  <Badge variant="destructive">
                    <XCircle className="h-3 w-3 mr-1" />
                    {t("disconnected")}
                  </Badge>
                )
              )}
            </div>
          </div>
          <Button variant="outline" onClick={checkHealth} disabled={checking}>
            {checking ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : null}
            {t("testConnection")}
          </Button>
        </CardContent>
      </Card>

      {/* AI Model */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{t("aiModel")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>{t("aiModel")}</Label>
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              className="w-full mt-1.5 rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              {models.length > 0 ? (
                models.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))
              ) : (
                <option value="llama3">llama3 (default)</option>
              )}
            </select>
          </div>
          <div>
            <Label>{t("ollamaUrl")}</Label>
            <input
              type="text"
              value={ollamaUrl}
              onChange={(e) => setOllamaUrl(e.target.value)}
              className="w-full mt-1.5 rounded-md border border-input bg-background px-3 py-2 text-sm font-mono"
            />
          </div>
          <div>
            <Label>{t("aiServiceUrl")}</Label>
            <input
              type="text"
              value={aiServiceUrl}
              onChange={(e) => setAiServiceUrl(e.target.value)}
              className="w-full mt-1.5 rounded-md border border-input bg-background px-3 py-2 text-sm font-mono"
            />
          </div>
        </CardContent>
      </Card>

      {/* Brand Voice */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Brain className="h-5 w-5" />
            {t("brandVoice")}
          </CardTitle>
          <CardDescription>{t("brandVoiceDesc")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {brandSamples.map((sample, i) => (
            <div key={i} className="flex gap-2">
              <Textarea
                value={sample}
                onChange={(e) => updateBrandSample(i, e.target.value)}
                placeholder={`Sample caption ${i + 1}...`}
                rows={2}
                className="flex-1"
              />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeBrandSample(i)}
                disabled={brandSamples.length <= 1}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={addBrandSample}>
              <Plus className="h-3 w-3 mr-1" />
              {t("addSamples")}
            </Button>
            <Button
              size="sm"
              onClick={analyzeBrandVoice}
              disabled={brandSamples.filter((s) => s.trim()).length < 3 || analyzingVoice}
            >
              {analyzingVoice ? (
                <Loader2 className="h-3 w-3 mr-1 animate-spin" />
              ) : (
                <Brain className="h-3 w-3 mr-1" />
              )}
              {t("analyzeSamples")}
            </Button>
          </div>
          {brandAnalysis && (
            <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
              <p className="text-sm">{brandAnalysis}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Content Pillars */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Columns3 className="h-5 w-5" />
            {t("contentPillars")}
          </CardTitle>
          <CardDescription>{t("contentPillarsDesc")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            {pillars.map((pillar) => (
              <div
                key={pillar.id}
                className="flex items-center justify-between p-3 rounded-lg border"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: pillar.color }}
                  />
                  <span className="font-medium">{pillar.name}</span>
                  <Badge variant="secondary" className="text-xs">
                    {pillar.count} posts
                  </Badge>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removePillar(pillar.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={newPillarName}
              onChange={(e) => setNewPillarName(e.target.value)}
              placeholder="e.g., Education, Behind the Scenes..."
              className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm"
              onKeyDown={(e) => e.key === "Enter" && addPillar()}
            />
            <Button onClick={addPillar}>
              <Plus className="h-4 w-4 mr-1" />
              {t("addPillar")}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
