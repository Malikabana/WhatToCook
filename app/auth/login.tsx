import { useRouter } from "expo-router";
import { useTheme } from "../../context/ThemeContext";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ImageBackground,
} from "react-native";
import { auth } from "../../services/firebase";

const ERRORS: Record<string, string> = {
  "auth/user-not-found":    "No account found with this email.",
  "auth/wrong-password":    "Incorrect password.",
  "auth/invalid-email":     "Invalid email address.",
  "auth/invalid-credential":"Email or password is incorrect.",
  "auth/too-many-requests": "Too many attempts. Try again later.",
};

export default function Login() {
  const router = useRouter();
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const { isDark, toggleTheme } = useTheme();
  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) { setError("Please fill in all fields."); return; }
    setLoading(true); setError("");
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
    } catch (e: any) {
      setError(ERRORS[e.code] ?? "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ImageBackground
      source={{ uri: "https://i.pinimg.com/1200x/f6/79/57/f679573d3b9a45ba7eb78b461a2b6774.jpg" }}
      style={{ flex: 1 }}
      resizeMode="cover"
    >
      <StatusBar barStyle="light-content" />
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
      {/* Multi-layer overlay for depth */}
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
              <Text style={s.logoEmoji}>🍽️</Text>
            </View>
            <Text style={s.appName}>SmartMeal</Text>
            <Text style={s.tagline}>Cook smarter, not harder</Text>
          </View>

          {/* BOTTOM — form card */}
          <View style={s.card}>

            {/* Card header */}
            <Text style={s.cardTitle}>Welcome back</Text>
            <Text style={s.cardSub}>Sign in to your account</Text>

            {/* Divider */}
            <View style={s.divider} />

            {/* Email input */}
            <View style={s.fieldWrap}>
              <Text style={s.fieldLabel}>EMAIL</Text>
              <View style={[s.inputBox, focusedField === "email" && s.inputBoxFocused]}>
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
                  onFocus={() => setFocusedField("email")}
                  onBlur={() => setFocusedField(null)}
                />
              </View>
            </View>

            {/* Password input */}
            <View style={s.fieldWrap}>
              <Text style={s.fieldLabel}>PASSWORD</Text>
              <View style={[s.inputBox, focusedField === "password" && s.inputBoxFocused]}>
                <Text style={s.inputIcon}>🔒</Text>
                <TextInput
                  style={s.input}
                  placeholder="Your password"
                  placeholderTextColor="#666"
                  secureTextEntry
                  value={password}
                  onChangeText={setPassword}
                  onFocus={() => setFocusedField("password")}
                  onBlur={() => setFocusedField(null)}
                />
              </View>
            </View>

            {/* Error */}
            {error !== "" && (
              <View style={s.errorBox}>
                <Text style={s.errorText}>⚠️  {error}</Text>
              </View>
            )}

            {/* Sign in button */}
            <TouchableOpacity
              style={[s.button, loading && s.buttonDisabled]}
              onPress={handleLogin}
              activeOpacity={0.85}
              disabled={loading}
            >
              {loading
                ? <ActivityIndicator color="#fff" />
                : <Text style={s.buttonText}>Sign In →</Text>
              }
            </TouchableOpacity>

            {/* Register link */}
            <View style={s.footer}>
              <Text style={s.footerText}>Don't have an account? </Text>
              <TouchableOpacity onPress={() => router.push("/auth/register" as any)}>
                <Text style={s.footerLink}>Create one</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </ImageBackground>
  );
}

const s = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.55)",
  },
  overlayBottom: {
    position: "absolute",
    bottom: 0, left: 0, right: 0,
    height: "55%",
    backgroundColor: "rgba(0,0,0,0.45)",
  },
  safe: { flex: 1 },
  container: {
    flex: 1,
    justifyContent: "space-between",
    paddingBottom: 0,
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
    backgroundColor: "rgba(255,255,255,0.12)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
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
    color: "rgba(255,255,255,0.5)",
    letterSpacing: 0.3,
  },

  // ── Card ──────────────────────────────────────
  card: {
    backgroundColor: "rgba(18,18,18,0.88)",
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    padding: 28,
    paddingBottom: 40,
    borderWidth: 1,
    borderBottomWidth: 0,
    borderColor: "rgba(255,255,255,0.08)",
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#fff",
  },
  cardSub: {
    fontSize: 13,
    color: "#777",
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
  inputIcon: { fontSize: 16 },
  input: {
    flex: 1,
    height: 50,
    color: "#fff",
    fontSize: 15,
  },

  // ── Error ─────────────────────────────────────
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