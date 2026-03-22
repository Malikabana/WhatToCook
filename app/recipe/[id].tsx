import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator, Image, SafeAreaView, ScrollView,
  StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View,
} from "react-native";
import { Heart, Tag, ChevronLeft, ShoppingCart, NotebookPen, Save } from "lucide-react-native";
import { Meal, useApp } from "../../context/AppContext";
import { useTheme } from "../../context/ThemeContext";
import { getMealById } from "../../services/api";

export default function RecipeDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router  = useRouter();
  const { colors, isDark } = useTheme();
  const { toggleFavorite, isFavorite, fridgeItems, addToGrocery, groceryList, saveNote, getNote } = useApp();
  const [meal, setMeal]           = useState<Meal | null>(null);
  const [loading, setLoading]     = useState(true);
  const [note, setNote]           = useState("");
  const [noteSaved, setNoteSaved] = useState(false);

  useEffect(() => {
    if (!id) return;
    getMealById(id).then((m) => {
      setMeal(m);
      if (m) setNote(getNote(m.idMeal));
    }).finally(() => setLoading(false));
  }, [id]);

  const handleSaveNote = () => {
    if (!meal) return;
    saveNote(meal.idMeal, note);
    setNoteSaved(true);
    setTimeout(() => setNoteSaved(false), 2000);
  };

  if (loading) return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: isDark ? "#0d0d0d" : "#FFF7ED" }}>
      <ActivityIndicator size="large" color="#FF8C42" />
    </View>
  );

  if (!meal) return (
    <SafeAreaView style={[s.safe, { backgroundColor: isDark ? "#0d0d0d" : "#FFF7ED" }]}>
      <Text style={[s.err, { color: colors.textMuted }]}>Could not load recipe.</Text>
    </SafeAreaView>
  );

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
    <SafeAreaView style={[s.safe, { backgroundColor: isDark ? "#0d0d0d" : "#FFF7ED" }]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* Hero image */}
        <Image source={{ uri: meal.strMealThumb }} style={s.image} />
        <TouchableOpacity style={s.backBtn} onPress={() => router.back()}>
          <ChevronLeft size={22} color="#fff" strokeWidth={2.5} />
        </TouchableOpacity>

        <View style={s.body}>

          {/* Title */}
          <Text style={[s.title, { color: colors.text }]}>{meal.strMeal}</Text>

          {/* Tags */}
          <View style={s.tags}>
            {[meal.strCategory, meal.strArea].filter(Boolean).map((t) => (
              <View key={t} style={[s.tag, { backgroundColor: colors.accentLight }]}>
                <Tag size={11} color={colors.accent} strokeWidth={2} />
                <Text style={[s.tagText, { color: colors.accent }]}>{t}</Text>
              </View>
            ))}
          </View>

          {/* Fridge match */}
          {fridgeItems.length > 0 && (
            <View style={[s.summary, { backgroundColor: colors.bgCard, borderColor: colors.border }]}>
              <Text style={[s.summaryText, { color: colors.textMuted }]}>
                You have{" "}
                <Text style={[s.summaryBold, { color: colors.accent }]}>{have} of {ingredients.length}</Text>
                {" "}ingredients
              </Text>
              <View style={[s.summaryBar, { backgroundColor: colors.border }]}>
                <View style={[s.summaryFill, { width: `${(have / ingredients.length) * 100}%` as any, backgroundColor: colors.accent }]} />
              </View>
            </View>
          )}

          {/* Favorite button */}
          <TouchableOpacity
            style={[s.favBtn, { borderColor: colors.accent }, fav && { backgroundColor: colors.accent }]}
            onPress={() => toggleFavorite(meal)}
          >
            <Heart size={16} color={fav ? "#fff" : colors.accent} strokeWidth={2} fill={fav ? "#fff" : "none"} />
            <Text style={[s.favText, { color: fav ? "#fff" : colors.accent }]}>
              {fav ? "Remove from Favorites" : "Save to Favorites"}
            </Text>
          </TouchableOpacity>

          {/* Ingredients */}
          <Text style={[s.section, { color: colors.text }]}>Ingredients</Text>
          {ingredients.map((ing, i) => {
            const inList = groceryList.includes(ing.name);
            return (
              <View key={i} style={s.ingRow}>
                <View style={[s.dot, ing.inFridge ? s.dotGreen : s.dotRed]} />
                <Text style={[s.ingText, { color: colors.textMuted }]}>
                  {ing.measure ? `${ing.measure} ` : ""}{ing.name}
                </Text>
                {!ing.inFridge && (
                  <TouchableOpacity
                    style={[s.addBtn, { backgroundColor: colors.accentLight, borderColor: colors.accent },
                      inList && { borderColor: "#22c55e", backgroundColor: "#f0fdf4" }]}
                    onPress={() => !inList && addToGrocery(ing.name)}
                  >
                    <ShoppingCart size={11} color={inList ? "#22c55e" : colors.accent} strokeWidth={2} />
                    <Text style={[s.addBtnText, { color: colors.accent }, inList && { color: "#22c55e" }]}>
                      {inList ? "Added" : "Add"}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            );
          })}

          {/* Instructions */}
          <Text style={[s.section, { color: colors.text }]}>Instructions</Text>
          <Text style={[s.instructions, { color: colors.textMuted }]}>{meal.strInstructions}</Text>

          {/* Notes */}
          <View style={s.notesHeader}>
            <NotebookPen size={16} color={colors.text} strokeWidth={2} />
            <Text style={[s.section, { color: colors.text, marginBottom: 0, marginTop: 0 }]}>My Notes</Text>
          </View>
          <TextInput
            style={[s.noteInput, { backgroundColor: colors.bgCard, borderColor: colors.border, color: colors.text }]}
            placeholder="Write your personal notes here..."
            placeholderTextColor={colors.textFaint}
            value={note}
            onChangeText={setNote}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
          <TouchableOpacity
            style={[s.saveNoteBtn, { backgroundColor: noteSaved ? "#22c55e" : colors.accent }]}
            onPress={handleSaveNote}
          >
            <Save size={16} color="#fff" strokeWidth={2} />
            <Text style={s.saveNoteBtnText}>{noteSaved ? "Saved!" : "Save Note"}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1 },
  err: { textAlign: "center", marginTop: 80, fontSize: 16 },
  image: { width: "100%", height: 300 },
  backBtn: {
    position: "absolute", top: 52, left: 16,
    backgroundColor: "#000000aa", borderRadius: 20,
    width: 40, height: 40, alignItems: "center", justifyContent: "center",
  },
  body: { padding: 20 },
  title: { fontSize: 24, fontWeight: "800", marginBottom: 12 },
  tags: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 16 },
  tag: { flexDirection: "row", alignItems: "center", gap: 5, paddingHorizontal: 12, paddingVertical: 5, borderRadius: 20 },
  tagText: { fontSize: 13, fontWeight: "600" },
  summary: { borderRadius: 14, padding: 14, marginBottom: 16, borderWidth: 1, gap: 8 },
  summaryText: { fontSize: 14 },
  summaryBold: { fontWeight: "800" },
  summaryBar: { height: 5, borderRadius: 3, overflow: "hidden" },
  summaryFill: { height: "100%", borderRadius: 3 },
  favBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, borderWidth: 2, borderRadius: 14, paddingVertical: 14, marginBottom: 28 },
  favText: { fontWeight: "700", fontSize: 15 },
  section: { fontSize: 18, fontWeight: "800", marginBottom: 12, marginTop: 20 },
  ingRow: { flexDirection: "row", alignItems: "center", marginBottom: 10, gap: 10 },
  dot: { width: 7, height: 7, borderRadius: 4, flexShrink: 0 },
  dotGreen: { backgroundColor: "#22c55e" },
  dotRed: { backgroundColor: "#ef4444" },
  ingText: { flex: 1, fontSize: 14, lineHeight: 20, textTransform: "capitalize" },
  addBtn: { flexDirection: "row", alignItems: "center", gap: 4, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 10, borderWidth: 1 },
  addBtnText: { fontSize: 12, fontWeight: "700" },
  instructions: { fontSize: 14, lineHeight: 26, marginBottom: 24 },
  notesHeader: { flexDirection: "row", alignItems: "center", gap: 8, marginTop: 20, marginBottom: 12 },
  noteInput: { borderWidth: 1, borderRadius: 14, padding: 14, fontSize: 14, lineHeight: 22, minHeight: 100, marginBottom: 12 },
  saveNoteBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, borderRadius: 14, paddingVertical: 13, marginBottom: 48 },
  saveNoteBtnText: { color: "#fff", fontWeight: "700", fontSize: 15 },
});