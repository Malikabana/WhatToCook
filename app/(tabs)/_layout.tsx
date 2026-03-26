import { Tabs } from "expo-router";
import { BookOpen, Heart, Home, Refrigerator, ShoppingCart } from "lucide-react-native";
import { useTheme } from "../../context/ThemeContext";

export default function TabLayout() {
  const { colors, isDark } = useTheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarHideOnKeyboard: true,
        tabBarStyle: {
          backgroundColor: isDark ? "#0d0d0d" : "#ffffff",
          borderTopColor: isDark ? "rgba(255,255,255,0.08)" : "#e5e5e5",
          borderTopWidth: 1,
          height: 78,
          paddingTop: 8,
          paddingBottom: 18,
        },
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: isDark ? "#777" : "#999",
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "600",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => <Home size={22} color={color} strokeWidth={2} />,
        }}
      />
      <Tabs.Screen
        name="browse"
        options={{
          title: "Browse",
          tabBarIcon: ({ color }) => <BookOpen size={22} color={color} strokeWidth={2} />,
        }}
      />
      <Tabs.Screen
        name="fridge"
        options={{
          title: "Fridge",
          tabBarIcon: ({ color }) => <Refrigerator size={22} color={color} strokeWidth={2} />,
        }}
      />
      <Tabs.Screen
        name="grocery"
        options={{
          title: "Grocery",
          tabBarIcon: ({ color }) => <ShoppingCart size={22} color={color} strokeWidth={2} />,
        }}
      />
      <Tabs.Screen
        name="favorites"
        options={{
          title: "Favorites",
          tabBarIcon: ({ color }) => <Heart size={22} color={color} strokeWidth={2} />,
        }}
      />
    </Tabs>
  );
}