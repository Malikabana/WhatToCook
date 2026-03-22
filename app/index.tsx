import { useRouter } from "expo-router";
import {
  Animated, Easing, Image, SafeAreaView,
  ScrollView, StatusBar, StyleSheet, Text,
  TouchableOpacity, View,
} from "react-native";
import { useEffect, useRef, useState } from "react";
import {
  BookOpen, Snowflake, ShoppingCart, Heart,
  Scale, Leaf, Wallet, Dumbbell,
  Sun, Sunset, Moon, Utensils, Tag,
  ChevronRight,
} from "lucide-react-native";
import TopBar from "../components/TopBar";
import { useApp } from "../context/AppContext";
import { useTheme } from "../context/ThemeContext";
import { getRandomMeals } from "../services/api";
import { Meal } from "../context/AppContext";

const TILES = [
  { Icon: BookOpen,     label: "Browse",    sub: "Thousands of recipes",    route: "/browse"    },
  { Icon: Snowflake,    label: "My Fridge", sub: "Cook with what you have", route: "/fridge"    },
  { Icon: ShoppingCart, label: "Grocery",   sub: "Plan your shopping",      route: "/grocery"   },
  { Icon: Heart,        label: "Favorites", sub: "Your saved recipes",      route: "/favorites" },
] as const;

const DIET_META: Record<string, { label: string; Icon: any }> = {
  balanced:    { label: "Balanced",     Icon: Scale    },
  vegetarian:  { label: "Vegetarian",   Icon: Leaf     },
  budget:      { label: "Budget",       Icon: Wallet   },
  highprotein: { label: "High Protein", Icon: Dumbbell },
};

const DARK_BG  = "https://i.pinimg.com/736x/17/6a/74/176a7412e8ddced436b3b5783ec8ab75.jpg";
const LIGHT_BG = "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800";

function greeting(): { text: string; Icon: any } {
  const h = new Date().getHours();
  if (h < 12) return { text: "Good morning",   Icon: Sun    };
  if (h < 18) return { text: "Good afternoon", Icon: Sunset };
  return         { text: "Good evening",   Icon: Moon   };
}

