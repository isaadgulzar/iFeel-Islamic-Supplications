import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import CollectionsScreen from "@/screens/CollectionsScreen";
import { useScreenOptions } from "@/hooks/useScreenOptions";

export type CollectionsStackParamList = {
  Collections: undefined;
};

const Stack = createNativeStackNavigator<CollectionsStackParamList>();

export default function CollectionsStackNavigator() {
  const screenOptions = useScreenOptions();

  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen
        name="Collections"
        component={CollectionsScreen}
        options={{
          headerTitle: "Collections",
        }}
      />
    </Stack.Navigator>
  );
}
