import { useRouter } from "expo-router";
import {
  FlatList,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Animated,
  Easing,
} from "react-native";
import { useEffect, useRef } from "react";
import TopBar from "../components/TopBar";
import { useApp } from "../context/AppContext";

const TILES = [
  { icon: "📖", label: "Browse", sub: "Thousands of recipes", route: "/browse" },
  { icon: "🧊", label: "My Fridge", sub: "Cook with what you have", route: "/fridge" },
  { icon: "🛒", label: "Grocery", sub: "Plan your shopping", route: "/grocery" },
  { icon: "❤️", label: "Favorites", sub: "Your saved recipes", route: "/favorites" },
] as const;

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning 👋";
  if (h < 18) return "Good afternoon 👋";
  return "Good evening 👋";
}

export default function Home() {
  const router = useRouter();
  const { recentlyViewed, user } = useApp();

  // 🔥 animated background
  const scale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(scale, {
          toValue: 1.1,
          duration: 8000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: 1,
          duration: 8000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  return (
    <View style={{ flex: 1 }}>
      {/* 🔥 Animated Background */}
      <Animated.Image
        source={{
          uri: "https://i.pinimg.com/736x/0a/c0/cc/0ac0ccb8807371350bfdf782cbfc919a.jpg",
        }}
        style={[StyleSheet.absoluteFillObject, { transform: [{ scale }] }]}
        resizeMode="cover"
      />

      {/* Overlay */}
      <View style={s.overlay}>
        <SafeAreaView style={s.safe}>
          <TopBar title="" showBack={false} />

          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Hero */}
            <View style={s.hero}>
              <Text style={s.greet}>{greeting()}</Text>
              <Text style={s.heroTitle}>What are we cooking today?</Text>
              {user?.email && <Text style={s.email}>{user.email}</Text>}
            </View>

            {/* Navigation grid */}
            <View style={s.grid}>
              {TILES.map((t) => (
                <TouchableOpacity
                  key={t.route}
                  style={s.tile}
                  onPress={() => router.push(t.route as any)}
                  activeOpacity={0.85}
                >
                  <Text style={s.tileIcon}>{t.icon}</Text>
                  <Text style={s.tileLabel}>{t.label}</Text>
                  <Text style={s.tileSub}>{t.sub}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Recently viewed */}
            {recentlyViewed.length > 0 && (
              <View style={s.section}>
                <Text style={s.sectionTitle}>Recently viewed</Text>

                <FlatList
                  horizontal
                  data={recentlyViewed}
                  keyExtractor={(m) => m.idMeal}
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{ paddingHorizontal: 20, gap: 12 }}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      onPress={() => router.push(`/recipe/${item.idMeal}` as any)}
                      activeOpacity={0.85}
                    >
                      <Image source={{ uri: item.strMealThumb }} style={s.recentImg} />
                      <Text style={s.recentName} numberOfLines={2}>
                        {item.strMeal}
                      </Text>
                    </TouchableOpacity>
                  )}
                />
              </View>
            )}
          </ScrollView>
        </SafeAreaView>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "transparent",
  },

  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
  },

  hero: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 28,
  },

  greet: {
    fontSize: 14,
    color: "#eee",
  },

  heroTitle: {
    fontSize: 26,
    fontWeight: "800",
    color: "#fff",
    lineHeight: 34,
    marginTop: 8,
  },

  email: {
    fontSize: 13,
    color: "#ddd",
    marginTop: 16,
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 16,
    gap: 16,
    marginTop: 10,
    marginBottom: 20,
  },

  tile: {
    width: "47%",
    borderRadius: 18,
    padding: 18,
    backgroundColor: "rgba(255,255,255,0.12)",

    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",

    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },

  tileIcon: {
    fontSize: 28,
    marginBottom: 10,
  },

  tileLabel: {
    fontSize: 15,
    fontWeight: "800",
    color: "#fff",
  },

  tileSub: {
    fontSize: 12,
    color: "#ddd",
    marginTop: 4,
  },

  section: {
    marginBottom: 30,
  },

  sectionTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: "#fff",
    paddingHorizontal: 24,
    marginBottom: 14,
    marginTop: 40,
  },

  recentImg: {
    width: 140,
    height: 100,
    borderRadius: 12,
    marginBottom: 6,
  },

  recentName: {
    width: 140,
    fontSize: 13,
    fontWeight: "600",
    color: "#eee",
    lineHeight: 18,
  },
});