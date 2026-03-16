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
import { useTranslation } from "react-i18next";
import * as apiClient from "@/lib/api-client";
import CopyButton from "@/components/shared/CopyButton";
import type { GenerationResult } from "@/types/caption";

export default function HistoryScreen() {
  const { t } = useTranslation();
  const [history, setHistory] = useState<GenerationResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHistory = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiClient.getHistory();
      setHistory(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : t("common.error")
      );
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const renderItem = useCallback(
    ({ item }: { item: GenerationResult }) => (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.cardMeta}>
            <View style={styles.platformBadge}>
              <Text style={styles.platformBadgeText}>
                {item.platform}
              </Text>
            </View>
            <View style={styles.toneBadge}>
              <Text style={styles.toneBadgeText}>
                {t(`tones.${item.tone}`)}
              </Text>
            </View>
          </View>
          <Text style={styles.dateText}>
            {formatDate(item.createdAt)}
          </Text>
        </View>

        {item.captions.slice(0, 2).map((caption, idx) => (
          <View key={idx} style={styles.captionPreview}>
            <Text style={styles.captionText} numberOfLines={3}>
              {caption.text}
            </Text>
            <CopyButton text={caption.text} compact />
          </View>
        ))}

        {item.captions.length > 2 && (
          <Text style={styles.moreText}>
            +{item.captions.length - 2} more captions
          </Text>
        )}

        {item.hashtags.length > 0 && (
          <View style={styles.hashtagPreview}>
            <Text style={styles.hashtagText} numberOfLines={1}>
              {item.hashtags
                .slice(0, 5)
                .map((h) => h.tag)
                .join(" ")}
            </Text>
          </View>
        )}
      </View>
    ),
    [t]
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <View style={styles.header}>
        <Text style={styles.headerIcon}>🕐</Text>
        <View>
          <Text style={styles.title}>{t("history.title")}</Text>
          <Text style={styles.subtitle}>
            {t("history.subtitle")}
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
            onPress={fetchHistory}
          >
            <Text style={styles.retryBtnText}>
              {t("common.retry")}
            </Text>
          </TouchableOpacity>
        </View>
      ) : history.length === 0 ? (
        <View style={styles.center}>
          <Text style={styles.emptyIcon}>🕐</Text>
          <Text style={styles.emptyText}>{t("history.empty")}</Text>
        </View>
      ) : (
        <FlatList
          data={history}
          renderItem={renderItem}
          keyExtractor={(item) => item.id || Math.random().toString()}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          onRefresh={fetchHistory}
          refreshing={loading}
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
    marginBottom: 12,
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
  toneBadge: {
    backgroundColor: "rgba(168, 85, 247, 0.15)",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  toneBadgeText: {
    color: "#A855F7",
    fontSize: 11,
    fontWeight: "600",
  },
  dateText: {
    color: "#71717A",
    fontSize: 11,
  },
  captionPreview: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 10,
    marginBottom: 8,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.05)",
  },
  captionText: {
    flex: 1,
    color: "#D4D4D8",
    fontSize: 13,
    lineHeight: 18,
  },
  moreText: {
    color: "#71717A",
    fontSize: 12,
    fontStyle: "italic",
    marginBottom: 8,
  },
  hashtagPreview: {
    marginTop: 4,
  },
  hashtagText: {
    color: "#A855F7",
    fontSize: 12,
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
  emptyIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyText: {
    color: "#71717A",
    fontSize: 15,
    textAlign: "center",
  },
});
