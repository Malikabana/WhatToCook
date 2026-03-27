import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";

type Theme = "dark" | "light";

type ThemeColors = {
  bg: string;
  bgCard: string;
  bgInput: string;
  border: string;
  text: string;
  textMuted: string; //
  textFaint: string;
  accent: string;
  accentLight: string;
  tabBar: string;
};

const DARK: ThemeColors = {
  bg:          "#0d0d0d",
  bgCard:      "rgba(255,255,255,0.06)",
  bgInput:     "rgba(255,255,255,0.08)",
  border:      "rgba(255,255,255,0.09)",
  text:        "#ffffff",
  textMuted:   "#888888",
  textFaint:   "#444444",
  accent:      "#FF8C42",
  accentLight: "rgba(255,140,66,0.12)",
  tabBar:      "rgba(12,12,12,0.95)",
};

const LIGHT: ThemeColors = {
  bg:          "#FFF7ED",
  bgCard:      "#ffffff",
  bgInput:     "#ffffff",
  border:      "#FFE4C8",
  text:        "#1a1a1a",
  textMuted:   "#888888",
  textFaint:   "#cccccc",
  accent:      "#FF6B00",
  accentLight: "#FFEDD5",
  tabBar:      "#ffffff",
};

type ThemeContextType = {
  theme: Theme;
  colors: ThemeColors;
  toggleTheme: () => void;
  isDark: boolean;
};

const ThemeContext = createContext<ThemeContextType | null>(null);

export function useTheme(): ThemeContextType {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be inside ThemeProvider");
  return ctx;
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    AsyncStorage.getItem("app_theme").then((saved) => { // On app load, we check AsyncStorage for a saved theme preference under the key "app_theme". If we find a valid theme ("light" or "dark"), we set it as the current theme. This ensures that the user's theme choice persists across app sessions. If there's an error retrieving the value, we simply log it and default to "dark".
      if (saved === "light" || saved === "dark") setTheme(saved);
    });
  }, []);

  const toggleTheme = () => {
    const next: Theme = theme === "dark" ? "light" : "dark";
    setTheme(next);
    AsyncStorage.setItem("app_theme", next).catch(console.warn);
  };

  return (
    <ThemeContext.Provider value={{
      theme,
      colors: theme === "dark" ? DARK : LIGHT,
      toggleTheme,
      isDark: theme === "dark",
    }}>
      {children}
    </ThemeContext.Provider>
  );
}
