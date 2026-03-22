import { FlatList, ImageBackground, SafeAreaView, StyleSheet, Text, View } from "react-native";
import RecipeCard from "../components/RecipeCard";
import TopBar from "../components/TopBar";
import { useApp } from "../context/AppContext";
import { useTheme } from "../context/ThemeContext";

const DARK_BG  = "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800";
const LIGHT_BG = "https://images.unsplash.com/photo-1543353071-873f17a7a088?w=800";

export default function Favorites() {
  const { favorites } = useApp();
  const { colors, isDark } = useTheme();

  const content = (
    <SafeAreaView style={s.safe}>
      <TopBar title="Favorites" showBack={false} />
      <FlatList
        data={favorites}
        keyExtractor={(m) => m.idMeal}
        contentContainerStyle={[s.list, { marginTop: 80 }]}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <Text style={[s.sub, { color: isDark ? "#bbb" : colors.textMuted }]}>
            {favorites.length === 0
              ? "No saved recipes yet"
              : `${favorites.length} saved recipe${favorites.length !== 1 ? "s" : ""}`}
          </Text>
        }
        ListEmptyComponent={
          <View style={s.emptyBox}>
            <Text style={s.emptyIcon}>🤍</Text>
            <Text style={[s.emptyText, { color: isDark ? "#bbb" : colors.textMuted }]}>
              Tap the heart on any recipe to save it here
            </Text>
          </View>
        }
        renderItem={({ item }) => <RecipeCard meal={item} route={`/recipe/${item.idMeal}`} />}
      />
    </SafeAreaView>
  );

  return (
    <View style={{ flex: 1 }}>
      <ImageBackground
        source={{ uri: isDark ? DARK_BG : LIGHT_BG }}
        style={StyleSheet.absoluteFillObject}
        resizeMode="cover"
      />
      <View style={{ ...StyleSheet.absoluteFillObject, backgroundColor: isDark ? "rgba(0,0,0,0.65)" : "rgba(255,247,237,0.92)" }} />
      {content}
    </View>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "transparent" },
  list: { padding: 16, paddingBottom: 40 },
  sub: { fontSize: 14, marginBottom: 16 },
  emptyBox: { alignItems: "center", marginTop: 100, gap: 12 },
  emptyIcon: { fontSize: 50 },
  emptyText: { fontSize: 15, textAlign: "center", lineHeight: 22, paddingHorizontal: 20 },
});