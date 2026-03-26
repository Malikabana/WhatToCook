import AsyncStorage from "@react-native-async-storage/async-storage";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { auth } from "../services/firebase";

export type Meal = {
  idMeal: string; strMeal: string; strMealThumb: string;
  strInstructions?: string; strCategory?: string; strArea?: string;
  [key: string]: string | undefined;
};

type ContextType = {
  user: User | null; authReady: boolean; logout: () => Promise<void>;
  favorites: Meal[]; toggleFavorite: (meal: Meal) => void; isFavorite: (id: string) => boolean;
  fridgeItems: string[]; addFridgeItem: (item: string) => void; removeFridgeItem: (item: string) => void;
  groceryList: string[]; addToGrocery: (item: string) => void; removeFromGrocery: (item: string) => void; clearGrocery: () => void;
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
  const [dataReady, setDataReady]     = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => { setUser(u); setAuthReady(true); });
    return unsub;
  }, []);

  useEffect(() => {
    if (!authReady) return;
    setFavorites([]); setFridgeItems([]); setGroceryList([]); setDataReady(false);
    if (!user) { setDataReady(true); return; }
    (async () => {
      try {
        const [f, fr, gr] = await Promise.all([
          AsyncStorage.getItem("favorites"),
          AsyncStorage.getItem("fridge"),
          AsyncStorage.getItem("grocery"),
        ]);
        if (f)  setFavorites(JSON.parse(f));
        if (fr) setFridgeItems(JSON.parse(fr));
        if (gr) setGroceryList(JSON.parse(gr));
      } catch (e) { console.warn("Load error:", e); }
      finally { setDataReady(true); }
    })();
  }, [user, authReady]);

  const persist = (key: string, value: any) =>
    AsyncStorage.setItem(key, JSON.stringify(value)).catch(console.warn);

  const logout = () => signOut(auth);

  const toggleFavorite = (meal: Meal) => {
    const next = favorites.some((f) => f.idMeal === meal.idMeal)
      ? favorites.filter((f) => f.idMeal !== meal.idMeal)
      : [...favorites, meal];
    setFavorites(next); persist("favorites", next);
  };

  const isFavorite = (id: string) => favorites.some((f) => f.idMeal === id);

  const addFridgeItem = (item: string) => {
    const clean = item.trim().toLowerCase();
    if (!clean || fridgeItems.includes(clean)) return;
    const next = [...fridgeItems, clean]; setFridgeItems(next); persist("fridge", next);
  };

  const removeFridgeItem = (item: string) => {
    const next = fridgeItems.filter((i) => i !== item); setFridgeItems(next); persist("fridge", next);
  };

  const addToGrocery = (item: string) => {
    const clean = item.trim().toLowerCase();
    if (!clean || groceryList.includes(clean)) return;
    const next = [...groceryList, clean]; setGroceryList(next); persist("grocery", next);
  };

  const removeFromGrocery = (item: string) => {
    const next = groceryList.filter((i) => i !== item); setGroceryList(next); persist("grocery", next);
  };

  const clearGrocery = () => { setGroceryList([]); persist("grocery", []); };

  if (!authReady || !dataReady) return null;

  return (
    <AppContext.Provider value={{
      user, authReady, logout,
      favorites, toggleFavorite, isFavorite,
      fridgeItems, addFridgeItem, removeFridgeItem,
      groceryList, addToGrocery, removeFromGrocery, clearGrocery,
    }}>
      {children}
    </AppContext.Provider>
  );
}