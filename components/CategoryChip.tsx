import { StyleSheet, Text, TouchableOpacity } from "react-native";
import {
  Utensils, Beef, Fish, Wheat, Leaf, Cookie,
  Sunrise, Drumstick, Flame, ShoppingBag,
} from "lucide-react-native";
import { useTheme } from "../context/ThemeContext";

const ICONS: Record<string, any> = {
  All:        Utensils,
  Chicken:    Drumstick,
  Beef:       Beef,
  Seafood:    Fish,
  Pasta:      Wheat,
  Vegetarian: Leaf,
  Dessert:    Cookie,
  Breakfast:  Sunrise,
  Lamb:       Flame,
  Pork:       ShoppingBag,
};

type Props = { label: string; active: boolean; onPress: () => void };

export default function CategoryChip({ label, active, onPress }: Props) {
  const { colors, isDark } = useTheme();
  const Icon = ICONS[label] ?? Utensils;

  return (
    <TouchableOpacity
      style={[
        s.chip,
        {
          backgroundColor: active ? colors.accent : isDark ? "rgba(255,255,255,0.08)" : colors.bgCard,
          borderColor: active ? colors.accent : isDark ? "rgba(255,255,255,0.12)" : colors.border,
        },
      ]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Icon
        size={14}
        color={active ? "#fff" : colors.accent}
        strokeWidth={2}
      />
      <Text style={[s.label, { color: active ? "#fff" : colors.accent }]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const s = StyleSheet.create({
  chip: {
    flexDirection: "row", alignItems: "center",
    paddingHorizontal: 14, paddingVertical: 8,
    borderRadius: 20, borderWidth: 1, gap: 6,
  },
  label: { fontSize: 13, fontWeight: "600" },
});