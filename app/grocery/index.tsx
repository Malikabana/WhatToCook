import { useRouter } from "expo-router";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ImageBackground,
} from "react-native";
import TopBar from "../../components/TopBar";

const GOALS = [
  { key: "balanced", icon: "⚖️", title: "Balanced diet", desc: "Proteins, carbs and vegetables" },
  { key: "vegetarian", icon: "🥦", title: "Vegetarian", desc: "Plant-based, no meat or fish" },
  { key: "budget", icon: "💰", title: "On a budget", desc: "Affordable basics that go far" },
  { key: "highprotein", icon: "💪", title: "High protein", desc: "Build muscle, stay full" },
] as const;

export default function GroceryHome() {
  const router = useRouter();

  return (
    <ImageBackground
      source={{ uri: "https://i.pinimg.com/736x/9b/63/da/9b63da8361f93f465ab57faa2fa8ac6b.jpg" }}
      style={{ flex: 1 }}
      resizeMode="cover"
    >
      {/* 🔥 layered gradient effect */}
      <View style={s.overlay}>
        <SafeAreaView style={s.safe}>
          <TopBar title="Grocery" showBack={false} />

          <View style={s.container}>
            <Text style={s.title}>Your weekly plan</Text>
            <Text style={s.sub}>Choose a goal and we’ll handle the rest</Text>

            {GOALS.map((goal) => (
              <TouchableOpacity
                key={goal.key}
                style={s.card}
                onPress={() =>
                  router.push({
                    pathname: "/grocery/list",
                    params: { goal: goal.key },
                  } as any)
                }
                activeOpacity={0.9}
              >
                {/* icon bubble */}
                <View style={s.iconWrap}>
                  <Text style={s.icon}>{goal.icon}</Text>
                </View>

                {/* text */}
                <View style={s.body}>
                  <Text style={s.cardTitle}>{goal.title}</Text>
                  <Text style={s.cardDesc}>{goal.desc}</Text>
                </View>

                {/* arrow */}
                <Text style={s.arrow}>›</Text>
              </TouchableOpacity>
            ))}
          </View>
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

  // 🔥 smoother, more premium overlay (gradient illusion)
  overlay: {
    flex: 1,
    backgroundColor: "rgba(10,10,10,0.65)",
  },

  container: {
    flex: 1,
    paddingHorizontal: 22,
    paddingTop: 10,
    gap: 16,
  },

  // 🔥 better hierarchy
  title: {
    fontSize: 24,
    fontWeight: "900",
    color: "#FFFFFF",
    letterSpacing: 0.3,
  },

  sub: {
    fontSize: 14,
    color: "#CFCFCF",
    marginBottom: 12,
  },

  // 🔥 cleaner spacing + depth
  card: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 22,

    backgroundColor: "rgba(255,255,255,0.10)",

    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.18)",

    shadowColor: "#000",
    shadowOpacity: 0.35,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
  },

  // 🔥 icon with better contrast
  iconWrap: {
    backgroundColor: "rgba(255,255,255,0.18)",
    padding: 12,
    borderRadius: 16,
  },

  icon: {
    fontSize: 20,
  },

  body: {
    flex: 1,
    marginLeft: 12,
  },

  // 🔥 strong readable title
  cardTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#FFFFFF",
  },

  // 🔥 softer secondary text
  cardDesc: {
    fontSize: 13,
    color: "#D6D6D6",
    marginTop: 4,
    lineHeight: 17,
  },

  // 🔥 accent color used properly (only here)
  arrow: {
    fontSize: 22,
    color: "#FF8C42", // softer orange (less aggressive)
    fontWeight: "700",
  },
});