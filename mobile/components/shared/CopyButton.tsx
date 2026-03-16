import React, { useState } from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import * as Clipboard from "expo-clipboard";
import { useTranslation } from "react-i18next";

interface CopyButtonProps {
  text: string;
  label?: string;
  compact?: boolean;
  style?: object;
}

export default function CopyButton({
  text,
  label,
  compact = false,
  style,
}: CopyButtonProps) {
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await Clipboard.setStringAsync(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <TouchableOpacity
      style={[styles.button, compact && styles.compact, style]}
      onPress={handleCopy}
      activeOpacity={0.7}
    >
      <Text style={[styles.text, compact && styles.compactText]}>
        {copied
          ? t("common.copied")
          : label || t("common.copy")}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: "rgba(168, 85, 247, 0.15)",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "rgba(168, 85, 247, 0.3)",
  },
  compact: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  text: {
    color: "#A855F7",
    fontSize: 14,
    fontWeight: "600",
  },
  compactText: {
    fontSize: 12,
  },
});
