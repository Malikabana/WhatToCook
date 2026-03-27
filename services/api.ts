import axios from "axios"; //HTTP requests to the API
import { Meal } from "../context/AppContext";

const BASE = "https://www.themealdb.com/api/json/v1/1";

export async function searchByName(query: string): Promise<Meal[]> {
  const res = await axios
    .get<{ meals: Meal[] | null }>(`${BASE}/search.php?s=${encodeURIComponent(query)}`)
    .catch(() => null);
  return res?.data.meals ?? [];
}

export async function searchByIngredient(ingredient: string): Promise<Meal[]> {
  const res = await axios
    .get<{ meals: Meal[] | null }>(`${BASE}/filter.php?i=${encodeURIComponent(ingredient)}`)
    .catch(() => null);
  return res?.data.meals ?? [];
}

export async function searchByCategory(category: string): Promise<Meal[]> {
  const res = await axios
    .get<{ meals: Meal[] | null }>(`${BASE}/filter.php?c=${encodeURIComponent(category)}`)
    .catch(() => null);
  return res?.data.meals ?? [];
}

export async function searchByCuisine(area: string): Promise<Meal[]> {
  const res = await axios
    .get<{ meals: Meal[] | null }>(`${BASE}/filter.php?a=${encodeURIComponent(area)}`)
    .catch(() => null);
  return res?.data.meals ?? [];
}

export async function getMealById(id: string): Promise<Meal | null> {
  const res = await axios
    .get<{ meals: Meal[] | null }>(`${BASE}/lookup.php?i=${id}`)
    .catch(() => null);
  return res?.data.meals?.[0] ?? null;
}
// TheMealDB's random endpoint returns one meal at a time, so we make multiple requests in parallel to get the desired count of random meals. We also filter out any null results and ensure uniqueness by meal ID.
export async function getRandomMeals(count = 50): Promise<Meal[]> {
  const results = await Promise.all(
    Array.from({ length: count }, () =>
      axios
        .get<{ meals: Meal[] }>(`${BASE}/random.php`)
        .then((r) => r.data.meals?.[0])
        .catch(() => null)
    )
  );
  const all = results.filter((m): m is Meal => m !== null);
  return all.filter((m, i, self) => i === self.findIndex((x) => x.idMeal === m.idMeal));
}