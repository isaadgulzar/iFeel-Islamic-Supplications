import React, { useMemo, useCallback, useRef, useEffect } from "react";
import { FlatList, View, StyleSheet, Image, TextInput, Platform, Pressable, Animated } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { Gesture, GestureDetector } from "react-native-gesture-handler";

import { FeelingCard } from "../components/FeelingCard";
import { MeshGradientBackground } from "../components/MeshGradientBackground";
import { EmptyState } from "../components/EmptyState";
import { ThemedText } from "../components/ThemedText";
import { useTheme } from "../hooks/useTheme";
import { useSearch } from "../context/SearchContext";
import { useView } from "../context/ViewContext";
import { Spacing, BorderRadius, FeelingColors } from "../constants/theme";
import { FEELINGS } from "../data/feelings";
import { getDuasByCategory } from "../data/duas";
import type { Feeling } from "../types";
import { trackSearchPerformed, trackCategoryViewed } from "../lib/analytics";

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
      <ThemedText style={styles.title}>How are you feeling?</ThemedText>
    </View>
  );
}

interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (text: string) => void;
  viewMode: "grid" | "list";
  onToggleView: () => void;
}

const SearchBar = React.memo(({ searchQuery, onSearchChange, viewMode, onToggleView }: SearchBarProps) => {
  const { theme } = useTheme();

  const handleClear = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onSearchChange("");
  };

  const handleToggleView = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onToggleView();
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

  const toggleButton = (
    <Pressable onPress={handleToggleView} hitSlop={8}>
      <Feather
        name={viewMode === "grid" ? "grid" : "align-justify"}
        size={18}
        color={theme.tabIconSelected}
      />
    </Pressable>
  );

  return (
    <View style={styles.searchBarWrapper}>
      <View style={styles.searchAndToggleContainer}>
        <View style={styles.searchBoxContainer}>
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
        {Platform.OS === "ios" ? (
          <BlurView intensity={40} tint="dark" style={styles.toggleButtonBlur}>
            <View style={[styles.toggleButtonInner, { backgroundColor: theme.backgroundDefault }]}>
              {toggleButton}
            </View>
          </BlurView>
        ) : (
          <View style={[styles.toggleButtonFallback, { backgroundColor: theme.tabBarBg }]}>
            {toggleButton}
          </View>
        )}
      </View>
    </View>
  );
});

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

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

interface ListItemProps {
  item: Feeling & { duaCount: number };
  index: number;
  onPress: () => void;
}

function ListItem({ item, index, onPress }: ListItemProps) {
  const { theme } = useTheme();
  const scale = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(20)).current;

  const colorKey = item.colorKey as keyof typeof FeelingColors;
  const feelingStyle = FeelingColors[colorKey] || { bg: theme.cardGlass, icon: theme.primary };

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        delay: index * 30,
        useNativeDriver: true,
      }),
      Animated.spring(translateY, {
        toValue: 0,
        delay: index * 30,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const animatedStyle = {
    transform: [{ scale }],
  };

  const handlePressIn = () => {
    Animated.spring(scale, {
      toValue: 0.97,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const content = (
    <>
      <View style={[styles.listIconContainer, { backgroundColor: feelingStyle.bg }]}>
        <Feather name={item.icon as any} size={20} color={feelingStyle.icon} />
      </View>
      <View style={styles.listTextContainer}>
        <ThemedText style={styles.listName}>{item.name}</ThemedText>
        <ThemedText style={styles.listCount}>
          {item.duaCount} {item.duaCount === 1 ? "dua" : "duas"}
        </ThemedText>
      </View>
      <View style={[styles.chevronContainer, { backgroundColor: "rgba(255,255,255,0.1)" }]}>
        <Feather name="chevron-right" size={18} color="rgba(255,255,255,0.6)" />
      </View>
    </>
  );

  if (Platform.OS === "ios") {
    return (
      <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY }] }}>
        <AnimatedPressable
          onPress={onPress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          style={[styles.listRow, animatedStyle]}
        >
          <BlurView
            intensity={60}
            tint="dark"
            style={[styles.listBlurContent, { borderColor: theme.border }]}
          >
            {content}
          </BlurView>
        </AnimatedPressable>
      </Animated.View>
    );
  }

  return (
    <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY }] }}>
      <AnimatedPressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={[
          styles.listRow,
          styles.listFallback,
          { backgroundColor: theme.cardSolid, borderColor: theme.border },
          animatedStyle,
        ]}
      >
        {content}
      </AnimatedPressable>
    </Animated.View>
  );
}

