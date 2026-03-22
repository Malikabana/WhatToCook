import { useRouter } from "expo-router";
import {
  ImageBackground, SafeAreaView, StyleSheet,
  Text, TouchableOpacity, View,
} from "react-native";
import TopBar from "../../components/TopBar";
import { useApp } from "../../context/AppContext";
import { useTheme } from "../../context/ThemeContext";

const DARK_BG  = "https://images.unsplash.com/photo-1542838132-92c53300491e?w=800";
const LIGHT_BG = "https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=800";

const GOALS = [
  { key: "balanced",    icon: "⚖️", title: "Balanced diet",  desc: "Proteins, carbs and vegetables"  },
  { key: "vegetarian",  icon: "🥦", title: "Vegetarian",      desc: "Plant-based, no meat or fish"    },
  { key: "budget",      icon: "💰", title: "On a budget",     desc: "Affordable basics that go far"   },
  { key: "highprotein", icon: "💪", title: "High protein",    desc: "Build muscle, stay full"         },
] as const;

export default function GroceryHome() {
  const router = useRouter();
  const { colors, isDark } = useTheme();
  const { activeDiet, setActiveDiet } = useApp();

  return (
    <View style={{ flex: 1 }}>
      <ImageBackground
        source={{ uri: isDark ? DARK_BG : LIGHT_BG }}
        style={StyleSheet.absoluteFillObject}
        resizeMode="cover"
      />
      <View style={{ ...StyleSheet.absoluteFillObject, backgroundColor: isDark ? "rgba(0,0,0,0.65)" : "rgba(255,247,237,0.92)" }} />

      <SafeAreaView style={s.safe}>
        <TopBar title="Grocery" showBack={false} />
        <View style={[s.container, { marginTop: 80 }]}>
          <Text style={[s.title, { color: isDark ? "#fff" : colors.text }]}>Your weekly plan</Text>
          <Text style={[s.sub, { color: isDark ? "#bbb" : colors.textMuted }]}>
            Pick a goal — tap again to set it as your active diet
          </Text>

          {GOALS.map((goal) => {
            const isActive = activeDiet === goal.key;
            return (
              <TouchableOpacity
                key={goal.key}
                style={[
                  s.card,
                  isDark
                    ? { backgroundColor: "rgba(255,255,255,0.08)", borderColor: "rgba(255,255,255,0.12)" }
                    : { backgroundColor: colors.bgCard, borderColor: colors.border },
                  isActive && { borderColor: colors.accent, borderWidth: 2 },
                ]}
                onPress={() => {
                  setActiveDiet(isActive ? null : goal.key);
                  router.push({ pathname: "/grocery/list", params: { goal: goal.key } } as any);
                }}
                activeOpacity={0.85}
              >
                <View style={[s.iconWrap, { backgroundColor: isActive ? colors.accent : isDark ? "rgba(255,255,255,0.1)" : colors.accentLight }]}>
                  <Text style={s.icon}>{goal.icon}</Text>
                </View>
                <View style={s.body}>
                  <Text style={[s.cardTitle, { color: isDark ? "#fff" : colors.text }]}>{goal.title}</Text>
                  <Text style={[s.cardDesc, { color: isDark ? "#bbb" : colors.textMuted }]}>{goal.desc}</Text>
                </View>
                {isActive
                  ? <View style={[s.activeBadge, { backgroundColor: colors.accent }]}><Text style={s.activeBadgeText}>Active</Text></View>
                  : <Text style={[s.arrow, { color: colors.accent }]}>›</Text>
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
  card: {
    flexDirection: "row", alignItems: "center",
    padding: 16, borderRadius: 20, borderWidth: 1, gap: 12,
  },
  iconWrap: { width: 48, height: 48, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  icon: { fontSize: 22 },
  body: { flex: 1 },
  cardTitle: { fontSize: 15, fontWeight: "800" },
  cardDesc: { fontSize: 12, marginTop: 3, lineHeight: 17 },
  arrow: { fontSize: 22, fontWeight: "700" },
  activeBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },
  activeBadgeText: { color: "#fff", fontSize: 11, fontWeight: "800" },
});