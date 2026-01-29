import PostHog from "posthog-react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Initialize PostHog
// TODO: Replace with your actual PostHog API key from https://app.posthog.com
const POSTHOG_API_KEY = "phc_gNKOSkuqT42Tj4YZ4J6jOPBm7a5jWXsHuAP9VG0V19S";
const POSTHOG_HOST = "https://us.i.posthog.com"; // or 'https://eu.i.posthog.com' for EU region

let posthog: PostHog | null = null;

export const initAnalytics = async () => {
  try {
    // Check if user has consented to analytics
    const consent = await AsyncStorage.getItem("analyticsConsent");

    if (consent === "true") {
      posthog = new PostHog(POSTHOG_API_KEY, {
        host: POSTHOG_HOST,
        captureNativeAppLifecycleEvents: true,
      });

      console.log("PostHog initialized");
    } else {
      console.log("Analytics disabled - no user consent");
    }
  } catch (error) {
    console.error("Failed to initialize PostHog:", error);
  }
};

export const setAnalyticsConsent = async (consent: boolean) => {
  await AsyncStorage.setItem("analyticsConsent", consent.toString());

  if (!consent) {
    // Store when user declined (for re-prompting later)
    await AsyncStorage.setItem("analyticsDeclinedAt", new Date().toISOString());

    // Increment decline count
    const count = parseInt(
      (await AsyncStorage.getItem("analyticsDeclineCount")) || "0"
    );
    await AsyncStorage.setItem("analyticsDeclineCount", (count + 1).toString());

    // Store app opens count at decline (for session-based re-prompting)
    const stats = await getLocalStats();
    await AsyncStorage.setItem("analyticsDeclinedAtAppOpen", stats.appOpens.toString());
    await AsyncStorage.setItem("analyticsDeclinedAtDuasRead", stats.duasRead.toString());
  } else {
    // Clear decline data if they accept
    await AsyncStorage.removeItem("analyticsDeclinedAt");
    await AsyncStorage.removeItem("analyticsDeclineCount");
    await AsyncStorage.removeItem("analyticsDeclinedAtAppOpen");
    await AsyncStorage.removeItem("analyticsDeclinedAtDuasRead");
  }

  if (consent) {
    // Initialize if user consents
    await initAnalytics();
  } else {
    // Disable if user opts out
    posthog = null;
  }
};

export const getAnalyticsConsent = async (): Promise<boolean | null> => {
  const consent = await AsyncStorage.getItem("analyticsConsent");
  if (consent === null) return null; // Not asked yet
  return consent === "true";
};

export const shouldShowConsentModal = async (): Promise<boolean> => {
  const consent = await getAnalyticsConsent();

  // Never asked before - show on first launch
  if (consent === null) return true;

  // Already accepted - never show again
  if (consent === true) return false;

  // Declined - check if we should re-prompt
  const declinedAt = await AsyncStorage.getItem("analyticsDeclinedAt");
  if (!declinedAt) return true; // No decline timestamp, show modal

  // Get decline count - stop after 3 attempts
  const timesDeclined = parseInt(
    (await AsyncStorage.getItem("analyticsDeclineCount")) || "0"
  );

  if (timesDeclined >= 3) {
    // Respect user choice - stop asking after 3 declines
    return false;
  }

  // Calculate time since last decline
  const declinedDate = new Date(declinedAt);
  const daysSinceDecline = Math.floor(
    (Date.now() - declinedDate.getTime()) / (1000 * 60 * 60 * 24)
  );

  // Get current stats
  const stats = await getLocalStats();

  // Get stats at time of decline
  const declinedAtDuasRead = parseInt(
    (await AsyncStorage.getItem("analyticsDeclinedAtDuasRead")) || "0"
  );

  const duasReadSinceDecline = stats.duasRead - declinedAtDuasRead;

  // Hybrid re-prompt strategy based on decline count
  if (timesDeclined === 1) {
    // First decline: Re-ask after 3 days + user read 10 more duas
    // This means they're finding value in the app
    return daysSinceDecline >= 3 && duasReadSinceDecline >= 10;
  } else if (timesDeclined === 2) {
    // Second decline: Re-ask after 7 days + user read 30 more duas
    // They're really engaged now, might reconsider
    return daysSinceDecline >= 7 && duasReadSinceDecline >= 30;
  }

  // Fallback (shouldn't reach here due to timesDeclined >= 3 check above)
  return false;
};

// Core tracking functions
export const trackEvent = (
  eventName: string,
  properties?: Record<string, any>,
) => {
  if (!posthog) return;
  posthog.capture(eventName, properties);
};

export const trackDuaRead = (
  duaId: string,
  category: string,
  duration?: number,
) => {
  trackEvent("dua_read", {
    dua_id: duaId,
    category,
    duration_seconds: duration,
  });
};

export const trackFavoriteAdded = async (duaId: string, category: string) => {
  const stats = await getLocalStats();
  trackEvent("favorite_added", {
    dua_id: duaId,
    category,
    total_favorites: stats.favoriteCount,
  });
};

export const trackFavoriteRemoved = async (duaId: string, category: string) => {
  const stats = await getLocalStats();
  trackEvent("favorite_removed", {
    dua_id: duaId,
    category,
    total_favorites: stats.favoriteCount,
  });
};

export const trackCategoryViewed = (category: string) => {
  trackEvent("category_viewed", {
    category,
  });
};

