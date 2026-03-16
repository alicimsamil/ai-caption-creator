import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";
import * as Clipboard from "expo-clipboard";
import * as apiClient from "@/lib/api-client";
import CopyButton from "@/components/shared/CopyButton";
import type { GeneratedHashtag } from "@/types/caption";

const CATEGORY_COLORS: Record<string, string> = {
  niche: "#10B981",
  broad: "#3B82F6",
  trending: "#F59E0B",
  branded: "#A855F7",
};

function getChipFontSize(relevancy: number): number {
  if (relevancy > 0.8) return 16;
  if (relevancy > 0.6) return 14;
  return 12;
}

export default function TrendingScreen() {
  const { t } = useTranslation();
  const [hashtags, setHashtags] = useState<GeneratedHashtag[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedTag, setCopiedTag] = useState<string | null>(null);

  const fetchTrending = useCallback(async () => {
    setError(null);
    try {
      const data = await apiClient.getTrending();
      setHashtags(data.hashtags);
    } catch (err) {
      setError(err instanceof Error ? err.message : t("common.error"));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [t]);

  useEffect(() => {
    fetchTrending();
  }, [fetchTrending]);

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    fetchTrending();
  }, [fetchTrending]);

  const handleCopyHashtag = useCallback(async (tag: string) => {
    await Clipboard.setStringAsync(tag);
    setCopiedTag(tag);
    setTimeout(() => setCopiedTag(null), 2000);
  }, []);

  const getCategoryColor = (category: string): string => {
    return CATEGORY_COLORS[category] || "#71717A";
  };

  const renderHashtagChip = (hashtag: GeneratedHashtag, index: number) => {
    const fontSize = getChipFontSize(hashtag.relevancy);
    const isCopied = copiedTag === hashtag.tag;
    const categoryColor = getCategoryColor(hashtag.category);

    return (
      <TouchableOpacity
        key={hashtag.id || `chip-${index}`}
        style={[
          styles.chip,
          { borderColor: `${categoryColor}40` },
        ]}
        onPress={() => handleCopyHashtag(hashtag.tag)}
        activeOpacity={0.7}
      >
        <Text
          style={[
            styles.chipText,
            { fontSize, color: isCopied ? "#A855F7" : "#E4E4E7" },
          ]}
        >
          {isCopied ? t("common.copied") : hashtag.tag}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderHashtagItem = useCallback(
    ({ item }: { item: GeneratedHashtag }) => {
      const categoryColor = getCategoryColor(item.category);
      const barWidth = `${Math.round(item.relevancy * 100)}%`;

      return (
        <View style={styles.hashtagCard}>
          <View style={styles.hashtagCardHeader}>
            <Text style={styles.hashtagTag}>{item.tag}</Text>
            <View style={styles.hashtagActions}>
              <View
                style={[
                  styles.categoryBadge,
                  { backgroundColor: `${categoryColor}20` },
                ]}
              >
                <Text
                  style={[styles.categoryBadgeText, { color: categoryColor }]}
                >
                  {item.category}
                </Text>
              </View>
              <CopyButton text={item.tag} compact label={t("trending.copyHashtag")} />
            </View>
          </View>
          <View style={styles.relevancyBarContainer}>
            <View
              style={[
                styles.relevancyBar,
                {
                  width: barWidth as any,
                  backgroundColor: categoryColor,
                },
              ]}
            />
          </View>
        </View>
      );
    },
    [t]
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea} edges={["top"]}>
        <View style={styles.header}>
          <Text style={styles.headerIcon}>🔥</Text>
          <View>
            <Text style={styles.title}>{t("trending.title")}</Text>
            <Text style={styles.subtitle}>{t("trending.subtitle")}</Text>
          </View>
        </View>
        <View style={styles.center}>
          <ActivityIndicator color="#A855F7" size="large" />
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.safeArea} edges={["top"]}>
        <View style={styles.header}>
          <Text style={styles.headerIcon}>🔥</Text>
          <View>
            <Text style={styles.title}>{t("trending.title")}</Text>
            <Text style={styles.subtitle}>{t("trending.subtitle")}</Text>
          </View>
        </View>
        <View style={styles.center}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryBtn} onPress={fetchTrending}>
            <Text style={styles.retryBtnText}>{t("common.retry")}</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <FlatList
        data={hashtags}
        renderItem={renderHashtagItem}
        keyExtractor={(item, index) => item.id || `hashtag-${index}`}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        onRefresh={handleRefresh}
        refreshing={refreshing}
        ListHeaderComponent={
          <>
            <View style={styles.header}>
              <Text style={styles.headerIcon}>🔥</Text>
              <View>
                <Text style={styles.title}>{t("trending.title")}</Text>
                <Text style={styles.subtitle}>{t("trending.subtitle")}</Text>
              </View>
            </View>

            {/* Hashtag Cloud Section */}
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>
                {t("trending.hashtagCloud")}
              </Text>
              <View style={styles.cloudContainer}>
                {hashtags.map((hashtag, index) =>
                  renderHashtagChip(hashtag, index)
                )}
              </View>
            </View>

            {/* Top Hashtags Section Header */}
            <Text style={[styles.sectionTitle, styles.topHashtagsTitle]}>
              {t("trending.topHashtags")}
            </Text>
          </>
        }
      />
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
  list: {
    paddingBottom: 40,
  },
  sectionContainer: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 12,
  },
  topHashtagsTitle: {
    paddingHorizontal: 20,
  },
  cloudContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    backgroundColor: "rgba(255, 255, 255, 0.03)",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
  },
  chip: {
    backgroundColor: "rgba(255, 255, 255, 0.06)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
  },
  chipText: {
    fontWeight: "600",
  },
  hashtagCard: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 20,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
  },
  hashtagCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  hashtagTag: {
    color: "#E4E4E7",
    fontSize: 15,
    fontWeight: "600",
    flexShrink: 1,
    marginRight: 8,
  },
  hashtagActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  categoryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  categoryBadgeText: {
    fontSize: 11,
    fontWeight: "600",
    textTransform: "capitalize",
  },
  relevancyBarContainer: {
    height: 4,
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    borderRadius: 2,
    overflow: "hidden",
  },
  relevancyBar: {
    height: 4,
    borderRadius: 2,
  },
});
