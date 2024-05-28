import "~/global.css";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { Theme, ThemeProvider } from "@react-navigation/native";
import { SplashScreen } from "expo-router";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { StatusBar } from "expo-status-bar";
import * as React from "react";
import { Platform } from "react-native";
import { NAV_THEME } from "~/lib/constants";
import { useColorScheme } from "~/lib/useColorScheme";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Drawer } from "expo-router/drawer";
import CustomDrawerContent from "~/components/CustomDrawerContent";

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

// Prevent the splash screen from auto-hiding before getting the color scheme.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const { colorScheme, setColorScheme, isDarkColorScheme } = useColorScheme();
  const [isColorSchemeLoaded, setIsColorSchemeLoaded] = React.useState(false);

  React.useEffect(() => {
    (async () => {
      const theme = await AsyncStorage.getItem("theme");
      if (Platform.OS === "web") {
        // Adds the background color to the html element to prevent white background on overscroll.
        document.documentElement.classList.add("bg-background");
      }
      if (!theme) {
        AsyncStorage.setItem("theme", colorScheme);
        setIsColorSchemeLoaded(true);
        return;
      }
      const colorTheme = theme === "dark" ? "dark" : "light";
      if (colorTheme !== colorScheme) {
        setColorScheme(colorTheme);

        setIsColorSchemeLoaded(true);
        return;
      }
      setIsColorSchemeLoaded(true);
    })().finally(() => {
      SplashScreen.hideAsync();
    });
  }, []);

  if (!isColorSchemeLoaded) {
    return null;
  }

  return (
    <ThemeProvider value={isDarkColorScheme ? DARK_THEME : LIGHT_THEME}>
      <StatusBar style={isDarkColorScheme ? "light" : "dark"} />
      <GestureHandlerRootView style={{ flex: 1 }}>
        <Drawer initialRouteName="homepage"
          screenOptions={{ 
            drawerHideStatusBarOnOpen: true,
            drawerLabelStyle: { fontSize: 14, fontWeight: "bold", marginLeft: -10}, 
          }}
          drawerContent={CustomDrawerContent}
          >
          <Drawer.Screen
            name="homepage"
            options={{
              drawerLabel: "Homepage",
              headerTitle: "Homepage",
              // headerTitleAlign: "center",
              drawerIcon: ({ color, size }) => (
                <FontAwesome size={size} name="home" color={color} />
              ),
              // headerShown: false,
            }}
          />
          <Drawer.Screen
            name="lead"
            options={{
              drawerLabel: "Lead",
              headerTitle: "Lead",
              drawerLabelStyle:{fontSize: 14, fontWeight: "bold", marginLeft:-4 },
              // headerTitleAlign: "center",
              drawerIcon: ({ color, size }) => (
                <FontAwesome size={size} name="user" color={color} />
              ),
              // headerShown: false,
            }}
          />
          <Drawer.Screen
            name="followup"
            options={{
              drawerLabel: "Follow Up",
              headerTitle: "Follow Up",
              // headerTitleAlign: "center",
              drawerIcon: ({ color, size }) => (
                <FontAwesome size={size} name="bell" color={color} />
              ),
              // headerShown: false,
            }}
          />
        </Drawer>
      </GestureHandlerRootView>
    </ThemeProvider>
  );
}
