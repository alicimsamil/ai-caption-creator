import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";
import i18next from "i18next";
import * as storage from "@/lib/storage";
import { checkHealth, getModels } from "@/lib/api-client";
import type { ModelInfo } from "@/types/caption";

export default function SettingsScreen() {
  const { t } = useTranslation();
  const [serverUrl, setServerUrl] = useState("http://localhost:3000");
  const [selectedModel, setSelectedModel] = useState("llama3");
  const [language, setLanguage] = useState("en");
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [models, setModels] = useState<ModelInfo[]>([]);
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [isTesting, setIsTesting] = useState(false);

  useEffect(() => {
    (async () => {
      setServerUrl(await storage.getServerUrl());
      setSelectedModel(await storage.getModel());
      setLanguage(await storage.getLanguage());
      setTheme(await storage.getTheme());
    })();
  }, []);

  const handleSaveUrl = async () => {
    await storage.setServerUrl(serverUrl);
    Alert.alert(t("settings.saved"));
  };

  const handleTestConnection = async () => {
    setIsTesting(true);
    try {
      await checkHealth();
      setIsConnected(true);
      const modelsList = await getModels();
      setModels(modelsList);
    } catch {
      setIsConnected(false);
    } finally {
      setIsTesting(false);
    }
  };

  const handleModelSelect = async (model: string) => {
    setSelectedModel(model);
    await storage.setModel(model);
  };

  const handleLanguageChange = async (lang: string) => {
    setLanguage(lang);
    await storage.setLanguage(lang);
    i18next.changeLanguage(lang);
  };

  const handleThemeChange = async (newTheme: "dark" | "light") => {
    setTheme(newTheme);
    await storage.setTheme(newTheme);
  };

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>{t("settings.title")}</Text>
          <Text style={styles.subtitle}>{t("settings.subtitle")}</Text>
        </View>

        {/* Server URL */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t("settings.serverUrl")}</Text>
          <TextInput
            style={styles.input}
            value={serverUrl}
            onChangeText={setServerUrl}
            placeholder={t("settings.serverUrlPlaceholder")}
            placeholderTextColor="#475569"
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="url"
          />
          <View style={styles.urlActions}>
            <TouchableOpacity
              style={styles.actionBtn}
              onPress={handleSaveUrl}
              activeOpacity={0.7}
            >
              <Text style={styles.actionBtnText}>{t("common.save")}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionBtn, styles.testBtn]}
              onPress={handleTestConnection}
              disabled={isTesting}
              activeOpacity={0.7}
            >
              {isTesting ? (
                <ActivityIndicator size="small" color="#a78bfa" />
              ) : (
                <Text style={styles.actionBtnText}>
                  {t("settings.testConnection")}
                </Text>
              )}
            </TouchableOpacity>
          </View>
          {isConnected !== null && (
            <View
              style={[
                styles.statusBadge,
                isConnected ? styles.statusConnected : styles.statusDisconnected,
              ]}
            >
              <Text
                style={[
                  styles.statusText,
                  isConnected
                    ? styles.statusTextConnected
                    : styles.statusTextDisconnected,
                ]}
              >
                {isConnected
                  ? t("settings.connected")
                  : t("settings.disconnected")}
              </Text>
            </View>
          )}
        </View>

        {/* AI Model */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t("settings.aiModel")}</Text>
          {models.length > 0 ? (
            <View style={styles.chipRow}>
              {models.map((model) => (
                <TouchableOpacity
                  key={model.name}
                  style={[
                    styles.chip,
                    selectedModel === model.name && styles.chipSelected,
                  ]}
                  onPress={() => handleModelSelect(model.name)}
                >
                  <Text
                    style={[
                      styles.chipText,
                      selectedModel === model.name && styles.chipTextSelected,
                    ]}
                  >
                    {model.name}
                  </Text>
                  <Text style={styles.chipSub}>{model.sizeHuman}</Text>
                </TouchableOpacity>
              ))}
            </View>
          ) : (
            <Text style={styles.hintText}>
              {selectedModel} (test connection to load models)
            </Text>
          )}
        </View>

        {/* Language */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {t("settings.defaultLanguage")}
          </Text>
          <View style={styles.chipRow}>
            {[
              { id: "en", label: "English" },
              { id: "tr", label: "Turkce" },
            ].map((lang) => (
              <TouchableOpacity
                key={lang.id}
                style={[
                  styles.chip,
                  language === lang.id && styles.chipSelected,
                ]}
                onPress={() => handleLanguageChange(lang.id)}
              >
                <Text
                  style={[
                    styles.chipText,
                    language === lang.id && styles.chipTextSelected,
                  ]}
                >
                  {lang.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Theme */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t("settings.theme")}</Text>
          <View style={styles.chipRow}>
            {[
              { id: "dark" as const, label: t("settings.dark") },
              { id: "light" as const, label: t("settings.light") },
            ].map((opt) => (
              <TouchableOpacity
                key={opt.id}
                style={[
                  styles.chip,
                  theme === opt.id && styles.chipSelected,
                ]}
                onPress={() => handleThemeChange(opt.id)}
              >
                <Text
                  style={[
                    styles.chipText,
                    theme === opt.id && styles.chipTextSelected,
                  ]}
                >
                  {opt.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
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
  section: {
    marginBottom: 28,
  },
  sectionTitle: {
    color: "#c4b5fd",
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 10,
    letterSpacing: 0.5,
  },
  input: {
    backgroundColor: "rgba(30, 27, 46, 0.8)",
    borderRadius: 12,
    padding: 14,
    color: "#e2e8f0",
    fontSize: 15,
    borderWidth: 1,
    borderColor: "rgba(139, 92, 246, 0.2)",
  },
  urlActions: {
    flexDirection: "row",
    gap: 10,
    marginTop: 10,
  },
  actionBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: "rgba(139, 92, 246, 0.15)",
    borderWidth: 1,
    borderColor: "rgba(139, 92, 246, 0.3)",
    alignItems: "center",
  },
  testBtn: {
    backgroundColor: "rgba(139, 92, 246, 0.08)",
  },
  actionBtnText: {
    color: "#a78bfa",
    fontSize: 13,
    fontWeight: "700",
  },
  statusBadge: {
    marginTop: 10,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 10,
    alignSelf: "flex-start",
  },
  statusConnected: {
    backgroundColor: "rgba(34, 197, 94, 0.15)",
  },
  statusDisconnected: {
    backgroundColor: "rgba(239, 68, 68, 0.15)",
  },
  statusText: {
    fontSize: 13,
    fontWeight: "600",
  },
  statusTextConnected: {
    color: "#22c55e",
  },
  statusTextDisconnected: {
    color: "#ef4444",
  },
  chipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: "rgba(30, 27, 46, 0.8)",
    borderWidth: 1,
    borderColor: "rgba(139, 92, 246, 0.2)",
  },
  chipSelected: {
    backgroundColor: "rgba(139, 92, 246, 0.2)",
    borderColor: "#8b5cf6",
  },
  chipText: {
    color: "#94a3b8",
    fontSize: 14,
    fontWeight: "600",
  },
  chipTextSelected: {
    color: "#c4b5fd",
  },
  chipSub: {
    color: "#475569",
    fontSize: 11,
    marginTop: 2,
  },
  hintText: {
    color: "#475569",
    fontSize: 13,
    fontStyle: "italic",
  },
});
