import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { useTheme } from "../context/ThemeContext";

const ICONS: Record<string, string> = {
  All: "✦", Chicken: "🍗", Beef: "🥩", Seafood: "🐟",
  Pasta: "🍝", Vegetarian: "🥦", Dessert: "🍰",
  Breakfast: "🥞", Lamb: "🍖", Pork: "🥓",
  Italian: "🇮🇹", Mexican: "🌮", Japanese: "🍱",
  Chinese: "🥢", Indian: "🍛", French: "🥐",
  American: "🍔", Thai: "🍜", Moroccan: "🫕",
};

type Props = { label: string; active: boolean; onPress: () => void };

export default function CategoryChip({ label, active, onPress }: Props) {
  const { colors } = useTheme();

  return (
    <TouchableOpacity
      style={[
        s.chip,
        { backgroundColor: colors.bgCard, borderColor: colors.border },
        active && { backgroundColor: colors.accent, borderColor: colors.accent },
      ]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Text style={s.icon}>{ICONS[label] ?? "🍽️"}</Text>
      <Text style={[
        s.label,
        { color: colors.accent },
        active && { color: "#fff" },
      ]}>
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
  icon: { fontSize: 14 },
  label: { fontSize: 13, fontWeight: "600" },
});