export default function FeelingsScreen() {
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const { searchQuery, setSearchQuery } = useSearch();
  const { viewMode, toggleViewMode } = useView();

  const filteredFeelings = useMemo(() => {
    if (!searchQuery.trim()) {
      return FEELINGS;
    }
    const query = searchQuery.toLowerCase();
    const results = FEELINGS.filter((feeling) =>
      feeling.name.toLowerCase().includes(query)
    );

    // Track search performed
    trackSearchPerformed(query, results.length);

    return results;
  }, [searchQuery]);

  const feelingsWithDuas = useMemo(() => {
    return filteredFeelings.map((feeling) => ({
      ...feeling,
      duaCount: getDuasByCategory(feeling.id).length,
    })).filter((f) => f.duaCount > 0);
  }, [filteredFeelings]);

  const handleFeelingPress = useCallback(
    (feelingId: string) => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      trackCategoryViewed(feelingId);
      navigation.navigate("DuaCategory", { feelingId });
    },
    [navigation]
  );

  const renderGridItem = useCallback(
    ({ item }: { item: Feeling }) => (
      <FeelingItem feeling={item} onPress={() => handleFeelingPress(item.id)} />
    ),
    [handleFeelingPress]
  );

  const renderListItem = useCallback(
    ({ item, index }: { item: typeof feelingsWithDuas[0]; index: number }) => (
      <ListItem item={item} index={index} onPress={() => handleFeelingPress(item.id)} />
    ),
    [handleFeelingPress]
  );

  const swipeGesture = Gesture.Pan()
    .onEnd((event) => {
      const SWIPE_THRESHOLD = 50;
      if (Math.abs(event.velocityX) > 500 || Math.abs(event.translationX) > SWIPE_THRESHOLD) {
        if (event.translationX > 0) {
          // Swipe right - go to previous tab (Favorites)
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          navigation.navigate("Favorites" as never);
        } else {
          // Swipe left - go to next tab (Settings)
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          navigation.navigate("Settings" as never);
        }
      }
    });

  return (
    <GestureDetector gesture={swipeGesture}>
      <MeshGradientBackground>
        <View style={styles.container}>
        <View style={[styles.headerWrapper, { paddingTop: insets.top + Spacing.lg }]}>
          <ListHeader />
          <SearchBar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            viewMode={viewMode}
            onToggleView={toggleViewMode}
          />
        </View>
        {viewMode === "grid" ? (
          <FlatList
            key="grid-view"
            data={filteredFeelings}
            renderItem={renderGridItem}
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
        ) : (
          <FlatList
            key="list-view"
            data={feelingsWithDuas}
            renderItem={renderListItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={[
              styles.listViewContainer,
              {
                paddingTop: 0,
                paddingBottom: 120,
                flexGrow: feelingsWithDuas.length === 0 ? 1 : undefined,
              },
            ]}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <EmptyState
                image={require("../../assets/icon.png")}
                title="Connecting you to peace..."
                message="Finding the right duas for your heart."
              />
            }
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="on-drag"
          />
        )}
        </View>
      </MeshGradientBackground>
    </GestureDetector>
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
    paddingBottom: 0,
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
    marginTop: Spacing.md,
    marginBottom: Spacing.lg,
  },
  searchAndToggleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  searchBoxContainer: {
    flex: 1,
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
  toggleButtonBlur: {
    borderRadius: BorderRadius.full,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.12)",
    width: 44,
    height: 44,
  },
  toggleButtonInner: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  toggleButtonFallback: {
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  listViewContainer: {
    paddingHorizontal: Spacing.lg,
  },
  listRow: {
    marginBottom: Spacing.sm,
    borderRadius: BorderRadius.xl,
    overflow: "hidden",
  },
  listBlurContent: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.lg,
    borderWidth: 1,
    borderRadius: BorderRadius.xl,
    overflow: "hidden",
  },
  listFallback: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.lg,
    borderWidth: 1,
  },
  listIconContainer: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.lg,
    alignItems: "center",
    justifyContent: "center",
    marginRight: Spacing.md,
  },
  listTextContainer: {
    flex: 1,
  },
  listName: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 2,
    color: "#FFFFFF",
  },
  listCount: {
    fontSize: 13,
    color: "rgba(255, 255, 255, 0.5)",
  },
  chevronContainer: {
    width: 32,
    height: 32,
    borderRadius: BorderRadius.full,
    alignItems: "center",
    justifyContent: "center",
  },
});
