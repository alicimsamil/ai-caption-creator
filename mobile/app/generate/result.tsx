import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from "react-native";
import * as Clipboard from "expo-clipboard";
import { useGenerationStore } from "../../stores/generation-store";

const PURPLE = "#8B5CF6";

export default function ResultScreen() {
  const results = useGenerationStore((s) => s.results);

  if (!results) {
    return (
      <View style={s.container}>
        <Text style={s.empty}>Henuz sonuc yok</Text>
      </View>
    );
  }

  return (
    <ScrollView style={s.container} contentContainerStyle={{ padding: 16, paddingBottom: 100 }}>
      <Text style={s.title}>Sonuclar</Text>
      {results.captions?.map((c: any, i: number) => (
        <View key={i} style={s.card}>
          <Text style={s.cardLabel}>Caption {i + 1}</Text>
          <Text style={s.text}>{c.text}</Text>
          <TouchableOpacity
            style={s.copyBtn}
            onPress={() => { Clipboard.setStringAsync(c.text); Alert.alert("Kopyalandi!"); }}
          >
            <Text style={s.copyText}>Kopyala</Text>
          </TouchableOpacity>
        </View>
      ))}
    </ScrollView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0a0a0f" },
  title: { fontSize: 24, fontWeight: "bold", color: "#fff", marginBottom: 16 },
  empty: { color: "#6B7280", textAlign: "center", marginTop: 60 },
  card: { backgroundColor: "#1f1f2e", borderRadius: 12, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: "#2d2d3f" },
  cardLabel: { color: PURPLE, fontSize: 12, fontWeight: "600", marginBottom: 8 },
  text: { color: "#E5E7EB", fontSize: 14, lineHeight: 22 },
  copyBtn: { backgroundColor: PURPLE + "20", borderRadius: 8, paddingVertical: 8, alignItems: "center", marginTop: 12 },
  copyText: { color: PURPLE, fontWeight: "600" },
});
