import React, { useEffect } from "react";
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
import { useGenerationStore } from "@/stores/generation-store";
import type { Template } from "@/types/caption";

export default function TemplatesScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { templates, isLoadingTemplates, loadTemplates, applyTemplate } =
    useGenerationStore();

  useEffect(() => {
    loadTemplates();
  }, [loadTemplates]);

  const handleUseTemplate = (template: Template) => {
    applyTemplate(template);
    router.navigate("/(tabs)");
  };

  const renderTemplate = ({ item }: { item: Template }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.badges}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>
              {item.platform === "all" ? "All" : item.platform}
            </Text>
          </View>
          <View style={[styles.badge, styles.toneBadge]}>
            <Text style={styles.badgeText}>{item.tone}</Text>
          </View>
          {item.isBuiltIn && (
            <View style={[styles.badge, styles.builtInBadge]}>
              <Text style={styles.badgeText}>{t("templates.builtIn")}</Text>
            </View>
          )}
        </View>
      </View>
      <Text style={styles.cardTitle}>{item.name}</Text>
      <Text style={styles.cardDesc} numberOfLines={2}>
        {item.description}
      </Text>
      <TouchableOpacity
        style={styles.useBtn}
        onPress={() => handleUseTemplate(item)}
        activeOpacity={0.7}
      >
        <Text style={styles.useBtnText}>{t("templates.useTemplate")}</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <View style={styles.header}>
        <Text style={styles.title}>{t("templates.title")}</Text>
        <Text style={styles.subtitle}>{t("templates.subtitle")}</Text>
      </View>

      {isLoadingTemplates ? (
        <ActivityIndicator
          size="large"
          color="#8b5cf6"
          style={styles.loader}
        />
      ) : templates.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>{t("templates.empty")}</Text>
        </View>
      ) : (
        <FlatList
          data={templates}
          renderItem={renderTemplate}
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
  builtInBadge: {
    backgroundColor: "rgba(34, 197, 94, 0.15)",
  },
  badgeText: {
    color: "#c4b5fd",
    fontSize: 11,
    fontWeight: "600",
    textTransform: "capitalize",
  },
  cardTitle: {
    color: "#e2e8f0",
    fontSize: 16,
    fontWeight: "700",
  },
  cardDesc: {
    color: "#94a3b8",
    fontSize: 13,
    marginTop: 4,
    lineHeight: 18,
  },
  useBtn: {
    marginTop: 12,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: "rgba(139, 92, 246, 0.15)",
    borderWidth: 1,
    borderColor: "rgba(139, 92, 246, 0.3)",
    alignItems: "center",
  },
  useBtnText: {
    color: "#a78bfa",
    fontSize: 13,
    fontWeight: "700",
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
  emptyText: {
    color: "#64748b",
    fontSize: 15,
  },
});
