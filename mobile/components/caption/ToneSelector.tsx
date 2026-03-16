import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";
import { useTranslation } from "react-i18next";
import { TONE_CONFIGS } from "@/lib/platform-config";
import type { Tone } from "@/types/platform";

interface ToneSelectorProps {
  selected: Tone;
  onSelect: (tone: Tone) => void;
}

export default function ToneSelector({
  selected,
  onSelect,
}: ToneSelectorProps) {
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{t("generate.tone")}</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {TONE_CONFIGS.map((tone) => {
          const isSelected = tone.id === selected;
          return (
            <TouchableOpacity
              key={tone.id}
              style={[styles.chip, isSelected && styles.chipSelected]}
              onPress={() => onSelect(tone.id)}
              activeOpacity={0.7}
            >
              <Text style={styles.chipEmoji}>{tone.emoji}</Text>
              <Text
                style={[
                  styles.chipText,
                  isSelected && styles.chipTextSelected,
                ]}
              >
                {t(`tones.${tone.id}`)}
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
  chipEmoji: {
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
