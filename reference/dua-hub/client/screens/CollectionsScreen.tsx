import React from "react";
import { FlatList, View, StyleSheet, Pressable, Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Feather } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import * as Haptics from "expo-haptics";
import Animated, {
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

import { ThemedText } from "@/components/ThemedText";
import { MeshGradientBackground } from "@/components/MeshGradientBackground";
import { EmptyState } from "@/components/EmptyState";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius, FeelingColors } from "@/constants/theme";
import { FEELINGS } from "@/data/feelings";
import { getDuasByCategory } from "@/data/duas";
import { RootStackParamList } from "@/navigation/RootStackNavigator";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

function CollectionRow({
  item,
  index,
  onPress,
}: {
  item: any;
  index: number;
  onPress: () => void;
}) {
  const { theme } = useTheme();
  const scale = useSharedValue(1);

  const colorKey = item.colorKey as keyof typeof FeelingColors;
  const feelingStyle = FeelingColors[colorKey] || { bg: theme.cardGlass, icon: theme.primary };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.97);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
  };

  const content = (
    <>
      <View style={[styles.iconContainer, { backgroundColor: feelingStyle.bg }]}>
        <Feather name={item.icon as any} size={20} color={feelingStyle.icon} />
      </View>
      <View style={styles.textContainer}>
        <ThemedText style={styles.name}>{item.name}</ThemedText>
        <ThemedText style={styles.count}>
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
      <Animated.View entering={FadeInUp.delay(index * 30).duration(400).springify()}>
        <AnimatedPressable
          onPress={onPress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          style={[styles.row, animatedStyle]}
          testID={`collection-row-${item.id}`}
        >
          <BlurView
            intensity={60}
            tint="dark"
            style={[styles.blurContent, { borderColor: theme.border }]}
          >
            {content}
          </BlurView>
        </AnimatedPressable>
      </Animated.View>
    );
  }

  return (
    <Animated.View entering={FadeInUp.delay(index * 30).duration(400).springify()}>
      <AnimatedPressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={[
          styles.row,
          styles.fallback,
          { backgroundColor: theme.cardSolid, borderColor: theme.border },
          animatedStyle,
        ]}
        testID={`collection-row-${item.id}`}
      >
        {content}
      </AnimatedPressable>
    </Animated.View>
  );
}

export default function CollectionsScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NavigationProp>();

  const feelingsWithDuas = FEELINGS.map((feeling) => ({
    ...feeling,
    duaCount: getDuasByCategory(feeling.id).length,
  })).filter((f) => f.duaCount > 0);

  const handlePress = (feelingId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    navigation.navigate("DuaCategory", { feelingId });
  };

  const renderItem = ({ item, index }: { item: typeof feelingsWithDuas[0]; index: number }) => (
    <CollectionRow item={item} index={index} onPress={() => handlePress(item.id)} />
  );

  return (
    <MeshGradientBackground variant="cool">
      <FlatList
        data={feelingsWithDuas}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[
          styles.list,
          {
            paddingTop: insets.top + Spacing.lg,
            paddingBottom: 120,
            flexGrow: feelingsWithDuas.length === 0 ? 1 : undefined,
          },
        ]}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <Animated.View entering={FadeInUp.duration(400)} style={styles.header}>
            <ThemedText style={styles.title}>Collections</ThemedText>
            <ThemedText style={styles.subtitle}>Browse duas by feeling</ThemedText>
          </Animated.View>
        }
        ListEmptyComponent={
          <EmptyState
            image={require("../../assets/images/empty-collections.png")}
            title="No collections yet"
            message="Categories will appear here once duas are added."
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
  row: {
    marginBottom: Spacing.sm,
    borderRadius: BorderRadius.xl,
    overflow: "hidden",
  },
  blurContent: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.lg,
    borderWidth: 1,
    borderRadius: BorderRadius.xl,
    overflow: "hidden",
  },
  fallback: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.lg,
    borderWidth: 1,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.lg,
    alignItems: "center",
    justifyContent: "center",
    marginRight: Spacing.md,
  },
  textContainer: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 2,
    color: "#FFFFFF",
  },
  count: {
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
