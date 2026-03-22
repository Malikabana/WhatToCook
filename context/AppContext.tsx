import AsyncStorage from "@react-native-async-storage/async-storage";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { auth } from "../services/firebase";

export type Meal = {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
  strInstructions?: string;
  strCategory?: string;
  strArea?: string;
  [key: string]: string | undefined;
};

type ContextType = {
  user: User | null;
  authReady: boolean;
  logout: () => Promise<void>;
  favorites: Meal[];
  toggleFavorite: (meal: Meal) => void;
  isFavorite: (id: string) => boolean;
  fridgeItems: string[];
  addFridgeItem: (item: string) => void;
  removeFridgeItem: (item: string) => void;
  groceryList: string[];
  addToGrocery: (item: string) => void;
  removeFromGrocery: (item: string) => void;
  clearGrocery: () => void;
  notes: Record<string, string>;
  saveNote: (mealId: string, note: string) => void;
  getNote: (mealId: string) => string;
  activeDiet: string | null;
  setActiveDiet: (diet: string | null) => void;
};

const AppContext = createContext<ContextType | null>(null);

export function useApp(): ContextType {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be inside AppProvider");
  return ctx;
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser]               = useState<User | null>(null);
  const [authReady, setAuthReady]     = useState(false);
  const [favorites, setFavorites]     = useState<Meal[]>([]);
  const [fridgeItems, setFridgeItems] = useState<string[]>([]);
  const [groceryList, setGroceryList] = useState<string[]>([]);
  const [notes, setNotes]             = useState<Record<string, string>>({});
  const [activeDiet, setActiveDietState] = useState<string | null>(null);
  const [dataReady, setDataReady]     = useState(false);

  // Listen to Firebase auth state
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setAuthReady(true);
    });
    return unsub;
  }, []);

  // Reload data when user changes
  useEffect(() => {
    if (!authReady) return;

    setFavorites([]);
    setFridgeItems([]);
    setGroceryList([]);
    setNotes({});
    setActiveDietState(null);
    setDataReady(false);

    if (!user) {
      setDataReady(true);
      return;
    }

    const uid = user.uid;
    (async () => {
      try {
        const [f, fr, gr, n, d] = await Promise.all([
          AsyncStorage.getItem(`${uid}_favorites`),
          AsyncStorage.getItem(`${uid}_fridge`),
          AsyncStorage.getItem(`${uid}_grocery`),
          AsyncStorage.getItem(`${uid}_notes`),
          AsyncStorage.getItem(`${uid}_activeDiet`),
        ]);
        if (f)  setFavorites(JSON.parse(f));
        if (fr) setFridgeItems(JSON.parse(fr));
        if (gr) setGroceryList(JSON.parse(gr));
        if (n)  setNotes(JSON.parse(n));
        if (d)  setActiveDietState(JSON.parse(d));
      } catch (e) {
        console.warn("Failed to load user data:", e);
      } finally {
        setDataReady(true);
      }
    })();
  }, [user, authReady]);

  const persist = (key: string, value: any) => {
    if (!user) return;
    AsyncStorage.setItem(`${user.uid}_${key}`, JSON.stringify(value)).catch(console.warn);
  };

  const logout = () => signOut(auth);

  const toggleFavorite = (meal: Meal) => {
    const next = favorites.some((f) => f.idMeal === meal.idMeal)
      ? favorites.filter((f) => f.idMeal !== meal.idMeal)
      : [...favorites, meal];
    setFavorites(next);
    persist("favorites", next);
  };

  const isFavorite = (id: string) => favorites.some((f) => f.idMeal === id);

  const addFridgeItem = (item: string) => {
    const clean = item.trim().toLowerCase();
    if (!clean || fridgeItems.includes(clean)) return;
    const next = [...fridgeItems, clean];
    setFridgeItems(next);
    persist("fridge", next);
  };

  const removeFridgeItem = (item: string) => {
    const next = fridgeItems.filter((i) => i !== item);
    setFridgeItems(next);
    persist("fridge", next);
  };

  const addToGrocery = (item: string) => {
    const clean = item.trim().toLowerCase();
    if (!clean || groceryList.includes(clean)) return;
    const next = [...groceryList, clean];
    setGroceryList(next);
    persist("grocery", next);
  };

  const removeFromGrocery = (item: string) => {
    const next = groceryList.filter((i) => i !== item);
    setGroceryList(next);
    persist("grocery", next);
  };

  const clearGrocery = () => {
    setGroceryList([]);
    persist("grocery", []);
  };

  const saveNote = (mealId: string, note: string) => {
    const next = { ...notes, [mealId]: note };
    setNotes(next);
    persist("notes", next);
  };

  const getNote = (mealId: string) => notes[mealId] ?? "";

  const setActiveDiet = (diet: string | null) => {
    setActiveDietState(diet);
    persist("activeDiet", diet);
  };

  if (!authReady || !dataReady) return null;

  return (
    <AppContext.Provider value={{
      user, authReady, logout,
      favorites, toggleFavorite, isFavorite,
      fridgeItems, addFridgeItem, removeFridgeItem,
      groceryList, addToGrocery, removeFromGrocery, clearGrocery,
      notes, saveNote, getNote,
      activeDiet, setActiveDiet,
    }}>
      {children}
    </AppContext.Provider>
  );
}