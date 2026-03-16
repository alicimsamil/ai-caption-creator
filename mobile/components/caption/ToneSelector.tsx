import React from "react";
import { TouchableOpacity, Text, ScrollView, StyleSheet } from "react-native";
import type { Tone } from "@/types/platform";
import { TONE_CONFIGS } from "@/lib/platform-config";

interface ToneSelectorProps {
  selected: Tone;
  onSelect: (tone: Tone) => void;
}

export default function ToneSelector({ selected, onSelect }: ToneSelectorProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {TONE_CONFIGS.map((tone) => {
        const isSelected = selected === tone.id;
        return (
          <TouchableOpacity
            key={tone.id}
            style={[styles.chip, isSelected && styles.chipSelected]}
            onPress={() => onSelect(tone.id)}
            activeOpacity={0.7}
          >
            <Text style={styles.emoji}>{tone.emoji}</Text>
            <Text
              style={[styles.chipText, isSelected && styles.chipTextSelected]}
            >
              {tone.name}
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
