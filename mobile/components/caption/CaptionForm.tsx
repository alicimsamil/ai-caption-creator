import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Switch,
  StyleSheet,
  Image,
  ActivityIndicator,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useTranslation } from "react-i18next";
import { useGenerationStore } from "@/stores/generation-store";
import PlatformSelector from "./PlatformSelector";
import ToneSelector from "./ToneSelector";
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

interface CaptionFormProps {
  onGenerate: () => void;
}

export default function CaptionForm({ onGenerate }: CaptionFormProps) {
  const { t } = useTranslation();
  const store = useGenerationStore();

  const pickImage = async (source: "camera" | "gallery") => {
    let result;
    if (source === "camera") {
      const permission =
        await ImagePicker.requestCameraPermissionsAsync();
      if (!permission.granted) {
        Alert.alert(
          "Permission required",
          "Camera permission is needed to take photos."
        );
        return;
      }
      result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.8,
        base64: true,
      });
    } else {
      result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.8,
        base64: true,
      });
    }

    if (!result.canceled && result.assets[0]) {
      store.setImageUri(result.assets[0].uri);
    }
  };

  const showImagePicker = () => {
    Alert.alert(t("generate.uploadImage"), "", [
      { text: "Camera", onPress: () => pickImage("camera") },
      { text: "Gallery", onPress: () => pickImage("gallery") },
      { text: t("common.cancel"), style: "cancel" },
    ]);
  };

  const removeImage = () => {
    store.setImageUri(null);
    store.setImageDescription(null);
  };

  return (
    <View style={styles.container}>
      {/* Topic Input */}
      <View style={styles.section}>
        <Text style={styles.label}>{t("generate.topic")}</Text>
        <TextInput
          style={styles.textInput}
          placeholder={t("generate.topicPlaceholder")}
          placeholderTextColor="#52525B"
          value={store.topic}
          onChangeText={store.setTopic}
          multiline
          numberOfLines={3}
          textAlignVertical="top"
        />
      </View>

      {/* Platform Selector */}
      <PlatformSelector
        selected={store.platform}
        onSelect={store.setPlatform}
      />

      {/* Tone Selector */}
      <ToneSelector selected={store.tone} onSelect={store.setTone} />

      {/* Language Selector */}
      <View style={styles.section}>
        <Text style={styles.label}>{t("generate.language")}</Text>
        <View style={styles.langGrid}>
          {LANGUAGES.map((lang) => {
            const isSelected = lang.id === store.language;
            return (
              <TouchableOpacity
                key={lang.id}
                style={[
                  styles.langChip,
                  isSelected && styles.langChipSelected,
                ]}
                onPress={() => store.setLanguage(lang.id)}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.langChipText,
                    isSelected && styles.langChipTextSelected,
                  ]}
                >
                  {lang.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Count Selector */}
      <View style={styles.section}>
        <Text style={styles.label}>{t("generate.count")}</Text>
        <View style={styles.countRow}>
          {[1, 2, 3, 5].map((num) => {
            const isSelected = num === store.count;
            return (
              <TouchableOpacity
                key={num}
                style={[
                  styles.countChip,
                  isSelected && styles.countChipSelected,
                ]}
                onPress={() => store.setCount(num)}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.countChipText,
                    isSelected && styles.countChipTextSelected,
                  ]}
                >
                  {num}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Image Picker */}
      <View style={styles.section}>
        <Text style={styles.label}>{t("generate.uploadImage")}</Text>
        {store.imageUri ? (
          <View style={styles.imagePreview}>
            <Image
              source={{ uri: store.imageUri }}
              style={styles.previewImage}
            />
            <TouchableOpacity
              style={styles.removeImageBtn}
              onPress={removeImage}
            >
              <Text style={styles.removeImageText}>✕</Text>
            </TouchableOpacity>
            {store.isAnalyzingImage && (
              <View style={styles.analyzingOverlay}>
                <ActivityIndicator color="#A855F7" />
                <Text style={styles.analyzingText}>
                  {t("generate.analyzing")}
                </Text>
              </View>
            )}
          </View>
        ) : (
          <TouchableOpacity
            style={styles.imagePickerBtn}
            onPress={showImagePicker}
            activeOpacity={0.7}
          >
            <Text style={styles.imagePickerIcon}>📷</Text>
            <Text style={styles.imagePickerText}>
              {t("generate.uploadImageDesc")}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Toggles */}
      <View style={styles.togglesContainer}>
        <View style={styles.toggleRow}>
          <Text style={styles.toggleLabel}>
            {t("generate.includeEmojis")}
          </Text>
          <Switch
            value={store.includeEmojis}
            onValueChange={store.setIncludeEmojis}
            trackColor={{
              false: "#3F3F46",
              true: "rgba(168, 85, 247, 0.4)",
            }}
            thumbColor={store.includeEmojis ? "#A855F7" : "#71717A"}
          />
        </View>
        <View style={styles.toggleRow}>
          <Text style={styles.toggleLabel}>
            {t("generate.includeCta")}
          </Text>
          <Switch
            value={store.includeCta}
            onValueChange={store.setIncludeCta}
            trackColor={{
              false: "#3F3F46",
              true: "rgba(168, 85, 247, 0.4)",
            }}
            thumbColor={store.includeCta ? "#A855F7" : "#71717A"}
          />
        </View>
        <View style={styles.toggleRow}>
          <Text style={styles.toggleLabel}>
            {t("generate.includeHashtags")}
          </Text>
          <Switch
            value={store.includeHashtags}
            onValueChange={store.setIncludeHashtags}
            trackColor={{
              false: "#3F3F46",
              true: "rgba(168, 85, 247, 0.4)",
            }}
            thumbColor={
              store.includeHashtags ? "#A855F7" : "#71717A"
            }
          />
        </View>
      </View>

      {/* Generate Button */}
      <TouchableOpacity
        style={[
          styles.generateBtn,
          (!store.topic.trim() || store.isGenerating) &&
            styles.generateBtnDisabled,
        ]}
        onPress={onGenerate}
        disabled={!store.topic.trim() || store.isGenerating}
        activeOpacity={0.8}
      >
        {store.isGenerating ? (
          <View style={styles.generatingRow}>
            <ActivityIndicator color="#FFFFFF" size="small" />
            <Text style={styles.generateBtnText}>
              {t("common.generating")}
            </Text>
          </View>
        ) : (
          <Text style={styles.generateBtnText}>
            ✨ {t("generate.generateBtn")}
          </Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 4,
  },
  section: {
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
  textInput: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 12,
    padding: 14,
    color: "#E4E4E7",
    fontSize: 15,
    minHeight: 80,
  },
  langGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  langChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  langChipSelected: {
    backgroundColor: "rgba(168, 85, 247, 0.2)",
    borderColor: "#A855F7",
  },
  langChipText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#A1A1AA",
  },
  langChipTextSelected: {
    color: "#A855F7",
  },
  countRow: {
    flexDirection: "row",
    gap: 8,
  },
  countChip: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  countChipSelected: {
    backgroundColor: "rgba(168, 85, 247, 0.2)",
    borderColor: "#A855F7",
  },
  countChipText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#A1A1AA",
  },
  countChipTextSelected: {
    color: "#A855F7",
  },
  imagePickerBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 12,
    borderStyle: "dashed",
    paddingVertical: 24,
  },
  imagePickerIcon: {
    fontSize: 24,
  },
  imagePickerText: {
    color: "#A1A1AA",
    fontSize: 14,
  },
  imagePreview: {
    position: "relative",
    borderRadius: 12,
    overflow: "hidden",
  },
  previewImage: {
    width: "100%",
    height: 180,
    borderRadius: 12,
  },
  removeImageBtn: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "rgba(0,0,0,0.7)",
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  removeImageText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },
  analyzingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  analyzingText: {
    color: "#A855F7",
    fontSize: 13,
    fontWeight: "600",
  },
  togglesContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.03)",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.06)",
    padding: 4,
    marginBottom: 20,
  },
  toggleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  toggleLabel: {
    color: "#D4D4D8",
    fontSize: 14,
    fontWeight: "500",
  },
  generateBtn: {
    backgroundColor: "#A855F7",
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
    shadowColor: "#A855F7",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  generateBtnDisabled: {
    backgroundColor: "#52525B",
    shadowOpacity: 0,
    elevation: 0,
  },
  generateBtnText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
  generatingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
});
