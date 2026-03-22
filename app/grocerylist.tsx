import { useState } from "react";
import {
  FlatList, ImageBackground, SafeAreaView,
  StyleSheet, Text, TouchableOpacity, View,
} from "react-native";
import TopBar from "../components/TopBar";
import { useApp } from "../context/AppContext";
import { useTheme } from "../context/ThemeContext";

const DARK_BG  = "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=800";
const LIGHT_BG = "https://images.unsplash.com/photo-1506617564039-2f3b650b7010?w=800";

export default function GroceryListScreen() {
  const { groceryList, removeFromGrocery, clearGrocery } = useApp();
  const { colors, isDark } = useTheme();
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
        <TopBar title="My List" showBack showGrocery={false} />
        <FlatList
          data={groceryList}
          keyExtractor={(item) => item}
          contentContainerStyle={[s.list, { marginTop: 80 }]}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <View style={s.header}>
              <Text style={[s.sub, { color: isDark ? "#bbb" : colors.textMuted }]}>
                {groceryList.length === 0 ? "Your list is empty" : `${checked.length} / ${groceryList.length} checked`}
              </Text>
              {groceryList.length > 0 && (
                <>
                  <View style={[s.barBg, { backgroundColor: isDark ? "rgba(255,255,255,0.15)" : colors.border }]}>
                    <View style={[s.barFill, { width: `${(checked.length / groceryList.length) * 100}%` as any, backgroundColor: colors.accent }]} />
                  </View>
                  <TouchableOpacity onPress={clearGrocery} style={s.clearBtn}>
                    <Text style={[s.clearText, { color: isDark ? "#888" : colors.textMuted }]}>Clear all</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          }
          ListEmptyComponent={
            <View style={s.emptyBox}>
              <Text style={s.emptyIcon}>🛒</Text>
              <Text style={[s.emptyText, { color: isDark ? "#bbb" : colors.textMuted }]}>
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
                  style={[s.box, { borderColor: isDark ? "rgba(255,255,255,0.4)" : colors.border },
                    done && { backgroundColor: colors.accent, borderColor: colors.accent }]}
                  onPress={() => toggle(item)}
                >
                  {done && <Text style={s.tick}>✓</Text>}
                </TouchableOpacity>
                <Text style={[s.itemText, { color: isDark ? "#fff" : colors.text }, done && s.itemDone]}>
                  {item}
                </Text>
                <TouchableOpacity onPress={() => removeFromGrocery(item)} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                  <Text style={s.remove}>✕</Text>
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
  safe: { flex: 1, backgroundColor: "transparent" },
  list: { padding: 16, paddingBottom: 40 },
  header: { marginBottom: 16 },
  sub: { fontSize: 14, marginBottom: 10 },
  barBg: { height: 5, borderRadius: 3, marginBottom: 10, overflow: "hidden" },
  barFill: { height: "100%", borderRadius: 3 },
  clearBtn: { alignSelf: "flex-end" },
  clearText: { fontSize: 13, fontWeight: "600" },
  row: {
    flexDirection: "row", alignItems: "center",
    paddingVertical: 14, paddingHorizontal: 14,
    marginBottom: 10, borderRadius: 14, borderWidth: 1, gap: 14,
  },
  box: { width: 22, height: 22, borderRadius: 6, borderWidth: 1.5, alignItems: "center", justifyContent: "center" },
  tick: { color: "#fff", fontSize: 12, fontWeight: "800" },
  itemText: { flex: 1, fontSize: 15, textTransform: "capitalize" },
  itemDone: { color: "#888", textDecorationLine: "line-through" },
  remove: { color: "#ccc", fontSize: 14, fontWeight: "700" },
  emptyBox: { alignItems: "center", marginTop: 100, gap: 12 },
  emptyIcon: { fontSize: 48 },
  emptyText: { fontSize: 15, textAlign: "center", lineHeight: 22 },
});