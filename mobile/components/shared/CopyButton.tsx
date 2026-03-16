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
  style?: object;
}

export default function CopyButton({ text, label, style }: CopyButtonProps) {
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);
  const [copying, setCopying] = useState(false);

  const handleCopy = async () => {
    setCopying(true);
    try {
      await Clipboard.setStringAsync(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } finally {
      setCopying(false);
    }
  };

  return (
    <TouchableOpacity
      style={[styles.button, copied && styles.buttonCopied, style]}
      onPress={handleCopy}
      disabled={copying}
      activeOpacity={0.7}
    >
      {copying ? (
        <ActivityIndicator size="small" color="#fff" />
      ) : (
        <Text style={[styles.text, copied && styles.textCopied]}>
          {copied
            ? t("common.copied")
            : label || t("common.copy")}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: "rgba(139, 92, 246, 0.15)",
    borderWidth: 1,
    borderColor: "rgba(139, 92, 246, 0.3)",
  },
  buttonCopied: {
    backgroundColor: "rgba(34, 197, 94, 0.15)",
    borderColor: "rgba(34, 197, 94, 0.3)",
  },
  text: {
    color: "#a78bfa",
    fontSize: 13,
    fontWeight: "600",
  },
  textCopied: {
    color: "#22c55e",
  },
});
