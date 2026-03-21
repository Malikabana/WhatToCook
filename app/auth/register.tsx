import { useRouter } from "expo-router";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
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

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRegister = async () => {
    if (!email.trim() || !password || !confirm) {
      setError("Fill in all fields.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords don't match.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await createUserWithEmailAndPassword(auth, email.trim(), password);
    } catch (e: any) {
      if (e.code === "auth/email-already-in-use")
        setError("Email already registered.");
      else if (e.code === "auth/invalid-email")
        setError("Invalid email address.");
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
      {/* 🔥 softer warm overlay (different vibe from login) */}
      <View style={s.overlay}>
        <SafeAreaView style={s.safe}>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : undefined}
            style={s.container}
          >
            {/* 🔥 HEADER */}
            <View style={s.header}>
              <Text style={s.logo}>✨</Text>
              <Text style={s.title}>Create your account</Text>
              <Text style={s.sub}>Start your cooking journey</Text>
            </View>

            {/* 🔥 CARD */}
            <View style={s.card}>
              {/* inputs */}
              <View style={s.inputWrap}>
                <TextInput
                  style={s.input}
                  placeholder="Email"
                  placeholderTextColor="#aaa"
                  value={email}
                  onChangeText={setEmail}
                />
              </View>

              <View style={s.inputWrap}>
                <TextInput
                  style={s.input}
                  placeholder="Password"
                  placeholderTextColor="#aaa"
                  secureTextEntry
                  value={password}
                  onChangeText={setPassword}
                />
              </View>

              <View style={s.inputWrap}>
                <TextInput
                  style={s.input}
                  placeholder="Confirm password"
                  placeholderTextColor="#aaa"
                  secureTextEntry
                  value={confirm}
                  onChangeText={setConfirm}
                />
              </View>

              {error !== "" && <Text style={s.error}>{error}</Text>}

              {/* button */}
              <TouchableOpacity
                style={[s.button, loading && s.buttonOff]}
                onPress={handleRegister}
                activeOpacity={0.9}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={s.buttonText}>Create Account</Text>
                )}
              </TouchableOpacity>

              {/* link */}
              <TouchableOpacity
                onPress={() => router.back()}
                style={s.linkWrap}
              >
                <Text style={s.linkText}>
                  Already have an account?{" "}
                  <Text style={s.linkBold}>Sign in</Text>
                </Text>
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </View>
    </ImageBackground>
  );
}

const s = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "transparent",
  },

  // 🔥 warmer overlay (slightly orange tone)
  overlay: {
    flex: 1,
    backgroundColor: "rgba(20,10,5,0.75)",
  },

  container: {
    flex: 1,
    justifyContent: "space-between",
    padding: 24,
  },

  header: {
    alignItems: "center",
    marginTop: 40,
  },

  logo: {
    fontSize: 40,
  },

  title: {
    fontSize: 26,
    fontWeight: "900",
    color: "#fff",
    marginTop: 10,
  },

  sub: {
    fontSize: 13,
    color: "#bbb",
    marginTop: 6,
  },

  // 🔥 softer glass card
  card: {
    backgroundColor: "rgba(255,255,255,0.07)",
    borderRadius: 26,
    padding: 20,

    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",

    shadowColor: "#000",
    shadowOpacity: 0.4,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },

    marginBottom: 40,
  },

  inputWrap: {
    backgroundColor: "rgba(255,255,255,0.12)",
    borderRadius: 14,
    paddingHorizontal: 14,
    marginBottom: 12,
  },

  input: {
    height: 48,
    color: "#fff",
    fontSize: 15,
  },

  error: {
    color: "#ef4444",
    fontSize: 13,
    marginBottom: 10,
  },

  button: {
    backgroundColor: "#FF8C42",
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 6,
  },

  buttonOff: {
    opacity: 0.6,
  },

  buttonText: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 16,
  },

  linkWrap: {
    alignItems: "center",
    marginTop: 16,
  },

  linkText: {
    fontSize: 13,
    color: "#aaa",
  },

  linkBold: {
    color: "#FF8C42",
    fontWeight: "700",
  },
});