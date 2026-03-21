import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ImageBackground,
} from "react-native";
import TopBar from "../components/TopBar";
import { Meal, useApp } from "../context/AppContext";
import { getMealById, searchByIngredient } from "../services/api";

type EnrichedMeal = Meal & { matchPercent: number; missing: string[] };

function extractIngredients(meal: Meal): string[] {
  const out: string[] = [];
  for (let i = 1; i <= 20; i++) {
    const ing = meal[`strIngredient${i}`]?.trim().toLowerCase();
    if (ing) out.push(ing);
  }
  return out;
}

export default function Fridge() {
  const router = useRouter();
  const { fridgeItems, addFridgeItem, removeFridgeItem, isFavorite, toggleFavorite } = useApp();

  const [text, setText] = useState("");
  const [meals, setMeals] = useState<EnrichedMeal[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleAdd = () => {
    const clean = text.trim().toLowerCase();
    if (!clean) return;
    addFridgeItem(clean);
    setText("");
  };

  const handleSearch = async () => {
    if (!fridgeItems.length) return;
    setLoading(true);
    setSearched(false);

    try {
      const initial = await searchByIngredient(fridgeItems[0]);
      const detailed = await Promise.all(
        initial.slice(0, 15).map((m) => getMealById(m.idMeal))
      );

      const fridge = fridgeItems.map((f) => f.toLowerCase());

      const enriched: EnrichedMeal[] = detailed
        .filter((m): m is Meal => m !== null)
        .map((meal) => {
          const ings = extractIngredients(meal);
          const have = ings.filter((ing) =>
            fridge.some((f) => ing.includes(f) || f.includes(ing))
          );
          const missing = ings.filter(
            (ing) => !fridge.some((f) => ing.includes(f) || f.includes(ing))
          );

          return {
            ...meal,
            matchPercent: Math.round((have.length / ings.length) * 100),
            missing,
          };
        })
        .sort((a, b) => b.matchPercent - a.matchPercent);

      setMeals(enriched);
    } finally {
      setLoading(false);
      setSearched(true);
    }
  };

  const barColor = (pct: number) =>
    pct >= 80 ? "#22c55e" : pct >= 50 ? "#FF8C42" : "#ef4444";

  return (
    <ImageBackground
      source={{ uri: "https://i.pinimg.com/736x/9b/63/da/9b63da8361f93f465ab57faa2fa8ac6b.jpg" }}
      style={{ flex: 1 }}
      resizeMode="cover"
    >
      <View style={s.overlay}>
        <SafeAreaView style={s.safe}>
          <TopBar title="My Fridge" showBack={false} />

          <FlatList
            data={searched ? meals : []}
            keyExtractor={(m) => m.idMeal}
            contentContainerStyle={s.list}
            showsVerticalScrollIndicator={false}
            ListHeaderComponent={
              <View>
                <Text style={s.sub}>
                  Add ingredients — we'll find what you can make
                </Text>

                <View style={s.inputRow}>
                  <TextInput
                    style={s.input}
                    value={text}
                    onChangeText={setText}
                    onSubmitEditing={handleAdd}
                    placeholder="e.g. chicken, pasta..."
                    placeholderTextColor="#aaa"
                  />

                  <TouchableOpacity style={s.addBtn} onPress={handleAdd}>
                    <Text style={s.addBtnText}>Add</Text>
                  </TouchableOpacity>
                </View>

                {fridgeItems.length > 0 && (
                  <View style={s.chips}>
                    {fridgeItems.map((item) => (
                      <TouchableOpacity
                        key={item}
                        style={s.chip}
                        onPress={() => removeFridgeItem(item)}
                      >
                        <Text style={s.chipText}>{item}</Text>
                        <Text style={s.chipX}>✕</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}

                {fridgeItems.length > 0 && !loading && (
                  <TouchableOpacity style={s.searchBtn} onPress={handleSearch}>
                    <Text style={s.searchBtnText}>Find Recipes →</Text>
                  </TouchableOpacity>
                )}

                {loading && (
                  <View style={s.loadBox}>
                    <ActivityIndicator size="large" color="#FF8C42" />
                    <Text style={s.loadText}>
                      Analysing your ingredients...
                    </Text>
                  </View>
                )}

                {searched && !loading && meals.length > 0 && (
                  <Text style={s.resultsLabel}>
                    {meals.length} recipes — best matches
                  </Text>
                )}
              </View>
            }
            renderItem={({ item }) => (
              <TouchableOpacity
                style={s.card}
                onPress={() => router.push(`/recipe/${item.idMeal}` as any)}
              >
                <Image source={{ uri: item.strMealThumb }} style={s.cardImg} />

                <View style={s.cardBody}>
                  <Text style={s.cardName}>{item.strMeal}</Text>

                  <View style={s.matchRow}>
                    <View style={s.barBg}>
                      <View
                        style={[
                          s.barFill,
                          {
                            width: `${item.matchPercent}%` as any,
                            backgroundColor: barColor(item.matchPercent),
                          },
                        ]}
                      />
                    </View>
                    <Text style={[s.pct, { color: barColor(item.matchPercent) }]}>
                      {item.matchPercent}%
                    </Text>
                  </View>

                  {item.missing.length > 0 ? (
                    <Text style={s.missing}>
                      Missing: {item.missing.slice(0, 2).join(", ")}
                    </Text>
                  ) : (
                    <Text style={s.allGood}>✅ Ready to cook</Text>
                  )}
                </View>

                <TouchableOpacity
                  onPress={() => toggleFavorite(item)}
                  style={s.fav}
                >
                  <Text style={{ fontSize: 20 }}>
                    {isFavorite(item.idMeal) ? "❤️" : "🤍"}
                  </Text>
                </TouchableOpacity>
              </TouchableOpacity>
            )}
          />
        </SafeAreaView>
      </View>
    </ImageBackground>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "transparent" },

  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.55)",
  },

  list: { padding: 20, paddingBottom: 40 },

  sub: { fontSize: 14, color: "#ddd", marginBottom: 14 },

  inputRow: { flexDirection: "row", gap: 10, marginBottom: 14 },

  input: {
    flex: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: "rgba(255,255,255,0.1)",
    color: "#fff",
  },

  addBtn: {
    backgroundColor: "#FF8C42",
    borderRadius: 12,
    paddingHorizontal: 18,
    justifyContent: "center",
  },

  addBtnText: { color: "#fff", fontWeight: "700" },

  chips: { flexDirection: "row", flexWrap: "wrap", gap: 8 },

  chip: {
    flexDirection: "row",
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    gap: 6,
  },

  chipText: { color: "#fff", fontSize: 13 },

  chipX: { color: "#FF8C42" },

  searchBtn: {
    backgroundColor: "#1A1A1A",
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 10,
    marginBottom: 20,
  },

  searchBtnText: { color: "#fff", fontWeight: "700" },

  loadBox: { alignItems: "center", paddingVertical: 40 },

  loadText: { color: "#ccc", marginTop: 10 },

  resultsLabel: { color: "#bbb", marginBottom: 10 },

  card: {
    flexDirection: "row",
    borderRadius: 16,
    marginBottom: 12,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.15)",
    overflow: "hidden",
  },

  cardImg: { width: 100, height: 110 },

  cardBody: { flex: 1, padding: 10 },

  cardName: { color: "#fff", fontWeight: "700" },

  matchRow: { flexDirection: "row", alignItems: "center", gap: 8 },

  barBg: {
    flex: 1,
    height: 5,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 3,
  },

  barFill: { height: "100%", borderRadius: 3 },

  pct: { fontSize: 12, fontWeight: "800" },

  missing: { color: "#ef4444", fontSize: 11 },

  allGood: { color: "#22c55e", fontSize: 11 },

  fav: { padding: 10 },
});