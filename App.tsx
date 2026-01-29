import React, { useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import * as SplashScreen from "expo-splash-screen";
import {
  useFonts,
  Amiri_400Regular,
  Amiri_700Bold,
} from "@expo-google-fonts/amiri";
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from "@expo-google-fonts/inter";

import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./src/lib/query-client";

import RootStackNavigator from "./src/navigation/RootStackNavigator";
import { PreferencesProvider } from "./src/context/PreferencesContext";
import { SearchProvider } from "./src/context/SearchContext";
import { ViewProvider } from "./src/context/ViewContext";
import { AnalyticsConsentModal } from "./src/components/AnalyticsConsentModal";
import { ErrorBoundary } from "./src/components/ErrorBoundary";
import {
  initAnalytics,
  trackAppOpen,
  getAnalyticsConsent,
  setAnalyticsConsent,
  shouldShowConsentModal,
  getConsentAttemptNumber,
  trackEvent,
} from "./src/lib/analytics";

SplashScreen.preventAutoHideAsync();

export default function App() {
  const [showConsentModal, setShowConsentModal] = useState(false);

  const [fontsLoaded, fontError] = useFonts({
    Amiri_400Regular,
    Amiri_700Bold,
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  useEffect(() => {
    // Check if we should show the consent modal
    shouldShowConsentModal().then(async (shouldShow) => {
      if (shouldShow) {
        setShowConsentModal(true);

        // Track that modal was shown (even before consent)
        const attemptNumber = await getConsentAttemptNumber();
        // This won't track unless user previously consented
        // We'll track on accept/decline instead
      } else {
        // User already consented, initialize analytics
        initAnalytics().then(() => {
          getAnalyticsConsent().then((consent) => {
            if (consent) {
              trackAppOpen();
            }
          });
        });
      }
    });
  }, []);

  const handleConsentAccept = async () => {
    const attemptNumber = await getConsentAttemptNumber();

    await setAnalyticsConsent(true);
    setShowConsentModal(false);

    // Track consent acceptance
    trackEvent("consent_accepted", {
      attempt: attemptNumber,
      is_first_attempt: attemptNumber === 1,
    });

    await trackAppOpen();
  };

  const handleConsentDecline = async () => {
    const attemptNumber = await getConsentAttemptNumber();

    // Track decline if user previously consented (otherwise no tracking active)
    if (attemptNumber > 1) {
      trackEvent("consent_declined", {
        attempt: attemptNumber,
        times_declined: attemptNumber,
      });
    }

    await setAnalyticsConsent(false);
    setShowConsentModal(false);
  };

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <PreferencesProvider>
          <SearchProvider>
            <ViewProvider>
              <SafeAreaProvider>
                <GestureHandlerRootView style={styles.root}>
                  <NavigationContainer>
                    <RootStackNavigator />
                  </NavigationContainer>
                  <StatusBar style="light" />
                  <AnalyticsConsentModal
                    visible={showConsentModal}
                    onAccept={handleConsentAccept}
                    onDecline={handleConsentDecline}
                  />
                </GestureHandlerRootView>
              </SafeAreaProvider>
            </ViewProvider>
          </SearchProvider>
        </PreferencesProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
