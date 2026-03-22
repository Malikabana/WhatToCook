import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator, FlatList, ImageBackground,
  RefreshControl, SafeAreaView, ScrollView, StyleSheet,
  Text, TextInput, TouchableOpacity, View,
} from "react-native";
import CategoryChip from "../components/CategoryChip";
import RecipeCard from "../components/RecipeCard";
import TopBar from "../components/TopBar";
import { Meal } from "../context/AppContext";
import { useTheme } from "../context/ThemeContext";
import { getRandomMeals, searchByCategory, searchByName } from "../services/api";

const CATEGORIES = ["All","Chicken","Beef","Seafood","Pasta","Vegetarian","Dessert","Breakfast","Lamb","Pork"];

const DARK_BG = "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800";
const LIGHT_BG = "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800";

export default function Browse() {
  const { colors, isDark } = useTheme();
  const [query, setQuery]           = useState("");
  const [meals, setMeals]           = useState<Meal[]>([]);
  const [loading, setLoading]       = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchHistory, setSearchHistory]   = useState<string[]>([]);
  const [totalCount, setTotalCount]         = useState(0);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => { loadRandom(); }, []);

  const loadRandom = async () => {
    setLoading(true);
    const data = await getRandomMeals(16);
    setMeals(data);
    setTotalCount(data.length);
    setLoading(false);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    setQuery(""); setActiveCategory("All");
    const data = await getRandomMeals(16);
    setMeals(data);
    setRefreshing(false);
  };

  const handleSearch = (text: string) => {
    setQuery(text);
    setActiveCategory("All");
    if (timer.current) clearTimeout(timer.current);
    if (text.trim().length < 2) { if (!text.trim()) loadRandom(); return; }
    timer.current = setTimeout(async () => {
      setLoading(true);
      const results = await searchByName(text.trim());
      setMeals(results);
      setTotalCount(results.length);
      // Save to search history
      if (text.trim()) {
        setSearchHistory((prev) => {
          const filtered = prev.filter((h) => h !== text.trim());
          return [text.trim(), ...filtered].slice(0, 3);
        });
      }
      setLoading(false);
    }, 400);
  };

  const handleCategory = async (cat: string) => {
    setActiveCategory(cat); setQuery("");
    setLoading(true);
    const results = cat === "All" ? await getRandomMeals(16) : await searchByCategory(cat);
    setMeals(results);
    setTotalCount(results.length);
    setLoading(false);
  };

  const handleSurprise = async () => {
    setLoading(true);
    setQuery(""); setActiveCategory("All");
    const data = await getRandomMeals(1);
    if (data[0]) setMeals(data);
    setTotalCount(1);
    setLoading(false);
  };

  const content = (
    <SafeAreaView style={s.safe}>
      <TopBar title="Browse" showBack={false} />

      <View style={[s.inner, { marginTop: 80 }]}>

        {/* Recipe counter */}
        <Text style={[s.counter, { color: isDark ? "rgba(255,255,255,0.5)" : colors.textMuted }]}>
          {totalCount > 0 ? `${totalCount} recipes found` : "Searching..."}
        </Text>

        {/* Search bar */}
        <View style={s.searchRow}>
          <TextInput
            style={[s.search, {
              backgroundColor: isDark ? "rgba(255,255,255,0.1)" : colors.bgInput,
              borderColor: isDark ? "rgba(255,255,255,0.15)" : colors.border,
              color: isDark ? "#fff" : colors.text,
            }]}
            placeholder="Search any recipe..."
            placeholderTextColor={isDark ? "#888" : colors.textFaint}
            value={query}
            onChangeText={handleSearch}
            autoCapitalize="none"
            autoCorrect={false}
          />
          <TouchableOpacity
            style={[s.surpriseBtn, { backgroundColor: colors.accent }]}
            onPress={handleSurprise}
          >
            <Text style={s.surpriseBtnText}>🎲</Text>
          </TouchableOpacity>
        </View>

        {/* Search history */}
        {searchHistory.length > 0 && query === "" && (
          <View style={s.historyRow}>
            <Text style={[s.historyLabel, { color: isDark ? "#666" : colors.textFaint }]}>Recent:</Text>
            {searchHistory.map((h) => (
              <TouchableOpacity
                key={h}
                style={[s.historyChip, {
                  backgroundColor: isDark ? "rgba(255,255,255,0.07)" : colors.accentLight,
                  borderColor: isDark ? "rgba(255,255,255,0.1)" : colors.border,
                }]}
                onPress={() => handleSearch(h)}
              >
                <Text style={[s.historyChipText, { color: isDark ? "#ccc" : colors.accent }]}>
                  {h}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Category chips */}
        <ScrollView
          horizontal showsHorizontalScrollIndicator={false}
          style={s.chipRow} contentContainerStyle={s.chipContent}
        >
          {CATEGORIES.map((item) => (
            <CategoryChip
              key={item}
              label={item}
              active={activeCategory === item}
              onPress={() => handleCategory(item)}
            />
          ))}
        </ScrollView>

        {/* Results */}
        {loading
          ? <ActivityIndicator size="large" color={colors.accent} style={{ marginTop: 60 }} />
          : <FlatList
              data={meals}
              keyExtractor={(m) => m.idMeal}
              contentContainerStyle={s.list}
              showsVerticalScrollIndicator={false}
              refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor={colors.accent} />}
              ListEmptyComponent={<Text style={[s.empty, { color: isDark ? "#666" : colors.textMuted }]}>No recipes found.</Text>}
              renderItem={({ item }) => <RecipeCard meal={item} route={`/recipe/${item.idMeal}`} />}
            />
        }
      </View>
    </SafeAreaView>
  );

  return (
    <View style={{ flex: 1 }}>
      <ImageBackground
        source={{ uri: isDark ? DARK_BG : LIGHT_BG }}
        style={StyleSheet.absoluteFillObject}
        resizeMode="cover"
      />
      <View style={{ ...StyleSheet.absoluteFillObject, backgroundColor: isDark ? "rgba(0,0,0,0.75)" : "rgba(255,247,237,0.92)" }} />
      {content}
    </View>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "transparent" },
  inner: { flex: 1, paddingHorizontal: 16 },
  counter: { fontSize: 12, marginBottom: 8, fontWeight: "600" },
  searchRow: { flexDirection: "row", gap: 10, marginBottom: 10 },
  search: { flex: 1, borderRadius: 14, paddingHorizontal: 16, paddingVertical: 13, fontSize: 15, borderWidth: 1 },
  surpriseBtn: { width: 50, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  surpriseBtnText: { fontSize: 22 },
  historyRow: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 10, flexWrap: "wrap" },
  historyLabel: { fontSize: 12, fontWeight: "600" },
  historyChip: { paddingHorizontal: 12, paddingVertical: 5, borderRadius: 14, borderWidth: 1 },
  historyChipText: { fontSize: 12, fontWeight: "600" },
  chipRow: { flexGrow: 0, marginBottom: 12 },
  chipContent: { gap: 8, paddingBottom: 4 },
  list: { paddingBottom: 32 },
  empty: { textAlign: "center", marginTop: 60, fontSize: 15 },
});