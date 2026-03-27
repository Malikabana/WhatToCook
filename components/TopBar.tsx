import { useRouter } from "expo-router";
import { ChevronLeft, Moon, Settings, ShoppingCart, Sun } from "lucide-react-native";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { useApp } from "../context/AppContext";
import { useTheme } from "../context/ThemeContext";

type Props = {
  showBack?: boolean;
  showGrocery?: boolean;
};

export default function TopBar({ showBack = false, showGrocery = true }: Props) {
  const router = useRouter();
  const { groceryList } = useApp();
  const { isDark, toggleTheme } = useTheme();

  return (
    <View style={s.container} pointerEvents="box-none">
      <View style={s.left}>
        {showBack && (
          <TouchableOpacity onPress={() => router.back()} style={s.iconBtn}>
            <ChevronLeft size={22} color="#fff" strokeWidth={2.5} />
          </TouchableOpacity>
        )}
      </View>
      <View style={s.right}>
        {/* Theme toggle sits here now */}
        <TouchableOpacity onPress={toggleTheme} style={s.iconBtn}>
          {isDark
            ? <Sun  size={22} color="#fff" strokeWidth={2} />
            : <Moon size={22} color="#fff" strokeWidth={2} />
          }
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push("/settings" as any)} style={s.iconBtn}>
          <Settings size={22} color="#fff" strokeWidth={2} />
        </TouchableOpacity>
        {showGrocery && (
          <TouchableOpacity onPress={() => router.push("/grocerylist" as any)} style={s.iconBtn}>
            <ShoppingCart size={22} color="#fff" strokeWidth={2} />
            {groceryList.length > 0 && (
              <View style={s.badge}><View style={s.badgeDot} /></View>
            )}
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    position: "absolute", top: 60, left: 0, right: 0,
    zIndex: 1000, flexDirection: "row",
    alignItems: "center", justifyContent: "space-between",
    paddingHorizontal: 16,
  },
  left:   { flexDirection: "row", gap: 8 },
  right:  { flexDirection: "row", gap: 8 },
  iconBtn: { backgroundColor: "rgba(0,0,0,0.3)", padding: 10, borderRadius: 20 },
  badge:  { position: "absolute", top: 6, right: 6 },
  badgeDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: "#FF8C42", borderWidth: 1.5, borderColor: "rgba(0,0,0,0.3)" },
});