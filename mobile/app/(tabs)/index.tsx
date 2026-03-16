import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import * as Clipboard from "expo-clipboard";
import { useGenerationStore } from "../../stores/generation-store";
import { PLATFORMS, TONES } from "../../lib/platform-config";
import { generateCaption, generateHashtags } from "../../lib/api-client";

const PURPLE = "#8B5CF6";

export default function GenerateScreen() {
  const store = useGenerationStore();

  const handleGenerate = async () => {
    if (!store.topic.trim()) return;
    store.setIsGenerating(true);
    store.setError(null);

    try {
      const result = await generateCaption({
        topic: store.topic,
        platform: store.platform,
        tone: store.tone,
        language: store.language,
        count: store.count,
        includeEmojis: store.includeEmojis,
        includeCta: store.includeCta,
        includeHashtags: store.includeHashtags,
        persona: store.persona || undefined,
        imageDescription: store.imageDescription || undefined,
      } as any);

      let finalResult = result;
      if (store.includeHashtags) {
        try {
          const hashResult = await generateHashtags(
            store.topic,
            store.platform,
            store.language,
            20
          );
          finalResult = { ...result, hashtags: hashResult.hashtags };
        } catch {}
      }
      store.setResults(finalResult);
    } catch (err: any) {
      store.setError(err.message || "Generation failed");
    } finally {
      store.setIsGenerating(false);
    }
  };

  const copyToClipboard = async (text: string) => {
    await Clipboard.setStringAsync(text);
    Alert.alert("Copied!", "Caption copied to clipboard");
  };

  return (
    <ScrollView style={s.container} contentContainerStyle={s.content}>
      <Text style={s.title}>Caption Uret</Text>
      <Text style={s.subtitle}>AI ile sosyal medya caption ve hashtag uret</Text>

      {/* Platform Selector */}
      <Text style={s.label}>Platform</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={s.chipRow}>
        {PLATFORMS.map((p) => (
          <TouchableOpacity
            key={p.id}
            style={[s.chip, store.platform === p.id && s.chipActive]}
            onPress={() => store.setPlatform(p.id)}
          >
            <Text style={[s.chipText, store.platform === p.id && s.chipTextActive]}>
              {p.emoji} {p.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Topic Input */}
      <Text style={s.label}>Konu</Text>
      <TextInput
        style={s.input}
        value={store.topic}
        onChangeText={store.setTopic}
        placeholder="Paylasimin icerigini acikla..."
        placeholderTextColor="#6B7280"
        multiline
        numberOfLines={4}
        textAlignVertical="top"
      />

      {/* Tone Selector */}
      <Text style={s.label}>Ton</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={s.chipRow}>
        {TONES.map((t) => (
          <TouchableOpacity
            key={t.id}
            style={[s.chip, store.tone === t.id && s.chipActive]}
            onPress={() => store.setTone(t.id)}
          >
            <Text style={[s.chipText, store.tone === t.id && s.chipTextActive]}>
              {t.emoji} {t.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Options */}
      <View style={s.optionsRow}>
        <View style={s.optionItem}>
          <Text style={s.label}>Dil</Text>
          <View style={s.selectWrap}>
            {["tr", "en"].map((l) => (
              <TouchableOpacity
                key={l}
                style={[s.miniChip, store.language === l && s.chipActive]}
                onPress={() => store.setLanguage(l)}
              >
                <Text style={[s.chipText, store.language === l && s.chipTextActive]}>
                  {l.toUpperCase()}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        <View style={s.optionItem}>
          <Text style={s.label}>Sayi</Text>
          <View style={s.selectWrap}>
            {[1, 2, 3, 5].map((n) => (
              <TouchableOpacity
                key={n}
                style={[s.miniChip, store.count === n && s.chipActive]}
                onPress={() => store.setCount(n)}
              >
                <Text style={[s.chipText, store.count === n && s.chipTextActive]}>
                  {n}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>

      {/* Generate Button */}
      <TouchableOpacity
        style={[s.generateBtn, (!store.topic.trim() || store.isGenerating) && s.generateBtnDisabled]}
        onPress={handleGenerate}
        disabled={!store.topic.trim() || store.isGenerating}
      >
        {store.isGenerating ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={s.generateBtnText}>✨ Caption Uret</Text>
        )}
      </TouchableOpacity>

      {/* Error */}
      {store.error && (
        <View style={s.errorBox}>
          <Text style={s.errorText}>{store.error}</Text>
        </View>
      )}

      {/* Results */}
      {store.results && (
        <View style={s.results}>
          <Text style={s.sectionTitle}>
            Captionlar ({store.results.captions?.length || 0})
          </Text>
          {store.results.captions?.map((caption: any, i: number) => (
            <View key={i} style={s.resultCard}>
              <Text style={s.resultText}>{caption.text}</Text>
              <View style={s.resultFooter}>
                <Text style={s.charCount}>
                  {caption.charCount || caption.text.length} karakter
                </Text>
                <TouchableOpacity
                  style={s.copyBtn}
                  onPress={() => copyToClipboard(caption.text)}
                >
                  <Text style={s.copyBtnText}>Kopyala</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}

          {store.results.hashtags?.length > 0 && (
            <>
              <Text style={s.sectionTitle}>
                Hashtagler ({store.results.hashtags.length})
              </Text>
              <View style={s.hashtagWrap}>
                {store.results.hashtags.map((h: any, i: number) => (
                  <TouchableOpacity
                    key={i}
                    style={s.hashtagChip}
                    onPress={() => copyToClipboard(`#${h.tag}`)}
                  >
                    <Text style={s.hashtagText}>#{h.tag}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              <TouchableOpacity
                style={s.copyAllBtn}
                onPress={() =>
                  copyToClipboard(
                    store.results.hashtags.map((h: any) => `#${h.tag}`).join(" ")
                  )
                }
              >
                <Text style={s.copyBtnText}>Tumunu Kopyala</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      )}
    </ScrollView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0a0a0f" },
  content: { padding: 16, paddingBottom: 100 },
  title: { fontSize: 28, fontWeight: "bold", color: "#fff", marginBottom: 4 },
  subtitle: { fontSize: 14, color: "#9CA3AF", marginBottom: 20 },
  label: { fontSize: 14, fontWeight: "600", color: "#D1D5DB", marginBottom: 8, marginTop: 16 },
  chipRow: { flexDirection: "row", marginBottom: 8 },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#1f1f2e",
    marginRight: 8,
    borderWidth: 1,
    borderColor: "#2d2d3f",
  },
  chipActive: { backgroundColor: PURPLE + "20", borderColor: PURPLE },
  chipText: { color: "#9CA3AF", fontSize: 13 },
  chipTextActive: { color: PURPLE },
  input: {
    backgroundColor: "#1f1f2e",
    borderRadius: 12,
    padding: 14,
    color: "#fff",
    fontSize: 15,
    borderWidth: 1,
    borderColor: "#2d2d3f",
    minHeight: 100,
  },
  optionsRow: { flexDirection: "row", gap: 16 },
  optionItem: { flex: 1 },
  selectWrap: { flexDirection: "row", gap: 6 },
  miniChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: "#1f1f2e",
    borderWidth: 1,
    borderColor: "#2d2d3f",
  },
  generateBtn: {
    backgroundColor: PURPLE,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 24,
  },
  generateBtnDisabled: { opacity: 0.5 },
  generateBtnText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  errorBox: { backgroundColor: "#7F1D1D", borderRadius: 8, padding: 12, marginTop: 16 },
  errorText: { color: "#FCA5A5", fontSize: 13 },
  results: { marginTop: 24 },
  sectionTitle: { fontSize: 18, fontWeight: "bold", color: "#fff", marginBottom: 12, marginTop: 8 },
  resultCard: {
    backgroundColor: "#1f1f2e",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#2d2d3f",
  },
  resultText: { color: "#E5E7EB", fontSize: 14, lineHeight: 22 },
  resultFooter: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 12 },
  charCount: { color: "#6B7280", fontSize: 12 },
  copyBtn: {
    backgroundColor: PURPLE + "30",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 8,
  },
  copyBtnText: { color: PURPLE, fontSize: 13, fontWeight: "600" },
  hashtagWrap: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  hashtagChip: {
    backgroundColor: PURPLE + "15",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: PURPLE + "30",
  },
  hashtagText: { color: PURPLE, fontSize: 13 },
  copyAllBtn: {
    backgroundColor: PURPLE + "20",
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 12,
  },
});
