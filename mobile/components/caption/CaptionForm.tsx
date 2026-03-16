import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Switch,
  Alert,
  Image,
  ActivityIndicator,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useTranslation } from "react-i18next";
import { useGenerationStore } from "@/stores/generation-store";
import PlatformSelector from "./PlatformSelector";
import ToneSelector from "./ToneSelector";
import { analyzeImage } from "@/lib/api-client";
import type { Language } from "@/types/platform";

const LANGUAGES: { id: Language; label: string }[] = [
  { id: "en", label: "English" },
  { id: "tr", label: "Turkce" },
  { id: "de", label: "Deutsch" },
  { id: "fr", label: "Francais" },
  { id: "es", label: "Espanol" },
  { id: "pt", label: "Portugues" },
  { id: "ar", label: "Arabic" },
  { id: "ja", label: "Japanese" },
  { id: "ko", label: "Korean" },
  { id: "zh", label: "Chinese" },
];

export default function CaptionForm() {
  const { t } = useTranslation();
  const store = useGenerationStore();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [analyzingImage, setAnalyzingImage] = useState(false);

  const pickImage = async (source: "camera" | "gallery") => {
    let result;
    if (source === "camera") {
      const permission = await ImagePicker.requestCameraPermissionsAsync();
      if (!permission.granted) {
        Alert.alert("Permission needed", "Camera permission is required");
        return;
      }
      result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.8,
      });
    } else {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        Alert.alert("Permission needed", "Gallery permission is required");
        return;
      }
      result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.8,
      });
    }

    if (!result.canceled && result.assets[0]) {
      const asset = result.assets[0];
      setSelectedImage(asset.uri);
      setAnalyzingImage(true);
      try {
        const analysis = await analyzeImage(
          asset.uri,
          asset.mimeType || "image/jpeg"
        );
        store.setImageDescription(analysis.description);
      } catch {
        Alert.alert("Error", "Failed to analyze image");
      } finally {
        setAnalyzingImage(false);
      }
    }
  };

  const showImagePicker = () => {
    Alert.alert(t("generate.uploadImage"), "", [
      { text: "Camera", onPress: () => pickImage("camera") },
      { text: "Gallery", onPress: () => pickImage("gallery") },
      { text: t("common.cancel"), style: "cancel" },
    ]);
  };

  return (
    <View style={styles.container}>
      {/* Platform selector */}
      <Text style={styles.label}>{t("generate.platform")}</Text>
      <PlatformSelector
        selected={store.platform}
        onSelect={store.setPlatform}
      />

      {/* Topic input */}
      <Text style={[styles.label, { marginTop: 20 }]}>
        {t("generate.topic")}
      </Text>
      <TextInput
        style={styles.textInput}
        placeholder={t("generate.topicPlaceholder")}
        placeholderTextColor="#475569"
        value={store.topic}
        onChangeText={store.setTopic}
        multiline
        numberOfLines={3}
        textAlignVertical="top"
      />

      {/* Tone selector */}
      <Text style={[styles.label, { marginTop: 20 }]}>
        {t("generate.tone")}
      </Text>
      <ToneSelector selected={store.tone} onSelect={store.setTone} />

      {/* Language selector */}
      <Text style={[styles.label, { marginTop: 20 }]}>
        {t("generate.language")}
      </Text>
      <View style={styles.langRow}>
        {LANGUAGES.slice(0, 5).map((lang) => (
          <TouchableOpacity
            key={lang.id}
            style={[
              styles.langChip,
              store.language === lang.id && styles.langChipSelected,
            ]}
            onPress={() => store.setLanguage(lang.id)}
          >
            <Text
              style={[
                styles.langText,
                store.language === lang.id && styles.langTextSelected,
              ]}
            >
              {lang.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Count selector */}
      <Text style={[styles.label, { marginTop: 20 }]}>
        {t("generate.count")}
      </Text>
      <View style={styles.countRow}>
        {[1, 2, 3, 5].map((num) => (
          <TouchableOpacity
            key={num}
            style={[
              styles.countChip,
              store.count === num && styles.countChipSelected,
            ]}
            onPress={() => store.setCount(num)}
          >
            <Text
              style={[
                styles.countText,
                store.count === num && styles.countTextSelected,
              ]}
            >
              {num}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Image picker */}
      <TouchableOpacity
        style={styles.imageButton}
        onPress={showImagePicker}
        activeOpacity={0.7}
      >
        <Text style={styles.imageButtonText}>
          {analyzingImage
            ? t("generate.analyzing")
            : t("generate.uploadImage")}
        </Text>
        {analyzingImage && (
          <ActivityIndicator
            size="small"
            color="#8b5cf6"
            style={{ marginLeft: 8 }}
          />
        )}
      </TouchableOpacity>

      {selectedImage && (
        <Image
          source={{ uri: selectedImage }}
          style={styles.imagePreview}
          resizeMode="cover"
        />
      )}

      {store.imageDescription ? (
        <View style={styles.analysisBox}>
          <Text style={styles.analysisLabel}>
            {t("generate.imageAnalysis")}
          </Text>
          <Text style={styles.analysisText}>{store.imageDescription}</Text>
        </View>
      ) : null}

      {/* Toggles */}
      <View style={styles.toggleRow}>
        <Text style={styles.toggleLabel}>{t("generate.includeEmojis")}</Text>
        <Switch
          value={store.includeEmojis}
          onValueChange={store.setIncludeEmojis}
          trackColor={{ false: "#334155", true: "#7c3aed" }}
          thumbColor={store.includeEmojis ? "#c4b5fd" : "#94a3b8"}
        />
      </View>
      <View style={styles.toggleRow}>
        <Text style={styles.toggleLabel}>{t("generate.includeCta")}</Text>
        <Switch
          value={store.includeCta}
          onValueChange={store.setIncludeCta}
          trackColor={{ false: "#334155", true: "#7c3aed" }}
          thumbColor={store.includeCta ? "#c4b5fd" : "#94a3b8"}
        />
      </View>
      <View style={styles.toggleRow}>
        <Text style={styles.toggleLabel}>{t("generate.includeHashtags")}</Text>
        <Switch
          value={store.includeHashtags}
          onValueChange={store.setIncludeHashtags}
          trackColor={{ false: "#334155", true: "#7c3aed" }}
          thumbColor={store.includeHashtags ? "#c4b5fd" : "#94a3b8"}
        />
      </View>

      {/* Persona */}
      <Text style={[styles.label, { marginTop: 16 }]}>
        {t("generate.persona")}
      </Text>
      <TextInput
        style={[styles.textInput, { minHeight: 44 }]}
        placeholder={t("generate.personaPlaceholder")}
        placeholderTextColor="#475569"
        value={store.persona}
        onChangeText={store.setPersona}
      />

      {/* Generate button */}
      <TouchableOpacity
        style={[styles.generateBtn, store.isGenerating && styles.generateBtnDisabled]}
        onPress={store.generate}
        disabled={store.isGenerating}
        activeOpacity={0.8}
      >
        {store.isGenerating ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.generateBtnText}>
            {store.result
              ? t("generate.regenerate")
              : t("generate.generateBtn")}
          </Text>
        )}
      </TouchableOpacity>

      {store.error && (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>{store.error}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: 20,
  },
  label: {
    color: "#c4b5fd",
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  textInput: {
    backgroundColor: "rgba(30, 27, 46, 0.8)",
    borderRadius: 12,
    padding: 14,
    color: "#e2e8f0",
    fontSize: 15,
    borderWidth: 1,
    borderColor: "rgba(139, 92, 246, 0.2)",
    minHeight: 80,
  },
  langRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  langChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: "rgba(30, 27, 46, 0.8)",
    borderWidth: 1,
    borderColor: "rgba(139, 92, 246, 0.2)",
  },
  langChipSelected: {
    backgroundColor: "rgba(139, 92, 246, 0.2)",
    borderColor: "#8b5cf6",
  },
  langText: {
    color: "#94a3b8",
    fontSize: 13,
    fontWeight: "600",
  },
  langTextSelected: {
    color: "#c4b5fd",
  },
  countRow: {
    flexDirection: "row",
    gap: 10,
  },
  countChip: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(30, 27, 46, 0.8)",
    borderWidth: 1,
    borderColor: "rgba(139, 92, 246, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  countChipSelected: {
    backgroundColor: "rgba(139, 92, 246, 0.25)",
    borderColor: "#8b5cf6",
  },
  countText: {
    color: "#94a3b8",
    fontSize: 16,
    fontWeight: "700",
  },
  countTextSelected: {
    color: "#c4b5fd",
  },
  imageButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(139, 92, 246, 0.3)",
    borderStyle: "dashed",
    backgroundColor: "rgba(139, 92, 246, 0.05)",
  },
  imageButtonText: {
    color: "#a78bfa",
    fontSize: 14,
    fontWeight: "600",
  },
  imagePreview: {
    width: "100%",
    height: 200,
    borderRadius: 12,
    marginTop: 12,
  },
  analysisBox: {
    marginTop: 12,
    padding: 12,
    borderRadius: 10,
    backgroundColor: "rgba(139, 92, 246, 0.08)",
    borderWidth: 1,
    borderColor: "rgba(139, 92, 246, 0.15)",
  },
  analysisLabel: {
    color: "#a78bfa",
    fontSize: 12,
    fontWeight: "700",
    marginBottom: 4,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  analysisText: {
    color: "#cbd5e1",
    fontSize: 13,
    lineHeight: 18,
  },
  toggleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 14,
    paddingVertical: 4,
  },
  toggleLabel: {
    color: "#cbd5e1",
    fontSize: 14,
  },
  generateBtn: {
    marginTop: 24,
    paddingVertical: 16,
    borderRadius: 14,
    backgroundColor: "#7c3aed",
    alignItems: "center",
    shadowColor: "#7c3aed",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  generateBtnDisabled: {
    opacity: 0.6,
  },
  generateBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  errorBox: {
    marginTop: 12,
    padding: 12,
    borderRadius: 10,
    backgroundColor: "rgba(239, 68, 68, 0.1)",
    borderWidth: 1,
    borderColor: "rgba(239, 68, 68, 0.3)",
  },
  errorText: {
    color: "#fca5a5",
    fontSize: 13,
  },
});
