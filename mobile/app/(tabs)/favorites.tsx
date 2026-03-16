import { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from "react-native";
import * as Clipboard from "expo-clipboard";
import { getFavorites, toggleFavorite } from "../../lib/api-client";

const PURPLE = "#8B5CF6";

export default function FavoritesScreen() {
  const [favorites, setFavorites] = useState<any[]>([]);

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    try {
      const data = await getFavorites();
      setFavorites(Array.isArray(data) ? data : []);
    } catch {}
  };

  const handleRemove = async (id: string) => {
    try {
      await toggleFavorite(id);
      setFavorites((prev) => prev.filter((f) => f.id !== id));
    } catch {}
  };

  return (
    <View style={s.container}>
      <Text style={s.title}>Favoriler</Text>
      <FlatList
        data={favorites}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 100 }}
        renderItem={({ item }) => (
          <View style={s.card}>
            <View style={s.cardHeader}>
              <View style={s.badge}><Text style={s.badgeText}>{item.platform}</Text></View>
              <Text style={s.charCount}>{item.charCount || item.text?.length} kar.</Text>
            </View>
            <Text style={s.captionText}>{item.text}</Text>
            <View style={s.actions}>
              <TouchableOpacity
                style={s.actionBtn}
                onPress={() => { Clipboard.setStringAsync(item.text); Alert.alert("Kopyalandi!"); }}
              >
                <Text style={s.actionText}>Kopyala</Text>
              </TouchableOpacity>
              <TouchableOpacity style={s.actionBtn} onPress={() => handleRemove(item.id)}>
                <Text style={[s.actionText, { color: "#EF4444" }]}>Kaldir</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        ListEmptyComponent={<Text style={s.empty}>Henuz favori yok</Text>}
      />
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0a0a0f", padding: 16 },
  title: { fontSize: 28, fontWeight: "bold", color: "#fff", marginBottom: 16 },
  card: { backgroundColor: "#1f1f2e", borderRadius: 12, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: "#2d2d3f" },
  cardHeader: { flexDirection: "row", justifyContent: "space-between", marginBottom: 10 },
  badge: { backgroundColor: PURPLE + "20", paddingHorizontal: 10, paddingVertical: 3, borderRadius: 6 },
  badgeText: { color: PURPLE, fontSize: 11, fontWeight: "500" },
  charCount: { color: "#6B7280", fontSize: 11 },
  captionText: { color: "#D1D5DB", fontSize: 14, lineHeight: 22, marginBottom: 12 },
  actions: { flexDirection: "row", gap: 12 },
  actionBtn: { paddingVertical: 4 },
  actionText: { color: PURPLE, fontSize: 13, fontWeight: "600" },
  empty: { color: "#6B7280", textAlign: "center", marginTop: 60 },
});
