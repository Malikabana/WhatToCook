import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator, Image, SafeAreaView, ScrollView,
  StyleSheet, Text, TouchableOpacity, View,
} from "react-native";
import { Meal, useApp } from "../../context/AppContext";
import { getMealById } from "../../services/api";

export default function RecipeDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { toggleFavorite, isFavorite, fridgeItems, addToGrocery, groceryList, addRecentlyViewed } = useApp();
  const [meal, setMeal] = useState<Meal | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    getMealById(id).then((m) => {
      setMeal(m);
      if (m) addRecentlyViewed(m);
    }).finally(() => setLoading(false));
  }, [id]);

  if (loading) return <ActivityIndicator size="large" color="#FF6B00" style={{ flex: 1, backgroundColor: "#FFF7ED" }} />;
  if (!meal) return <SafeAreaView style={s.safe}><Text style={s.err}>Could not load recipe.</Text></SafeAreaView>;

  const fav = isFavorite(meal.idMeal);

  const ingredients: { name: string; measure: string; inFridge: boolean }[] = [];
  for (let i = 1; i <= 20; i++) {
    const ing = meal[`strIngredient${i}`]?.trim().toLowerCase();
    const msr = meal[`strMeasure${i}`]?.trim();
    if (!ing) continue;
    const inFridge = fridgeItems.some((f) => ing.includes(f) || f.includes(ing));
    ingredients.push({ name: ing, measure: msr ?? "", inFridge });
  }

  const have = ingredients.filter((i) => i.inFridge).length;

  return (
    <SafeAreaView style={s.safe}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Image source={{ uri: meal.strMealThumb }} style={s.image} />
        <TouchableOpacity style={s.backBtn} onPress={() => router.back()}>
          <Text style={s.backText}>‹</Text>
        </TouchableOpacity>

        <View style={s.body}>
          <Text style={s.title}>{meal.strMeal}</Text>

          <View style={s.tags}>
            {[meal.strCategory, meal.strArea].filter(Boolean).map((t) => (
              <View key={t} style={s.tag}><Text style={s.tagText}>{t}</Text></View>
            ))}
          </View>

          {fridgeItems.length > 0 && (
            <View style={s.summary}>
              <Text style={s.summaryText}>
                You have <Text style={s.summaryBold}>{have} of {ingredients.length}</Text> ingredients
              </Text>
              <View style={s.summaryBar}>
                <View style={[s.summaryFill, { width: `${(have / ingredients.length) * 100}%` as any }]} />
              </View>
            </View>
          )}

          <TouchableOpacity style={[s.favBtn, fav && s.favBtnOn]} onPress={() => toggleFavorite(meal)}>
            <Text style={[s.favText, fav && s.favTextOn]}>
              {fav ? "❤️  Remove from Favorites" : "🤍  Save to Favorites"}
            </Text>
          </TouchableOpacity>

          <Text style={s.section}>Ingredients</Text>
          {ingredients.map((ing, i) => {
            const inList = groceryList.includes(ing.name);
            return (
              <View key={i} style={s.ingRow}>
                <View style={[s.dot, ing.inFridge ? s.dotGreen : s.dotRed]} />
                <Text style={s.ingText}>{ing.measure ? `${ing.measure} ` : ""}{ing.name}</Text>
                {!ing.inFridge && (
                  <TouchableOpacity
                    style={[s.addBtn, inList && s.addBtnDone]}
                    onPress={() => !inList && addToGrocery(ing.name)}
                  >
                    <Text style={[s.addBtnText, inList && s.addBtnTextDone]}>
                      {inList ? "✓" : "+ List"}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            );
          })}

          <Text style={s.section}>Instructions</Text>
          <Text style={s.instructions}>{meal.strInstructions}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#FFF7ED" },
  err: { textAlign: "center", marginTop: 80, color: "#aaa", fontSize: 16 },
  image: { width: "100%", height: 300 },
  backBtn: {
    position: "absolute", top: 52, left: 16,
    backgroundColor: "#000000aa", borderRadius: 20,
    width: 40, height: 40, alignItems: "center", justifyContent: "center",
  },
  backText: { fontSize: 28, color: "#fff", lineHeight: 32 },
  body: { padding: 20 },
  title: { fontSize: 24, fontWeight: "800", color: "#1a1a1a", marginBottom: 12 },
  tags: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 16 },
  tag: { backgroundColor: "#FFEDD5", paddingHorizontal: 12, paddingVertical: 5, borderRadius: 20 },
  tagText: { color: "#C2410C", fontSize: 13, fontWeight: "600" },
  summary: { backgroundColor: "#fff", borderRadius: 14, padding: 14, marginBottom: 16, borderWidth: 1, borderColor: "#FFE4C8", gap: 8 },
  summaryText: { fontSize: 14, color: "#555" },
  summaryBold: { fontWeight: "800", color: "#FF6B00" },
  summaryBar: { height: 5, backgroundColor: "#FFE4C8", borderRadius: 3, overflow: "hidden" },
  summaryFill: { height: "100%", backgroundColor: "#FF6B00", borderRadius: 3 },
  favBtn: { borderWidth: 2, borderColor: "#FF6B00", borderRadius: 14, paddingVertical: 14, alignItems: "center", marginBottom: 28 },
  favBtnOn: { backgroundColor: "#FF6B00" },
  favText: { color: "#FF6B00", fontWeight: "700", fontSize: 15 },
  favTextOn: { color: "#fff" },
  section: { fontSize: 18, fontWeight: "800", color: "#1a1a1a", marginBottom: 12, marginTop: 4 },
  ingRow: { flexDirection: "row", alignItems: "center", marginBottom: 10, gap: 10 },
  dot: { width: 7, height: 7, borderRadius: 4, flexShrink: 0 },
  dotGreen: { backgroundColor: "#22c55e" },
  dotRed: { backgroundColor: "#ef4444" },
  ingText: { flex: 1, fontSize: 14, color: "#444", lineHeight: 20, textTransform: "capitalize" },
  addBtn: { backgroundColor: "#FFEDD5", paddingHorizontal: 10, paddingVertical: 5, borderRadius: 10, borderWidth: 1, borderColor: "#FF6B00" },
  addBtnDone: { borderColor: "#22c55e", backgroundColor: "#f0fdf4" },
  addBtnText: { fontSize: 12, fontWeight: "700", color: "#FF6B00" },
  addBtnTextDone: { color: "#22c55e" },
  instructions: { fontSize: 14, color: "#555", lineHeight: 26, marginBottom: 48 },
});