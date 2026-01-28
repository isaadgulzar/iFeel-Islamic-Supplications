import React from "react";
import { FlatList, View, StyleSheet, Image } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import Animated, { FadeInDown } from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";

import { FeelingCard } from "../components/FeelingCard";
import { MeshGradientBackground } from "../components/MeshGradientBackground";
import { EmptyState } from "../components/EmptyState";
import { ThemedText } from "../components/ThemedText";
import { useTheme } from "../hooks/useTheme";
import { Spacing, BorderRadius } from "../constants/theme";
import { FEELINGS } from "../data/feelings";

type NavigationProp = NativeStackNavigationProp<any>;

export default function FeelingsScreen() {
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const navigation = useNavigation<NavigationProp>();

  const handleFeelingPress = (feelingId: string) => {
    navigation.navigate("DuaCategory", { feelingId });
  };

  const renderItem = ({ item, index }: { item: typeof FEELINGS[0]; index: number }) => (
    <Animated.View
      entering={FadeInDown.delay(index * 20).duration(400).springify()}
      style={styles.cardWrapper}
    >
      <FeelingCard feeling={item} onPress={() => handleFeelingPress(item.id)} />
    </Animated.View>
  );

  return (
    <MeshGradientBackground>
      <FlatList
        data={FEELINGS}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        numColumns={3}
        contentContainerStyle={[
          styles.list,
          {
            paddingTop: insets.top + Spacing.lg,
            paddingBottom: 120,
          },
        ]}
        columnWrapperStyle={styles.row}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <Animated.View entering={FadeInDown.duration(500)} style={styles.header}>
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
              <View>
                <ThemedText style={styles.appName}>iFeel</ThemedText>
                <ThemedText style={styles.appSubtitle}>Islamic Supplications</ThemedText>
              </View>
            </View>
            <ThemedText style={styles.tagline}>Healing Supplications for Every Mood</ThemedText>
            <ThemedText style={styles.title}>How are you{"\n"}feeling today?</ThemedText>
          </Animated.View>
        }
        ListEmptyComponent={
          <EmptyState
            image={require("../../assets/icon.png")}
            title="Connecting you to peace..."
            message="Finding the right duas for your heart."
          />
        }
      />
    </MeshGradientBackground>
  );
}

const styles = StyleSheet.create({
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
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.xl,
    paddingTop: Spacing.md,
  },
  brandRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing.lg,
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
  appName: {
    fontSize: 24,
    fontWeight: "700",
    color: "#FFFFFF",
    letterSpacing: -0.5,
  },
  appSubtitle: {
    fontSize: 12,
    fontWeight: "500",
    color: "rgba(255, 255, 255, 0.7)",
    marginTop: 2,
  },
  tagline: {
    fontSize: 14,
    fontWeight: "500",
    color: "rgba(168, 85, 247, 0.9)",
    marginBottom: Spacing.lg,
    fontStyle: "italic",
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    color: "#FFFFFF",
    lineHeight: 40,
  },
});
