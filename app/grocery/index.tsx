import { useRef, useEffect } from "react";
import { useRouter } from "expo-router";
import {
  Animated, Easing, SafeAreaView, StatusBar,
  StyleSheet, Text, TouchableOpacity, View,
} from "react-native";
import { Scale, Leaf, Wallet, Dumbbell, ChevronRight, CheckCircle } from "lucide-react-native";
import TopBar from "../../components/TopBar";
import { useApp } from "../../context/AppContext";
import { useTheme } from "../../context/ThemeContext";

const DARK_BG  = "https://images.unsplash.com/photo-1542838132-92c53300491e?w=800";
const LIGHT_BG = "https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=800";

const GOALS = [
  { key: "balanced",    Icon: Scale,    title: "Balanced diet",  desc: "Proteins, carbs and vegetables"  },
  { key: "vegetarian",  Icon: Leaf,     title: "Vegetarian",      desc: "Plant-based, no meat or fish"    },
  { key: "budget",      Icon: Wallet,   title: "On a budget",     desc: "Affordable basics that go far"   },
  { key: "highprotein", Icon: Dumbbell, title: "High protein",    desc: "Build muscle, stay full"         },
] as const;

export default function GroceryHome() {
  const router = useRouter();
  const { colors, isDark } = useTheme();
  const { activeDiet, setActiveDiet } = useApp();

  const scale = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(scale, { toValue: 1.06, duration: 12000, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        Animated.timing(scale, { toValue: 1,    duration: 12000, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
      ])
    ).start();
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
      <Animated.Image
        source={{ uri: isDark ? DARK_BG : LIGHT_BG }}
        style={[StyleSheet.absoluteFillObject, { transform: [{ scale }] }]}
        resizeMode="cover"
      />
      <View style={{ ...StyleSheet.absoluteFillObject, backgroundColor: isDark ? "rgba(0,0,0,0.65)" : "rgba(255,247,237,0.88)" }} />

      <SafeAreaView style={s.safe}>
        <TopBar title="Grocery" showBack={false} />
        <View style={[s.container, { marginTop: 80 }]}>
          <Text style={[s.title, { color: isDark ? "#fff" : colors.text }]}>Your weekly plan</Text>
          <Text style={[s.sub, { color: isDark ? "#bbb" : colors.textMuted }]}>
            Pick a goal — tap to set as your active diet
          </Text>

          {GOALS.map(({ key, Icon, title, desc }) => {
            const isActive = activeDiet === key;
            return (
              <TouchableOpacity
                key={key}
                style={[
                  s.card,
                  isDark
                    ? { backgroundColor: "rgba(255,255,255,0.08)", borderColor: "rgba(255,255,255,0.12)" }
                    : { backgroundColor: colors.bgCard, borderColor: colors.border },
                  isActive && { borderColor: colors.accent, borderWidth: 2 },
                ]}
                onPress={() => {
                  setActiveDiet(isActive ? null : key);
                  router.push({ pathname: "/grocery/list", params: { goal: key } } as any);
                }}
                activeOpacity={0.85}
              >
                <View style={[
                  s.iconWrap,
                  { backgroundColor: isActive ? colors.accent : isDark ? "rgba(255,255,255,0.1)" : colors.accentLight },
                ]}>
                  <Icon size={22} color={isActive ? "#fff" : colors.accent} strokeWidth={1.8} />
                </View>
                <View style={s.body}>
                  <Text style={[s.cardTitle, { color: isDark ? "#fff" : colors.text }]}>{title}</Text>
                  <Text style={[s.cardDesc, { color: isDark ? "#bbb" : colors.textMuted }]}>{desc}</Text>
                </View>
                {isActive
                  ? <CheckCircle size={20} color={colors.accent} strokeWidth={2} />
                  : <ChevronRight size={20} color={colors.accent} strokeWidth={2} />
                }
              </TouchableOpacity>
            );
          })}
        </View>
      </SafeAreaView>
    </View>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "transparent" },
  container: { flex: 1, paddingHorizontal: 20, gap: 12 },
  title: { fontSize: 24, fontWeight: "900", letterSpacing: 0.3 },
  sub: { fontSize: 13, marginBottom: 4 },
  card: { flexDirection: "row", alignItems: "center", padding: 16, borderRadius: 20, borderWidth: 1, gap: 12 },
  iconWrap: { width: 48, height: 48, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  body: { flex: 1 },
  cardTitle: { fontSize: 15, fontWeight: "800" },
  cardDesc: { fontSize: 12, marginTop: 3, lineHeight: 17 },
});