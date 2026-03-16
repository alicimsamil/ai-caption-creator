import React from "react";
import { ScrollView, Text, View, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";
import CaptionForm from "@/components/caption/CaptionForm";
import CaptionResult from "@/components/caption/CaptionResult";
import HashtagList from "@/components/hashtag/HashtagList";
import { useGenerationStore } from "@/stores/generation-store";

export default function GenerateScreen() {
  const { t } = useTranslation();
  const { captions, hashtags, result } = useGenerationStore();

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>{t("generate.title")}</Text>
          <Text style={styles.subtitle}>{t("generate.subtitle")}</Text>
        </View>

        <CaptionForm />

        {result && captions.length > 0 && (
          <View style={styles.results}>
            <Text style={styles.resultsTitle}>{t("generate.results")}</Text>
            {captions.map((caption, index) => (
              <CaptionResult
                key={caption.id || index}
                caption={caption}
                index={index}
              />
            ))}
            {hashtags.length > 0 && <HashtagList hashtags={hashtags} />}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#0F0A1A",
  },
  scroll: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 24,
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
  results: {
    marginTop: 28,
  },
  resultsTitle: {
    color: "#e2e8f0",
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 16,
  },
});
