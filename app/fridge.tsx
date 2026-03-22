import { useRouter } from "expo-router";
import { useState, useRef } from "react";
import {
  ActivityIndicator, Animated, Easing, FlatList, Image,
  SafeAreaView, StatusBar, StyleSheet, Text, TextInput,
  TouchableOpacity, View,
} from "react-native";
import { Plus, Search, Thermometer , X} from "lucide-react-native";
import TopBar from "../components/TopBar";
import { Meal, useApp } from "../context/AppContext";
import { useTheme } from "../context/ThemeContext";
import { getMealById, searchByIngredient } from "../services/api";

const DARK_BG  = "https://i.pinimg.com/736x/da/1a/0b/da1a0b841cd98a633b6abdacb719c612.jpg";
const LIGHT_BG = "https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=800";

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
  const { colors, isDark } = useTheme();
  const { fridgeItems, addFridgeItem, removeFridgeItem, isFavorite, toggleFavorite } = useApp();
  const [text, setText]         = useState("");
  const [meals, setMeals]       = useState<EnrichedMeal[]>([]);
  const [loading, setLoading]   = useState(false);
  const [searched, setSearched] = useState(false);

  const scale = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(scale, { toValue: 1.06, duration: 12000, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        Animated.timing(scale, { toValue: 1,    duration: 12000, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
      ])
    ).start();
  }, []);

  const handleAdd = () => {
    const clean = text.trim().toLowerCase();
    if (!clean) return;
    addFridgeItem(clean); setText("");
  };

  const handleSearch = async () => {
    if (!fridgeItems.length) return;
    setLoading(true); setSearched(false);
    try {
      const initial  = await searchByIngredient(fridgeItems[0]);
      const detailed = await Promise.all(initial.slice(0, 15).map((m) => getMealById(m.idMeal)));
      const fridge   = fridgeItems.map((f) => f.toLowerCase());
      const enriched: EnrichedMeal[] = detailed
        .filter((m): m is Meal => m !== null)
        .map((meal) => {
          const ings    = extractIngredients(meal);
          const have    = ings.filter((ing) => fridge.some((f) => ing.includes(f) || f.includes(ing)));
          const missing = ings.filter((ing) => !fridge.some((f) => ing.includes(f) || f.includes(ing)));
          return { ...meal, matchPercent: Math.round((have.length / ings.length) * 100), missing };
        })
        .sort((a, b) => b.matchPercent - a.matchPercent);
      setMeals(enriched);
    } finally { setLoading(false); setSearched(true); }
  };

  const barColor = (pct: number) => pct >= 80 ? "#22c55e" : pct >= 50 ? "#FF8C42" : "#ef4444";

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
        <TopBar title="My Fridge" showBack={false} />
        <FlatList
          data={searched ? meals : []}
          keyExtractor={(m) => m.idMeal}
          contentContainerStyle={[s.list, { marginTop: 80 }]}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <View>
              <View style={s.subRow}>
                <Thermometer size={14} color={isDark ? "#bbb" : colors.textMuted} strokeWidth={2} />
                <Text style={[s.sub, { color: isDark ? "#bbb" : colors.textMuted }]}>
                  Add what you have — we'll find the best matches
                </Text>
              </View>

              <View style={s.inputRow}>
                <View style={[s.inputBox, {
                  backgroundColor: isDark ? "rgba(255,255,255,0.09)" : "#fff",
                  borderColor: isDark ? "rgba(255,255,255,0.12)" : colors.border,
                }]}>
                  <TextInput
                    style={[s.input, { color: isDark ? "#fff" : colors.text }]}
                    value={text} onChangeText={setText}
                    onSubmitEditing={handleAdd} returnKeyType="done"
                    placeholder="e.g. chicken, pasta..."
                    placeholderTextColor={isDark ? "#666" : colors.textFaint}
                    autoCapitalize="none" autoCorrect={false}
                  />
                </View>
                <TouchableOpacity style={[s.addBtn, { backgroundColor: colors.accent }]} onPress={handleAdd}>
                  <Plus size={22} color="#fff" strokeWidth={2.5} />
                </TouchableOpacity>
              </View>

              {fridgeItems.length > 0 && (
                <View style={s.chips}>
                  {fridgeItems.map((item) => (
                    <TouchableOpacity
                      key={item}
                      style={[s.chip, {
                        backgroundColor: isDark ? "rgba(255,255,255,0.08)" : colors.accentLight,
                        borderColor: isDark ? "rgba(255,255,255,0.15)" : colors.border,
                      }]}
                      onPress={() => removeFridgeItem(item)}
                    >
                      <Text style={[s.chipText, { color: isDark ? "#fff" : colors.accent }]}>{item}</Text>
                
<X size={12} color={colors.accent} strokeWidth={2.5} />
                    </TouchableOpacity>
                  ))}
                </View>
              )}

              {fridgeItems.length > 0 && !loading && (
                <TouchableOpacity
                  style={[s.searchBtn, { backgroundColor: isDark ? "rgba(255,255,255,0.12)" : colors.text }]}
                  onPress={handleSearch}
                >
                  <Search size={16} color="#fff" strokeWidth={2} />
                  <Text style={s.searchBtnText}>Find Recipes</Text>
                </TouchableOpacity>
              )}

              {loading && (
                <View style={s.loadBox}>
                  <ActivityIndicator size="large" color={colors.accent} />
                  <Text style={[s.loadText, { color: isDark ? "#bbb" : colors.textMuted }]}>
                    Analysing your ingredients...
                  </Text>
                </View>
              )}

              {searched && !loading && (
                <Text style={[s.resultsLabel, { color: isDark ? "#888" : colors.textMuted }]}>
                  {meals.length > 0 ? `${meals.length} recipes — sorted by best match` : "No recipes found. Try different ingredients."}
                </Text>
              )}
            </View>
          }
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[s.card, {
                backgroundColor: isDark ? "rgba(255,255,255,0.08)" : colors.bgCard,
                borderColor: isDark ? "rgba(255,255,255,0.12)" : colors.border,
              }]}
              onPress={() => router.push(`/recipe/${item.idMeal}` as any)}
              activeOpacity={0.85}
            >
              <Image source={{ uri: item.strMealThumb }} style={s.cardImg} />
              <View style={s.cardBody}>
                <Text style={[s.cardName, { color: isDark ? "#fff" : colors.text }]} numberOfLines={2}>
                  {item.strMeal}
                </Text>
                <View style={s.matchRow}>
                  <View style={[s.barBg, { backgroundColor: isDark ? "rgba(255,255,255,0.15)" : colors.border }]}>
                    <View style={[s.barFill, { width: `${item.matchPercent}%` as any, backgroundColor: barColor(item.matchPercent) }]} />
                  </View>
                  <Text style={[s.pct, { color: barColor(item.matchPercent) }]}>{item.matchPercent}%</Text>
                </View>
                {item.missing.length > 0
                  ? <Text style={s.missing} numberOfLines={1}>Missing: {item.missing.slice(0, 3).join(", ")}</Text>
                  : <Text style={s.allGood}>✅ Ready to cook!</Text>
                }
              </View>
              <TouchableOpacity onPress={() => toggleFavorite(item)} style={s.fav}>
                <Text style={{ fontSize: 20 }}>{isFavorite(item.idMeal) ? "❤️" : "🤍"}</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          )}
        />
      </SafeAreaView>
    </View>
  );
}

