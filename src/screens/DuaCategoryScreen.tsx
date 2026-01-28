import React, { useMemo } from "react";
import { FlatList, View, StyleSheet, ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { DuaCard } from "../components/DuaCard";
import { DisplayOptionChip } from "../components/DisplayOptionChip";
import { MeshGradientBackground } from "../components/MeshGradientBackground";
import { GlassBackButton } from "../components/GlassBackButton";
import { EmptyState } from "../components/EmptyState";
import { ThemedText } from "../components/ThemedText";
import { usePreferences } from "../context/PreferencesContext";
import { Spacing } from "../constants/theme";
import { getDuasByCategory } from "../data/duas";
import { FEELINGS } from "../data/feelings";
import { DisplayOption } from "../types";

type ScreenRouteProp = RouteProp<{ DuaCategory: { feelingId: string } }, "DuaCategory">;
type NavigationProp = NativeStackNavigationProp<any>;

const DISPLAY_OPTIONS: { key: DisplayOption; label: string }[] = [
  { key: "arabic", label: "Arabic" },
  { key: "transliteration", label: "Transliteration" },
  { key: "translation", label: "Translation" },
];

interface ListHeaderProps {
  feelingName: string;
  onBack: () => void;
  displayOptions: DisplayOption[];
  onToggleDisplayOption: (option: DisplayOption) => void;
}

function ListHeader({ feelingName, onBack, displayOptions, onToggleDisplayOption }: ListHeaderProps) {
  return (
    <View style={styles.header}>
      <View style={styles.navRow}>
        <GlassBackButton onPress={onBack} />
        <View style={styles.titleContainer}>
          <ThemedText style={styles.subtitle}>I am feeling</ThemedText>
          <ThemedText style={styles.title}>{feelingName}</ThemedText>
        </View>
      </View>
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
            isActive={displayOptions.includes(option.key)}
            onToggle={() => onToggleDisplayOption(option.key)}
          />
        ))}
      </ScrollView>
    </View>
  );
}

interface DuaItemProps {
  dua: ReturnType<typeof getDuasByCategory>[0];
  index: number;
  onPress: () => void;
}

function DuaItem({ dua, index, onPress }: DuaItemProps) {
  return <DuaCard dua={dua} index={index} onPress={onPress} />;
}

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
    <DuaItem dua={item} index={index} onPress={() => handleDuaPress(item.id)} />
  );

  const renderHeader = () => (
    <ListHeader
      feelingName={feeling?.name || "..."}
      onBack={handleBack}
      displayOptions={preferences.displayOptions}
      onToggleDisplayOption={toggleDisplayOption}
    />
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
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={
          <EmptyState
            image={require("../../assets/icon.png")}
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
