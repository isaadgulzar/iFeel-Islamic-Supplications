import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import FeelingsScreen from "../screens/FeelingsScreen";
import CollectionsScreen from "../screens/CollectionsScreen";
import FavoritesScreen from "../screens/FavoritesScreen";
import ProfileScreen from "../screens/ProfileScreen";
import { FloatingTabBar } from "../components/FloatingTabBar";
import { useScreenOptions } from "../hooks/useScreenOptions";

export type MainTabParamList = {
  Feelings: undefined;
  Collections: undefined;
  Favorites: undefined;
  Settings: undefined;
};

const Tab = createBottomTabNavigator<MainTabParamList>();

export function MainTabNavigator() {
  const screenOptions = useScreenOptions({ transparent: true });

  return (
    <Tab.Navigator
      screenOptions={{
        ...screenOptions,
        headerShown: false,
      }}
      tabBar={(props) => <FloatingTabBar {...props} />}
    >
      <Tab.Screen
        name="Feelings"
        component={FeelingsScreen}
        options={{ title: "My Feelings" }}
      />
      <Tab.Screen
        name="Collections"
        component={CollectionsScreen}
        options={{ title: "Collections" }}
      />
      <Tab.Screen
        name="Favorites"
        component={FavoritesScreen}
        options={{ title: "Favorites" }}
      />
      <Tab.Screen
        name="Settings"
        component={ProfileScreen}
        options={{ title: "Settings" }}
      />
    </Tab.Navigator>
  );
}
