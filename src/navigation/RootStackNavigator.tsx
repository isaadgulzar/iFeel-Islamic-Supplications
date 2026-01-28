import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { MainTabNavigator } from "./MainTabNavigator";
import DuaCategoryScreen from "../screens/DuaCategoryScreen";
import DuaDetailScreen from "../screens/DuaDetailScreen";
import { useScreenOptions } from "../hooks/useScreenOptions";

export type RootStackParamList = {
  Main: undefined;
  DuaCategory: { feelingId: string };
  DuaDetail: { duaId: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootStackNavigator() {
  const screenOptions = useScreenOptions();

  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen
        name="Main"
        component={MainTabNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="DuaCategory"
        component={DuaCategoryScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="DuaDetail"
        component={DuaDetailScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
