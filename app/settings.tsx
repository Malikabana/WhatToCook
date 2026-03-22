import { useState } from "react";
import {
  Alert, ImageBackground, SafeAreaView, ScrollView,
  StyleSheet, Text, TouchableOpacity, View,
} from "react-native";
import TopBar from "../components/TopBar";
import { useApp } from "../context/AppContext";
import { useTheme } from "../context/ThemeContext";
import {
  cancelGroceryReminder, registerForNotifications,
  scheduleGroceryReminder,
} from "../services/notifications";

const DARK_BG  = "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800";
const LIGHT_BG = "https://images.unsplash.com/photo-1484723091739-30a097e8f929?w=800";

const HOURS   = Array.from({ length: 24 }, (_, i) => i);
const MINUTES = [0, 15, 30, 45];
const pad     = (n: number) => n.toString().padStart(2, "0");

export default function Settings() {
  const { user, logout } = useApp();
  const { colors, isDark, toggleTheme } = useTheme();
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
    if (!granted) { Alert.alert("Permission denied", "Enable notifications in your phone settings."); return; }
    setSaving(true);
    const id = await scheduleGroceryReminder(hour, minute);
    setSaving(false);
    if (id) { setEnabled(true); Alert.alert("Reminder set! 🛒", `Every day at ${pad(hour)}:${pad(minute)}`); }
  };

  const handleLogout = () => {
    Alert.alert("Sign out", "Are you sure?", [
      { text: "Cancel", style: "cancel" },
      { text: "Sign out", style: "destructive", onPress: logout },
    ]);
  };

  const content = (
    <SafeAreaView style={s.safe}>
      <TopBar title="Settings" showBack showGrocery={false} />
      <ScrollView contentContainerStyle={[s.content, { marginTop: 80 }]} showsVerticalScrollIndicator={false}>

        {/* Account */}
        <Text style={[s.sectionLabel, { color: isDark ? "#555" : colors.textFaint }]}>Account</Text>
        <View style={[s.card, { backgroundColor: isDark ? "rgba(255,255,255,0.07)" : colors.bgCard, borderColor: isDark ? "rgba(255,255,255,0.1)" : colors.border }]}>
          <Text style={[s.cardLabel, { color: colors.textMuted }]}>Signed in as</Text>
          <Text style={[s.cardValue, { color: isDark ? "#fff" : colors.text }]}>{user?.email}</Text>
        </View>
        <TouchableOpacity style={s.logoutBtn} onPress={handleLogout}>
          <Text style={s.logoutText}>Sign Out</Text>
        </TouchableOpacity>

        {/* Appearance */}
        <Text style={[s.sectionLabel, { color: isDark ? "#555" : colors.textFaint }]}>Appearance</Text>
        <TouchableOpacity
          style={[s.themeBtn, { backgroundColor: isDark ? "rgba(255,255,255,0.07)" : colors.bgCard, borderColor: isDark ? "rgba(255,255,255,0.1)" : colors.border }]}
          onPress={toggleTheme}
        >
          <Text style={s.themeIcon}>{isDark ? "☀️" : "🌙"}</Text>
          <View style={s.themeBody}>
            <Text style={[s.themeLabel, { color: isDark ? "#fff" : colors.text }]}>
              {isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
            </Text>
            <Text style={[s.themeSub, { color: colors.textMuted }]}>Currently: {isDark ? "Dark" : "Light"}</Text>
          </View>
          <Text style={[s.themeArrow, { color: colors.accent }]}>›</Text>
        </TouchableOpacity>

        {/* Notifications */}
        <Text style={[s.sectionLabel, { color: isDark ? "#555" : colors.textFaint }]}>Grocery Reminder</Text>
        <View style={[s.card, { backgroundColor: isDark ? "rgba(255,255,255,0.07)" : colors.bgCard, borderColor: isDark ? "rgba(255,255,255,0.1)" : colors.border }]}>
          <Text style={[s.cardLabel, { color: colors.textMuted }]}>Remind me every day at</Text>

          <Text style={[s.pickerLabel, { color: colors.textMuted }]}>Hour</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ flexGrow: 0 }} contentContainerStyle={{ gap: 8, paddingBottom: 4 }}>
            {HOURS.map((h) => (
              <TouchableOpacity
                key={h}
                style={[s.chip,
                  { borderColor: isDark ? "rgba(255,255,255,0.15)" : colors.border, backgroundColor: isDark ? "rgba(255,255,255,0.05)" : colors.bg },
                  hour === h && { backgroundColor: colors.accent, borderColor: colors.accent },
                ]}
                onPress={() => setHour(h)}
              >
                <Text style={[s.chipText, { color: colors.accent }, hour === h && { color: "#fff" }]}>{pad(h)}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <Text style={[s.pickerLabel, { color: colors.textMuted }]}>Minute</Text>
          <View style={s.minuteRow}>
            {MINUTES.map((m) => (
              <TouchableOpacity
                key={m}
                style={[s.chip,
                  { borderColor: isDark ? "rgba(255,255,255,0.15)" : colors.border, backgroundColor: isDark ? "rgba(255,255,255,0.05)" : colors.bg },
                  minute === m && { backgroundColor: colors.accent, borderColor: colors.accent },
                ]}
                onPress={() => setMinute(m)}
              >
                <Text style={[s.chipText, { color: colors.accent }, minute === m && { color: "#fff" }]}>{pad(m)}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <Text style={[s.preview, { color: isDark ? "#fff" : colors.text }]}>⏰  {pad(hour)}:{pad(minute)} every day</Text>
        </View>

        <TouchableOpacity
          style={[s.notifBtn, { borderColor: colors.accent }, enabled && { backgroundColor: colors.accent }, saving && s.btnOff]}
          onPress={handleToggle}
          disabled={saving}
        >
          <Text style={[s.notifBtnText, { color: colors.accent }, enabled && { color: "#fff" }]}>
            {saving ? "Saving..." : enabled ? "Cancel Reminder" : "Set Daily Reminder"}
          </Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );

  return (
    <View style={{ flex: 1 }}>
      <ImageBackground
        source={{ uri: isDark ? DARK_BG : LIGHT_BG }}
        style={StyleSheet.absoluteFillObject}
        resizeMode="cover"
      />
      <View style={{ ...StyleSheet.absoluteFillObject, backgroundColor: isDark ? "rgba(0,0,0,0.72)" : "rgba(255,247,237,0.93)" }} />
      {content}
    </View>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "transparent" },
  content: { padding: 20, paddingBottom: 48 },
  sectionLabel: { fontSize: 11, fontWeight: "800", letterSpacing: 1.2, textTransform: "uppercase", marginTop: 24, marginBottom: 10 },
  card: { borderRadius: 16, padding: 16, borderWidth: 1, marginBottom: 12 },
  cardLabel: { fontSize: 12, marginBottom: 4 },
  cardValue: { fontSize: 15, fontWeight: "700" },
  logoutBtn: { borderWidth: 1.5, borderColor: "#ef4444", borderRadius: 14, paddingVertical: 14, alignItems: "center", marginBottom: 8 },
  logoutText: { color: "#ef4444", fontWeight: "700", fontSize: 15 },
  themeBtn: { flexDirection: "row", alignItems: "center", borderRadius: 16, padding: 16, borderWidth: 1, marginBottom: 8, gap: 12 },
  themeIcon: { fontSize: 24 },
  themeBody: { flex: 1 },
  themeLabel: { fontSize: 15, fontWeight: "700" },
  themeSub: { fontSize: 12, marginTop: 2 },
  themeArrow: { fontSize: 22, fontWeight: "700" },
  pickerLabel: { fontSize: 12, marginTop: 14, marginBottom: 8 },
  minuteRow: { flexDirection: "row", gap: 10 },
  chip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10, borderWidth: 1.5, marginRight: 8 },
  chipText: { fontSize: 14, fontWeight: "700" },
  preview: { marginTop: 16, fontSize: 15, fontWeight: "700", textAlign: "center" },
  notifBtn: { borderWidth: 2, borderRadius: 14, paddingVertical: 15, alignItems: "center", marginBottom: 12 },
  notifBtnText: { fontWeight: "800", fontSize: 15 },
  btnOff: { opacity: 0.5 },
});