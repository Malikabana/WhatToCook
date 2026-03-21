import { StyleSheet, Text, TouchableOpacity } from "react-native";

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
  return (
    <TouchableOpacity
      style={[s.chip, active && s.chipOn]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Text style={s.icon}>{ICONS[label] ?? "🍽️"}</Text>
      <Text style={[s.label, active && s.labelOn]}>{label}</Text>
    </TouchableOpacity>
  );
}

const s = StyleSheet.create({
  chip: {
    flexDirection: "row", alignItems: "center",
    paddingHorizontal: 14, paddingVertical: 8,
    borderRadius: 20, backgroundColor: "#fff",
    borderWidth: 1, borderColor: "#FFE4C8", gap: 6,
  },
  chipOn: { backgroundColor: "#FF6B00", borderColor: "#FF6B00" },
  icon: { fontSize: 14 },
  label: { fontSize: 13, fontWeight: "600", color: "#C2410C" },
  labelOn: { color: "#fff" },
});