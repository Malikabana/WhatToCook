import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator, Animated, Easing, FlatList,
  ImageBackground, RefreshControl, SafeAreaView,
  ScrollView, StatusBar, StyleSheet, Text,
  TextInput, TouchableOpacity, View,
} from "react-native";
import { Search, Shuffle, Clock } from "lucide-react-native";
import CategoryChip from "../components/CategoryChip";
import RecipeCard from "../components/RecipeCard";
import TopBar from "../components/TopBar";
import { Meal } from "../context/AppContext";
import { useTheme } from "../context/ThemeContext";
import { getRandomMeals, searchByCategory, searchByName } from "../services/api";

const CATEGORIES = ["All","Chicken","Beef","Seafood","Pasta","Vegetarian","Dessert","Breakfast","Lamb","Pork"];
const DARK_BG  = "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800";
const LIGHT_BG = "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800";

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

  const scale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(scale, { toValue: 1.06, duration: 12000, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        Animated.timing(scale, { toValue: 1,    duration: 12000, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
      ])
    ).start();
    loadRandom();
  }, []);

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

  const iconColor = isDark ? "rgba(255,255,255,0.5)" : colors.textMuted;

  return (
    <View style={{ flex: 1 }}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
      <Animated.Image
        source={{ uri: isDark ? DARK_BG : LIGHT_BG }}
        style={[StyleSheet.absoluteFillObject, { transform: [{ scale }] }]}
        resizeMode="cover"
      />
      <View style={{ ...StyleSheet.absoluteFillObject, backgroundColor: isDark ? "rgba(0,0,0,0.72)" : "rgba(255,247,237,0.88)" }} />

      <SafeAreaView style={s.safe}>
        <TopBar title="Browse" showBack={false} />

        <View style={[s.inner, { marginTop: 80 }]}>

          {/* Counter */}
          <View style={s.counterRow}>
            <Search size={13} color={iconColor} strokeWidth={2} />
            <Text style={[s.counter, { color: iconColor }]}>
              {totalCount > 0 ? `${totalCount} recipes found` : "Loading..."}
            </Text>
          </View>

          {/* Search bar */}
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
            <TouchableOpacity
              style={[s.surpriseBtn, { backgroundColor: colors.accent }]}
              onPress={handleSurprise}
            >
              <Shuffle size={20} color="#fff" strokeWidth={2} />
            </TouchableOpacity>
          </View>

          {/* Search history */}
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

          {/* Category chips */}
          <ScrollView
            horizontal showsHorizontalScrollIndicator={false}
            style={s.chipRow} contentContainerStyle={s.chipContent}
          >
            {CATEGORIES.map((item) => (
              <CategoryChip
                key={item} label={item}
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
  safe: { flex: 1, backgroundColor: "transparent" },
  inner: { flex: 1, paddingHorizontal: 16 },
  counterRow: { flexDirection: "row", alignItems: "center", gap: 5, marginBottom: 8 },
  counter: { fontSize: 12, fontWeight: "600" },
  searchRow: { flexDirection: "row", gap: 10, marginBottom: 10 },
  searchBox: {
    flex: 1, flexDirection: "row", alignItems: "center",
    borderRadius: 14, paddingHorizontal: 14, paddingVertical: 12,
    borderWidth: 1, gap: 10,
  },
  searchInput: { flex: 1, fontSize: 15 },
  surpriseBtn: { width: 50, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  historyRow: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 10, flexWrap: "wrap" },
  historyChip: { paddingHorizontal: 12, paddingVertical: 5, borderRadius: 14, borderWidth: 1 },
  historyChipText: { fontSize: 12, fontWeight: "600" },
  chipRow: { flexGrow: 0, marginBottom: 12 },
  chipContent: { gap: 8, paddingBottom: 4 },
  list: { paddingBottom: 32 },
  empty: { textAlign: "center", marginTop: 60, fontSize: 15 },
});