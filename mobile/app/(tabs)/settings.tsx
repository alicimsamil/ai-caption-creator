import { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from "react-native";
import { getServerUrl, setServerUrl } from "../../lib/storage";
import { checkHealth, getModels } from "../../lib/api-client";

const PURPLE = "#8B5CF6";

export default function SettingsScreen() {
  const [url, setUrl] = useState("http://localhost:3000");
  const [connected, setConnected] = useState<boolean | null>(null);
  const [models, setModels] = useState<string[]>([]);
  const [checking, setChecking] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    const saved = await getServerUrl();
    if (saved) setUrl(saved);
  };

  const handleSave = async () => {
    await setServerUrl(url);
    Alert.alert("Kaydedildi", "Sunucu URL guncellendi");
  };

  const handleTestConnection = async () => {
    setChecking(true);
    try {
      await setServerUrl(url);
      const health = await checkHealth();
      setConnected(true);
      try {
        const modelsData = await getModels();
        setModels(modelsData.models || []);
      } catch {}
      Alert.alert("Bagli!", "Sunucuya basariyla baglanildi");
    } catch {
      setConnected(false);
      Alert.alert("Hata", "Sunucuya baglanilamadi");
    } finally {
      setChecking(false);
    }
  };

  return (
    <ScrollView style={s.container} contentContainerStyle={s.content}>
      <Text style={s.title}>Ayarlar</Text>

      <View style={s.card}>
        <Text style={s.cardTitle}>Sunucu Baglantisi</Text>
        <Text style={s.label}>Sunucu URL</Text>
        <TextInput
          style={s.input}
          value={url}
          onChangeText={setUrl}
          placeholder="http://localhost:3000"
          placeholderTextColor="#6B7280"
          autoCapitalize="none"
          autoCorrect={false}
        />

        <View style={s.statusRow}>
          <Text style={s.label}>Durum:</Text>
          {connected === true && <Text style={s.connected}>Bagli</Text>}
          {connected === false && <Text style={s.disconnected}>Bagli Degil</Text>}
          {connected === null && <Text style={s.unknown}>Bilinmiyor</Text>}
        </View>

        <View style={s.buttonRow}>
          <TouchableOpacity style={s.btn} onPress={handleSave}>
            <Text style={s.btnText}>Kaydet</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[s.btn, s.btnOutline]}
            onPress={handleTestConnection}
            disabled={checking}
          >
            <Text style={s.btnOutlineText}>
              {checking ? "Test ediliyor..." : "Baglantiyi Test Et"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {models.length > 0 && (
        <View style={s.card}>
          <Text style={s.cardTitle}>Mevcut Modeller</Text>
          {models.map((m, i) => (
            <View key={i} style={s.modelItem}>
              <Text style={s.modelText}>{m}</Text>
            </View>
          ))}
        </View>
      )}

      <View style={s.card}>
        <Text style={s.cardTitle}>Hakkinda</Text>
        <Text style={s.aboutText}>CaptionAI v1.0.0</Text>
        <Text style={s.aboutText}>Self-hosted AI Caption Generator</Text>
        <Text style={s.aboutText}>Powered by Ollama + BLIP</Text>
      </View>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0a0a0f" },
  content: { padding: 16, paddingBottom: 100 },
  title: { fontSize: 28, fontWeight: "bold", color: "#fff", marginBottom: 20 },
  card: { backgroundColor: "#1f1f2e", borderRadius: 12, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: "#2d2d3f" },
  cardTitle: { fontSize: 16, fontWeight: "bold", color: "#fff", marginBottom: 12 },
  label: { fontSize: 13, color: "#9CA3AF", marginBottom: 6 },
  input: { backgroundColor: "#141420", borderRadius: 8, padding: 12, color: "#fff", fontSize: 14, borderWidth: 1, borderColor: "#2d2d3f", fontFamily: "monospace" },
  statusRow: { flexDirection: "row", alignItems: "center", gap: 8, marginTop: 12 },
  connected: { color: "#10B981", fontWeight: "600" },
  disconnected: { color: "#EF4444", fontWeight: "600" },
  unknown: { color: "#6B7280" },
  buttonRow: { flexDirection: "row", gap: 12, marginTop: 16 },
  btn: { flex: 1, backgroundColor: PURPLE, borderRadius: 8, paddingVertical: 12, alignItems: "center" },
  btnText: { color: "#fff", fontWeight: "600" },
  btnOutline: { backgroundColor: "transparent", borderWidth: 1, borderColor: PURPLE },
  btnOutlineText: { color: PURPLE, fontWeight: "600" },
  modelItem: { backgroundColor: "#141420", borderRadius: 6, padding: 10, marginBottom: 6 },
  modelText: { color: "#D1D5DB", fontSize: 13, fontFamily: "monospace" },
  aboutText: { color: "#6B7280", fontSize: 13, marginBottom: 4 },
});
