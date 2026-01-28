import React, { useMemo } from "react";
import { FlatList, View, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import Animated, { FadeInUp } from "react-native-reanimated";

import { DuaCard } from "../components/DuaCard";
import { MeshGradientBackground } from "../components/MeshGradientBackground";
import { EmptyState } from "../components/EmptyState";
import { ThemedText } from "../components/ThemedText";
import { usePreferences } from "../context/PreferencesContext";
import { Spacing } from "../constants/theme";
import { DUAS } from "../data/duas";

type NavigationProp = NativeStackNavigationProp<any>;

export default function FavoritesScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NavigationProp>();
  const { preferences } = usePreferences();

  const favoriteDuas = useMemo(() => {
    return DUAS.filter((dua) => preferences.favorites.includes(dua.id));
  }, [preferences.favorites]);

  const handleDuaPress = (duaId: string) => {
    navigation.navigate("DuaDetail", { duaId });
  };

  const renderItem = ({ item, index }: { item: typeof DUAS[0]; index: number }) => (
    <Animated.View entering={FadeInUp.delay(index * 40).duration(400).springify()}>
      <DuaCard dua={item} index={index} onPress={() => handleDuaPress(item.id)} />
    </Animated.View>
  );

  return (
    <MeshGradientBackground>
      <FlatList
        data={favoriteDuas}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[
          styles.list,
          {
            paddingTop: insets.top + Spacing.lg,
            paddingBottom: 120,
            flexGrow: favoriteDuas.length === 0 ? 1 : undefined,
          },
        ]}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <Animated.View entering={FadeInUp.duration(400)} style={styles.header}>
            <ThemedText style={styles.title}>Favorites</ThemedText>
            <ThemedText style={styles.subtitle}>Your saved duas</ThemedText>
          </Animated.View>
        }
        ListEmptyComponent={
          <EmptyState
            image={require("../../assets/icon.png")}
            title="No favorites yet"
            message="Tap the heart icon on any dua to save it here for quick access."
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
    marginBottom: Spacing.xl,
    paddingTop: Spacing.md,
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: Spacing.xs,
  },
  subtitle: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.6)",
  },
});
