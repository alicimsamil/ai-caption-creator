import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import * as apiClient from "@/lib/api-client";
import { useGenerationStore } from "@/stores/generation-store";
import type { Template } from "@/types/caption";

const CATEGORY_EMOJIS: Record<string, string> = {
  "product-launch": "🚀",
  "behind-the-scenes": "🎬",
  quote: "💬",
  tutorial: "📖",
  announcement: "📢",
  engagement: "💬",
  storytelling: "📝",
  promotion: "🎯",
  seasonal: "🌟",
  "user-generated": "👥",
  collaboration: "🤝",
  milestone: "🏆",
  "tips-tricks": "💡",
  "before-after": "🔄",
  question: "❓",
  contest: "🎪",
};

export default function TemplatesScreen() {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const store = useGenerationStore();
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTemplates = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiClient.getTemplates();
      setTemplates(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : t("common.error")
      );
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    fetchTemplates();
  }, [fetchTemplates]);

  const handleUseTemplate = useCallback(
    (template: Template) => {
      store.setTemplateId(template.id);
      if (template.tone) store.setTone(template.tone);
      if (template.platform && template.platform !== "all") {
        store.setPlatform(template.platform);
      }
      router.push("/(tabs)");
    },
    [store, router]
  );

  const renderItem = useCallback(
    ({ item }: { item: Template }) => {
      const isTr = i18n.language === "tr";
      const name = isTr && item.nameTr ? item.nameTr : item.name;
      const desc =
        isTr && item.descriptionTr
          ? item.descriptionTr
          : item.description;

      return (
        <TouchableOpacity
          style={styles.card}
          onPress={() => handleUseTemplate(item)}
          activeOpacity={0.7}
        >
          <View style={styles.cardHeader}>
            <Text style={styles.cardEmoji}>
              {CATEGORY_EMOJIS[item.category] || "📝"}
            </Text>
            <View style={styles.cardMeta}>
              <View style={styles.platformBadge}>
                <Text style={styles.platformBadgeText}>
                  {item.platform === "all"
                    ? t("templates.allPlatforms")
                    : item.platform}
                </Text>
              </View>
              {item.isBuiltIn && (
                <View style={styles.builtInBadge}>
                  <Text style={styles.builtInBadgeText}>
                    {t("templates.builtIn")}
                  </Text>
                </View>
              )}
            </View>
          </View>
          <Text style={styles.cardTitle}>{name}</Text>
          <Text style={styles.cardDesc} numberOfLines={2}>
            {desc}
          </Text>
          <View style={styles.cardFooter}>
            <View style={styles.toneBadge}>
              <Text style={styles.toneBadgeText}>
                {t(`tones.${item.tone}`)}
              </Text>
            </View>
            <Text style={styles.useText}>
              {t("templates.useTemplate")} →
            </Text>
          </View>
        </TouchableOpacity>
      );
    },
    [handleUseTemplate, i18n.language, t]
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <View style={styles.header}>
        <Text style={styles.headerIcon}>📋</Text>
        <View>
          <Text style={styles.title}>{t("templates.title")}</Text>
          <Text style={styles.subtitle}>
            {t("templates.subtitle")}
          </Text>
        </View>
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator color="#A855F7" size="large" />
        </View>
      ) : error ? (
        <View style={styles.center}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity
            style={styles.retryBtn}
            onPress={fetchTemplates}
          >
            <Text style={styles.retryBtnText}>
              {t("common.retry")}
            </Text>
          </TouchableOpacity>
        </View>
      ) : templates.length === 0 ? (
        <View style={styles.center}>
          <Text style={styles.emptyText}>{t("common.noResults")}</Text>
        </View>
      ) : (
        <FlatList
          data={templates}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#0F0A1A",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 20,
    paddingBottom: 16,
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
  list: {
    padding: 20,
    paddingTop: 0,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  cardEmoji: {
    fontSize: 28,
  },
  cardMeta: {
    flexDirection: "row",
    gap: 6,
  },
  platformBadge: {
    backgroundColor: "rgba(59, 130, 246, 0.15)",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  platformBadgeText: {
    color: "#3B82F6",
    fontSize: 11,
    fontWeight: "600",
    textTransform: "capitalize",
  },
  builtInBadge: {
    backgroundColor: "rgba(16, 185, 129, 0.15)",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  builtInBadgeText: {
    color: "#10B981",
    fontSize: 11,
    fontWeight: "600",
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  cardDesc: {
    fontSize: 13,
    color: "#A1A1AA",
    lineHeight: 18,
    marginBottom: 12,
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  toneBadge: {
    backgroundColor: "rgba(168, 85, 247, 0.15)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  toneBadgeText: {
    color: "#A855F7",
    fontSize: 11,
    fontWeight: "600",
  },
  useText: {
    color: "#A855F7",
    fontSize: 13,
    fontWeight: "600",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },
  errorText: {
    color: "#EF4444",
    fontSize: 14,
    textAlign: "center",
    marginBottom: 16,
  },
  retryBtn: {
    backgroundColor: "rgba(168, 85, 247, 0.2)",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },
  retryBtnText: {
    color: "#A855F7",
    fontWeight: "600",
  },
  emptyText: {
    color: "#71717A",
    fontSize: 15,
  },
});
