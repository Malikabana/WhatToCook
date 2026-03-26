import { useRouter } from "expo-router";
import { ChevronRight, Moon, Sun, Sunset, Tag, Utensils } from "lucide-react-native";
import { useEffect, useState } from "react";
import {
  Image,
  SafeAreaView, ScrollView, StatusBar,
  StyleSheet, Text, TouchableOpacity, View,
} from "react-native";
import TopBar from "../../components/TopBar";
import { Meal, useApp } from "../../context/AppContext";
import { useTheme } from "../../context/ThemeContext";
import { getRandomMeals } from "../../services/api";

function greeting(): { text: string; Icon: any } {
  const h = new Date().getHours();
  if (h < 12) return { text: "Good morning",   Icon: Sun    };
  if (h < 18) return { text: "Good afternoon", Icon: Sunset };
  return         { text: "Good evening",   Icon: Moon   };
}

export default function Home() {
  const router = useRouter();
  const { user } = useApp();
  const { isDark, colors } = useTheme();
  const [mealOfDay, setMealOfDay] = useState<Meal | null>(null);

  useEffect(() => {
    getRandomMeals(1).then((meals) => { if (meals[0]) setMealOfDay(meals[0]); });
  }, []);

 
  const { text: greetText, Icon: GreetIcon } = greeting();
  const bg = isDark ? "#0d0d0d" : "#FFF7ED";

  return (
    <View style={[s.container, { backgroundColor: bg }]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
      <SafeAreaView style={{ flex: 1 }}>
        <TopBar showBack={false} />
        <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>

          {/* Greeting */}
          <View style={s.hero}>
            <View style={s.greetRow}>
              <GreetIcon size={14} color={isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.4)"} strokeWidth={2} />
              <Text style={[s.greet, { color: isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.4)" }]}>{greetText}</Text>
            </View>
            
          </View>

          {/* Meal of the Day */}
          {mealOfDay && (
            <View style={s.section}>
              <View style={s.sectionRow}>
                <Utensils size={15} color={isDark ? "#fff" : "#1a1a1a"} strokeWidth={2} />
                <Text style={[s.sectionTitle, { color: isDark ? "#fff" : "#1a1a1a" }]}>Meal of the Day</Text>
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
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1 },
  scroll: { paddingBottom: 40 },
  hero: { paddingHorizontal: 24, paddingTop: 90, paddingBottom: 24 },
  greetRow: { flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 6 },
  greet: { fontSize: 14 },
  heroTitle: { fontSize: 28, fontWeight: "900", lineHeight: 36 },
  section: { paddingHorizontal: 20, marginBottom: 24 },
  sectionRow: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 12 },
  sectionTitle: { fontSize: 16, fontWeight: "800" },
  motdCard: { borderRadius: 18, overflow: "hidden", height: 160 },
  motdImage: { width: "100%", height: "100%" },
  motdOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.4)" },
  motdInfo: { position: "absolute", bottom: 14, left: 14, right: 40 },
  motdName: { fontSize: 18, fontWeight: "800", color: "#fff", lineHeight: 22 },
  motdTag: {
    marginTop: 6, alignSelf: "flex-start", flexDirection: "row", alignItems: "center", gap: 5,
    backgroundColor: "rgba(255,140,66,0.3)", borderWidth: 1, borderColor: "rgba(255,140,66,0.5)",
    paddingHorizontal: 10, paddingVertical: 3, borderRadius: 10,
  },
  motdTagText: { color: "#FF8C42", fontSize: 11, fontWeight: "700" },
  motdArrow: { position: "absolute", bottom: 16, right: 14 },
  userRow: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6, paddingHorizontal: 20 },
  userDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: "#22c55e" },
  userEmail: { fontSize: 12 },
});