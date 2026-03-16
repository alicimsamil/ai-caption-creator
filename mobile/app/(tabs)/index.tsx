import React, { useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";
import { useGenerationStore } from "@/stores/generation-store";
import * as apiClient from "@/lib/api-client";
import CaptionForm from "@/components/caption/CaptionForm";
import CaptionResult from "@/components/caption/CaptionResult";
import HashtagList from "@/components/hashtag/HashtagList";
import type { GeneratedCaption } from "@/types/caption";

export default function GenerateScreen() {
  const { t } = useTranslation();
  const store = useGenerationStore();

  const handleGenerate = useCallback(async () => {
    if (!store.topic.trim()) return;

    store.setIsGenerating(true);
    store.setError(null);
    store.setResults(null);

    try {
      // If image is selected but not analyzed yet, analyze it
      if (store.imageUri && !store.imageDescription) {
        store.setIsAnalyzingImage(true);
        try {
          const response = await fetch(store.imageUri);
          const blob = await response.blob();
          const reader = new FileReader();
          const base64 = await new Promise<string>((resolve) => {
            reader.onloadend = () => {
              const result = reader.result as string;
              resolve(result.split(",")[1]);
            };
            reader.readAsDataURL(blob);
          });

          const analysis = await apiClient.analyzeImage(
            base64,
            "image/jpeg"
          );
          store.setImageDescription(analysis.description);
        } catch (err) {
          // Continue without image analysis
          console.warn("Image analysis failed:", err);
        } finally {
          store.setIsAnalyzingImage(false);
        }
      }

      const request = store.getRequest();
      const result = await apiClient.generateCaption(request);
      store.setResults(result);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : t("common.error");
      store.setError(message);
      Alert.alert(t("common.error"), message);
    } finally {
      store.setIsGenerating(false);
    }
  }, [store, t]);

  const handleFavorite = useCallback(
    async (caption: GeneratedCaption) => {
      if (!caption.id) return;
      try {
        await apiClient.toggleFavorite(caption.id);
      } catch {
        // Silently fail
      }
    },
    []
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerIcon}>✨</Text>
          <View>
            <Text style={styles.title}>{t("generate.title")}</Text>
            <Text style={styles.subtitle}>
              {t("generate.subtitle")}
            </Text>
          </View>
        </View>

        {/* Form */}
        <CaptionForm onGenerate={handleGenerate} />

        {/* Results */}
        {store.results && (
          <View style={styles.results}>
            <Text style={styles.resultsTitle}>
              {t("generate.results")}
            </Text>

            {/* Captions */}
            {store.results.captions.map((caption, index) => (
              <CaptionResult
                key={caption.id || index}
                caption={caption}
                index={index}
                onFavorite={handleFavorite}
              />
            ))}

            {/* Hashtags */}
            {store.results.hashtags.length > 0 && (
              <HashtagList hashtags={store.results.hashtags} />
            )}
          </View>
        )}

        {/* Error */}
        {store.error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{store.error}</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#0F0A1A",
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 28,
  },
  headerIcon: {
    fontSize: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    color: "#FFFFFF",
  },
  subtitle: {
    fontSize: 13,
    color: "#71717A",
    marginTop: 2,
  },
  results: {
    marginTop: 28,
  },
  resultsTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 16,
  },
  errorContainer: {
    marginTop: 16,
    backgroundColor: "rgba(239, 68, 68, 0.1)",
    borderWidth: 1,
    borderColor: "rgba(239, 68, 68, 0.3)",
    borderRadius: 12,
    padding: 14,
  },
  errorText: {
    color: "#EF4444",
    fontSize: 14,
  },
});
