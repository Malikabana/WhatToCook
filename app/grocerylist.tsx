import { useState } from "react";
import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ImageBackground,
} from "react-native";
import TopBar from "../components/TopBar";
import { useApp } from "../context/AppContext";

export default function GroceryList() {
  const { groceryList, removeFromGrocery, clearGrocery } = useApp();
  const [checked, setChecked] = useState<string[]>([]);

  const toggle = (item: string) =>
    setChecked((p) =>
      p.includes(item) ? p.filter((i) => i !== item) : [...p, item]
    );

  return (
    <ImageBackground
      source={{ uri: "https://i.pinimg.com/736x/9b/63/da/9b63da8361f93f465ab57faa2fa8ac6b.jpg" }}
      style={{ flex: 1 }}
      resizeMode="cover"
    >
      <View style={s.overlay}>
        <SafeAreaView style={s.safe}>
          <TopBar title="My List" showBack showGrocery={false} />

          <FlatList
            data={groceryList}
            keyExtractor={(item) => item}
            contentContainerStyle={s.list}
            showsVerticalScrollIndicator={false}
            ListHeaderComponent={
              <View style={s.header}>
                <Text style={s.sub}>
                  {groceryList.length === 0
                    ? "Your list is empty"
                    : `${checked.length} / ${groceryList.length} checked`}
                </Text>

                {groceryList.length > 0 && (
                  <>
                    <View style={s.barBg}>
                      <View
                        style={[
                          s.barFill,
                          {
                            width: `${
                              (checked.length / groceryList.length) * 100
                            }%` as any,
                          },
                        ]}
                      />
                    </View>

                    <TouchableOpacity
                      onPress={clearGrocery}
                      style={s.clearBtn}
                    >
                      <Text style={s.clearText}>Clear all</Text>
                    </TouchableOpacity>
                  </>
                )}
              </View>
            }
            ListEmptyComponent={
              <View style={s.emptyBox}>
                <Text style={s.emptyIcon}>🛒</Text>
                <Text style={s.emptyText}>
                  Add ingredients from any recipe or grocery plan
                </Text>
              </View>
            }
            renderItem={({ item }) => {
              const done = checked.includes(item);

              return (
                <View style={s.row}>
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
                    onPress={() => removeFromGrocery(item)}
                  >
                    <Text style={s.remove}>✕</Text>
                  </TouchableOpacity>
                </View>
              );
            }}
          />
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

  // 🔥 same overlay style as your other screens
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.55)",
  },

  list: {
    padding: 20,
    paddingBottom: 40,
  },

  header: {
    marginBottom: 12,
  },

  sub: {
    fontSize: 14,
    color: "#ddd",
    marginBottom: 10,
  },

  barBg: {
    height: 5,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 3,
    marginBottom: 12,
    overflow: "hidden",
  },

  barFill: {
    height: "100%",
    backgroundColor: "#FF8C42",
    borderRadius: 3,
  },

  clearBtn: {
    alignSelf: "flex-end",
    marginBottom: 10,
  },

  clearText: {
    fontSize: 13,
    color: "#bbb",
    fontWeight: "600",
  },

  // 🔥 glass row style (same as your cards)
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 14,
    marginBottom: 10,
    borderRadius: 14,

    backgroundColor: "rgba(255,255,255,0.08)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.15)",

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
    backgroundColor: "#FF8C42",
    borderColor: "#FF8C42",
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
    textTransform: "capitalize",
  },

  itemDone: {
    color: "#bbb",
    textDecorationLine: "line-through",
  },

  remove: {
    color: "#ccc",
    fontSize: 14,
    fontWeight: "700",
  },

  emptyBox: {
    alignItems: "center",
    marginTop: 100,
    gap: 12,
  },

  emptyIcon: {
    fontSize: 48,
  },

  emptyText: {
    fontSize: 15,
    color: "#ccc",
    textAlign: "center",
    lineHeight: 22,
  },
});