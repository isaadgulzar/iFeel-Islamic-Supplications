import React, { useMemo, useCallback } from "react";
import { FlatList, View, StyleSheet, Image, TextInput, Platform, Pressable } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";

import { FeelingCard } from "../components/FeelingCard";
import { MeshGradientBackground } from "../components/MeshGradientBackground";
import { EmptyState } from "../components/EmptyState";
import { ThemedText } from "../components/ThemedText";
import { useTheme } from "../hooks/useTheme";
import { useSearch } from "../context/SearchContext";
import { Spacing, BorderRadius } from "../constants/theme";
import { FEELINGS } from "../data/feelings";
import type { Feeling } from "../types";

type NavigationProp = NativeStackNavigationProp<any>;

function ListHeader() {
  return (
    <View style={styles.header}>
      <View style={styles.brandRow}>
        <LinearGradient
          colors={["#A855F7", "#7C3AED"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.iconGradient}
        >
          <Image
            source={require("../../assets/icon.png")}
            style={styles.icon}
            resizeMode="contain"
          />
        </LinearGradient>
        <View style={styles.appTextContainer}>
          <ThemedText style={styles.appName}>iFeel: Duas for Every Feeling</ThemedText>
          <ThemedText style={styles.appSubtitle}>Authentic Islamic supplications for every emotion</ThemedText>
        </View>
      </View>
      <ThemedText style={styles.title}>How are you feeling today?</ThemedText>
    </View>
  );
}

interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (text: string) => void;
}

const SearchBar = React.memo(({ searchQuery, onSearchChange }: SearchBarProps) => {
  const { theme } = useTheme();

  const handleClear = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onSearchChange("");
  };

  const searchContent = (
    <View style={styles.searchContent}>
      <Feather name="search" size={18} color={theme.tabIconDefault} />
      <TextInput
        value={searchQuery}
        onChangeText={onSearchChange}
        placeholder="Type to search..."
        placeholderTextColor="rgba(255, 255, 255, 0.4)"
        style={[styles.searchInput, { color: theme.text }]}
        autoCapitalize="none"
        autoCorrect={false}
        returnKeyType="search"
        blurOnSubmit={false}
      />
      {searchQuery.length > 0 && (
        <Pressable onPress={handleClear} hitSlop={8}>
          <Feather name="x" size={18} color={theme.tabIconDefault} />
        </Pressable>
      )}
    </View>
  );

  return (
    <View style={styles.searchBarWrapper}>
      {Platform.OS === "ios" ? (
        <BlurView intensity={40} tint="dark" style={styles.searchBarBlur}>
          <View style={[styles.searchBarInner, { backgroundColor: theme.backgroundDefault }]}>
            {searchContent}
          </View>
        </BlurView>
      ) : (
        <View style={[styles.searchBarFallback, { backgroundColor: theme.tabBarBg }]}>
          {searchContent}
        </View>
      )}
    </View>
  );
});

interface FeelingItemProps {
  feeling: Feeling;
  onPress: () => void;
}

function FeelingItem({ feeling, onPress }: FeelingItemProps) {
  return (
    <View style={styles.cardWrapper}>
      <FeelingCard feeling={feeling} onPress={onPress} />
    </View>
  );
}

export default function FeelingsScreen() {
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const { searchQuery, setSearchQuery } = useSearch();

  const filteredFeelings = useMemo(() => {
    if (!searchQuery.trim()) {
      return FEELINGS;
    }
    const query = searchQuery.toLowerCase();
    return FEELINGS.filter((feeling) =>
      feeling.name.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  const handleFeelingPress = useCallback(
    (feelingId: string) => {
      navigation.navigate("DuaCategory", { feelingId });
    },
    [navigation]
  );

  const renderItem = useCallback(
    ({ item }: { item: Feeling }) => (
      <FeelingItem feeling={item} onPress={() => handleFeelingPress(item.id)} />
    ),
    [handleFeelingPress]
  );

  return (
    <MeshGradientBackground>
      <View style={styles.container}>
        <View style={[styles.headerWrapper, { paddingTop: insets.top + Spacing.lg }]}>
          <ListHeader />
          <SearchBar searchQuery={searchQuery} onSearchChange={setSearchQuery} />
        </View>
        <FlatList
          data={filteredFeelings}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          numColumns={3}
          contentContainerStyle={[
            styles.list,
            {
              paddingBottom: 120,
            },
          ]}
          columnWrapperStyle={styles.row}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <EmptyState
              image={require("../../assets/icon.png")}
              title="Connecting you to peace..."
              message="Finding the right duas for your heart."
            />
          }
          keyboardShouldPersistTaps="handled"
          removeClippedSubviews={false}
          keyboardDismissMode="on-drag"
        />
      </View>
    </MeshGradientBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerWrapper: {
    paddingHorizontal: Spacing.lg,
  },
  list: {
    paddingHorizontal: Spacing.sm,
  },
  row: {
    justifyContent: "flex-start",
  },
  cardWrapper: {
    width: "33.33%",
  },
  header: {
    paddingBottom: Spacing.md,
  },
  brandRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing.xl,
  },
  iconGradient: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.md,
    padding: 3,
    marginRight: Spacing.md,
  },
  icon: {
    width: "100%",
    height: "100%",
    borderRadius: BorderRadius.md - 3,
  },
  appTextContainer: {
    flex: 1,
  },
  appName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FFFFFF",
    letterSpacing: -0.3,
    marginBottom: 2,
  },
  appSubtitle: {
    fontSize: 11,
    fontWeight: "500",
    color: "#14B8A6",
    fontStyle: "italic",
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    color: "#FFFFFF",
    lineHeight: 40,
  },
  searchBarWrapper: {
    marginTop: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  searchBarBlur: {
    borderRadius: BorderRadius.xl,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.12)",
  },
  searchBarInner: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
  },
  searchBarFallback: {
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
  },
  searchContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    paddingVertical: Spacing.xs,
  },
});
