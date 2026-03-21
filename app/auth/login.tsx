import { useRouter } from "expo-router";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import {
  ActivityIndicator, KeyboardAvoidingView, Platform,
  SafeAreaView, StyleSheet, Text, TextInput,
  TouchableOpacity, View,
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
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) { setError("Please fill in all fields."); return; }
    setLoading(true);
    setError("");
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
    } catch (e: any) {
      setError(ERRORS[e.code] ?? "Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={s.safe}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={s.container}>
        <View style={s.hero}>
          <Text style={s.emoji}>🍽️</Text>
          <Text style={s.title}>SmartMeal</Text>
          <Text style={s.sub}>Sign in to continue</Text>
        </View>

        <View style={s.form}>
          <Text style={s.label}>Email</Text>
          <TextInput
            style={s.input} value={email} onChangeText={setEmail}
            placeholder="you@example.com" placeholderTextColor="#bbb"
            keyboardType="email-address" autoCapitalize="none" autoCorrect={false}
          />
          <Text style={s.label}>Password</Text>
          <TextInput
            style={s.input} value={password} onChangeText={setPassword}
            placeholder="Your password" placeholderTextColor="#bbb"
            secureTextEntry
          />
          {error !== "" && <Text style={s.error}>{error}</Text>}

          <TouchableOpacity style={[s.btn, loading && s.btnOff]} onPress={handleLogin} disabled={loading}>
            {loading
              ? <ActivityIndicator color="#fff" />
              : <Text style={s.btnText}>Sign In</Text>
            }
          </TouchableOpacity>

          <TouchableOpacity style={s.link} onPress={() => router.push("/auth/register" as any)}>
            <Text style={s.linkText}>No account? <Text style={s.linkBold}>Create one</Text></Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#FFF7ED" },
  container: { flex: 1, padding: 28, justifyContent: "center" },
  hero: { alignItems: "center", marginBottom: 48 },
  emoji: { fontSize: 58 },
  title: { fontSize: 36, fontWeight: "800", color: "#1a1a1a", marginTop: 10 },
  sub: { fontSize: 15, color: "#aaa", marginTop: 4 },
  form: {},
  label: { fontSize: 13, fontWeight: "700", color: "#1a1a1a", marginBottom: 6 },
  input: {
    backgroundColor: "#fff", borderRadius: 12,
    paddingHorizontal: 16, paddingVertical: 14,
    fontSize: 15, color: "#1a1a1a",
    borderWidth: 1.5, borderColor: "#FFD4A8", marginBottom: 16,
  },
  error: { color: "#ef4444", fontSize: 13, marginBottom: 12, textAlign: "center" },
  btn: {
    backgroundColor: "#FF6B00", borderRadius: 14,
    paddingVertical: 16, alignItems: "center", marginTop: 4,
  },
  btnOff: { opacity: 0.6 },
  btnText: { color: "#fff", fontWeight: "800", fontSize: 16 },
  link: { alignItems: "center", marginTop: 24 },
  linkText: { fontSize: 14, color: "#aaa" },
  linkBold: { color: "#FF6B00", fontWeight: "700" },
});