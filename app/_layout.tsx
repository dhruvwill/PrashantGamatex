import "~/global.css";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { Theme, ThemeProvider } from "@react-navigation/native";
import { Redirect, SplashScreen, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import * as React from "react";
import { Platform } from "react-native";
import { NAV_THEME } from "~/lib/constants";
import { useColorScheme } from "~/lib/useColorScheme";
import { PortalHost } from "~/components/primitives/portal";
import { useFonts } from "expo-font";
import { useThemeStore } from "~/store";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Toast from "react-native-toast-message";
import { GestureHandlerRootView } from "react-native-gesture-handler";

const LIGHT_THEME: Theme = {
  dark: false,
  colors: NAV_THEME.light,
};
const DARK_THEME: Theme = {
  dark: true,
  colors: NAV_THEME.dark,
};

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

// Prevent the splash screen from auto-hiding before getting the color scheme. .
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const { theme, setTheme } = useThemeStore();
  const { colorScheme, setColorScheme } = useColorScheme();
  const [fontsLoaded] = useFonts({
    acumin: require("../assets/fonts/Acumin.otf"),
    acumin_italic: require("../assets/fonts/Acumin_italic.otf"),
    acumin_bold: require("../assets/fonts/Acumin_bold.otf"),
    acumin_bolditalic: require("../assets/fonts/Acumin_bolditalic.otf"),
  });

  React.useEffect(() => {
    if (Platform.OS === "web") {
      // Adds the background color to the html element to prevent white background on overscroll.
      document.documentElement.classList.add("bg-background");
    }
    setColorScheme(theme);
    SplashScreen.hideAsync();
  }, [theme, setColorScheme]);

  if (!fontsLoaded) {
    return null;
  }

  const selectedTheme = colorScheme === "dark" ? DARK_THEME : LIGHT_THEME;
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider value={selectedTheme}>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
          {/* <Redirect href="/signin" /> */}
          <Stack initialRouteName="signin">
            <Stack.Screen
              name="signin"
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="(marketing)"
              options={{
                headerShown: false,
              }}
            />
          </Stack>
          <Toast />
          <PortalHost />
        </GestureHandlerRootView>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
