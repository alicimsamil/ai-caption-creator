import React from "react";
import { ScrollView, Text, View, StyleSheet, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { useGenerationStore } from "@/stores/generation-store";
import CaptionResult from "@/components/caption/CaptionResult";
import HashtagList from "@/components/hashtag/HashtagList";

export default function GenerationResultScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { captions, hashtags, result } = useGenerationStore();

  if (!result) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.empty}>
          <Text style={styles.emptyText}>{t("common.noResults")}</Text>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => router.back()}
          >
            <Text style={styles.backBtnText}>{t("common.close")}</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.backArrow}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.title}>{t("generate.results")}</Text>
          <View style={styles.meta}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{result.platform}</Text>
            </View>
            <View style={[styles.badge, styles.toneBadge]}>
              <Text style={styles.badgeText}>{result.tone}</Text>
            </View>
            <Text style={styles.modelText}>{result.model}</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>{t("generate.captions")}</Text>
        {captions.map((caption, index) => (
          <CaptionResult
            key={caption.id || index}
            caption={caption}
            index={index}
          />
        ))}

        {hashtags.length > 0 && <HashtagList hashtags={hashtags} />}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#0F0A1A",
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 24,
  },
  backArrow: {
    color: "#a78bfa",
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 12,
  },
  title: {
    color: "#f1f5f9",
    fontSize: 28,
    fontWeight: "800",
    letterSpacing: -0.5,
  },
  meta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 10,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: "rgba(139, 92, 246, 0.15)",
  },
  toneBadge: {
    backgroundColor: "rgba(59, 130, 246, 0.15)",
  },
  badgeText: {
    color: "#c4b5fd",
    fontSize: 11,
    fontWeight: "600",
    textTransform: "capitalize",
  },
  modelText: {
    color: "#475569",
    fontSize: 12,
  },
  sectionTitle: {
    color: "#e2e8f0",
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 14,
  },
  empty: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    color: "#64748b",
    fontSize: 16,
    marginBottom: 16,
  },
  backBtn: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: "rgba(139, 92, 246, 0.15)",
  },
  backBtnText: {
    color: "#a78bfa",
    fontWeight: "600",
  },
});
