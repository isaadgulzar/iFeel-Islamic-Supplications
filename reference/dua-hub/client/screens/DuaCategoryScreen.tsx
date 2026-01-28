import React, { useMemo } from "react";
import { FlatList, View, StyleSheet, ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import Animated, { FadeInUp, FadeInDown } from "react-native-reanimated";

import { DuaCard } from "@/components/DuaCard";
import { DisplayOptionChip } from "@/components/DisplayOptionChip";
import { MeshGradientBackground } from "@/components/MeshGradientBackground";
import { GlassBackButton } from "@/components/GlassBackButton";
import { EmptyState } from "@/components/EmptyState";
import { ThemedText } from "@/components/ThemedText";
import { usePreferences } from "@/context/PreferencesContext";
import { Spacing } from "@/constants/theme";
import { getDuasByCategory } from "@/data/duas";
import { FEELINGS } from "@/data/feelings";
import { RootStackParamList } from "@/navigation/RootStackNavigator";
import { DisplayOption } from "@/types";

type ScreenRouteProp = RouteProp<RootStackParamList, "DuaCategory">;
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const DISPLAY_OPTIONS: { key: DisplayOption; label: string }[] = [
  { key: "arabic", label: "Arabic" },
  { key: "transliteration", label: "Transliteration" },
  { key: "translation", label: "Translation" },
];

export default function DuaCategoryScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<ScreenRouteProp>();
  const { preferences, toggleDisplayOption } = usePreferences();

  const { feelingId } = route.params;
  const feeling = FEELINGS.find((f) => f.id === feelingId);
  const duas = useMemo(() => getDuasByCategory(feelingId), [feelingId]);

  const handleDuaPress = (duaId: string) => {
    navigation.navigate("DuaDetail", { duaId });
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const renderItem = ({ item, index }: { item: typeof duas[0]; index: number }) => (
    <Animated.View entering={FadeInUp.delay(index * 40).duration(400).springify()}>
      <DuaCard dua={item} index={index} onPress={() => handleDuaPress(item.id)} />
    </Animated.View>
  );

  return (
    <MeshGradientBackground>
      <FlatList
        data={duas}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[
          styles.list,
          {
            paddingTop: insets.top + Spacing.lg,
            paddingBottom: insets.bottom + Spacing["3xl"],
            flexGrow: duas.length === 0 ? 1 : undefined,
          },
        ]}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View style={styles.header}>
            <Animated.View entering={FadeInDown.duration(400)} style={styles.navRow}>
              <GlassBackButton onPress={handleBack} />
              <View style={styles.titleContainer}>
                <ThemedText style={styles.subtitle}>I am feeling</ThemedText>
                <ThemedText style={styles.title}>{feeling?.name || "..."}</ThemedText>
              </View>
            </Animated.View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.chipsContainer}
            >
              {DISPLAY_OPTIONS.map((option) => (
                <DisplayOptionChip
                  key={option.key}
                  option={option.key}
                  label={option.label}
                  isActive={preferences.displayOptions.includes(option.key)}
                  onToggle={() => toggleDisplayOption(option.key)}
                />
              ))}
            </ScrollView>
          </View>
        }
        ListEmptyComponent={
          <EmptyState
            image={require("../../assets/images/empty-feelings.png")}
            title="No duas yet"
            message={`Duas for "${feeling?.name || "this feeling"}" are coming soon.`}
          />
        }
      />
    </MeshGradientBackground>
  );
}

const styles = StyleSheet.create({
  list: {
    paddingHorizontal: Spacing.lg,
  },
  header: {
    marginBottom: Spacing.lg,
  },
  navRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing.xl,
  },
  titleContainer: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  subtitle: {
    fontSize: 13,
    color: "rgba(255, 255, 255, 0.6)",
    marginBottom: 2,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  chipsContainer: {
    flexDirection: "row",
    paddingVertical: Spacing.sm,
  },
});
