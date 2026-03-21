import { useRouter } from "expo-router";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import {
  ActivityIndicator, KeyboardAvoidingView, Platform,
  SafeAreaView, StyleSheet, Text, TextInput,
  TouchableOpacity, View,
} from "react-native";
import { auth } from "../../services/firebase";

export default function Register() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRegister = async () => {
    if (!email.trim() || !password || !confirm) { setError("Fill in all fields."); return; }
    if (password !== confirm) { setError("Passwords don't match."); return; }
    if (password.length < 6) { setError("Password must be at least 6 characters."); return; }
    setLoading(true);
    setError("");
    try {
      await createUserWithEmailAndPassword(auth, email.trim(), password);
    } catch (e: any) {
      if (e.code === "auth/email-already-in-use") setError("Email already registered.");
      else if (e.code === "auth/invalid-email") setError("Invalid email address.");
      else setError("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={s.safe}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={s.container}>
        <View style={s.hero}>
          <Text style={s.emoji}>🍽️</Text>
          <Text style={s.title}>Create Account</Text>
          <Text style={s.sub}>Join SmartMeal today</Text>
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
            placeholder="At least 6 characters" placeholderTextColor="#bbb"
            secureTextEntry
          />
          <Text style={s.label}>Confirm Password</Text>
          <TextInput
            style={s.input} value={confirm} onChangeText={setConfirm}
            placeholder="Repeat your password" placeholderTextColor="#bbb"
            secureTextEntry
          />
          {error !== "" && <Text style={s.error}>{error}</Text>}

          <TouchableOpacity style={[s.btn, loading && s.btnOff]} onPress={handleRegister} disabled={loading}>
            {loading
              ? <ActivityIndicator color="#fff" />
              : <Text style={s.btnText}>Create Account</Text>
            }
          </TouchableOpacity>

          <TouchableOpacity style={s.link} onPress={() => router.back()}>
            <Text style={s.linkText}>Already have an account? <Text style={s.linkBold}>Sign in</Text></Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#FFF7ED" },
  container: { flex: 1, padding: 28, justifyContent: "center" },
  hero: { alignItems: "center", marginBottom: 40 },
  emoji: { fontSize: 58 },
  title: { fontSize: 34, fontWeight: "800", color: "#1a1a1a", marginTop: 10 },
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