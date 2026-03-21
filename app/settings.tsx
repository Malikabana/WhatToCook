import { useState } from "react";
import { Alert, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import TopBar from "../components/TopBar";
import { useApp } from "../context/AppContext";
import {
  cancelGroceryReminder, registerForNotifications,
  scheduleGroceryReminder, sendTestNotification,
} from "../services/notifications";

const HOURS   = Array.from({ length: 24 }, (_, i) => i);
const MINUTES = [0, 15, 30, 45];
const pad = (n: number) => n.toString().padStart(2, "0");

export default function Settings() {
  const { user, logout } = useApp();
  const [hour, setHour]       = useState(9);
  const [minute, setMinute]   = useState(0);
  const [enabled, setEnabled] = useState(false);
  const [saving, setSaving]   = useState(false);

  const handleToggle = async () => {
    if (enabled) {
      await cancelGroceryReminder();
      setEnabled(false);
      Alert.alert("Reminder cancelled");
      return;
    }
    const granted = await registerForNotifications();
    if (!granted) {
      Alert.alert("Permission denied", "Enable notifications in your phone settings.");
      return;
    }
    setSaving(true);
    const id = await scheduleGroceryReminder(hour, minute);
    setSaving(false);
    if (id) {
      setEnabled(true);
      Alert.alert("Reminder set! 🛒", `Every day at ${pad(hour)}:${pad(minute)}`);
    }
  };

  const handleTest = async () => {
    const granted = await registerForNotifications();
    if (!granted) { Alert.alert("Permission denied"); return; }
    await sendTestNotification();
    Alert.alert("Sent!", "Check your notifications.");
  };

  const handleLogout = () => {
    Alert.alert("Sign out", "Are you sure?", [
      { text: "Cancel", style: "cancel" },
      { text: "Sign out", style: "destructive", onPress: logout },
    ]);
  };

  return (
    <SafeAreaView style={s.safe}>
      <TopBar title="Settings" showBack showGrocery={false} />
      <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>

        <Text style={s.sectionLabel}>Account</Text>
        <View style={s.card}>
          <Text style={s.cardLabel}>Signed in as</Text>
          <Text style={s.cardValue}>{user?.email}</Text>
        </View>
        <TouchableOpacity style={s.logoutBtn} onPress={handleLogout}>
          <Text style={s.logoutText}>Sign Out</Text>
        </TouchableOpacity>

        <Text style={s.sectionLabel}>Grocery Reminder</Text>
        <View style={s.card}>
          <Text style={s.cardLabel}>Remind me every day at</Text>

          <Text style={s.pickerLabel}>Hour</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ flexGrow: 0 }} contentContainerStyle={{ gap: 8, paddingBottom: 4 }}>
            {HOURS.map((h) => (
              <TouchableOpacity key={h} style={[s.chip, hour === h && s.chipOn]} onPress={() => setHour(h)}>
                <Text style={[s.chipText, hour === h && s.chipTextOn]}>{pad(h)}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <Text style={s.pickerLabel}>Minute</Text>
          <View style={s.minuteRow}>
            {MINUTES.map((m) => (
              <TouchableOpacity key={m} style={[s.chip, minute === m && s.chipOn]} onPress={() => setMinute(m)}>
                <Text style={[s.chipText, minute === m && s.chipTextOn]}>{pad(m)}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={s.preview}>⏰  {pad(hour)}:{pad(minute)} every day</Text>
        </View>

        <TouchableOpacity style={[s.notifBtn, enabled && s.notifBtnOn, saving && s.btnOff]} onPress={handleToggle} disabled={saving}>
          <Text style={[s.notifBtnText, enabled && s.notifBtnTextOn]}>
            {saving ? "Saving..." : enabled ? "Cancel Reminder" : "Set Daily Reminder"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={s.testBtn} onPress={handleTest}>
          <Text style={s.testBtnText}>Send Test Notification</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#FFF7ED" },
  content: { padding: 20, paddingBottom: 48 },
  sectionLabel: { fontSize: 11, fontWeight: "800", color: "#bbb", letterSpacing: 1.2, textTransform: "uppercase", marginTop: 28, marginBottom: 10 },
  card: { backgroundColor: "#fff", borderRadius: 16, padding: 16, borderWidth: 1, borderColor: "#FFE4C8", marginBottom: 12 },
  cardLabel: { fontSize: 12, color: "#aaa", marginBottom: 4 },
  cardValue: { fontSize: 15, fontWeight: "700", color: "#1a1a1a" },
  logoutBtn: { borderWidth: 1.5, borderColor: "#ef4444", borderRadius: 14, paddingVertical: 14, alignItems: "center", marginBottom: 8 },
  logoutText: { color: "#ef4444", fontWeight: "700", fontSize: 15 },
  pickerLabel: { fontSize: 12, color: "#aaa", marginTop: 14, marginBottom: 8 },
  minuteRow: { flexDirection: "row", gap: 10 },
  chip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10, borderWidth: 1.5, borderColor: "#FFD4A8", backgroundColor: "#FFF7ED", marginRight: 8 },
  chipOn: { backgroundColor: "#1A1A1A", borderColor: "#1A1A1A" },
  chipText: { fontSize: 14, fontWeight: "700", color: "#FF6B00" },
  chipTextOn: { color: "#fff" },
  preview: { marginTop: 16, fontSize: 15, fontWeight: "700", color: "#1a1a1a", textAlign: "center" },
  notifBtn: { borderWidth: 2, borderColor: "#FF6B00", borderRadius: 14, paddingVertical: 15, alignItems: "center", marginBottom: 12 },
  notifBtnOn: { backgroundColor: "#FF6B00" },
  notifBtnText: { color: "#FF6B00", fontWeight: "800", fontSize: 15 },
  notifBtnTextOn: { color: "#fff" },
  testBtn: { backgroundColor: "#FFEDD5", borderRadius: 14, paddingVertical: 15, alignItems: "center" },
  testBtnText: { color: "#C2410C", fontWeight: "700", fontSize: 15 },
  btnOff: { opacity: 0.5 },
});