export const trackSearchPerformed = (query: string, resultsCount: number) => {
  trackEvent("search_performed", {
    query,
    results_count: resultsCount,
  });
};

export const trackAppOpen = async () => {
  const stats = await incrementAppOpens();
  trackEvent("app_opened", {
    total_opens: stats.appOpens,
  });

  // Check for milestones
  await checkEngagementMilestones();
};

export const trackShareClicked = (duaId: string, category: string) => {
  trackEvent("share_clicked", {
    dua_id: duaId,
    category,
  });
};

// Local stats management (stored on device)
const STATS_KEY = "userStats";

interface UserStats {
  appOpens: number;
  duasRead: number;
  favoriteCount: number;
  lastOpenDate: string;
  categoriesViewed: Record<string, number>;
  emailPromptShown: boolean;
  milestonesReached: string[];
}

const getDefaultStats = (): UserStats => ({
  appOpens: 0,
  duasRead: 0,
  favoriteCount: 0,
  lastOpenDate: new Date().toISOString(),
  categoriesViewed: {},
  emailPromptShown: false,
  milestonesReached: [],
});

export const getLocalStats = async (): Promise<UserStats> => {
  try {
    const stats = await AsyncStorage.getItem(STATS_KEY);
    if (!stats) return getDefaultStats();
    return { ...getDefaultStats(), ...JSON.parse(stats) };
  } catch (error) {
    console.error("Failed to get local stats:", error);
    return getDefaultStats();
  }
};

const saveLocalStats = async (stats: UserStats) => {
  try {
    await AsyncStorage.setItem(STATS_KEY, JSON.stringify(stats));
  } catch (error) {
    console.error("Failed to save local stats:", error);
  }
};

export const incrementAppOpens = async (): Promise<UserStats> => {
  const stats = await getLocalStats();
  stats.appOpens += 1;
  stats.lastOpenDate = new Date().toISOString();
  await saveLocalStats(stats);
  return stats;
};

export const incrementDuasRead = async (): Promise<UserStats> => {
  const stats = await getLocalStats();
  stats.duasRead += 1;
  await saveLocalStats(stats);
  return stats;
};

export const incrementFavoriteCount = async (): Promise<UserStats> => {
  const stats = await getLocalStats();
  stats.favoriteCount += 1;
  await saveLocalStats(stats);
  return stats;
};

export const decrementFavoriteCount = async (): Promise<UserStats> => {
  const stats = await getLocalStats();
  stats.favoriteCount = Math.max(0, stats.favoriteCount - 1);
  await saveLocalStats(stats);
  return stats;
};

export const markEmailPromptShown = async () => {
  const stats = await getLocalStats();
  stats.emailPromptShown = true;
  await saveLocalStats(stats);
};

export const shouldShowEmailPrompt = async (): Promise<boolean> => {
  const stats = await getLocalStats();
  // Show after 10 duas read AND not shown before
  return stats.duasRead >= 10 && !stats.emailPromptShown;
};

// Milestone tracking
const checkEngagementMilestones = async () => {
  const stats = await getLocalStats();

  const milestones = [
    { name: "10_duas_read", threshold: 10, stat: stats.duasRead },
    { name: "50_duas_read", threshold: 50, stat: stats.duasRead },
    { name: "100_duas_read", threshold: 100, stat: stats.duasRead },
    { name: "5_favorites", threshold: 5, stat: stats.favoriteCount },
    { name: "20_favorites", threshold: 20, stat: stats.favoriteCount },
    { name: "7_day_streak", threshold: 7, stat: stats.appOpens },
  ];

  for (const milestone of milestones) {
    if (
      milestone.stat >= milestone.threshold &&
      !stats.milestonesReached.includes(milestone.name)
    ) {
      // Track milestone reached
      trackEvent("milestone_reached", {
        milestone: milestone.name,
        value: milestone.stat,
      });

      // Save to local stats
      stats.milestonesReached.push(milestone.name);
      await saveLocalStats(stats);
    }
  }
};

// Identify user (call this when user provides email later)
export const identifyUser = (
  email: string,
  properties?: Record<string, any>,
) => {
  if (!posthog) return;
  posthog.identify(email, properties);
};

// Reset analytics (for logout/data clearing)
export const resetAnalytics = () => {
  if (!posthog) return;
  posthog.reset();
};

// Helper: Get consent attempt number (for UI/tracking)
export const getConsentAttemptNumber = async (): Promise<number> => {
  const timesDeclined = parseInt(
    (await AsyncStorage.getItem("analyticsDeclineCount")) || "0"
  );
  return timesDeclined + 1; // Attempt 1, 2, or 3
};

// Helper: Get consent statistics (for debugging/admin view)
export const getConsentStats = async () => {
  const consent = await getAnalyticsConsent();
  const timesDeclined = parseInt(
    (await AsyncStorage.getItem("analyticsDeclineCount")) || "0"
  );
  const declinedAt = await AsyncStorage.getItem("analyticsDeclinedAt");
  const declinedAtDuasRead = parseInt(
    (await AsyncStorage.getItem("analyticsDeclinedAtDuasRead")) || "0"
  );
  const stats = await getLocalStats();

  return {
    hasConsented: consent,
    timesDeclined,
    lastDeclinedAt: declinedAt,
    duasReadAtLastDecline: declinedAtDuasRead,
    duasReadSinceDecline: stats.duasRead - declinedAtDuasRead,
    currentDuasRead: stats.duasRead,
    willShowAgain: await shouldShowConsentModal(),
  };
};
