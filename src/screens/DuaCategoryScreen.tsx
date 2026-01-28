import React, { useMemo, useRef, useEffect } from "react";
import { FlatList, View, StyleSheet, ScrollView, Animated } from "react-native";
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

  const renderItem = ({ item, index }: { item: typeof duas[0]; index: number }) => {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const translateY = useRef(new Animated.Value(20)).current;

    useEffect(() => {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 400,
          delay: index * 40,
          useNativeDriver: true,
        }),
        Animated.spring(translateY, {
          toValue: 0,
          delay: index * 40,
          useNativeDriver: true,
        }),
      ]).start();
    }, []);

    return (
      <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY }] }}>
        <DuaCard dua={item} index={index} onPress={() => handleDuaPress(item.id)} />
      </Animated.View>
    );
  };

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
        ListHeaderComponent={() => {
          const fadeAnim = useRef(new Animated.Value(0)).current;
          const translateY = useRef(new Animated.Value(20)).current;

          useEffect(() => {
            Animated.parallel([
              Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 400,
                useNativeDriver: true,
              }),
              Animated.timing(translateY, {
                toValue: 0,
                duration: 400,
                useNativeDriver: true,
              }),
            ]).start();
          }, []);

          return (
            <View style={styles.header}>
              <Animated.View style={[styles.navRow, { opacity: fadeAnim, transform: [{ translateY }] }]}>
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
          );
        }}
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
