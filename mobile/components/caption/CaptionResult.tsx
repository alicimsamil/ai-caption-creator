import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import type { GeneratedCaption } from "@/types/caption";
import CopyButton from "@/components/shared/CopyButton";

interface CaptionResultProps {
  caption: GeneratedCaption;
  index: number;
  onFavorite?: (caption: GeneratedCaption) => void;
}

export default function CaptionResult({
  caption,
  index,
  onFavorite,
}: CaptionResultProps) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>#{index + 1}</Text>
        </View>
        <View style={styles.actions}>
          {onFavorite && (
            <TouchableOpacity
              onPress={() => onFavorite(caption)}
              style={styles.favoriteBtn}
              activeOpacity={0.7}
            >
              <Text style={styles.favoriteIcon}>
                {caption.isFavorite ? "❤️" : "🤍"}
              </Text>
            </TouchableOpacity>
          )}
          <CopyButton text={caption.text} compact />
        </View>
      </View>
      <Text style={styles.captionText}>{caption.text}</Text>
      {(caption.hook || caption.body || caption.cta) && (
        <View style={styles.breakdown}>
          {caption.hook && (
            <View style={styles.breakdownItem}>
              <Text style={styles.breakdownLabel}>Hook</Text>
              <Text style={styles.breakdownText}>{caption.hook}</Text>
            </View>
          )}
          {caption.body && (
            <View style={styles.breakdownItem}>
              <Text style={styles.breakdownLabel}>Body</Text>
              <Text style={styles.breakdownText}>{caption.body}</Text>
            </View>
          )}
          {caption.cta && (
            <View style={styles.breakdownItem}>
              <Text style={styles.breakdownLabel}>CTA</Text>
              <Text style={styles.breakdownText}>{caption.cta}</Text>
            </View>
          )}
        </View>
      )}
      <View style={styles.footer}>
        <Text style={styles.charCount}>
          {caption.charCount} chars
        </Text>
        <View style={styles.badges}>
          {caption.hasEmojis && (
            <View style={styles.featureBadge}>
              <Text style={styles.featureBadgeText}>Emojis</Text>
            </View>
          )}
          {caption.hasCta && (
            <View style={styles.featureBadge}>
              <Text style={styles.featureBadgeText}>CTA</Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  badge: {
    backgroundColor: "rgba(168, 85, 247, 0.2)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeText: {
    color: "#A855F7",
    fontSize: 12,
    fontWeight: "700",
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  favoriteBtn: {
    padding: 4,
  },
  favoriteIcon: {
    fontSize: 18,
  },
  captionText: {
    color: "#E4E4E7",
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 12,
  },
  breakdown: {
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.08)",
    paddingTop: 12,
    marginBottom: 12,
    gap: 8,
  },
  breakdownItem: {
    gap: 2,
  },
  breakdownLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: "#A855F7",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  breakdownText: {
    color: "#A1A1AA",
    fontSize: 13,
    lineHeight: 18,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  charCount: {
    fontSize: 12,
    color: "#71717A",
  },
  badges: {
    flexDirection: "row",
    gap: 6,
  },
  featureBadge: {
    backgroundColor: "rgba(168, 85, 247, 0.1)",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  featureBadgeText: {
    fontSize: 10,
    color: "#A855F7",
    fontWeight: "600",
  },
});
