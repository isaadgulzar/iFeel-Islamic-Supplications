import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { UserPreferences, DEFAULT_PREFERENCES, Language, DisplayOption } from "../types";
import { getPreferences, savePreferences, toggleFavorite as toggleFavoriteStorage } from "../lib/storage";

interface PreferencesContextType {
  preferences: UserPreferences;
  isLoading: boolean;
  setLanguage: (lang: Language) => Promise<void>;
  setDisplayOptions: (options: DisplayOption[]) => Promise<void>;
  toggleDisplayOption: (option: DisplayOption) => Promise<void>;
  toggleFavorite: (duaId: string) => Promise<boolean>;
  isFavorite: (duaId: string) => boolean;
  refreshPreferences: () => Promise<void>;
}

const PreferencesContext = createContext<PreferencesContextType | undefined>(undefined);

export function PreferencesProvider({ children }: { children: ReactNode }) {
  const [preferences, setPreferences] = useState<UserPreferences>(DEFAULT_PREFERENCES);
  const [isLoading, setIsLoading] = useState(true);

  const refreshPreferences = async () => {
    try {
      const prefs = await getPreferences();
      setPreferences(prefs);
    } catch (error) {
      console.error("Error loading preferences:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshPreferences();
  }, []);

  const setLanguage = async (lang: Language) => {
    const newPrefs = { ...preferences, language: lang };
    setPreferences(newPrefs);
    await savePreferences(newPrefs);
  };

  const setDisplayOptions = async (options: DisplayOption[]) => {
    const newPrefs = { ...preferences, displayOptions: options };
    setPreferences(newPrefs);
    await savePreferences(newPrefs);
  };

  const toggleDisplayOption = async (option: DisplayOption) => {
    const currentOptions = preferences.displayOptions;
    let newOptions: DisplayOption[];

    if (currentOptions.includes(option)) {
      newOptions = currentOptions.filter((o) => o !== option);
      if (newOptions.length === 0) {
        newOptions = ["arabic"];
      }
    } else {
      newOptions = [...currentOptions, option];
    }

    await setDisplayOptions(newOptions);
  };

  const toggleFavorite = async (duaId: string) => {
    const isFav = await toggleFavoriteStorage(duaId);
    await refreshPreferences();
    return isFav;
  };

  const isFavorite = (duaId: string) => {
    return preferences.favorites.includes(duaId);
  };

  return (
    <PreferencesContext.Provider
      value={{
        preferences,
        isLoading,
        setLanguage,
        setDisplayOptions,
        toggleDisplayOption,
        toggleFavorite,
        isFavorite,
        refreshPreferences,
      }}
    >
      {children}
    </PreferencesContext.Provider>
  );
}

export function usePreferences() {
  const context = useContext(PreferencesContext);
  if (context === undefined) {
    throw new Error("usePreferences must be used within a PreferencesProvider");
  }
  return context;
}