export default function Home() {
  const router = useRouter();
  const { user, activeDiet } = useApp();
  const { isDark } = useTheme();
  const [mealOfDay, setMealOfDay] = useState<Meal | null>(null);
  const scale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(scale, { toValue: 1.08, duration: 10000, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        Animated.timing(scale, { toValue: 1,    duration: 10000, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
      ])
    ).start();
    getRandomMeals(1).then((meals) => { if (meals[0]) setMealOfDay(meals[0]); });
  }, []);

  const firstName = user?.email?.split("@")[0] ?? "";
  const { text: greetText, Icon: GreetIcon } = greeting();
  const diet = activeDiet ? DIET_META[activeDiet] : null;

  return (
    <View style={{ flex: 1, backgroundColor: isDark ? "#0a0a0a" : "#FFF7ED" }}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />

      <Animated.Image
        source={{ uri: isDark ? DARK_BG : LIGHT_BG }}
        style={[StyleSheet.absoluteFillObject, { transform: [{ scale }] }]}
        resizeMode="cover"
      />
      <View style={s.overlayTop} />
      <View style={[s.overlay, { backgroundColor: isDark ? "rgba(0,0,0,0.52)" : "rgba(255,247,237,0.75)" }]} />

      <SafeAreaView style={s.safe}>
        <TopBar showBack={false} />

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.scroll}>

          {/* Hero */}
          <View style={s.hero}>
            <View style={s.greetRow}>
              <GreetIcon size={14} color={isDark ? "rgba(255,255,255,0.55)" : "rgba(0,0,0,0.4)"} strokeWidth={2} />
              <Text style={[s.greet, { color: isDark ? "rgba(255,255,255,0.55)" : "rgba(0,0,0,0.4)" }]}>
                {greetText}
              </Text>
            </View>
            <Text style={[s.heroTitle, { color: isDark ? "#fff" : "#1a1a1a" }]}>
              {firstName ? `Hey ${firstName},\nwhat are we cooking?` : "What are we\ncooking today?"}
            </Text>

            {/* Diet badge */}
            {diet && (
              <View style={s.dietBadge}>
                <diet.Icon size={13} color="#FF8C42" strokeWidth={2} />
                <Text style={s.dietBadgeText}>Goal: {diet.label}</Text>
              </View>
            )}
          </View>

          {/* Sheet */}
          <View style={[s.sheet, {
            backgroundColor: isDark ? "rgba(12,12,12,0.7)" : "rgba(255,255,255,0.96)",
            borderColor: isDark ? "rgba(255,255,255,0.07)" : "#FFE4C8",
          }]}>

            {/* Grid */}
            <View style={s.grid}>
              {TILES.map((t) => (
                <TouchableOpacity
                  key={t.route}
                  style={[s.tile, {
                    backgroundColor: isDark ? "rgba(255,255,255,0.05)" : "#FFF7ED",
                    borderColor: isDark ? "rgba(255,255,255,0.08)" : "#FFE4C8",
                  }]}
                  onPress={() => router.push(t.route as any)}
                  activeOpacity={0.8}
                >
                  <View style={s.tileAccent} />
                  <View style={s.tileIconWrap}>
                    <t.Icon size={26} color="#FF8C42" strokeWidth={1.8} />
                  </View>
                  <Text style={[s.tileLabel, { color: isDark ? "#fff" : "#1a1a1a" }]}>{t.label}</Text>
                  <Text style={[s.tileSub, { color: isDark ? "#555" : "#aaa" }]}>{t.sub}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={[s.divider, { backgroundColor: isDark ? "rgba(190, 161, 15, 0.06)" : "#FFE4C8" }]} />

            {/* Meal of the day */}
            {mealOfDay && (
              <View style={s.motdSection}>
                <View style={s.motdTitleRow}>
                  <Utensils size={16} color={isDark ? "#fff" : "#1a1a1a"} strokeWidth={2} />
                  <Text style={[s.motdTitle, { color: isDark ? "#fff" : "#1a1a1a" }]}>Meal of the Day</Text>
                </View>
                <TouchableOpacity
                  style={s.motdCard}
                  onPress={() => router.push(`/recipe/${mealOfDay.idMeal}` as any)}
                  activeOpacity={0.85}
                >
                  <Image source={{ uri: mealOfDay.strMealThumb }} style={s.motdImage} />
                  <View style={s.motdOverlay} />
                  <View style={s.motdInfo}>
                    <Text style={s.motdName} numberOfLines={2}>{mealOfDay.strMeal}</Text>
                    {mealOfDay.strCategory && (
                      <View style={s.motdTag}>
                        <Tag size={10} color="#FF8C42" strokeWidth={2} />
                        <Text style={s.motdTagText}>{mealOfDay.strCategory}</Text>
                      </View>
                    )}
                  </View>
                  <View style={s.motdArrow}>
                    <ChevronRight size={16} color="#fff" strokeWidth={2.5} />
                  </View>
                </TouchableOpacity>
              </View>
            )}

            {/* User footer */}
            {user?.email && (
              <View style={s.userRow}>
                <View style={s.userDot} />
                <Text style={[s.userEmail, { color: isDark ? "#444" : "#bbb" }]}>{user.email}</Text>
              </View>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1 },
  scroll: { flexGrow: 1, justifyContent: "flex-end" },
  overlay: { ...StyleSheet.absoluteFillObject },
  overlayTop: { position: "absolute", top: 0, left: 0, right: 0, height: "40%", backgroundColor: "rgba(0,0,0,0.15)" },
  hero: { paddingHorizontal: 28, paddingTop: 20, paddingBottom: 32 },
  greetRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  greet: { fontSize: 14, letterSpacing: 0.3 },
  heroTitle: { fontSize: 30, fontWeight: "900", lineHeight: 38, marginTop: 6 },
  dietBadge: {
    marginTop: 12, alignSelf: "flex-start",
    flexDirection: "row", alignItems: "center", gap: 6,
    backgroundColor: "rgba(255,140,66,0.2)",
    borderWidth: 1, borderColor: "rgba(255,140,66,0.4)",
    paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20,
  },
  dietBadgeText: { color: "#FF8C42", fontSize: 13, fontWeight: "700" },
  sheet: {
    borderTopLeftRadius: 32, borderTopRightRadius: 32,
    borderWidth: 1, borderBottomWidth: 0,
    paddingTop: 28, paddingBottom: 48,
  },
  grid: { flexDirection: "row", flexWrap: "wrap", paddingHorizontal: 16, gap: 12, marginBottom: 24 },
  tile: { width: "47%", borderRadius: 18, padding: 16, borderWidth: 1, overflow: "hidden" },
  tileAccent: {
    position: "absolute", top: 0, left: 0, right: 0, height: 2,
    backgroundColor: "#FF8C42", borderTopLeftRadius: 18, borderTopRightRadius: 18,
  },
  tileIconWrap: { marginBottom: 10, marginTop: 6 },
  tileLabel: { fontSize: 15, fontWeight: "800" },
  tileSub: { fontSize: 12, marginTop: 3 },
  divider: { height: 1, marginHorizontal: 16, marginBottom: 20 },
  motdSection: { paddingHorizontal: 16, marginBottom: 24 },
  motdTitleRow: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 12 },
  motdTitle: { fontSize: 16, fontWeight: "800" },
  motdCard: { borderRadius: 18, overflow: "hidden", height: 160, position: "relative" },
  motdImage: { width: "100%", height: "100%" },
  motdOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.4)" },
  motdInfo: { position: "absolute", bottom: 14, left: 14, right: 40 },
  motdName: { fontSize: 18, fontWeight: "800", color: "#fff", lineHeight: 22 },
  motdTag: {
    marginTop: 6, alignSelf: "flex-start",
    flexDirection: "row", alignItems: "center", gap: 5,
    backgroundColor: "rgba(255,140,66,0.3)",
    borderWidth: 1, borderColor: "rgba(255,140,66,0.5)",
    paddingHorizontal: 10, paddingVertical: 3, borderRadius: 10,
  },
  motdTagText: { color: "#FF8C42", fontSize: 11, fontWeight: "700" },
  motdArrow: { position: "absolute", bottom: 16, right: 14 },
  userRow: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6, paddingHorizontal: 20 },
  userDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: "#22c55e" },
  userEmail: { fontSize: 12 },
});