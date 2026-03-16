import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import type { GeneratedHashtag } from "@/types/caption";
import CopyButton from "@/components/shared/CopyButton";

interface HashtagListProps {
  hashtags: GeneratedHashtag[];
}

const CATEGORY_COLORS: Record<string, string> = {
  niche: "#A855F7",
  broad: "#3B82F6",
  trending: "#F59E0B",
  branded: "#10B981",
};

export default function HashtagList({ hashtags }: HashtagListProps) {
  if (!hashtags.length) return null;

  const allTags = hashtags.map((h) => h.tag).join(" ");

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Hashtags</Text>
        <CopyButton text={allTags} compact />
      </View>
      <ScrollView
        horizontal={false}
        contentContainerStyle={styles.tagContainer}
      >
        {hashtags.map((hashtag, index) => (
          <View
            key={index}
            style={[
              styles.tag,
              {
                borderColor:
                  CATEGORY_COLORS[hashtag.category] || "#A855F7",
              },
            ]}
          >
            <Text style={styles.tagText}>{hashtag.tag}</Text>
            <View
              style={[
                styles.relevancyDot,
                {
                  backgroundColor:
                    CATEGORY_COLORS[hashtag.category] || "#A855F7",
                  opacity: hashtag.relevancy / 100,
                },
              ]}
            />
          </View>
        ))}
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
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  tagContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  tag: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(168, 85, 247, 0.1)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
  },
  tagText: {
    color: "#D4D4D8",
    fontSize: 13,
    fontWeight: "500",
  },
  relevancyDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginLeft: 6,
  },
});
