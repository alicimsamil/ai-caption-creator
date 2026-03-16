import React from "react";
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from "react-native";
import type { Platform } from "@/types/platform";
import { PLATFORMS } from "@/lib/platform-config";

interface PlatformSelectorProps {
  selected: Platform;
  onSelect: (platform: Platform) => void;
}

const PLATFORM_EMOJIS: Record<Platform, string> = {
  instagram: "📸",
  tiktok: "🎵",
  twitter: "🐦",
  linkedin: "💼",
  facebook: "👥",
  youtube: "▶️",
  pinterest: "📌",
};

export default function PlatformSelector({
  selected,
  onSelect,
}: PlatformSelectorProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {PLATFORMS.map((platform) => {
        const isSelected = selected === platform.id;
        return (
          <TouchableOpacity
            key={platform.id}
            style={[styles.chip, isSelected && styles.chipSelected]}
            onPress={() => onSelect(platform.id)}
            activeOpacity={0.7}
          >
            <Text style={styles.emoji}>{PLATFORM_EMOJIS[platform.id]}</Text>
            <Text
              style={[styles.chipText, isSelected && styles.chipTextSelected]}
            >
              {platform.name}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 4,
    gap: 8,
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: "rgba(30, 27, 46, 0.8)",
    borderWidth: 1,
    borderColor: "rgba(139, 92, 246, 0.2)",
    gap: 6,
  },
  chipSelected: {
    backgroundColor: "rgba(139, 92, 246, 0.2)",
    borderColor: "#8b5cf6",
  },
  emoji: {
    fontSize: 16,
  },
  chipText: {
    color: "#94a3b8",
    fontSize: 13,
    fontWeight: "600",
  },
  chipTextSelected: {
    color: "#c4b5fd",
  },
});
