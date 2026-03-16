import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";
import * as apiClient from "@/lib/api-client";
import CopyButton from "@/components/shared/CopyButton";
import type { GenerationResult, GeneratedCaption } from "@/types/caption";

export default function FavoritesScreen() {
  const { t } = useTranslation();
  const [favorites, setFavorites] = useState<GenerationResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFavorites = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiClient.getFavorites();
      setFavorites(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : t("common.error")
      );
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    fetchFavorites();
  }, [fetchFavorites]);

  const handleUnfavorite = useCallback(
    async (caption: GeneratedCaption) => {
      if (!caption.id) return;
      try {
        await apiClient.toggleFavorite(caption.id);
        Alert.alert("", t("favorites.removedFromFavorites"));
        fetchFavorites();
      } catch {
        // Silently fail
      }
    },
    [fetchFavorites, t]
  );

  // Flatten all captions from favorites results
  const allCaptions = favorites.flatMap((result) =>
    result.captions.map((caption) => ({
      ...caption,
      platform: result.platform,
      tone: result.tone,
    }))
  );

  const renderItem = useCallback(
    ({
      item,
    }: {
      item: GeneratedCaption & { tone: string };
    }) => (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.cardMeta}>
            <View style={styles.platformBadge}>
              <Text style={styles.platformBadgeText}>
                {item.platform}
              </Text>
            </View>
          </View>
          <View style={styles.actions}>
            <TouchableOpacity
              onPress={() => handleUnfavorite(item)}
              style={styles.unfavoriteBtn}
              activeOpacity={0.7}
            >
              <Text style={styles.unfavoriteIcon}>❤️</Text>
            </TouchableOpacity>
            <CopyButton text={item.text} compact />
          </View>
        </View>
        <Text style={styles.captionText}>{item.text}</Text>
        <View style={styles.cardFooter}>
          <Text style={styles.charCount}>
            {item.charCount} chars
          </Text>
        </View>
      </View>
    ),
    [handleUnfavorite]
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <View style={styles.header}>
        <Text style={styles.headerIcon}>❤️</Text>
        <View>
          <Text style={styles.title}>{t("favorites.title")}</Text>
          <Text style={styles.subtitle}>
            {t("favorites.subtitle")}
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
            onPress={fetchFavorites}
          >
            <Text style={styles.retryBtnText}>
              {t("common.retry")}
            </Text>
          </TouchableOpacity>
        </View>
      ) : allCaptions.length === 0 ? (
        <View style={styles.center}>
          <Text style={styles.emptyIcon}>🤍</Text>
          <Text style={styles.emptyText}>
            {t("favorites.empty")}
          </Text>
        </View>
      ) : (
        <FlatList
          data={allCaptions}
          renderItem={renderItem}
          keyExtractor={(item) =>
            item.id || Math.random().toString()
          }
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          onRefresh={fetchFavorites}
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
  actions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  unfavoriteBtn: {
    padding: 4,
  },
  unfavoriteIcon: {
    fontSize: 18,
  },
  captionText: {
    color: "#E4E4E7",
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 12,
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  charCount: {
    fontSize: 12,
    color: "#71717A",
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
