import { useLocalSearchParams } from "expo-router";
import { useState } from "react";
import {
  ImageBackground, SafeAreaView, ScrollView,
  StyleSheet, Text, TouchableOpacity, View,
} from "react-native";
import TopBar from "../../components/TopBar";
import { useApp } from "../../context/AppContext";
import { useTheme } from "../../context/ThemeContext";

type Goal = "balanced" | "vegetarian" | "budget" | "highprotein";

const LISTS: Record<Goal, { category: string; items: string[] }[]> = {
  balanced: [
    { category: "Proteins",   items: ["Chicken breast", "Eggs (x12)", "Canned tuna", "Greek yogurt"] },
    { category: "Vegetables", items: ["Spinach", "Broccoli", "Carrots", "Tomatoes", "Bell peppers"] },
    { category: "Carbs",      items: ["Brown rice", "Whole wheat bread", "Oats", "Sweet potatoes"] },
    { category: "Extras",     items: ["Olive oil", "Garlic", "Onions", "Lemon"] },
  ],
  vegetarian: [
    { category: "Proteins",   items: ["Eggs (x12)", "Lentils", "Chickpeas", "Tofu", "Greek yogurt"] },
    { category: "Vegetables", items: ["Spinach", "Zucchini", "Eggplant", "Tomatoes", "Mushrooms"] },
    { category: "Carbs",      items: ["Quinoa", "Brown rice", "Whole wheat pasta", "Oats"] },
    { category: "Extras",     items: ["Olive oil", "Garlic", "Cumin", "Paprika", "Lemon"] },
  ],
  budget: [
    { category: "Proteins",   items: ["Eggs (x12)", "Canned tuna (x4)", "Canned beans", "Chicken thighs"] },
    { category: "Vegetables", items: ["Carrots", "Cabbage", "Onions", "Potatoes", "Frozen peas"] },
    { category: "Carbs",      items: ["White rice (1kg)", "Pasta (500g)", "Bread", "Oats"] },
    { category: "Extras",     items: ["Sunflower oil", "Salt & pepper", "Bouillon cubes"] },
  ],
  highprotein: [
    { category: "Proteins",   items: ["Chicken breast (1kg)", "Eggs (x18)", "Salmon fillet", "Cottage cheese", "Tuna (x4)"] },
    { category: "Vegetables", items: ["Broccoli", "Spinach", "Asparagus", "Green beans"] },
    { category: "Carbs",      items: ["Sweet potatoes", "Brown rice", "Oats", "Whole wheat bread"] },
    { category: "Extras",     items: ["Olive oil", "Almonds", "Peanut butter"] },
  ],
};

const LABELS: Record<Goal, string> = {
  balanced: "Balanced ⚖️", vegetarian: "Vegetarian 🥦",
  budget: "Budget 💰",     highprotein: "High Protein 💪",
};

const DARK_BG  = "https://images.unsplash.com/photo-1493770348161-369560ae357d?w=800";
const LIGHT_BG = "https://images.unsplash.com/photo-1579113800032-c38bd7635818?w=800";

export default function GroceryList() {
  const { goal } = useLocalSearchParams<{ goal: Goal }>();
  const { addToGrocery, groceryList } = useApp();
  const { colors, isDark } = useTheme();
  const list  = LISTS[goal] ?? [];
  const total = list.reduce((a, c) => a + c.items.length, 0);
  const [checked, setChecked] = useState<string[]>([]);

  const toggle = (item: string) =>
    setChecked((p) => p.includes(item) ? p.filter((i) => i !== item) : [...p, item]);

  return (
    <View style={{ flex: 1 }}>
      <ImageBackground
        source={{ uri: isDark ? DARK_BG : LIGHT_BG }}
        style={StyleSheet.absoluteFillObject}
        resizeMode="cover"
      />
      <View style={{ ...StyleSheet.absoluteFillObject, backgroundColor: isDark ? "rgba(0,0,0,0.65)" : "rgba(255,247,237,0.92)" }} />

      <SafeAreaView style={s.safe}>
        <TopBar title={LABELS[goal]} showBack />
        <ScrollView contentContainerStyle={[s.content, { marginTop: 80 }]} showsVerticalScrollIndicator={false}>

          <View style={s.topRow}>
            <Text style={[s.sub, { color: isDark ? "#bbb" : colors.textMuted }]}>{checked.length} / {total} checked</Text>
            <TouchableOpacity onPress={() => list.flatMap((c) => c.items).forEach((i) => addToGrocery(i))}>
              <Text style={[s.addAll, { color: colors.accent }]}>+ Add all to list</Text>
            </TouchableOpacity>
          </View>

          <View style={[s.barBg, { backgroundColor: isDark ? "rgba(255,255,255,0.15)" : colors.border }]}>
            <View style={[s.barFill, { width: `${(checked.length / total) * 100}%` as any, backgroundColor: colors.accent }]} />
          </View>

          {list.map((cat) => (
            <View key={cat.category} style={s.section}>
              <Text style={[s.catTitle, { color: colors.accent }]}>{cat.category}</Text>
              {cat.items.map((item) => {
                const done   = checked.includes(item);
                const inList = groceryList.includes(item.toLowerCase());
                return (
                  <View key={item} style={[s.row, { borderBottomColor: isDark ? "rgba(255,255,255,0.08)" : colors.border }]}>
                    <TouchableOpacity
                      style={[s.box,
                        { borderColor: isDark ? "rgba(255,255,255,0.4)" : colors.border },
                        done && { backgroundColor: colors.accent, borderColor: colors.accent },
                      ]}
                      onPress={() => toggle(item)}
                    >
                      {done && <Text style={s.tick}>✓</Text>}
                    </TouchableOpacity>
                    <Text style={[s.itemText, { color: isDark ? "#fff" : colors.text }, done && s.itemDone]}>{item}</Text>
                    <TouchableOpacity
                      style={[s.addBtn, { borderColor: colors.accent }, inList && { borderColor: "#22c55e" }]}
                      onPress={() => !inList && addToGrocery(item.toLowerCase())}
                    >
                      <Text style={[s.addBtnText, { color: colors.accent }, inList && { color: "#22c55e" }]}>
                        {inList ? "✓" : "+ List"}
                      </Text>
                    </TouchableOpacity>
                  </View>
                );
              })}
            </View>
          ))}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "transparent" },
  content: { padding: 20, paddingBottom: 48 },
  topRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 10 },
  sub: { fontSize: 13 },
  addAll: { fontSize: 13, fontWeight: "700" },
  barBg: { height: 5, borderRadius: 3, marginBottom: 24, overflow: "hidden" },
  barFill: { height: "100%", borderRadius: 3 },
  section: { marginBottom: 24 },
  catTitle: { fontSize: 12, fontWeight: "800", marginBottom: 10, textTransform: "uppercase", letterSpacing: 1 },
  row: { flexDirection: "row", alignItems: "center", paddingVertical: 12, borderBottomWidth: 1, gap: 14 },
  box: { width: 22, height: 22, borderRadius: 6, borderWidth: 1.5, alignItems: "center", justifyContent: "center" },
  tick: { color: "#fff", fontSize: 12, fontWeight: "800" },
  itemText: { flex: 1, fontSize: 15 },
  itemDone: { color: "#888", textDecorationLine: "line-through" },
  addBtn: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8, borderWidth: 1 },
  addBtnText: { fontSize: 12, fontWeight: "700" },
});