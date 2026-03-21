import { useRouter } from "expo-router";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Meal, useApp } from "../context/AppContext";

type Props = { meal: Meal; route?: string };

export default function RecipeCard({ meal, route }: Props) {
  const router = useRouter();
  const { isFavorite, toggleFavorite } = useApp();
  const fav = isFavorite(meal.idMeal);

  return (
    <TouchableOpacity
      style={s.card}
      onPress={() => router.push((route ?? `/recipe/${meal.idMeal}`) as any)}
      activeOpacity={0.85}
    >
      <Image source={{ uri: meal.strMealThumb }} style={s.image} />
      <View style={s.info}>
        <Text style={s.name} numberOfLines={2}>{meal.strMeal}</Text>
        {meal.strCategory && (
          <View style={s.tag}>
            <Text style={s.tagText}>{meal.strCategory}</Text>
          </View>
        )}
      </View>
      <TouchableOpacity
        style={s.fav}
        onPress={() => toggleFavorite(meal)}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        <Text style={{ fontSize: 20 }}>{fav ? "❤️" : "🤍"}</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

const s = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#FFE4C8",
    shadowColor: "#FF6B00",
    shadowOpacity: 0.07,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  image: { width: 90, height: 90 },
  info: { flex: 1, padding: 12 },
  name: { fontSize: 15, fontWeight: "700", color: "#1a1a1a", lineHeight: 20 },
  tag: {
    marginTop: 6, alignSelf: "flex-start",
    backgroundColor: "#FFEDD5", paddingHorizontal: 8,
    paddingVertical: 3, borderRadius: 8,
  },
  tagText: { color: "#C2410C", fontSize: 11, fontWeight: "700" },
  fav: { paddingRight: 14 },
});