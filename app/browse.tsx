import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ImageBackground,
} from "react-native";
import CategoryChip from "../components/CategoryChip";
import RecipeCard from "../components/RecipeCard";
import TopBar from "../components/TopBar";
import { Meal } from "../context/AppContext";
import {
  getRandomMeals,
  searchByCategory,
  searchByCuisine,
  searchByName,
} from "../services/api";

const CATEGORIES = ["All","Chicken","Beef","Seafood","Pasta","Vegetarian","Dessert","Breakfast","Lamb","Pork"];
const CUISINES = ["All","Italian","Mexican","Japanese","Chinese","Indian","French","American","Thai","Moroccan"];
type Mode = "category" | "cuisine";

export default function Browse() {
  const [query, setQuery] = useState("");
  const [meals, setMeals] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [mode, setMode] = useState<Mode>("category");
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeCuisine, setActiveCuisine] = useState("All");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => { loadRandom(); }, []);

  const loadRandom = async () => {
    setLoading(true);
    setMeals(await getRandomMeals(16));
    setLoading(false);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    setQuery("");
    setActiveCategory("All");
    setActiveCuisine("All");
    setMeals(await getRandomMeals(16));
    setRefreshing(false);
  };

  const handleSearch = (text: string) => {
    setQuery(text);
    setActiveCategory("All");
    setActiveCuisine("All");

    if (timer.current) clearTimeout(timer.current);

    if (text.trim().length < 2) {
      if (!text.trim()) loadRandom();
      return;
    }

    timer.current = setTimeout(async () => {
      setLoading(true);
      setMeals(await searchByName(text.trim()));
      setLoading(false);
    }, 400);
  };

  const handleCategory = async (cat: string) => {
    setActiveCategory(cat);
    setQuery("");
    setLoading(true);
    setMeals(cat === "All" ? await getRandomMeals(16) : await searchByCategory(cat));
    setLoading(false);
  };

  const handleCuisine = async (cuisine: string) => {
    setActiveCuisine(cuisine);
    setQuery("");
    setLoading(true);
    setMeals(cuisine === "All" ? await getRandomMeals(16) : await searchByCuisine(cuisine));
    setLoading(false);
  };

  return (
    <ImageBackground
      source={{ uri: "https://i.pinimg.com/736x/fe/65/25/fe65250f7401547512d4716360addbb4.jpg" }} // change if needed
      style={{ flex: 1 }}
      resizeMode="cover"
    >
      <View style={s.overlay}>
        <SafeAreaView style={s.safe}>
          <TopBar title="Browse" showBack={false} />

          <View style={s.searchRow}>
            <TextInput
              style={s.search}
              placeholder="Search any recipe..."
              placeholderTextColor="#ddd"
              value={query}
              onChangeText={handleSearch}
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          <View style={s.modeRow}>
            {(["category", "cuisine"] as Mode[]).map((m) => (
              <TouchableOpacity
                key={m}
                style={[s.modeBtn, mode === m && s.modeBtnOn]}
                onPress={() => setMode(m)}
              >
                <Text style={[s.modeTxt, mode === m && s.modeTxtOn]}>
                  {m === "category" ? "Category" : "Cuisine"}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={s.chipRow}
            contentContainerStyle={s.chipContent}
          >
            {(mode === "category" ? CATEGORIES : CUISINES).map((item) => (
              <CategoryChip
                key={item}
                label={item}
                active={mode === "category" ? activeCategory === item : activeCuisine === item}
                onPress={() =>
                  mode === "category" ? handleCategory(item) : handleCuisine(item)
                }
              />
            ))}
          </ScrollView>

          {loading ? (
            <ActivityIndicator size="large" color="#FF6B00" style={{ marginTop: 60 }} />
          ) : (
            <FlatList
              data={meals}
              keyExtractor={(m) => m.idMeal}
              contentContainerStyle={s.list}
              showsVerticalScrollIndicator={false}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={handleRefresh}
                  tintColor="#FF6B00"
                />
              }
              ListEmptyComponent={<Text style={s.empty}>No recipes found.</Text>}
              renderItem={({ item }) => (
                <RecipeCard meal={item} route={`/recipe/${item.idMeal}`} />
              )}
            />
          )}
        </SafeAreaView>
      </View>
    </ImageBackground>
  );
}

const s = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "transparent",
  },

  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.2)",
  },

  searchRow: {
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 10,
  },

  search: {
    backgroundColor: "rgba(116, 111, 111, 0.9)",
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 13,
    fontSize: 15,
    color: "#1a1a1a",
    marginTop: 50,
  },

  modeRow: {
    flexDirection: "row",
    paddingHorizontal: 20,
    gap: 8,
    marginBottom: 5,
    marginTop: 25,
  },

  modeBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 10,
    alignItems: "center",
    
  },

  modeBtnOn: {
    backgroundColor: "#1bc924ff",
  },

  modeTxt: {
    fontSize: 13,
    fontWeight: "700",
    color: "#fdfafaff",
  },

  modeTxtOn: {
    color: "#fff",
  },

  chipRow: {
    flexGrow: 1,marginBottom: 5,
    
  },

  chipContent: {
    paddingHorizontal: 16,
    gap: 5,
 
  },

  list: {
    paddingHorizontal: 16,
    paddingBottom: 30,
  },

  empty: {
    textAlign: "center",
    color: "#eee",
    marginTop: 60,
    fontSize: 15,
  },
});