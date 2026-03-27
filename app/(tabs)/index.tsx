import { useRouter } from "expo-router";
import { ChevronRight, Moon, Sun, Sunset, Tag, Utensils } from "lucide-react-native";
import { useEffect, useState } from "react";
import {
  Image,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import TopBar from "../../components/TopBar";
import { Meal, useApp } from "../../context/AppContext";
import { useTheme } from "../../context/ThemeContext";
import { getRandomMeals } from "../../services/api";

const DARK_BG  = "https://i.pinimg.com/1200x/9c/ae/4f/9cae4fa16d06fcc62c8672916811f33c.jpg";
const LIGHT_BG = "https://i.pinimg.com/736x/19/a2/9d/19a29d5e12dc17c95e278f6f3700bfce.jpg";

function greeting(): { text: string; Icon: any } {
  const h = new Date().getHours();
  if (h < 12) return { text: "Good morning",   Icon: Sun    };
  if (h < 18) return { text: "Good afternoon", Icon: Sunset };
  return         { text: "Good evening",   Icon: Moon   };
}

export default function Home() {
  const router = useRouter();
  const { user, fridgeItems, favorites } = useApp();
  const { isDark, colors } = useTheme();

  const [mealOfDay, setMealOfDay] = useState<Meal | null>(null);
  const [recommended, setRecommended] = useState<Meal[]>([]);

  useEffect(() => {
    getRandomMeals(5).then((meals) => {
      setRecommended(meals);
      if (meals[0]) setMealOfDay(meals[0]);
    });
  }, []);

  const firstName = user?.email?.split("@")[0] ?? "";
  const { text: greetText, Icon: GreetIcon } = greeting();

  return (
    <View style={{ flex: 1 }}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />

      {/* Background */}
      <Image
        source={{ uri: isDark ? DARK_BG : LIGHT_BG }}
        style={StyleSheet.absoluteFillObject}
        resizeMode="cover"
      />
      <View style={{ ...StyleSheet.absoluteFillObject, backgroundColor: isDark ? "rgba(22, 2, 2, 0.65)" : "rgba(255,247,237,0.82)" }} />

      <SafeAreaView style={{ flex: 1 }}>
        <TopBar showBack={false} />

        <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>

          {/* HERO */}
          <View style={s.hero}>
            <View style={s.greetRow}>
              <GreetIcon size={14} color={isDark ? "#ccc" : "#333"} />
              <Text style={[s.greet, { color: isDark ? "#fff" : "#111" }]}>
                {greetText}
              </Text>
            </View>

            <Text style={[s.heroTitle, { color: isDark ? "#fff" : "#1a1a1a" }]}>
              {firstName
                ? `${firstName}, what are we doing today?`
                : "What are we doing today?"}
            </Text>

           
          </View>

          

          

          {/* MEAL OF THE DAY */}
          {mealOfDay && (
            <View style={s.section}>
              <View style={s.sectionRow}>
                <Utensils size={15} color={isDark ? "#fff" : "#1a1a1a"} />
                <Text style={[s.sectionTitle, { color: isDark ? "#fff" : "#1a1a1a" }]}>
                  Meal of the Day
                </Text>
              </View>

              <TouchableOpacity
                style={s.motdCard}
                onPress={() => router.push(`/recipe/${mealOfDay.idMeal}` as any)}
              >
                <Image source={{ uri: mealOfDay.strMealThumb }} style={s.motdImage} />
                <View style={s.motdOverlay} />

                <View style={s.motdInfo}>
                  <Text style={s.motdName}>{mealOfDay.strMeal}</Text>

                  {mealOfDay.strCategory && (
                    <View style={s.motdTag}>
                      <Tag size={10} color="#FF8C42" />
                      <Text style={s.motdTagText}>{mealOfDay.strCategory}</Text>
                    </View>
                  )}
                </View>

                <ChevronRight style={s.motdArrow} color="#fff" />
              </TouchableOpacity>
            </View>
          )}

          

          {/* USER */}
          {user?.email && (
            <View style={s.userRow}>
              <View style={s.userDot} />
              <Text style={[s.userEmail, { color: isDark ? "#fff" : "#333" }]}>
                {user.email}
              </Text>
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const s = StyleSheet.create({
  scroll: { paddingBottom: 40 },

  hero: { paddingHorizontal: 24, paddingTop: 90, paddingBottom: 24 },

  greetRow: { flexDirection: "row", gap: 6, marginBottom: 6 },

  greet: { fontSize: 19},

  heroTitle: { fontSize: 26, fontWeight: "900", marginBottom: 12 },

  section: { paddingHorizontal: 20, marginBottom: 100 },

  sectionRow: { flexDirection: "row", gap: 8, marginBottom: 12 },

  sectionTitle: { fontSize: 16, fontWeight: "800" },

  motdCard: { borderRadius: 18, overflow: "hidden", height: 160 },

  motdImage: { width: "100%", height: "100%" },

  motdOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.4)" },

  motdInfo: { position: "absolute", bottom: 14, left: 14 },

  motdName: { color: "#fff", fontWeight: "800" },

  motdTag: { flexDirection: "row", gap: 5 },

  motdTagText: { color: "#FF8C42", fontSize: 11 },

  motdArrow: { position: "absolute", right: 10, bottom: 10 },

  recoCard: { width: 120, marginRight: 10 },

  recoImage: { width: "100%", height: 80, borderRadius: 12 },

  recoText: { color: "#fff", fontSize: 12, marginTop: 4 },

  userRow: { alignItems: "center", marginTop: 20 },

  userDot: { width: 6, height: 6, backgroundColor: "#22c55e", borderRadius: 3 },

  userEmail: { fontSize: 12 },
});