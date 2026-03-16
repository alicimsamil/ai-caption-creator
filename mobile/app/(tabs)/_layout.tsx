import React from "react";
import { Tabs } from "expo-router";
import { View, Text, StyleSheet } from "react-native";
import { useTranslation } from "react-i18next";

function TabIcon({
  icon,
  label,
  focused,
}: {
  icon: string;
  label: string;
  focused: boolean;
}) {
  return (
    <View style={styles.tabIconContainer}>
      <Text style={[styles.tabIcon, focused && styles.tabIconFocused]}>
        {icon}
      </Text>
      <Text style={[styles.tabLabel, focused && styles.tabLabelFocused]}>
        {label}
      </Text>
    </View>
  );
}

export default function TabLayout() {
  const { t } = useTranslation();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarShowLabel: false,
        tabBarActiveTintColor: "#A855F7",
        tabBarInactiveTintColor: "#71717A",
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: t("nav.generate"),
          tabBarIcon: ({ focused }) => (
            <TabIcon
              icon="✨"
              label={t("nav.generate")}
              focused={focused}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="templates"
        options={{
          title: t("nav.templates"),
          tabBarIcon: ({ focused }) => (
            <TabIcon
              icon="📋"
              label={t("nav.templates")}
              focused={focused}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: t("nav.history"),
          tabBarIcon: ({ focused }) => (
            <TabIcon
              icon="🕐"
              label={t("nav.history")}
              focused={focused}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="favorites"
        options={{
          title: t("nav.favorites"),
          tabBarIcon: ({ focused }) => (
            <TabIcon
              icon="❤️"
              label={t("nav.favorites")}
              focused={focused}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: t("nav.settings"),
          tabBarIcon: ({ focused }) => (
            <TabIcon
              icon="⚙️"
              label={t("nav.settings")}
              focused={focused}
            />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: "#0F0A1A",
    borderTopColor: "rgba(168, 85, 247, 0.15)",
    borderTopWidth: 1,
    height: 80,
    paddingTop: 8,
    paddingBottom: 16,
  },
  tabIconContainer: {
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
  tabIcon: {
    fontSize: 22,
    opacity: 0.5,
  },
  tabIconFocused: {
    opacity: 1,
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: "600",
    color: "#71717A",
  },
  tabLabelFocused: {
    color: "#A855F7",
  },
});
