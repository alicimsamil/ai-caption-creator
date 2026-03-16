import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { useGenerationStore } from "@/stores/generation-store";
import CaptionResult from "@/components/caption/CaptionResult";
import HashtagList from "@/components/hashtag/HashtagList";
import * as apiClient from "@/lib/api-client";
import type { GeneratedCaption } from "@/types/caption";

export default function GenerateResultScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const store = useGenerationStore();
  const results = store.results;

  const handleFavorite = async (caption: GeneratedCaption) => {
    if (!caption.id) return;
    try {
      await apiClient.toggleFavorite(caption.id);
    } catch {
      // Silently fail
    }
  };

  const handleRegenerate = () => {
    router.back();
  };

  if (!results) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.center}>
          <Text style={styles.noResultsText}>
            {t("common.noResults")}
          </Text>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => router.back()}
          >
            <Text style={styles.backBtnText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backArrow}
          >
            <Text style={styles.backArrowText}>←</Text>
          </TouchableOpacity>
          <View style={styles.headerInfo}>
            <Text style={styles.title}>{t("generate.results")}</Text>
            <View style={styles.headerMeta}>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>
                  {results.platform}
                </Text>
              </View>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>
                  {t(`tones.${results.tone}`)}
                </Text>
              </View>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>
                  {results.model}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Captions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {t("generate.captions")} ({results.captions.length})
          </Text>
          {results.captions.map((caption, index) => (
            <CaptionResult
              key={caption.id || index}
              caption={caption}
              index={index}
              onFavorite={handleFavorite}
            />
          ))}
        </View>

        {/* Hashtags */}
        {results.hashtags.length > 0 && (
          <HashtagList hashtags={results.hashtags} />
        )}

        {/* Regenerate */}
        <TouchableOpacity
          style={styles.regenerateBtn}
          onPress={handleRegenerate}
          activeOpacity={0.8}
        >
          <Text style={styles.regenerateBtnText}>
            🔄 {t("generate.regenerate")}
          </Text>
        </TouchableOpacity>
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
    alignItems: "flex-start",
    gap: 12,
    marginBottom: 24,
  },
  backArrow: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 2,
  },
  backArrowText: {
    color: "#FFFFFF",
    fontSize: 20,
  },
  headerInfo: {
    flex: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: "800",
    color: "#FFFFFF",
    marginBottom: 8,
  },
  headerMeta: {
    flexDirection: "row",
    gap: 6,
    flexWrap: "wrap",
  },
  badge: {
    backgroundColor: "rgba(168, 85, 247, 0.15)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  badgeText: {
    color: "#A855F7",
    fontSize: 11,
    fontWeight: "600",
    textTransform: "capitalize",
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 12,
  },
  regenerateBtn: {
    marginTop: 16,
    backgroundColor: "rgba(168, 85, 247, 0.15)",
    borderWidth: 1,
    borderColor: "rgba(168, 85, 247, 0.3)",
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
  },
  regenerateBtnText: {
    color: "#A855F7",
    fontSize: 16,
    fontWeight: "700",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },
  noResultsText: {
    color: "#71717A",
    fontSize: 15,
    marginBottom: 16,
  },
  backBtn: {
    backgroundColor: "rgba(168, 85, 247, 0.2)",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },
  backBtnText: {
    color: "#A855F7",
    fontWeight: "600",
  },
});
