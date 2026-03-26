import { Heart } from "lucide-react-native";
import {
  FlatList,
  SafeAreaView, StatusBar, StyleSheet,
  Text, View,
} from "react-native";
import RecipeCard from "../../components/RecipeCard";
import TopBar from "../../components/TopBar";
import { useApp } from "../../context/AppContext";
import { useTheme } from "../../context/ThemeContext";

export default function Favorites() {
  const { favorites } = useApp();
  const { colors, isDark } = useTheme();

  return (
    <View style={[s.container, { backgroundColor: isDark ? "#0d0d0d" : "#FFF7ED" }]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
      <SafeAreaView style={{ flex: 1 }}>
        <TopBar showBack={false} />
        <FlatList
          data={favorites}
          keyExtractor={(m) => m.idMeal}
          contentContainerStyle={[s.list, { marginTop: 80 }]}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={s.emptyBox}>
              <Heart size={48} color={isDark ? "#333" : "#FFE4C8"} strokeWidth={1.5} />
              <Text style={[s.emptyText, { color: isDark ? "#555" : colors.textMuted }]}>
                No favorites yet.{"\n"}Tap the heart on any recipe to save it.
              </Text>
            </View>
          }
          renderItem={({ item }) => <RecipeCard meal={item} />}
        />
      </SafeAreaView>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1 },
  list: { padding: 16, paddingBottom: 40 },
  emptyBox: { alignItems: "center", marginTop: 120, gap: 16 },
  emptyText: { fontSize: 15, textAlign: "center", lineHeight: 22 },
});