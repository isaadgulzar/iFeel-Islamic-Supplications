import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import FeelingsScreen from "@/screens/FeelingsScreen";
import { HeaderTitle } from "@/components/HeaderTitle";
import { useScreenOptions } from "@/hooks/useScreenOptions";

export type FeelingsStackParamList = {
  Feelings: undefined;
};

const Stack = createNativeStackNavigator<FeelingsStackParamList>();

export default function FeelingsStackNavigator() {
  const screenOptions = useScreenOptions();

  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen
        name="Feelings"
        component={FeelingsScreen}
        options={{
          headerTitle: () => <HeaderTitle title="Sukoon" />,
        }}
      />
    </Stack.Navigator>
  );
}
