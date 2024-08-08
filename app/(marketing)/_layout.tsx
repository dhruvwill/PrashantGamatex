import "~/global.css";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { Link, SplashScreen, useNavigation } from "expo-router";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { Theme, ThemeProvider } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import * as React from "react";
import { Platform, View, Image } from "react-native";
import { NAV_THEME } from "~/lib/constants";
import { useColorScheme } from "~/lib/useColorScheme";
import { PortalHost } from "~/components/primitives/portal";
import { ThemeToggle } from "~/components/ThemeToggle";
import CustomDrawerContent from "~/components/CustomDrawerContent";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Drawer } from "expo-router/drawer";
import MenuIcon from "~/components/MenuIcon";
import Logo from "~/components/Logo";
import CustomHeader from "~/components/CustomHeader";
import { useAuth } from "~/hooks/auth";

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

  const { isAuthenticated } = useAuth();

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
      // const colorTheme = theme === "dark" ? "dark" : "light";
      // if (colorTheme !== colorScheme) {
      //   setColorScheme(colorTheme);

      //   setIsColorSchemeLoaded(true);
      //   return;
      // }
      setColorScheme("light");
      setIsColorSchemeLoaded(true);
    })().finally(() => {
      SplashScreen.hideAsync();
    });
  }, []);

  if (!isColorSchemeLoaded) {
    return null;
  }

  if (!isAuthenticated) {
    return (
      <ThemeProvider value={isDarkColorScheme ? DARK_THEME : LIGHT_THEME}>
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Image
            source={require("~/assets/images/logo.png")}
            style={{ width: 200, height: 200 }}
          />
          <Link href="signin" style={{ marginTop: 20 }}>
            <FontAwesome name="sign-in" size={30} color="steelblue" />
          </Link>
        </View>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider value={isDarkColorScheme ? DARK_THEME : LIGHT_THEME}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <Drawer
          screenOptions={{
            drawerLabelStyle: {
              fontSize: 14,
              fontWeight: "bold",
              marginLeft: -10,
            },
            drawerActiveTintColor: "steelblue",
            swipeEdgeWidth: 100,
          }}
          initialRouteName="m_homepage"
          drawerContent={CustomDrawerContent}
        >
          <Drawer.Screen
            name="m_homepage"
            options={{
              drawerLabel: "Homepage",
              headerStyle: {
                borderWidth: 1,
                borderColor: "#f0f0f0",
                borderBottomLeftRadius: 10,
                borderBottomRightRadius: 10,
              },
              headerTitle: () => <Logo />,
              headerTitleAlign: "center",
              headerTitleContainerStyle: {
                height: "auto",
              },
              drawerIcon: ({ focused, color, size }) =>
                focused ? (
                  <Ionicons name="home" size={size} />
                ) : (
                  <Ionicons name="home-outline" size={size} />
                ),
            }}
          />
          <Drawer.Screen
            name="m_lead"
            options={{
              drawerLabel: "Lead",
              headerStyle: {
                borderWidth: 1,
                borderColor: "#f0f0f0",
                borderBottomLeftRadius: 10,
                borderBottomRightRadius: 10,
              },
              headerTitle: () => <Logo />,
              headerTitleAlign: "center",
              headerTitleContainerStyle: {
                height: "auto",
              },
              drawerIcon: ({ focused, color, size }) =>
                focused ? (
                  <Ionicons name="person" size={size} />
                ) : (
                  <Ionicons name="person-outline" size={size} />
                ),
            }}
          />
          <Drawer.Screen
            name="m_followup"
            options={{
              drawerLabel: "Follow Up",
              headerStyle: {
                borderWidth: 1,
                borderColor: "#f0f0f0",
                borderBottomLeftRadius: 10,
                borderBottomRightRadius: 10,
              },
              headerTitle: () => <Logo />,
              headerTitleAlign: "center",
              headerTitleContainerStyle: {
                height: "auto",
              },
              drawerIcon: ({ focused, color, size }) =>
                focused ? (
                  <Ionicons name="notifications" size={size} />
                ) : (
                  <Ionicons name="notifications-outline" size={size} />
                ),
            }}
          />
          <Drawer.Screen
            name="m_expense"
            options={{
              drawerLabel: "Expense & Travel",
              headerStyle: {
                borderWidth: 1,
                borderColor: "#f0f0f0",
                borderBottomLeftRadius: 10,
                borderBottomRightRadius: 10,
              },
              headerTitle: () => <Logo />,
              headerTitleAlign: "center",
              headerTitleContainerStyle: {
                height: "auto",
              },
              drawerIcon: ({ focused, color, size }) =>
                focused ? (
                  <Ionicons name="wallet" size={size} />
                ) : (
                  <Ionicons name="wallet-outline" size={size} />
                ),
            }}
          />
          <Drawer.Screen
            name="about"
            options={{
              drawerLabel: "About",
              headerStyle: {
                borderWidth: 1,
                borderColor: "#f0f0f0",
                borderBottomLeftRadius: 10,
                borderBottomRightRadius: 10,
              },
              headerTitle: () => <Logo />,
              headerTitleAlign: "center",
              headerTitleContainerStyle: {
                height: "auto",
              },
              drawerIcon: ({ focused, color, size }) =>
                focused ? (
                  <Ionicons name="information-circle" size={size} />
                ) : (
                  <Ionicons name="information-circle-outline" size={size} />
                ),
            }}
          />
          <Drawer.Screen
            name="VisualizeAsync"
            options={{
              drawerLabel: "Async",
              headerStyle: {
                borderWidth: 1,
                borderColor: "#f0f0f0",
                borderBottomLeftRadius: 10,
                borderBottomRightRadius: 10,
              },
              headerTitle: () => <Logo />,
              headerTitleAlign: "center",
              headerTitleContainerStyle: {
                height: "auto",
              },
              drawerIcon: ({ focused, color, size }) =>
                focused ? (
                  <Ionicons name="notifications" size={size} />
                ) : (
                  <Ionicons name="notifications-outline" size={size} />
                ),
            }}
          />
        </Drawer>
      </GestureHandlerRootView>
      <PortalHost />
    </ThemeProvider>
  );
}
