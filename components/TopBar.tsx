import { useRouter } from "expo-router";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { ChevronLeft, Settings, ShoppingCart, Sun, Moon, Home } from "lucide-react-native";
import { useApp } from "../context/AppContext";
import { useTheme } from "../context/ThemeContext";

type Props = {
  title?: string;
  showBack?: boolean;
  showGrocery?: boolean;
};

export default function TopBar({ title, showBack = false, showGrocery = true }: Props) {
  const router = useRouter();
  const { groceryList } = useApp();
  const { isDark, toggleTheme } = useTheme();

  const iconColor = "#fff";
  const iconSize  = 22;

  return (
    <View style={s.container} pointerEvents="box-none">

      {/* Left — back + home */}
      <View style={s.left}>
        {showBack && (
          <TouchableOpacity onPress={() => router.back()} style={s.iconBtn}>
            <ChevronLeft size={iconSize} color={iconColor} strokeWidth={2.5} />
          </TouchableOpacity>
        )}
        <TouchableOpacity onPress={() => router.replace("/" as any)} style={s.iconBtn}>
          <Home size={iconSize} color={iconColor} strokeWidth={2} />
        </TouchableOpacity>
      </View>

      {/* Right — theme + settings + cart */}
      <View style={s.right}>
        <TouchableOpacity onPress={toggleTheme} style={s.iconBtn}>
          {isDark
            ? <Sun  size={iconSize} color={iconColor} strokeWidth={2} />
            : <Moon size={iconSize} color={iconColor} strokeWidth={2} />
          }
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push("/settings" as any)} style={s.iconBtn}>
          <Settings size={iconSize} color={iconColor} strokeWidth={2} />
        </TouchableOpacity>

        {showGrocery && (
          <TouchableOpacity onPress={() => router.push("/grocerylist" as any)} style={s.iconBtn}>
            <ShoppingCart size={iconSize} color={iconColor} strokeWidth={2} />
            {groceryList.length > 0 && (
              <View style={s.badge}>
                <View style={s.badgeDot} />
              </View>
            )}
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    position: "absolute",
    top: 60, left: 0, right: 0,
    zIndex: 1000,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
  },
  left: {
    flexDirection: "row",
    gap: 8,
  },
  right: {
    flexDirection: "row",
    gap: 8,
  },
  iconBtn: {
    backgroundColor: "rgba(0,0,0,0.3)",
    padding: 10,
    borderRadius: 20,
  },
  badge: {
    position: "absolute",
    top: 6, right: 6,
  },
  badgeDot: {
    width: 8, height: 8,
    borderRadius: 4,
    backgroundColor: "#FF8C42",
    borderWidth: 1.5,
    borderColor: "rgba(0,0,0,0.3)",
  },
});