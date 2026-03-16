import { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { getTemplates } from "../../lib/api-client";

const PURPLE = "#8B5CF6";

export default function TemplatesScreen() {
  const [templates, setTemplates] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    try {
      const data = await getTemplates();
      setTemplates(data);
    } catch {}
  };

  return (
    <View style={s.container}>
      <Text style={s.title}>Sablonlar</Text>
      <FlatList
        data={templates}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 100 }}
        renderItem={({ item }) => (
          <TouchableOpacity style={s.card}>
            <View style={s.cardHeader}>
              <Text style={s.cardTitle}>{item.nameTr || item.name}</Text>
              <View style={s.badge}>
                <Text style={s.badgeText}>{item.platform}</Text>
              </View>
            </View>
            <Text style={s.cardDesc}>{item.descriptionTr || item.description}</Text>
            <View style={s.cardFooter}>
              <View style={s.badge}>
                <Text style={s.badgeText}>{item.category}</Text>
              </View>
              <View style={s.badge}>
                <Text style={s.badgeText}>{item.tone}</Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <Text style={s.empty}>Henuz sablon yok</Text>
        }
      />
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0a0a0f", padding: 16 },
  title: { fontSize: 28, fontWeight: "bold", color: "#fff", marginBottom: 16 },
  card: {
    backgroundColor: "#1f1f2e",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#2d2d3f",
  },
  cardHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 8 },
  cardTitle: { fontSize: 16, fontWeight: "600", color: "#fff", flex: 1 },
  cardDesc: { fontSize: 13, color: "#9CA3AF", marginBottom: 12 },
  cardFooter: { flexDirection: "row", gap: 8 },
  badge: {
    backgroundColor: PURPLE + "20",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  badgeText: { color: PURPLE, fontSize: 11, fontWeight: "500" },
  empty: { color: "#6B7280", textAlign: "center", marginTop: 60 },
});
