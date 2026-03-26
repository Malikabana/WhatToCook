import { ChevronDown, ChevronUp, Dumbbell, Leaf, Plus, Scale, Wallet } from "lucide-react-native";
import { useState } from "react";
import {
    SafeAreaView, ScrollView, StatusBar, StyleSheet,
    Text, TouchableOpacity, View,
} from "react-native";
import TopBar from "../../components/TopBar";
import { useApp } from "../../context/AppContext";
import { useTheme } from "../../context/ThemeContext";

type Goal = "balanced" | "vegetarian" | "budget" | "highprotein";

const GOALS = [
  { key: "balanced"    as Goal, Icon: Scale,    title: "Balanced",     desc: "Proteins, carbs and vegetables"  },
  { key: "vegetarian"  as Goal, Icon: Leaf,     title: "Vegetarian",   desc: "Plant-based, no meat or fish"    },
  { key: "budget"      as Goal, Icon: Wallet,   title: "On a budget",  desc: "Affordable basics that go far"   },
  { key: "highprotein" as Goal, Icon: Dumbbell, title: "High protein", desc: "Build muscle, stay full"         },
];

const LISTS: Record<Goal, { category: string; items: string[] }[]> = {
  balanced:    [
    { category: "Proteins",   items: ["Chicken breast", "Eggs (x12)", "Canned tuna", "Greek yogurt"] },
    { category: "Vegetables", items: ["Spinach", "Broccoli", "Carrots", "Tomatoes", "Bell peppers"] },
    { category: "Carbs",      items: ["Brown rice", "Whole wheat bread", "Oats", "Sweet potatoes"] },
    { category: "Extras",     items: ["Olive oil", "Garlic", "Onions", "Lemon"] },
  ],
  vegetarian:  [
    { category: "Proteins",   items: ["Eggs (x12)", "Lentils", "Chickpeas", "Tofu", "Greek yogurt"] },
    { category: "Vegetables", items: ["Spinach", "Zucchini", "Eggplant", "Tomatoes", "Mushrooms"] },
    { category: "Carbs",      items: ["Quinoa", "Brown rice", "Whole wheat pasta", "Oats"] },
    { category: "Extras",     items: ["Olive oil", "Garlic", "Cumin", "Paprika", "Lemon"] },
  ],
  budget:      [
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

export default function Grocery() {
  const { addToGrocery, groceryList } = useApp();
  const { colors, isDark } = useTheme();
  const [expanded, setExpanded] = useState<Goal | null>(null);
  const [checked, setChecked] = useState<string[]>([]);

  const toggle = (item: string) =>
    setChecked((p) => p.includes(item) ? p.filter((i) => i !== item) : [...p, item]);

  const bg = isDark ? "#0d0d0d" : "#FFF7ED";

  return (
    <View style={[s.container, { backgroundColor: bg }]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
      <SafeAreaView style={{ flex: 1 }}>
        <TopBar showBack={false} />
        <ScrollView contentContainerStyle={[s.scroll, { marginTop: 80 }]} showsVerticalScrollIndicator={false}>

          <Text style={[s.title, { color: isDark ? "#fff" : colors.text }]}>Weekly Plan</Text>
          <Text style={[s.sub, { color: isDark ? "#bbb" : colors.textMuted }]}>Pick a goal to see your shopping list</Text>

          {GOALS.map(({ key, Icon, title, desc }) => {
            const isOpen = expanded === key;
            const list = LISTS[key];
            const allItems = list.flatMap((c) => c.items);
            return (
              <View key={key} style={[s.card, {
                backgroundColor: isDark ? "rgba(255,255,255,0.06)" : colors.bgCard,
                borderColor: isOpen ? colors.accent : isDark ? "rgba(255,255,255,0.1)" : colors.border,
              }]}>
                {/* Goal header */}
                <TouchableOpacity
                  style={s.cardHeader}
                  onPress={() => setExpanded(isOpen ? null : key)}
                  activeOpacity={0.8}
                >
                  <View style={[s.iconWrap, { backgroundColor: isOpen ? colors.accent : isDark ? "rgba(255,255,255,0.1)" : colors.accentLight }]}>
                    <Icon size={20} color={isOpen ? "#fff" : colors.accent} strokeWidth={1.8} />
                  </View>
                  <View style={s.cardBody}>
                    <Text style={[s.cardTitle, { color: isDark ? "#fff" : colors.text }]}>{title}</Text>
                    <Text style={[s.cardDesc, { color: isDark ? "#bbb" : colors.textMuted }]}>{desc}</Text>
                  </View>
                  {isOpen
                    ? <ChevronUp size={18} color={colors.accent} strokeWidth={2} />
                    : <ChevronDown size={18} color={colors.accent} strokeWidth={2} />
                  }
                </TouchableOpacity>

                {/* Expanded list */}
                {isOpen && (
                  <View style={s.listWrap}>
                    <TouchableOpacity
                      style={s.addAllBtn}
                      onPress={() => allItems.forEach((i) => addToGrocery(i))}
                    >
                      <Plus size={13} color={colors.accent} strokeWidth={2.5} />
                      <Text style={[s.addAllText, { color: colors.accent }]}>Add all to my list</Text>
                    </TouchableOpacity>

                    {list.map((cat) => (
                      <View key={cat.category} style={s.catSection}>
                        <Text style={[s.catTitle, { color: colors.accent }]}>{cat.category}</Text>
                        {cat.items.map((item) => {
                          const done   = checked.includes(item);
                          const inList = groceryList.includes(item.toLowerCase());
                          return (
                            <View key={item} style={[s.row, { borderBottomColor: isDark ? "rgba(255,255,255,0.07)" : colors.border }]}>
                              <TouchableOpacity
                                style={[s.box, { borderColor: isDark ? "rgba(255,255,255,0.3)" : colors.border }, done && { backgroundColor: colors.accent, borderColor: colors.accent }]}
                                onPress={() => toggle(item)}
                              >
                                {done && <Text style={s.tick}>✓</Text>}
                              </TouchableOpacity>
                              <Text style={[s.itemText, { color: isDark ? "#fff" : colors.text }, done && s.itemDone]}>{item}</Text>
                              <TouchableOpacity
                                style={[s.addBtn, { borderColor: inList ? "#22c55e" : colors.accent }]}
                                onPress={() => !inList && addToGrocery(item.toLowerCase())}
                              >
                                <Text style={[s.addBtnText, { color: inList ? "#22c55e" : colors.accent }]}>
                                  {inList ? "✓" : "+ List"}
                                </Text>
                              </TouchableOpacity>
                            </View>
                          );
                        })}
                      </View>
                    ))}
                  </View>
                )}
              </View>
            );
          })}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1 },
  scroll: { padding: 20, paddingBottom: 48 },
  title: { fontSize: 24, fontWeight: "900", marginBottom: 4 },
  sub: { fontSize: 13, marginBottom: 20 },
  card: { borderRadius: 18, borderWidth: 1.5, marginBottom: 12, overflow: "hidden" },
  cardHeader: { flexDirection: "row", alignItems: "center", padding: 16, gap: 12 },
  iconWrap: { width: 44, height: 44, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  cardBody: { flex: 1 },
  cardTitle: { fontSize: 15, fontWeight: "800" },
  cardDesc: { fontSize: 12, marginTop: 2 },
  listWrap: { paddingHorizontal: 16, paddingBottom: 16 },
  addAllBtn: { flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 14 },
  addAllText: { fontSize: 13, fontWeight: "700" },
  catSection: { marginBottom: 16 },
  catTitle: { fontSize: 11, fontWeight: "800", textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 },
  row: { flexDirection: "row", alignItems: "center", paddingVertical: 10, borderBottomWidth: 1, gap: 12 },
  box: { width: 20, height: 20, borderRadius: 5, borderWidth: 1.5, alignItems: "center", justifyContent: "center" },
  tick: { color: "#fff", fontSize: 11, fontWeight: "800" },
  itemText: { flex: 1, fontSize: 14 },
  itemDone: { color: "#888", textDecorationLine: "line-through" },
  addBtn: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, borderWidth: 1 },
  addBtnText: { fontSize: 12, fontWeight: "700" },
});