import { useRouter } from "expo-router";
import { useTheme } from "../../context/ThemeContext";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ImageBackground,
} from "react-native";
import { auth } from "../../services/firebase";

export default function Register() {
  const router = useRouter();
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm]   = useState("");
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");
  const [focused, setFocused]   = useState<string | null>(null);
const { isDark, toggleTheme } = useTheme();
  const handleRegister = async () => {
    if (!email.trim() || !password || !confirm) { setError("Fill in all fields."); return; }
    if (password !== confirm)  { setError("Passwords don't match."); return; }
    if (password.length < 6)   { setError("Password must be at least 6 characters."); return; }
    setLoading(true); setError("");
    try {
      await createUserWithEmailAndPassword(auth, email.trim(), password);
    } catch (e: any) {
      if (e.code === "auth/email-already-in-use") setError("Email already registered.");
      else if (e.code === "auth/invalid-email")   setError("Invalid email address.");
      else setError("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ImageBackground
      source={{ uri: "https://i.pinimg.com/1200x/22/f2/4d/22f24d4e81823742383b6ebd95155bc9.jpg" }}
      style={{ flex: 1 }}
      resizeMode="cover"
    >
      <StatusBar barStyle="light-content" />
      <View style={s.overlay} />
      <View style={s.overlayBottom} />

      <SafeAreaView style={s.safe}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={s.container}
        >
          {/* TOP — branding */}
          <View style={s.top}>
            <View style={s.logoBadge}>
              <Text style={s.logoEmoji}>✨</Text>
            </View>
            <Text style={s.appName}>SmartMeal</Text>
            <Text style={s.tagline}>Start your cooking journey</Text>
          </View>

          {/* BOTTOM — form card */}
          <View style={s.card}>
            <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
              <Text style={s.cardTitle}>Create account</Text>
              <Text style={s.cardSub}>Join us today</Text>

              <View style={s.divider} />

              {/* Email */}
              <View style={s.fieldWrap}>
                <Text style={s.fieldLabel}>EMAIL</Text>
                <View style={[s.inputBox, focused === "email" && s.inputBoxFocused]}>
                  <Text style={s.inputIcon}>✉️</Text>
                  <TextInput
                    style={s.input}
                    placeholder="you@example.com"
                    placeholderTextColor="#666"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    onFocus={() => setFocused("email")}
                    onBlur={() => setFocused(null)}
                  />
                </View>
              </View>

              {/* Password */}
              <View style={s.fieldWrap}>
                <Text style={s.fieldLabel}>PASSWORD</Text>
                <View style={[s.inputBox, focused === "password" && s.inputBoxFocused]}>
                  <Text style={s.inputIcon}>🔒</Text>
                  <TextInput
                    style={s.input}
                    placeholder="At least 6 characters"
                    placeholderTextColor="#666"
                    secureTextEntry
                    value={password}
                    onChangeText={setPassword}
                    onFocus={() => setFocused("password")}
                    onBlur={() => setFocused(null)}
                  />
                </View>
              </View>

              {/* Confirm */}
              <View style={s.fieldWrap}>
                <Text style={s.fieldLabel}>CONFIRM PASSWORD</Text>
                <View style={[s.inputBox, focused === "confirm" && s.inputBoxFocused,
                  confirm.length > 0 && password !== confirm && s.inputBoxError,
                  confirm.length > 0 && password === confirm && s.inputBoxSuccess,
                ]}>
                  <Text style={s.inputIcon}>
                    {confirm.length > 0 ? (password === confirm ? "✅" : "❌") : "🔑"}
                  </Text>
                  <TextInput
                    style={s.input}
                    placeholder="Repeat your password"
                    placeholderTextColor="#666"
                    secureTextEntry
                    value={confirm}
                    onChangeText={setConfirm}
                    onFocus={() => setFocused("confirm")}
                    onBlur={() => setFocused(null)}
                  />
                </View>
              </View>

              {/* Error */}
              {error !== "" && (
                <View style={s.errorBox}>
                  <Text style={s.errorText}>⚠️  {error}</Text>
                </View>
              )}

              {/* Password strength hint */}
              {password.length > 0 && password.length < 6 && (
                <View style={s.hintBox}>
                  <Text style={s.hintText}>💡  Password needs at least 6 characters</Text>
                </View>
              )}

              {/* Button */}
              <TouchableOpacity
  onPress={toggleTheme}
  style={{
    position: "absolute",
    top: 60, right: 20,
    backgroundColor: "rgba(0,0,0,0.3)",
    padding: 10, borderRadius: 20, zIndex: 10,
  }}
>
  <Text style={{ fontSize: 20 }}>{isDark ? "☀️" : "🌙"}</Text>
</TouchableOpacity>
              <TouchableOpacity
                style={[s.button, loading && s.buttonDisabled]}
                onPress={handleRegister}
                activeOpacity={0.85}
                disabled={loading}
              >
                {loading
                  ? <ActivityIndicator color="#fff" />
                  : <Text style={s.buttonText}>Create Account →</Text>
                }
              </TouchableOpacity>

              {/* Footer */}
              <View style={s.footer}>
                <Text style={s.footerText}>Already have an account? </Text>
                <TouchableOpacity onPress={() => router.back()}>
                  <Text style={s.footerLink}>Sign in</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </ImageBackground>
  );
}

const s = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(20,10,5,0.55)",
  },
  overlayBottom: {
    position: "absolute",
    bottom: 0, left: 0, right: 0,
    height: "60%",
    backgroundColor: "rgba(10,5,0,0.5)",
  },
  safe: { flex: 1 },
  container: {
    flex: 1,
    justifyContent: "space-between",
  },

  // ── Branding ──────────────────────────────────
  top: {
    alignItems: "center",
    paddingTop: 52,
    gap: 6,
  },
  logoBadge: {
    width: 72,
    height: 72,
    borderRadius: 22,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.18)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  logoEmoji: { fontSize: 36 },
  appName: {
    fontSize: 30,
    fontWeight: "900",
    color: "#fff",
    letterSpacing: 0.5,
  },
  tagline: {
    fontSize: 13,
    color: "rgba(255,255,255,0.45)",
    letterSpacing: 0.3,
  },

  // ── Card ──────────────────────────────────────
  card: {
    backgroundColor: "rgba(18,10,5,0.9)",
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: 28,
    paddingBottom: 48,
    borderWidth: 1,
    borderBottomWidth: 0,
    borderColor: "rgba(221, 204, 204, 0.07)",
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#fff",
  },
  cardSub: {
    fontSize: 13,
    color: "#666",
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: "rgba(255,255,255,0.07)",
    marginVertical: 20,
  },

  // ── Fields ────────────────────────────────────
  fieldWrap: { marginBottom: 14 },
  fieldLabel: {
    fontSize: 10,
    fontWeight: "800",
    color: "#555",
    letterSpacing: 1.2,
    marginBottom: 6,
  },
  inputBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.06)",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    paddingHorizontal: 14,
    gap: 10,
  },
  inputBoxFocused: {
    borderColor: "#FF8C42",
    backgroundColor: "rgba(255,140,66,0.06)",
  },
  inputBoxError: {
    borderColor: "#ef4444",
    backgroundColor: "rgba(239,68,68,0.05)",
  },
  inputBoxSuccess: {
    borderColor: "#22c55e",
    backgroundColor: "rgba(34,197,94,0.05)",
  },
  inputIcon: { fontSize: 16 },
  input: {
    flex: 1,
    height: 50,
    color: "#fff",
    fontSize: 15,
  },

  // ── Feedback boxes ────────────────────────────
  errorBox: {
    backgroundColor: "rgba(239,68,68,0.1)",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "rgba(239,68,68,0.25)",
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 14,
  },
  errorText: { color: "#ef4444", fontSize: 13 },
  hintBox: {
    backgroundColor: "rgba(255,140,66,0.08)",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "rgba(255,140,66,0.2)",
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 14,
  },
  hintText: { color: "#FF8C42", fontSize: 13 },

  // ── Button ────────────────────────────────────
  button: {
    backgroundColor: "#FF8C42",
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 6,
    shadowColor: "#FF8C42",
    shadowOpacity: 0.4,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
  },
  buttonDisabled: { opacity: 0.6 },
  buttonText: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 16,
    letterSpacing: 0.3,
  },

  // ── Footer ────────────────────────────────────
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  footerText: { fontSize: 14, color: "#555" },
  footerLink: { fontSize: 14, color: "#FF8C42", fontWeight: "700" },
});