import { useLocalSearchParams } from "expo-router";
import { useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ImageBackground,
} from "react-native";
import TopBar from "../../components/TopBar";
import { useApp } from "../../context/AppContext";

type Goal = "balanced" | "vegetarian" | "budget" | "highprotein";

const LISTS: Record<Goal, { category: string; items: string[] }[]> = {
  balanced: [
    { category: "Proteins", items: ["Chicken breast", "Eggs (x12)", "Canned tuna", "Greek yogurt"] },
    { category: "Vegetables", items: ["Spinach", "Broccoli", "Carrots", "Tomatoes", "Bell peppers"] },
    { category: "Carbs", items: ["Brown rice", "Whole wheat bread", "Oats", "Sweet potatoes"] },
    { category: "Extras", items: ["Olive oil", "Garlic", "Onions", "Lemon"] },
  ],
  vegetarian: [
    { category: "Proteins", items: ["Eggs (x12)", "Lentils", "Chickpeas", "Tofu", "Greek yogurt"] },
    { category: "Vegetables", items: ["Spinach", "Zucchini", "Eggplant", "Tomatoes", "Mushrooms"] },
    { category: "Carbs", items: ["Quinoa", "Brown rice", "Whole wheat pasta", "Oats"] },
    { category: "Extras", items: ["Olive oil", "Garlic", "Cumin", "Paprika", "Lemon"] },
  ],
  budget: [
    { category: "Proteins", items: ["Eggs (x12)", "Canned tuna (x4)", "Canned beans", "Chicken thighs"] },
    { category: "Vegetables", items: ["Carrots", "Cabbage", "Onions", "Potatoes", "Frozen peas"] },
    { category: "Carbs", items: ["White rice (1kg)", "Pasta (500g)", "Bread", "Oats"] },
    { category: "Extras", items: ["Sunflower oil", "Salt & pepper", "Bouillon cubes"] },
  ],
  highprotein: [
    { category: "Proteins", items: ["Chicken breast (1kg)", "Eggs (x18)", "Salmon fillet", "Cottage cheese", "Tuna (x4)"] },
    { category: "Vegetables", items: ["Broccoli", "Spinach", "Asparagus", "Green beans"] },
    { category: "Carbs", items: ["Sweet potatoes", "Brown rice", "Oats", "Whole wheat bread"] },
    { category: "Extras", items: ["Olive oil", "Almonds", "Peanut butter"] },
  ],
};

const LABELS: Record<Goal, string> = {
  balanced: "Balanced ⚖️",
  vegetarian: "Vegetarian 🥦",
  budget: "Budget 💰",
  highprotein: "High Protein 💪",
};

export default function GroceryList() {
  const { goal } = useLocalSearchParams<{ goal: Goal }>();
  const { addToGrocery, groceryList } = useApp();
  const list = LISTS[goal] ?? [];
  const [checked, setChecked] = useState<string[]>([]);
  const total = list.reduce((a, c) => a + c.items.length, 0);
  const allItems = list.flatMap((c) => c.items);

  const toggle = (item: string) =>
    setChecked((p) => (p.includes(item) ? p.filter((i) => i !== item) : [...p, item]));

  return (
    <ImageBackground
      source={{ uri: "https://i.pinimg.com/736x/fe/65/25/fe65250f7401547512d4716360addbb4.jpg" }}
      style={{ flex: 1 }}
      resizeMode="cover"
    >
      <View style={s.overlay}>
        <SafeAreaView style={s.safe}>
          <TopBar title={LABELS[goal]} showBack />

          <ScrollView
            style={s.scroll}
            contentContainerStyle={s.content}
            showsVerticalScrollIndicator={false}
          >
            <View style={s.topRow}>
              <Text style={s.sub}>
                {checked.length} / {total} checked
              </Text>
              <TouchableOpacity onPress={() => allItems.forEach((i) => addToGrocery(i))}>
                <Text style={s.addAll}>+ Add all to list</Text>
              </TouchableOpacity>
            </View>

            <View style={s.barBg}>
              <View
                style={[
                  s.barFill,
                  { width: `${(checked.length / total) * 100}%` as any },
                ]}
              />
            </View>

            {list.map((cat) => (
              <View key={cat.category} style={s.section}>
                <Text style={s.catTitle}>{cat.category}</Text>

                {cat.items.map((item) => {
                  const done = checked.includes(item);
                  const inList = groceryList.includes(item.toLowerCase());

                  return (
                    <View key={item} style={s.row}>
                      <TouchableOpacity
                        style={[s.box, done && s.boxOn]}
                        onPress={() => toggle(item)}
                      >
                        {done && <Text style={s.tick}>✓</Text>}
                      </TouchableOpacity>

                      <Text style={[s.itemText, done && s.itemDone]}>
                        {item}
                      </Text>

                      <TouchableOpacity
                        style={[s.addBtn, inList && s.addBtnDone]}
                        onPress={() => !inList && addToGrocery(item.toLowerCase())}
                      >
                        <Text style={[s.addBtnText, inList && s.addBtnTextDone]}>
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
    backgroundColor: "rgba(0,0,0,0.45)",
  },

  scroll: {
    flex: 1,
  },

  content: {
    padding: 20,
    paddingBottom: 48,
  },

  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },

  sub: {
    fontSize: 13,
    color: "#eee",
  },

  addAll: {
    fontSize: 13,
    color: "#FF6B00",
    fontWeight: "700",
  },

  barBg: {
    height: 5,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 3,
    marginBottom: 24,
    overflow: "hidden",
  },

  barFill: {
    height: "100%",
    backgroundColor: "#FF6B00",
    borderRadius: 3,
  },

  section: {
    marginBottom: 24,
  },

  catTitle: {
    fontSize: 12,
    fontWeight: "800",
    color: "#FF6B00",
    marginBottom: 10,
    textTransform: "uppercase",
    letterSpacing: 1,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 11,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.2)",
    gap: 14,
  },

  box: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: "rgba(255,255,255,0.6)",
    alignItems: "center",
    justifyContent: "center",
  },

  boxOn: {
    backgroundColor: "#FF6B00",
    borderColor: "#FF6B00",
  },

  tick: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "800",
  },

  itemText: {
    flex: 1,
    fontSize: 15,
    color: "#fff",
  },

  itemDone: {
    color: "#ccc",
    textDecorationLine: "line-through",
  },

  addBtn: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#FF6B00",
    backgroundColor: "rgba(255,255,255,0.1)",
  },

  addBtnDone: {
    borderColor: "#22c55e",
  },

  addBtnText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#FF6B00",
  },

  addBtnTextDone: {
    color: "#22c55e",
  },
});