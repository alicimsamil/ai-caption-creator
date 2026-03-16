import React, { useEffect, useState, useCallback } from "react";
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
import i18n from "i18next";
import * as storage from "@/lib/storage";
import * as apiClient from "@/lib/api-client";

export default function SettingsScreen() {
  const { t } = useTranslation();
  const [serverUrl, setServerUrl] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [models, setModels] = useState<string[]>([]);
  const [language, setLanguage] = useState("en");
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [connectionStatus, setConnectionStatus] = useState<
    "unknown" | "connected" | "disconnected"
  >("unknown");
  const [testing, setTesting] = useState(false);
  const [loadingModels, setLoadingModels] = useState(false);

  useEffect(() => {
    (async () => {
      const url = await storage.getServerUrl();
      const lang = await storage.getLanguage();
      const thm = await storage.getTheme();
      const mdl = await storage.getModel();
      setServerUrl(url);
      setLanguage(lang);
      setTheme(thm);
      setSelectedModel(mdl);
    })();
  }, []);

  const handleSaveUrl = useCallback(async () => {
    await storage.setServerUrl(serverUrl);
    Alert.alert("", t("settings.saved"));
  }, [serverUrl, t]);

  const handleTestConnection = useCallback(async () => {
    setTesting(true);
    try {
      await apiClient.checkHealth();
      setConnectionStatus("connected");
    } catch {
      setConnectionStatus("disconnected");
    } finally {
      setTesting(false);
    }
  }, []);

  const handleLoadModels = useCallback(async () => {
    setLoadingModels(true);
    try {
      const result = await apiClient.getModels();
      setModels(result.models);
    } catch {
      Alert.alert(t("common.error"), "Could not load models");
    } finally {
      setLoadingModels(false);
    }
  }, [t]);

  const handleSelectModel = useCallback(
    async (model: string) => {
      setSelectedModel(model);
      await storage.setModel(model);
    },
    []
  );

  const handleChangeLanguage = useCallback(
    async (lang: string) => {
      setLanguage(lang);
      await storage.setLanguage(lang);
      i18n.changeLanguage(lang);
    },
    []
  );

  const handleChangeTheme = useCallback(
    async (thm: "dark" | "light") => {
      setTheme(thm);
      await storage.setTheme(thm);
    },
    []
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerIcon}>⚙️</Text>
          <View>
            <Text style={styles.title}>{t("settings.title")}</Text>
            <Text style={styles.subtitle}>
              {t("settings.subtitle")}
            </Text>
          </View>
        </View>

        {/* Server URL */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {t("settings.serverUrl")}
          </Text>
          <TextInput
            style={styles.textInput}
            value={serverUrl}
            onChangeText={setServerUrl}
            placeholder={t("settings.serverUrlPlaceholder")}
            placeholderTextColor="#52525B"
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
              <Text style={styles.actionBtnText}>
                {t("common.save")}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionBtn, styles.testBtn]}
              onPress={handleTestConnection}
              disabled={testing}
              activeOpacity={0.7}
            >
              {testing ? (
                <ActivityIndicator color="#A855F7" size="small" />
              ) : (
                <Text style={styles.actionBtnText}>
                  {t("settings.testConnection")}
                </Text>
              )}
            </TouchableOpacity>
          </View>
          {connectionStatus !== "unknown" && (
            <View
              style={[
                styles.statusBadge,
                connectionStatus === "connected"
                  ? styles.statusConnected
                  : styles.statusDisconnected,
              ]}
            >
              <View
                style={[
                  styles.statusDot,
                  {
                    backgroundColor:
                      connectionStatus === "connected"
                        ? "#10B981"
                        : "#EF4444",
                  },
                ]}
              />
              <Text
                style={[
                  styles.statusText,
                  {
                    color:
                      connectionStatus === "connected"
                        ? "#10B981"
                        : "#EF4444",
                  },
                ]}
              >
                {connectionStatus === "connected"
                  ? t("settings.connected")
                  : t("settings.disconnected")}
              </Text>
            </View>
          )}
        </View>

        {/* AI Model */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              {t("settings.aiModel")}
            </Text>
            <TouchableOpacity
              onPress={handleLoadModels}
              disabled={loadingModels}
              activeOpacity={0.7}
            >
              {loadingModels ? (
                <ActivityIndicator color="#A855F7" size="small" />
              ) : (
                <Text style={styles.refreshText}>Refresh</Text>
              )}
            </TouchableOpacity>
          </View>
          {models.length > 0 ? (
            <View style={styles.modelGrid}>
              {models.map((model) => {
                const isSelected = model === selectedModel;
                return (
                  <TouchableOpacity
                    key={model}
                    style={[
                      styles.modelChip,
                      isSelected && styles.modelChipSelected,
                    ]}
                    onPress={() => handleSelectModel(model)}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        styles.modelChipText,
                        isSelected && styles.modelChipTextSelected,
                      ]}
                      numberOfLines={1}
                    >
                      {model}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          ) : (
            <Text style={styles.hintText}>
              Tap Refresh to load available models
            </Text>
          )}
        </View>

        {/* Language */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {t("settings.defaultLanguage")}
          </Text>
          <View style={styles.langRow}>
            {[
              { id: "en", label: "English" },
              { id: "tr", label: "Turkce" },
            ].map((lang) => {
              const isSelected = lang.id === language;
              return (
                <TouchableOpacity
                  key={lang.id}
                  style={[
                    styles.langChip,
                    isSelected && styles.langChipSelected,
                  ]}
                  onPress={() => handleChangeLanguage(lang.id)}
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

        {/* Theme */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {t("settings.theme")}
          </Text>
          <View style={styles.langRow}>
            {[
              {
                id: "dark" as const,
                label: t("settings.themeDark"),
                icon: "🌙",
              },
              {
                id: "light" as const,
                label: t("settings.themeLight"),
                icon: "☀️",
              },
            ].map((thm) => {
              const isSelected = thm.id === theme;
              return (
                <TouchableOpacity
                  key={thm.id}
                  style={[
                    styles.langChip,
                    isSelected && styles.langChipSelected,
                  ]}
                  onPress={() => handleChangeTheme(thm.id)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.themeIcon}>{thm.icon}</Text>
                  <Text
                    style={[
                      styles.langChipText,
                      isSelected && styles.langChipTextSelected,
                    ]}
                  >
                    {thm.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* App Info */}
        <View style={styles.infoSection}>
          <Text style={styles.infoTitle}>CaptionAI Mobile</Text>
          <Text style={styles.infoVersion}>Version 1.0.0</Text>
          <Text style={styles.infoDesc}>
            AI-Powered Social Media Caption Generator
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#0F0A1A",
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 28,
  },
  headerIcon: {
    fontSize: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    color: "#FFFFFF",
  },
  subtitle: {
    fontSize: 13,
    color: "#71717A",
    marginTop: 2,
  },
  section: {
    marginBottom: 28,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#A1A1AA",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 10,
  },
  textInput: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 12,
    padding: 14,
    color: "#E4E4E7",
    fontSize: 15,
  },
  urlActions: {
    flexDirection: "row",
    gap: 10,
    marginTop: 10,
  },
  actionBtn: {
    flex: 1,
    backgroundColor: "rgba(168, 85, 247, 0.15)",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(168, 85, 247, 0.3)",
  },
  testBtn: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  actionBtnText: {
    color: "#A855F7",
    fontWeight: "600",
    fontSize: 14,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 10,
    padding: 10,
    borderRadius: 8,
  },
  statusConnected: {
    backgroundColor: "rgba(16, 185, 129, 0.1)",
  },
  statusDisconnected: {
    backgroundColor: "rgba(239, 68, 68, 0.1)",
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 13,
    fontWeight: "600",
  },
  refreshText: {
    color: "#A855F7",
    fontSize: 13,
    fontWeight: "600",
  },
  modelGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  modelChip: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  modelChipSelected: {
    backgroundColor: "rgba(168, 85, 247, 0.2)",
    borderColor: "#A855F7",
  },
  modelChipText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#A1A1AA",
  },
  modelChipTextSelected: {
    color: "#A855F7",
  },
  hintText: {
    color: "#52525B",
    fontSize: 13,
    fontStyle: "italic",
  },
  langRow: {
    flexDirection: "row",
    gap: 10,
  },
  langChip: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  langChipSelected: {
    backgroundColor: "rgba(168, 85, 247, 0.2)",
    borderColor: "#A855F7",
  },
  langChipText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#A1A1AA",
  },
  langChipTextSelected: {
    color: "#A855F7",
  },
  themeIcon: {
    fontSize: 18,
  },
  infoSection: {
    alignItems: "center",
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.06)",
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#A855F7",
  },
  infoVersion: {
    fontSize: 12,
    color: "#71717A",
    marginTop: 4,
  },
  infoDesc: {
    fontSize: 12,
    color: "#52525B",
    marginTop: 4,
  },
});
