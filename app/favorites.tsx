import { useRef, useEffect } from "react";
import {
  Animated, Easing, FlatList, SafeAreaView,
  StatusBar, StyleSheet, Text, View,
} from "react-native";
import { Heart } from "lucide-react-native";
import RecipeCard from "../components/RecipeCard";
import TopBar from "../components/TopBar";
import { useApp } from "../context/AppContext";
import { useTheme } from "../context/ThemeContext";

const DARK_BG  = "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800";
const LIGHT_BG = "https://images.unsplash.com/photo-1543353071-873f17a7a088?w=800";

export default function Favorites() {
  const { favorites } = useApp();
  const { colors, isDark } = useTheme();

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
        <TopBar title="Favorites" showBack={false} />
        <FlatList
          data={favorites}
          keyExtractor={(m) => m.idMeal}
          contentContainerStyle={[s.list, { marginTop: 80 }]}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <View style={s.headerRow}>
              <Heart size={14} color={isDark ? "#bbb" : colors.textMuted} strokeWidth={2} />
              <Text style={[s.sub, { color: isDark ? "#bbb" : colors.textMuted }]}>
                {favorites.length === 0
                  ? "No saved recipes yet"
                  : `${favorites.length} saved recipe${favorites.length !== 1 ? "s" : ""}`}
              </Text>
            </View>
          }
          ListEmptyComponent={
            <View style={s.emptyBox}>
              <Heart size={48} color={isDark ? "#333" : "#FFE4C8"} strokeWidth={1.5} />
              <Text style={[s.emptyText, { color: isDark ? "#555" : colors.textMuted }]}>
                Tap the heart on any recipe to save it here
              </Text>
            </View>
          }
          renderItem={({ item }) => <RecipeCard meal={item} route={`/recipe/${item.idMeal}`} />}
        />
      </SafeAreaView>
    </View>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "transparent" },
  list: { padding: 16, paddingBottom: 40 },
  headerRow: { flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 16 },
  sub: { fontSize: 14 },
  emptyBox: { alignItems: "center", marginTop: 100, gap: 16 },
  emptyText: { fontSize: 15, textAlign: "center", lineHeight: 22, paddingHorizontal: 20 },
});