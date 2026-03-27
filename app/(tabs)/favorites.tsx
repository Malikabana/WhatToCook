import { Heart } from "lucide-react-native";
import {
  FlatList, Image, SafeAreaView,
  StatusBar, StyleSheet, Text, View,
} from "react-native";
import RecipeCard from "../../components/RecipeCard";
import TopBar from "../../components/TopBar";
import { useApp } from "../../context/AppContext";
import { useTheme } from "../../context/ThemeContext";

const DARK_BG  = "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800";
const LIGHT_BG = "https://i.pinimg.com/1200x/cc/00/b5/cc00b5b9d93afba3a71fa5fce8111c14.jpg";

export default function Favorites() {
  const { favorites } = useApp();
  const { colors, isDark } = useTheme();

  return (
    <View style={{ flex: 1 }}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
      <Image
        source={{ uri: isDark ? DARK_BG : LIGHT_BG }}
        style={StyleSheet.absoluteFillObject}
        resizeMode="cover"
      />
      <View style={{ ...StyleSheet.absoluteFillObject, backgroundColor: isDark ? "rgba(0,0,0,0.65)" : "rgba(255,247,237,0.88)" }} />

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
  list:      { padding: 16, paddingBottom: 40 },
  emptyBox:  { alignItems: "center", marginTop: 120, gap: 16 },
  emptyText: { fontSize: 15, textAlign: "center", lineHeight: 22 },
});