// Add missing import
import { useEffect } from "react";

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "transparent" },
  list: { padding: 16, paddingBottom: 40 },
  subRow: { flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 14 },
  sub: { fontSize: 14, flex: 1 },
  inputRow: { flexDirection: "row", gap: 10, marginBottom: 12 },
  inputBox: { flex: 1, borderRadius: 14, paddingHorizontal: 14, paddingVertical: 12, borderWidth: 1 },
  input: { fontSize: 15 },
  addBtn: { width: 50, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  chips: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 14 },
  chip: { flexDirection: "row", borderRadius: 20, paddingHorizontal: 12, paddingVertical: 7, gap: 6, borderWidth: 1 },
  chipText: { fontSize: 13, textTransform: "capitalize", fontWeight: "600" },
  chipX: { fontSize: 12, fontWeight: "700" },
  searchBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, borderRadius: 14, paddingVertical: 15, marginBottom: 20 },
  searchBtnText: { color: "#fff", fontWeight: "700", fontSize: 15 },
  loadBox: { alignItems: "center", paddingVertical: 40, gap: 12 },
  loadText: { fontSize: 14 },
  resultsLabel: { fontSize: 13, marginBottom: 12 },
  card: { flexDirection: "row", borderRadius: 16, marginBottom: 12, borderWidth: 1, overflow: "hidden" },
  cardImg: { width: 100, height: 110 },
  cardBody: { flex: 1, padding: 10, gap: 6 },
  cardName: { fontWeight: "700", fontSize: 14, lineHeight: 19 },
  matchRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  barBg: { flex: 1, height: 5, borderRadius: 3, overflow: "hidden" },
  barFill: { height: "100%", borderRadius: 3 },
  pct: { fontSize: 12, fontWeight: "800", minWidth: 36 },
  missing: { color: "#ef4444", fontSize: 11 },
  allGood: { color: "#22c55e", fontSize: 11, fontWeight: "600" },
  fav: { padding: 10 },
});