import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  ImageBackground,
} from "react-native";
import RecipeCard from "../components/RecipeCard";
import TopBar from "../components/TopBar";
import { useApp } from "../context/AppContext";

export default function Favorites() {
  const { favorites } = useApp();

  return (
    <ImageBackground
      source={{ uri: "https://i.pinimg.com/736x/9b/63/da/9b63da8361f93f465ab57faa2fa8ac6b.jpg" }}
      style={{ flex: 1 }}
      resizeMode="cover"
    >
      <View style={s.overlay}>
        <SafeAreaView style={s.safe}>
          <TopBar title="Favorites" showBack={false} />

          <FlatList
            data={favorites}
            keyExtractor={(m) => m.idMeal}
            contentContainerStyle={s.list}
            showsVerticalScrollIndicator={false}
            ListHeaderComponent={
              <Text style={s.sub}>
                {favorites.length === 0
                  ? "No saved recipes yet"
                  : `${favorites.length} saved recipe${
                      favorites.length !== 1 ? "s" : ""
                    }`}
              </Text>
            }
            ListEmptyComponent={
              <View style={s.emptyBox}>
                <Text style={s.emptyIcon}>🤍</Text>
                <Text style={s.emptyText}>
                  Tap the heart on any recipe to save it here
                </Text>
              </View>
            }
            renderItem={({ item }) => (
              <RecipeCard
                meal={item}
                route={`/recipe/${item.idMeal}`}
              />
            )}
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

  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.55)", // same as others
  },

  list: {
    padding: 20,
    paddingBottom: 40,
  },

  sub: {
    fontSize: 14,
    color: "#ddd",
    marginBottom: 16,
  },

  emptyBox: {
    alignItems: "center",
    marginTop: 100,
    gap: 12,
  },

  emptyIcon: {
    fontSize: 50,
  },

  emptyText: {
    fontSize: 15,
    color: "#ccc",
    textAlign: "center",
    lineHeight: 22,
    paddingHorizontal: 20,
  },
});