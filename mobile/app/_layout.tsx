import React, { useEffect } from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { View, StyleSheet } from "react-native";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import * as Localization from "expo-localization";
import en from "@/i18n/en.json";
import tr from "@/i18n/tr.json";
import { getLanguage } from "@/lib/storage";

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    tr: { translation: tr },
  },
  lng: "en",
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
});

export default function RootLayout() {
  useEffect(() => {
    (async () => {
      const savedLang = await getLanguage();
      if (savedLang) {
        i18n.changeLanguage(savedLang);
      } else {
        const deviceLocale = Localization.getLocales()[0]?.languageCode;
        if (deviceLocale && (deviceLocale === "tr" || deviceLocale === "en")) {
          i18n.changeLanguage(deviceLocale);
        }
      }
    })();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: "#0F0A1A" },
          animation: "slide_from_right",
        }}
      >
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="trending" />
        <Stack.Screen name="generate/result" />
      </Stack>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0F0A1A",
  },
});
