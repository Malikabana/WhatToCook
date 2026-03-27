import { ShoppingCart, Trash2 } from "lucide-react-native";
import { useState } from "react";
import {
  FlatList, Image, SafeAreaView, StatusBar,
  StyleSheet, Text, TouchableOpacity, View,
} from "react-native";
import TopBar from "../components/TopBar";
import { useApp } from "../context/AppContext";
import { useTheme } from "../context/ThemeContext";

const DARK_BG  = "https://i.pinimg.com/736x/b1/73/74/b1737402873727e0ee1f74a38c66417b.jpg";
const LIGHT_BG = "https://i.pinimg.com/736x/b1/73/74/b1737402873727e0ee1f74a38c66417b.jpg";

export default function GroceryListScreen() {
  const { groceryList, removeFromGrocery, clearGrocery } = useApp();
  const { colors, isDark } = useTheme();
  const [checked, setChecked] = useState<string[]>([]);

  const toggle = (item: string) =>
    setChecked((p) => p.includes(item) ? p.filter((i) => i !== item) : [...p, item]);

  return (
    <View style={{ flex: 1 }}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
      <Image
        source={{ uri: isDark ? DARK_BG : LIGHT_BG }}
        style={StyleSheet.absoluteFillObject}
        resizeMode="cover"
      />
      <View style={{ ...StyleSheet.absoluteFillObject, backgroundColor: isDark ? "rgba(0,0,0,0.65)" : "rgba(255,247,237,0.88)" }} />

      <SafeAreaView style={{ flex: 1 }}>
        <TopBar showBack showGrocery={false} />
        <FlatList
          data={groceryList}
          keyExtractor={(item) => item}
          contentContainerStyle={[s.list, { marginTop: 80 }]}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <View style={s.header}>
              <View style={s.headerTop}>
                <View style={s.headerLeft}>
                  <ShoppingCart size={14} color={isDark ? "#bbb" : colors.textMuted} strokeWidth={2} />
                  <Text style={[s.sub, { color: isDark ? "#bbb" : colors.textMuted }]}>
                    {groceryList.length === 0 ? "Your list is empty" : `${checked.length} / ${groceryList.length} checked`}
                  </Text>
                </View>
                {groceryList.length > 0 && (
                  <TouchableOpacity onPress={clearGrocery} style={s.clearBtn}>
                    <Trash2 size={14} color="#ef4444" strokeWidth={2} />
                    <Text style={s.clearText}>Clear all</Text>
                  </TouchableOpacity>
                )}
              </View>
              {groceryList.length > 0 && (
                <View style={[s.barBg, { backgroundColor: isDark ? "rgba(255,255,255,0.15)" : colors.border }]}>
                  <View style={[s.barFill, { width: `${(checked.length / groceryList.length) * 100}%` as any, backgroundColor: colors.accent }]} />
                </View>
              )}
            </View>
          }
          ListEmptyComponent={
            <View style={s.emptyBox}>
              <ShoppingCart size={48} color={isDark ? "#333" : "#FFE4C8"} strokeWidth={1.5} />
              <Text style={[s.emptyText, { color: isDark ? "#555" : colors.textMuted }]}>
                Add ingredients from any recipe or grocery plan
              </Text>
            </View>
          }
          renderItem={({ item }) => {
            const done = checked.includes(item);
            return (
              <View style={[s.row, {
                backgroundColor: isDark ? "rgba(255,255,255,0.07)" : colors.bgCard,
                borderColor: isDark ? "rgba(255,255,255,0.1)" : colors.border,
              }]}>
                <TouchableOpacity
                  style={[s.box, { borderColor: isDark ? "rgba(255,255,255,0.4)" : colors.border }, done && { backgroundColor: colors.accent, borderColor: colors.accent }]}
                  onPress={() => toggle(item)}
                >
                  {done && <Text style={s.tick}>✓</Text>}
                </TouchableOpacity>
                <Text style={[s.itemText, { color: isDark ? "#fff" : colors.text }, done && s.itemDone]}>{item}</Text>
                <TouchableOpacity onPress={() => removeFromGrocery(item)} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                  <Trash2 size={16} color={isDark ? "#444" : "#ccc"} strokeWidth={2} />
                </TouchableOpacity>
              </View>
            );
          }}
        />
      </SafeAreaView>
    </View>
  );
}

const s = StyleSheet.create({
  list:      { padding: 16, paddingBottom: 40 },
  header:    { marginBottom: 16 },
  headerTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 10 },
  headerLeft:{ flexDirection: "row", alignItems: "center", gap: 6 },
  sub:       { fontSize: 14 },
  clearBtn:  { flexDirection: "row", alignItems: "center", gap: 4 },
  clearText: { fontSize: 13, fontWeight: "600", color: "#ef4444" },
  barBg:     { height: 5, borderRadius: 3, overflow: "hidden" },
  barFill:   { height: "100%", borderRadius: 3 },
  row:       { flexDirection: "row", alignItems: "center", paddingVertical: 14, paddingHorizontal: 14, marginBottom: 10, borderRadius: 14, borderWidth: 1, gap: 14 },
  box:       { width: 22, height: 22, borderRadius: 6, borderWidth: 1.5, alignItems: "center", justifyContent: "center" },
  tick:      { color: "#fff", fontSize: 12, fontWeight: "800" },
  itemText:  { flex: 1, fontSize: 15, textTransform: "capitalize" },
  itemDone:  { color: "#888", textDecorationLine: "line-through" },
  emptyBox:  { alignItems: "center", marginTop: 100, gap: 16 },
  emptyText: { fontSize: 15, textAlign: "center", lineHeight: 22 },
});