import React, { useEffect } from "react";
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
import { useGenerationStore } from "@/stores/generation-store";
import CopyButton from "@/components/shared/CopyButton";
import type { FavoriteItem } from "@/types/caption";

export default function FavoritesScreen() {
  const { t } = useTranslation();
  const { favorites, isLoadingFavorites, loadFavorites, toggleFavorite } =
    useGenerationStore();

  useEffect(() => {
    loadFavorites();
  }, [loadFavorites]);

  const handleUnfavorite = (captionId: string) => {
    Alert.alert(
      t("favorites.removedFromFavorites"),
      "",
      [
        { text: t("common.cancel"), style: "cancel" },
        {
          text: t("common.delete"),
          style: "destructive",
          onPress: () => toggleFavorite(captionId),
        },
      ]
    );
  };

  const renderItem = ({ item }: { item: FavoriteItem }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        {item.generation && (
          <View style={styles.badges}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{item.generation.platform}</Text>
            </View>
            <View style={[styles.badge, styles.toneBadge]}>
              <Text style={styles.badgeText}>{item.generation.tone}</Text>
            </View>
          </View>
        )}
      </View>
      <Text style={styles.captionText} selectable>
        {item.text}
      </Text>
      {item.generation?.inputTopic && (
        <Text style={styles.topicText} numberOfLines={1}>
          Topic: {item.generation.inputTopic}
        </Text>
      )}
      <View style={styles.actions}>
        <CopyButton text={item.text} />
        <TouchableOpacity
          style={styles.heartBtn}
          onPress={() => handleUnfavorite(item.id)}
          activeOpacity={0.7}
        >
          <Text style={styles.heartText}>❤️</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <View style={styles.header}>
        <Text style={styles.title}>{t("favorites.title")}</Text>
        <Text style={styles.subtitle}>{t("favorites.subtitle")}</Text>
      </View>

      {isLoadingFavorites ? (
        <ActivityIndicator
          size="large"
          color="#8b5cf6"
          style={styles.loader}
        />
      ) : favorites.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyIcon}>❤️</Text>
          <Text style={styles.emptyText}>{t("favorites.empty")}</Text>
        </View>
      ) : (
        <FlatList
          data={favorites}
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
  safe: {
    flex: 1,
    backgroundColor: "#0F0A1A",
  },
  header: {
    padding: 20,
    paddingBottom: 12,
  },
  title: {
    color: "#f1f5f9",
    fontSize: 28,
    fontWeight: "800",
    letterSpacing: -0.5,
  },
  subtitle: {
    color: "#64748b",
    fontSize: 14,
    marginTop: 4,
  },
  list: {
    padding: 20,
    paddingTop: 8,
    gap: 12,
  },
  card: {
    backgroundColor: "rgba(30, 27, 46, 0.6)",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(139, 92, 246, 0.15)",
  },
  cardHeader: {
    marginBottom: 10,
  },
  badges: {
    flexDirection: "row",
    gap: 6,
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
  captionText: {
    color: "#e2e8f0",
    fontSize: 14,
    lineHeight: 20,
  },
  topicText: {
    color: "#475569",
    fontSize: 12,
    marginTop: 8,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "rgba(139, 92, 246, 0.1)",
  },
  heartBtn: {
    padding: 8,
  },
  heartText: {
    fontSize: 20,
  },
  loader: {
    marginTop: 60,
  },
  empty: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 80,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyText: {
    color: "#64748b",
    fontSize: 15,
    textAlign: "center",
    paddingHorizontal: 40,
  },
});
