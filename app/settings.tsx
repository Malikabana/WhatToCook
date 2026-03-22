import { useRef, useEffect, useState } from "react";
import {
  Alert, Animated, Easing, SafeAreaView, ScrollView,
  StatusBar, StyleSheet, Text, TouchableOpacity, View,
} from "react-native";
import { User, Sun, Moon, Bell, BellOff, LogOut } from "lucide-react-native";
import TopBar from "../components/TopBar";
import { useApp } from "../context/AppContext";
import { useTheme } from "../context/ThemeContext";
import { cancelGroceryReminder, registerForNotifications, scheduleGroceryReminder } from "../services/notifications";

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

  const scale = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(scale, { toValue: 1.06, duration: 12000, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        Animated.timing(scale, { toValue: 1,    duration: 12000, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
      ])
    ).start();
  }, []);

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

  const cardBg    = isDark ? "rgba(255,255,255,0.07)" : colors.bgCard;
  const cardBorder = isDark ? "rgba(255,255,255,0.1)" : colors.border;
  const textColor  = isDark ? "#fff" : colors.text;
  const mutedColor = isDark ? "#bbb" : colors.textMuted;
  const faintColor = isDark ? "#555" : colors.textFaint;

  return (
    <View style={{ flex: 1 }}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
      <Animated.Image
        source={{ uri: isDark ? DARK_BG : LIGHT_BG }}
        style={[StyleSheet.absoluteFillObject, { transform: [{ scale }] }]}
        resizeMode="cover"
      />
      <View style={{ ...StyleSheet.absoluteFillObject, backgroundColor: isDark ? "rgba(0,0,0,0.72)" : "rgba(255,247,237,0.90)" }} />

      <SafeAreaView style={s.safe}>
        <TopBar title="Settings" showBack showGrocery={false} />
        <ScrollView contentContainerStyle={[s.content, { marginTop: 80 }]} showsVerticalScrollIndicator={false}>

          {/* Account */}
          <View style={s.sectionRow}>
            <User size={12} color={faintColor} strokeWidth={2} />
            <Text style={[s.sectionLabel, { color: faintColor }]}>Account</Text>
          </View>
          <View style={[s.card, { backgroundColor: cardBg, borderColor: cardBorder }]}>
            <Text style={[s.cardLabel, { color: mutedColor }]}>Signed in as</Text>
            <Text style={[s.cardValue, { color: textColor }]}>{user?.email}</Text>
          </View>
          <TouchableOpacity style={s.logoutBtn} onPress={handleLogout}>
            <LogOut size={16} color="#ef4444" strokeWidth={2} />
            <Text style={s.logoutText}>Sign Out</Text>
          </TouchableOpacity>

          {/* Appearance */}
          <View style={s.sectionRow}>
            {isDark ? <Sun size={12} color={faintColor} strokeWidth={2} /> : <Moon size={12} color={faintColor} strokeWidth={2} />}
            <Text style={[s.sectionLabel, { color: faintColor }]}>Appearance</Text>
          </View>
          <TouchableOpacity
            style={[s.themeBtn, { backgroundColor: cardBg, borderColor: cardBorder }]}
            onPress={toggleTheme}
          >
            {isDark
              ? <Sun size={22} color={colors.accent} strokeWidth={1.8} />
              : <Moon size={22} color={colors.accent} strokeWidth={1.8} />
            }
            <View style={s.themeBody}>
              <Text style={[s.themeLabel, { color: textColor }]}>
                {isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
              </Text>
              <Text style={[s.themeSub, { color: mutedColor }]}>Currently: {isDark ? "Dark" : "Light"}</Text>
            </View>
            <Text style={[s.themeArrow, { color: colors.accent }]}>›</Text>
          </TouchableOpacity>

          {/* Notifications */}
          <View style={s.sectionRow}>
            <Bell size={12} color={faintColor} strokeWidth={2} />
            <Text style={[s.sectionLabel, { color: faintColor }]}>Grocery Reminder</Text>
          </View>
          <View style={[s.card, { backgroundColor: cardBg, borderColor: cardBorder }]}>
            <Text style={[s.cardLabel, { color: mutedColor }]}>Remind me every day at</Text>

            <Text style={[s.pickerLabel, { color: mutedColor }]}>Hour</Text>
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

            <Text style={[s.pickerLabel, { color: mutedColor }]}>Minute</Text>
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
            <Text style={[s.preview, { color: textColor }]}>⏰  {pad(hour)}:{pad(minute)} every day</Text>
          </View>

          <TouchableOpacity
            style={[s.notifBtn, { borderColor: colors.accent }, enabled && { backgroundColor: colors.accent }, saving && s.btnOff]}
            onPress={handleToggle}
            disabled={saving}
          >
            {enabled
              ? <BellOff size={16} color={enabled ? "#fff" : colors.accent} strokeWidth={2} />
              : <Bell size={16} color={enabled ? "#fff" : colors.accent} strokeWidth={2} />
            }
            <Text style={[s.notifBtnText, { color: colors.accent }, enabled && { color: "#fff" }]}>
              {saving ? "Saving..." : enabled ? "Cancel Reminder" : "Set Daily Reminder"}
            </Text>
          </TouchableOpacity>

        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "transparent" },
  content: { padding: 20, paddingBottom: 48 },
  sectionRow: { flexDirection: "row", alignItems: "center", gap: 5, marginTop: 24, marginBottom: 10 },
  sectionLabel: { fontSize: 11, fontWeight: "800", letterSpacing: 1.2, textTransform: "uppercase" },
  card: { borderRadius: 16, padding: 16, borderWidth: 1, marginBottom: 12 },
  cardLabel: { fontSize: 12, marginBottom: 4 },
  cardValue: { fontSize: 15, fontWeight: "700" },
  logoutBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, borderWidth: 1.5, borderColor: "#ef4444", borderRadius: 14, paddingVertical: 14, marginBottom: 8 },
  logoutText: { color: "#ef4444", fontWeight: "700", fontSize: 15 },
  themeBtn: { flexDirection: "row", alignItems: "center", borderRadius: 16, padding: 16, borderWidth: 1, marginBottom: 8, gap: 12 },
  themeBody: { flex: 1 },
  themeLabel: { fontSize: 15, fontWeight: "700" },
  themeSub: { fontSize: 12, marginTop: 2 },
  themeArrow: { fontSize: 22, fontWeight: "700" },
  pickerLabel: { fontSize: 12, marginTop: 14, marginBottom: 8 },
  minuteRow: { flexDirection: "row", gap: 10 },
  chip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10, borderWidth: 1.5, marginRight: 8 },
  chipText: { fontSize: 14, fontWeight: "700" },
  preview: { marginTop: 16, fontSize: 15, fontWeight: "700", textAlign: "center" },
  notifBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, borderWidth: 2, borderRadius: 14, paddingVertical: 15, marginBottom: 12 },
  notifBtnText: { fontWeight: "800", fontSize: 15 },
  btnOff: { opacity: 0.5 },
});