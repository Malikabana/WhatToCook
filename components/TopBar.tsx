import { useRouter } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useApp } from "../context/AppContext";

type Props = {
  title?: string;
  showBack?: boolean;
};

export default function TopBar({ title, showBack = false }: Props) {
  const router = useRouter();
  const { groceryList } = useApp();

  return (
    <View style={s.container} pointerEvents="box-none">

      {/* Back */}
      {showBack && (
        <TouchableOpacity onPress={() => router.back()} style={s.left}>
          <Text style={s.back}>‹</Text>
        </TouchableOpacity>
      )}

      {/* Title */}
      {title ? <Text style={s.title}>{title}</Text> : null}

      {/* Right icons */}
      <View style={s.right}>
        
        {/* Settings */}
        <TouchableOpacity
          onPress={() => router.push("/settings" as any)}
          style={s.iconBtn}
        >
          <Text style={s.icon}>⚙️</Text>
        </TouchableOpacity>

        {/* Cart */}
        <TouchableOpacity
          onPress={() => router.push("/grocerylist" as any)}
          style={s.iconBtn}
        >
          <Text style={s.icon}>🛒</Text>

          {groceryList.length > 0 && (
            <View style={s.badge}>
              <Text style={s.badgeText}>{groceryList.length}</Text>
            </View>
          )}
        </TouchableOpacity>

      </View>
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    position: "absolute",
    top: 60,
    left: 0,
    right: 0,
    zIndex: 1000,
    alignItems: "center",
  },

  left: {
    position: "absolute",
    left: 20,
  },

  right: {
    position: "absolute",
    right: 20,
    flexDirection: "row",
    gap: 12, // espace entre ⚙️ et 🛒
  },

  iconBtn: {
    backgroundColor: "rgba(0,0,0,0.3)",
    padding: 10,
    borderRadius: 20,
  },

  icon: {
    fontSize: 20,
  },

  back: {
    fontSize: 26,
    color: "#fff",
  },

  title: {
    fontSize: 16,
    fontWeight: "800",
    color: "#fff",
  },

  badge: {
    position: "absolute",
    top: -5,
    right: -6,
    backgroundColor: "#FF6B00",
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 3,
  },

  badgeText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "800",
  },
});