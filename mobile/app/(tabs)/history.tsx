import { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from "react-native";
import * as Clipboard from "expo-clipboard";
import { getHistory, deleteHistory } from "../../lib/api-client";

const PURPLE = "#8B5CF6";

export default function HistoryScreen() {
  const [generations, setGenerations] = useState<any[]>([]);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const data = await getHistory();
      setGenerations(Array.isArray(data) ? data : data.generations || []);
    } catch {}
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteHistory(id);
      setGenerations((prev) => prev.filter((g) => g.id !== id));
    } catch {}
  };

  return (
    <View style={s.container}>
      <Text style={s.title}>Gecmis</Text>
      <FlatList
        data={generations}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 100 }}
        renderItem={({ item }) => (
          <View style={s.card}>
            <View style={s.cardHeader}>
              <View style={s.badge}><Text style={s.badgeText}>{item.platform}</Text></View>
              <View style={s.badge}><Text style={s.badgeText}>{item.tone}</Text></View>
              <Text style={s.date}>{item.createdAt ? new Date(item.createdAt).toLocaleDateString() : ""}</Text>
            </View>
            {item.captions?.map((c: any, i: number) => (
              <TouchableOpacity
                key={i}
                style={s.captionItem}
                onPress={() => {
                  Clipboard.setStringAsync(c.text);
                  Alert.alert("Kopyalandi!");
                }}
              >
                <Text style={s.captionText} numberOfLines={3}>{c.text}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity style={s.deleteBtn} onPress={() => handleDelete(item.id)}>
              <Text style={s.deleteBtnText}>Sil</Text>
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={<Text style={s.empty}>Henuz gecmis yok</Text>}
      />
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0a0a0f", padding: 16 },
  title: { fontSize: 28, fontWeight: "bold", color: "#fff", marginBottom: 16 },
  card: { backgroundColor: "#1f1f2e", borderRadius: 12, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: "#2d2d3f" },
  cardHeader: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 12 },
  badge: { backgroundColor: PURPLE + "20", paddingHorizontal: 10, paddingVertical: 3, borderRadius: 6 },
  badgeText: { color: PURPLE, fontSize: 11, fontWeight: "500" },
  date: { color: "#6B7280", fontSize: 11, marginLeft: "auto" },
  captionItem: { backgroundColor: "#141420", borderRadius: 8, padding: 12, marginBottom: 8 },
  captionText: { color: "#D1D5DB", fontSize: 13, lineHeight: 20 },
  deleteBtn: { alignSelf: "flex-end", paddingVertical: 4, paddingHorizontal: 10 },
  deleteBtnText: { color: "#EF4444", fontSize: 12 },
  empty: { color: "#6B7280", textAlign: "center", marginTop: 60 },
});
