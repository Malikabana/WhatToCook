import { Clock, Search, Shuffle } from "lucide-react-native";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator, FlatList, Image, RefreshControl,
  SafeAreaView, ScrollView, StatusBar, StyleSheet,
  Text, TextInput, TouchableOpacity, View,
} from "react-native";
import CategoryChip from "../../components/CategoryChip";
import RecipeCard from "../../components/RecipeCard";
import TopBar from "../../components/TopBar";
import { Meal } from "../../context/AppContext";
import { useTheme } from "../../context/ThemeContext";
import { getRandomMeals, searchByCategory, searchByName } from "../../services/api";

const CATEGORIES = ["All","Chicken","Beef","Seafood","Pasta","Vegetarian","Dessert","Breakfast","Lamb","Pork"];
const DARK_BG  = "https://i.pinimg.com/1200x/62/c8/9f/62c89f1036b5f696dc7e60ef1b9ee29e.jpg";
const LIGHT_BG = "https://i.pinimg.com/736x/19/a2/9d/19a29d5e12dc17c95e278f6f3700bfce.jpg";

export default function Browse() {
  const { colors, isDark } = useTheme();
  const [query, setQuery]                   = useState("");
  const [meals, setMeals]                   = useState<Meal[]>([]);
  const [loading, setLoading]               = useState(true);
  const [refreshing, setRefreshing]         = useState(false);
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchHistory, setSearchHistory]   = useState<string[]>([]);
  const [totalCount, setTotalCount]         = useState(0);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => { loadRandom(); }, []);

  const loadRandom = async () => {
    setLoading(true);
    const data = await getRandomMeals(16);
    setMeals(data); setTotalCount(data.length); setLoading(false);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    setQuery(""); setActiveCategory("All");
    const data = await getRandomMeals(16);
    setMeals(data); setRefreshing(false);
  };

  const handleSearch = (text: string) => {
    setQuery(text); setActiveCategory("All");
    if (timer.current) clearTimeout(timer.current);
    if (text.trim().length < 2) { if (!text.trim()) loadRandom(); return; }
    timer.current = setTimeout(async () => {
      setLoading(true);
      const results = await searchByName(text.trim());
      setMeals(results); setTotalCount(results.length);
      setSearchHistory((prev) => [text.trim(), ...prev.filter((h) => h !== text.trim())].slice(0, 3));
      setLoading(false);
    }, 400);
  };

  const handleCategory = async (cat: string) => {
    setActiveCategory(cat); setQuery(""); setLoading(true);
    const results = cat === "All" ? await getRandomMeals(16) : await searchByCategory(cat);
    setMeals(results); setTotalCount(results.length); setLoading(false);
  };

  const handleSurprise = async () => {
    setLoading(true); setQuery(""); setActiveCategory("All");
    const data = await getRandomMeals(1);
    if (data[0]) { setMeals(data); setTotalCount(1); }
    setLoading(false);
  };

  return (
    <View style={{ flex: 1 }}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
      <Image
        source={{ uri: isDark ? DARK_BG : LIGHT_BG }}
        style={StyleSheet.absoluteFillObject}
        resizeMode="cover"
      />
      <View style={{ ...StyleSheet.absoluteFillObject, backgroundColor: isDark ? "rgba(0,0,0,0.72)" : "rgba(255,247,237,0.88)" }} />

      <SafeAreaView style={{ flex: 1 }}>
        <TopBar showBack={false} />
        <View style={[s.inner, { marginTop: 80 }]}>

          <View style={s.searchRow}>
            <View style={[s.searchBox, {
              backgroundColor: isDark ? "rgba(255,255,255,0.09)" : "#fff",
              borderColor: isDark ? "rgba(255,255,255,0.12)" : colors.border,
            }]}>
              <Search size={16} color={isDark ? "#888" : colors.textFaint} strokeWidth={2} />
              <TextInput
                style={[s.searchInput, { color: isDark ? "#fff" : colors.text }]}
                placeholder="Search any recipe..."
                placeholderTextColor={isDark ? "#666" : colors.textFaint}
                value={query}
                onChangeText={handleSearch}
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>
            <TouchableOpacity style={[s.surpriseBtn, { backgroundColor: colors.accent }]} onPress={handleSurprise}>
              <Shuffle size={20} color="#fff" strokeWidth={2} />
            </TouchableOpacity>
          </View>

          {searchHistory.length > 0 && query === "" && (
            <View style={s.historyRow}>
              <Clock size={12} color={isDark ? "#555" : colors.textFaint} strokeWidth={2} />
              {searchHistory.map((h) => (
                <TouchableOpacity
                  key={h}
                  style={[s.historyChip, {
                    backgroundColor: isDark ? "rgba(255,255,255,0.07)" : colors.accentLight,
                    borderColor: isDark ? "rgba(255,255,255,0.1)" : colors.border,
                  }]}
                  onPress={() => handleSearch(h)}
                >
                  <Text style={[s.historyChipText, { color: isDark ? "#ccc" : colors.accent }]}>{h}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={s.chipRow} contentContainerStyle={s.chipContent}>
            {CATEGORIES.map((item) => (
              <CategoryChip key={item} label={item} active={activeCategory === item} onPress={() => handleCategory(item)} />
            ))}
          </ScrollView>

          {loading
            ? <ActivityIndicator size="large" color={colors.accent} style={{ marginTop: 60 }} />
            : <FlatList
                data={meals}
                keyExtractor={(m) => m.idMeal}
                contentContainerStyle={s.list}
                showsVerticalScrollIndicator={false}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor={colors.accent} />}
                ListEmptyComponent={<Text style={[s.empty, { color: isDark ? "#555" : colors.textMuted }]}>No recipes found.</Text>}
                renderItem={({ item }) => <RecipeCard meal={item} route={`/recipe/${item.idMeal}`} />}
              />
          }
        </View>
      </SafeAreaView>
    </View>
  );
}

const s = StyleSheet.create({
  inner:       { flex: 1, paddingHorizontal: 16 },
  searchRow:   { flexDirection: "row", gap: 10, marginBottom: 12 },
  searchBox:   { flex: 1, flexDirection: "row", alignItems: "center", borderRadius: 14, paddingHorizontal: 14, paddingVertical: 12, borderWidth: 1, gap: 10 },
  searchInput: { flex: 1, fontSize: 15 },
  surpriseBtn: { width: 50, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  historyRow:  { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 10, flexWrap: "wrap" },
  historyChip: { paddingHorizontal: 12, paddingVertical: 5, borderRadius: 14, borderWidth: 1 },
  historyChipText: { fontSize: 12, fontWeight: "600" },
  chipRow:     { flexGrow: 0, marginBottom: 12 },
  chipContent: { gap: 8, paddingBottom: 4 },
  list:        { paddingBottom: 32 },
  empty:       { textAlign: "center", marginTop: 60, fontSize: 15 },
});