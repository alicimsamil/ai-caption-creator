import React from "react";
import { View, Text, StyleSheet } from "react-native";
import type { GeneratedCaption } from "@/types/caption";
import { getPlatformConfig } from "@/lib/platform-config";
import CopyButton from "@/components/shared/CopyButton";

interface CaptionResultProps {
  caption: GeneratedCaption;
  index: number;
}

export default function CaptionResult({ caption, index }: CaptionResultProps) {
  const platformConfig = getPlatformConfig(caption.platform);
  const isOverLimit = caption.charCount > platformConfig.charLimit;

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.label}>Caption {index + 1}</Text>
        <View style={styles.headerRight}>
          <Text
            style={[styles.charCount, isOverLimit && styles.charCountOver]}
          >
            {caption.charCount}/{platformConfig.charLimit}
          </Text>
          <CopyButton text={caption.text} />
        </View>
      </View>
      <Text style={styles.captionText} selectable>
        {caption.text}
      </Text>
      {caption.hook && (
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Hook</Text>
          <Text style={styles.sectionText}>{caption.hook}</Text>
        </View>
      )}
      {caption.body && (
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Body</Text>
          <Text style={styles.sectionText}>{caption.body}</Text>
        </View>
      )}
      {caption.cta && (
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>CTA</Text>
          <Text style={styles.sectionText}>{caption.cta}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "rgba(30, 27, 46, 0.6)",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(139, 92, 246, 0.15)",
    marginBottom: 12,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  label: {
    color: "#a78bfa",
    fontSize: 13,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  charCount: {
    color: "#64748b",
    fontSize: 12,
  },
  charCountOver: {
    color: "#ef4444",
  },
  captionText: {
    color: "#e2e8f0",
    fontSize: 15,
    lineHeight: 22,
  },
  section: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "rgba(139, 92, 246, 0.1)",
  },
  sectionLabel: {
    color: "#8b5cf6",
    fontSize: 11,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 4,
  },
  sectionText: {
    color: "#cbd5e1",
    fontSize: 14,
    lineHeight: 20,
  },
});
