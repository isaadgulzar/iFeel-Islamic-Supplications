import AsyncStorage from "@react-native-async-storage/async-storage";
import { UserPreferences, DEFAULT_PREFERENCES } from "../types";
import {
  trackFavoriteAdded,
  trackFavoriteRemoved,
  incrementFavoriteCount,
  decrementFavoriteCount,
} from "./analytics";
import { getDuaById } from "../data/duas";

const PREFERENCES_KEY = "@sukoon_preferences";

export async function getPreferences(): Promise<UserPreferences> {
  try {
    const stored = await AsyncStorage.getItem(PREFERENCES_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return { ...DEFAULT_PREFERENCES, ...parsed };
    }
    return DEFAULT_PREFERENCES;
  } catch (error) {
    console.error("Error reading preferences:", error);
    return DEFAULT_PREFERENCES;
  }
}

export async function savePreferences(preferences: UserPreferences): Promise<void> {
  try {
    await AsyncStorage.setItem(PREFERENCES_KEY, JSON.stringify(preferences));
  } catch (error) {
    console.error("Error saving preferences:", error);
    throw error;
  }
}

export async function updatePreference<K extends keyof UserPreferences>(
  key: K,
  value: UserPreferences[K]
): Promise<void> {
  const current = await getPreferences();
  await savePreferences({ ...current, [key]: value });
}

export async function toggleFavorite(duaId: string): Promise<boolean> {
  const prefs = await getPreferences();
  const isFavorite = prefs.favorites.includes(duaId);
  const dua = getDuaById(duaId);

  if (isFavorite) {
    prefs.favorites = prefs.favorites.filter((id) => id !== duaId);
    await decrementFavoriteCount();
    if (dua) {
      await trackFavoriteRemoved(duaId, dua.category);
    }
  } else {
    prefs.favorites = [...prefs.favorites, duaId];
    await incrementFavoriteCount();
    if (dua) {
      await trackFavoriteAdded(duaId, dua.category);
    }
  }

  await savePreferences(prefs);
  return !isFavorite;
}

export async function isFavorite(duaId: string): Promise<boolean> {
  const prefs = await getPreferences();
  return prefs.favorites.includes(duaId);
}
