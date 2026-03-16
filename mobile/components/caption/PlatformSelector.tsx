import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";
import { useTranslation } from "react-i18next";
import { PLATFORMS } from "@/lib/platform-config";
import type { Platform } from "@/types/platform";

interface PlatformSelectorProps {
  selected: Platform;
  onSelect: (platform: Platform) => void;
}

const PLATFORM_ICONS: Record<Platform, string> = {
  instagram: "📷",
  tiktok: "🎵",
  twitter: "𝕏",
  linkedin: "💼",
  facebook: "📘",
  youtube: "▶️",
  pinterest: "📌",
};

export default function PlatformSelector({
  selected,
  onSelect,
}: PlatformSelectorProps) {
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{t("generate.platform")}</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {PLATFORMS.map((platform) => {
          const isSelected = platform.id === selected;
          return (
            <TouchableOpacity
              key={platform.id}
              style={[styles.chip, isSelected && styles.chipSelected]}
              onPress={() => onSelect(platform.id)}
              activeOpacity={0.7}
            >
              <Text style={styles.chipIcon}>
                {PLATFORM_ICONS[platform.id]}
              </Text>
              <Text
                style={[
                  styles.chipText,
                  isSelected && styles.chipTextSelected,
                ]}
              >
                {platform.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#A1A1AA",
    marginBottom: 8,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  scrollContent: {
    gap: 8,
    paddingRight: 16,
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    gap: 6,
  },
  chipSelected: {
    backgroundColor: "rgba(168, 85, 247, 0.2)",
    borderColor: "#A855F7",
  },
  chipIcon: {
    fontSize: 16,
  },
  chipText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#A1A1AA",
  },
  chipTextSelected: {
    color: "#A855F7",
  },
});
