import { useRouter } from "expo-router";
import { signInWithEmailAndPassword } from "firebase/auth";
import { AlertCircle, Lock, Mail, UtensilsCrossed } from "lucide-react-native";
import { useState } from "react";
import {
  ActivityIndicator,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { auth } from "../../services/firebase";

const ERRORS: Record<string, string> = {
  "auth/user-not-found": "No account found with this email.",
  "auth/wrong-password": "Incorrect password.",
  "auth/invalid-email": "Invalid email address.",
  "auth/invalid-credential": "Email or password is incorrect.",
  "auth/too-many-requests": "Too many attempts. Try again later.",
};

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [focused, setFocused] = useState<string | null>(null);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      setError("Please fill in all fields.");
      return;
    }

    setLoading(true);
    setError("");

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
      <View style={s.overlay} />

      <SafeAreaView style={s.safe}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={s.container}
        >
          <View style={s.top}>
            <View style={s.logoBadge}>
              <UtensilsCrossed size={30} color="#fff" strokeWidth={2.2} />
            </View>
            <Text style={s.appName}>SmartMeal</Text>
            <Text style={s.tagline}>let us cook for you</Text>
          </View>

          <View style={s.card}>
            <Text style={s.cardTitle}>Welcome </Text>
            <Text style={s.cardSub}>Sign in to your account</Text>

            <View style={s.divider} />

            <View style={s.fieldWrap}>
              <Text style={s.fieldLabel}>EMAIL</Text>
              <View style={[s.inputBox, focused === "email" && s.inputBoxFocused]}>
                <Mail size={18} color="#888" strokeWidth={2} />
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

            <View style={s.fieldWrap}>
              <Text style={s.fieldLabel}>PASSWORD</Text>
              <View style={[s.inputBox, focused === "password" && s.inputBoxFocused]}>
                <Lock size={18} color="#888" strokeWidth={2} />
                <TextInput
                  style={s.input}
                  placeholder="Your password"
                  placeholderTextColor="#666"
                  secureTextEntry
                  value={password}
                  onChangeText={setPassword}
                  onFocus={() => setFocused("password")}
                  onBlur={() => setFocused(null)}
                />
              </View>
            </View>

            {error !== "" && (
              <View style={s.errorBox}>
                <AlertCircle size={16} color="#ef4444" strokeWidth={2.2} />
                <Text style={s.errorText}>{error}</Text>
              </View>
            )}

            <TouchableOpacity
              style={[s.button, loading && s.buttonDisabled]}
              onPress={handleLogin}
              activeOpacity={0.85}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={s.buttonText}>Sign In</Text>
              )}
            </TouchableOpacity>

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
  safe: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: "space-between",
  },
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
  appName: {
    fontSize: 30,
    fontWeight: "900",
    color: "#fff",
    letterSpacing: 0.5,
  },
  tagline: {
    fontSize: 13,
    color: "rgba(255,255,255,0.5)",
  },
  card: {
    backgroundColor: "rgba(18,18,18,0.88)",
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
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
  fieldWrap: {
    marginBottom: 14,
  },
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
  input: {
    flex: 1,
    height: 50,
    color: "#fff",
    fontSize: 15,
  },
  errorBox: {
    backgroundColor: "rgba(239,68,68,0.1)",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "rgba(239,68,68,0.25)",
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  errorText: {
    color: "#ef4444",
    fontSize: 13,
    flex: 1,
  },
  button: {
    backgroundColor: "#FF8C42",
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 6,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 16,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  footerText: {
    fontSize: 14,
    color: "#555",
  },
  footerLink: {
    fontSize: 14,
    color: "#FF8C42",
    fontWeight: "700",
  },
});