import React, { useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";
import { useGenerationStore } from "@/stores/generation-store";
import CopyButton from "@/components/shared/CopyButton";
import type { HistoryItem } from "@/types/caption";

export default function HistoryScreen() {
  const { t } = useTranslation();
  const { history, isLoadingHistory, loadHistory } = useGenerationStore();

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  const renderItem = ({ item }: { item: HistoryItem }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.badges}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{item.platform}</Text>
          </View>
          <View style={[styles.badge, styles.toneBadge]}>
            <Text style={styles.badgeText}>{item.tone}</Text>
          </View>
        </View>
        <Text style={styles.date}>
          {new Date(item.createdAt).toLocaleDateString()}
        </Text>
      </View>
      <Text style={styles.topic} numberOfLines={2}>
        {item.inputTopic}
      </Text>
      {item.captions.length > 0 && (
        <View style={styles.captionPreview}>
          <Text style={styles.captionText} numberOfLines={3}>
            {item.captions[0].text}
          </Text>
          <CopyButton text={item.captions[0].text} />
        </View>
      )}
      <Text style={styles.meta}>
        {item.captions.length} captions | {item.model}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <View style={styles.header}>
        <Text style={styles.title}>{t("history.title")}</Text>
        <Text style={styles.subtitle}>{t("history.subtitle")}</Text>
      </View>

      {isLoadingHistory ? (
        <ActivityIndicator
          size="large"
          color="#8b5cf6"
          style={styles.loader}
        />
      ) : history.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyIcon}>🕐</Text>
          <Text style={styles.emptyText}>{t("history.empty")}</Text>
        </View>
      ) : (
        <FlatList
          data={history}
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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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
  date: {
    color: "#475569",
    fontSize: 12,
  },
  topic: {
    color: "#e2e8f0",
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 10,
  },
  captionPreview: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    backgroundColor: "rgba(15, 10, 26, 0.5)",
    borderRadius: 10,
    padding: 12,
  },
  captionText: {
    flex: 1,
    color: "#94a3b8",
    fontSize: 13,
    lineHeight: 18,
  },
  meta: {
    color: "#475569",
    fontSize: 11,
    marginTop: 10,
    textTransform: "capitalize",
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
  },
});
