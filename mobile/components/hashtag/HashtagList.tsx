import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import type { GeneratedHashtag } from "@/types/caption";
import CopyButton from "@/components/shared/CopyButton";

interface HashtagListProps {
  hashtags: GeneratedHashtag[];
}

const CATEGORY_COLORS: Record<string, string> = {
  niche: "#8b5cf6",
  broad: "#3b82f6",
  trending: "#f59e0b",
  branded: "#ec4899",
};

export default function HashtagList({ hashtags }: HashtagListProps) {
  if (!hashtags.length) return null;

  const allTags = hashtags.map((h) => h.tag).join(" ");

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Hashtags</Text>
        <CopyButton text={allTags} />
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.tagsRow}>
          {hashtags.map((hashtag, index) => (
            <View
              key={index}
              style={[
                styles.tag,
                {
                  borderColor:
                    CATEGORY_COLORS[hashtag.category] || "#8b5cf6",
                },
              ]}
            >
              <Text style={styles.tagText}>{hashtag.tag}</Text>
              <Text style={styles.categoryText}>{hashtag.category}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  title: {
    color: "#e2e8f0",
    fontSize: 16,
    fontWeight: "700",
  },
  tagsRow: {
    flexDirection: "row",
    gap: 8,
    paddingBottom: 4,
  },
  tag: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "rgba(139, 92, 246, 0.08)",
    borderWidth: 1,
  },
  tagText: {
    color: "#c4b5fd",
    fontSize: 13,
    fontWeight: "600",
  },
  categoryText: {
    color: "#64748b",
    fontSize: 10,
    marginTop: 2,
    textTransform: "capitalize",
  },
});
