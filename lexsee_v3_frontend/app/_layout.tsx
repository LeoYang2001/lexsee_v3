import "~/global.css";

import {
  DarkTheme,
  DefaultTheme,
  Theme,
  ThemeProvider,
} from "@react-navigation/native";
import { Redirect } from "expo-router"; // Stack will go into group layouts
import { StatusBar } from "expo-status-bar";
import { ActivityIndicator, Appearance, Platform, View } from "react-native";
import { NAV_THEME } from "~/lib/constants";
import { useColorScheme } from "~/lib/useColorScheme";
// PortalHost will move to group layouts if it's used for in-app modals etc.
// If it's a truly global portal for things that pop over everything, it *might* stay.
// For now, let's assume it's for in-app elements and moves.
// import { PortalHost } from "@rn-primitives/portal";
import { setAndroidNavigationBar } from "~/lib/android-navigation-bar";
import * as SplashScreen from "expo-splash-screen";
import { useCallback, useEffect, useLayoutEffect, useState } from "react";
import { Provider } from "react-redux";
import { store } from "~/redux/store";
import { Authenticator } from "@aws-amplify/ui-react-native";
import { Amplify } from "aws-amplify";
import outputs from "../../lexsee_v3_backend/amplify_outputs.json";

// Import useAuthListener WITHOUT useSelector directly at this top level
// It will return its own state
import useAuthListener from "~/hooks/useAuthListener"; // Make sure path is correct

Amplify.configure(outputs);

const LIGHT_THEME: Theme = {
  ...DefaultTheme,
  colors: NAV_THEME.light,
};
const DARK_THEME: Theme = {
  ...DarkTheme,
  colors: NAV_THEME.dark,
};

export { ErrorBoundary } from "expo-router";

const useIsomorphicLayoutEffect =
  Platform.OS === "web" && typeof window === "undefined"
    ? useEffect
    : useLayoutEffect;

function useSetWebBackgroundClassName() {
  useIsomorphicLayoutEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.classList.add("bg-background");
    }
  }, []);
}

function useSetAndroidNavigationBar() {
  useLayoutEffect(() => {
    setAndroidNavigationBar(Appearance.getColorScheme() ?? "light");
  }, []);
}

function noop() {}

const usePlatformSpecificSetup = Platform.select({
  web: useSetWebBackgroundClassName,
  android: useSetAndroidNavigationBar,
  default: noop,
});

SplashScreen.preventAutoHideAsync();
SplashScreen.setOptions({
  duration: 1000,
  fade: true,
});

// This is your main RootLayout component, exported as default from app/_layout.tsx
export default function RootLayout() {
  // --- Global Setup Hooks ---
  usePlatformSpecificSetup();
  const { isDarkColorScheme } = useColorScheme(); // This hook should be safe to call here if it uses Appearance API directly

  // --- App Readiness State (for Splash Screen) ---
  const [appIsReady, setAppIsReady] = useState(false);
  useEffect(() => {
    async function prepare() {
      try {
        await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate async loading
      } catch (e) {
        console.warn("App preparation error:", e);
      } finally {
        setAppIsReady(true);
        console.log("App Ready (initial assets loaded)");
      }
    }
    prepare();
  }, []);

  const onLayoutRootView = useCallback(() => {
    if (appIsReady) {
      SplashScreen.hideAsync();
      console.log("Splash Screen hidden");
    }
  }, [appIsReady]);

  // --- Authentication State (Directly from useAuthListener) ---
  // Call useAuthListener *inside* the Provider chain, but its RETURNED values
  // are what we'll use for the initial redirect.
  // We'll wrap the *entire return* in the providers.

  // --- Render Logic for Initial Loading & Redirect ---

  // 1. Show Splash Screen (or null) while app assets are loading
  if (!appIsReady) {
    console.log("RootLayout: App not ready, returning null for splash screen.");
    return null;
  }

  // 2. Render the top-level providers.
  //    The useAuthListener hook will be called *within* this provider chain.
  return (
    <Authenticator.Provider>
      <Provider store={store}>
        <ThemeProvider value={isDarkColorScheme ? DARK_THEME : LIGHT_THEME}>
          {/* Now, call useAuthListener and use its returned state */}
          <AuthGate
            onLayoutRootView={onLayoutRootView}
            isDarkColorScheme={isDarkColorScheme}
          />
          <StatusBar style={isDarkColorScheme ? "light" : "dark"} />
        </ThemeProvider>
      </Provider>
    </Authenticator.Provider>
  );
}

// This new component will live INSIDE the provider chain
function AuthGate({
  onLayoutRootView,
  isDarkColorScheme,
}: {
  onLayoutRootView: () => void;
  isDarkColorScheme: boolean;
}) {
  const { isAuthLoaded, isSignedIn } = useAuthListener(); // Now useDispatch works inside here

  console.log("AuthGate: isAuthLoaded:", isAuthLoaded);
  console.log("AuthGate: isSignedIn (from useAuthListener):", isSignedIn);

  // 1. Show an ActivityIndicator while authentication state is being determined
  if (!isAuthLoaded || isSignedIn === null) {
    // isSignedIn === null means state is still unknown
    console.log(
      "AuthGate: Auth not yet loaded or unknown, showing ActivityIndicator."
    );
    return (
      <View
        className="flex-1 items-center justify-center bg-background"
        onLayout={onLayoutRootView} // Attach onLayout here
      >
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // 2. Once everything is loaded (app assets AND auth state is determined), perform the redirect.
  console.log(
    "AuthGate: Auth loaded. Final redirect decision: isSignedIn is",
    isSignedIn
  );
  return <Redirect href={isSignedIn ? "/(home)" : "/(auth)/signIn"} />;
}
