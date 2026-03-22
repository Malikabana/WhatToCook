import { useRouter } from "expo-router";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Heart, Tag } from "lucide-react-native";
import { Meal, useApp } from "../context/AppContext";
import { useTheme } from "../context/ThemeContext";

type Props = { meal: Meal; route?: string };

export default function RecipeCard({ meal, route }: Props) {
  const router = useRouter();
  const { isFavorite, toggleFavorite } = useApp();
  const { colors, isDark } = useTheme();
  const fav = isFavorite(meal.idMeal);

  return (
    <TouchableOpacity
      style={[s.card, {
        backgroundColor: isDark ? "rgba(255,255,255,0.08)" : colors.bgCard,
        borderColor: isDark ? "rgba(255,255,255,0.12)" : colors.border,
      }]}
      onPress={() => router.push((route ?? `/recipe/${meal.idMeal}`) as any)}
      activeOpacity={0.85}
    >
      <Image source={{ uri: meal.strMealThumb }} style={s.image} />
      <View style={s.info}>
        <Text style={[s.name, { color: isDark ? "#fff" : colors.text }]} numberOfLines={2}>
          {meal.strMeal}
        </Text>
        {meal.strCategory && (
          <View style={[s.tag, { backgroundColor: colors.accentLight }]}>
            <Tag size={10} color={colors.accent} strokeWidth={2} />
            <Text style={[s.tagText, { color: colors.accent }]}>{meal.strCategory}</Text>
          </View>
        )}
      </View>
      <TouchableOpacity
        style={s.fav}
        onPress={() => toggleFavorite(meal)}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        <Heart
          size={20}
          color={fav ? "#ef4444" : isDark ? "#555" : "#ccc"}
          fill={fav ? "#ef4444" : "none"}
          strokeWidth={2}
        />
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

const s = StyleSheet.create({
  card: {
    borderRadius: 16, marginBottom: 12,
    flexDirection: "row", alignItems: "center",
    overflow: "hidden", borderWidth: 1,
    shadowColor: "#000", shadowOpacity: 0.08,
    shadowRadius: 8, shadowOffset: { width: 0, height: 2 }, elevation: 2,
  },
  image: { width: 90, height: 90 },
  info: { flex: 1, padding: 12 },
  name: { fontSize: 15, fontWeight: "700", lineHeight: 20 },
  tag: { flexDirection: "row", alignItems: "center", gap: 4, marginTop: 6, alignSelf: "flex-start", paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  tagText: { fontSize: 11, fontWeight: "700" },
  fav: { paddingRight: 14 },
});