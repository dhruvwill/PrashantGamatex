import "~/global.css";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { Link, SplashScreen, useNavigation } from "expo-router";
import { FontAwesome, Ionicons, MaterialIcons } from "@expo/vector-icons";
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
import Logo from "~/components/Logo";
import { useAuth } from "~/hooks/auth";

const LIGHT_THEME: Theme = {
  dark: false,
  colors: NAV_THEME.light,
  fonts: {
    regular: { fontFamily: "acumin", fontWeight: "400" },
    medium: { fontFamily: "acumin", fontWeight: "400" },
    bold: { fontFamily: "acumin_bold", fontWeight: "700" },
    heavy: { fontFamily: "acumin_bold", fontWeight: "900" },
  },
};
const DARK_THEME: Theme = {
  dark: true,
  colors: NAV_THEME.dark,
  fonts: {
    regular: { fontFamily: "acumin", fontWeight: "400" },
    medium: { fontFamily: "acumin", fontWeight: "400" },
    bold: { fontFamily: "acumin_bold", fontWeight: "700" },
    heavy: { fontFamily: "acumin_bold", fontWeight: "900" },
  },
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
          <Link href="/signin" style={{ marginTop: 20 }}>
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
            drawerHideStatusBarOnOpen: true,
            swipeEdgeWidth: 100,
          }}
          initialRouteName="m_homepage"
          drawerContent={CustomDrawerContent}
        >
          <Drawer.Screen
            name="m_homepage"
            options={{
              drawerLabel: "Homepage",
              drawerItemStyle: {
                borderRadius: 5
              },
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
                  <Ionicons color={color} name="home" size={size} className="pr-2" />
                ) : (
                  <Ionicons color={color} name="home-outline" size={size} className="pr-2" />
                ),
            }}
          />
          <Drawer.Screen
            name="m_lead"
            options={{
              drawerItemStyle: {
                borderRadius: 5
              },
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
                  <Ionicons color={color} name="person" size={size} className="pr-2" />
                ) : (
                  <Ionicons color={color} name="person-outline" size={size} className="pr-2" />
                ),
            }}
          />
          <Drawer.Screen
            name="m_followup"
            options={{
              drawerItemStyle: {
                borderRadius: 5
              },
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
                  <Ionicons color={color} name="notifications" size={size} className="pr-2" />
                ) : (
                  <Ionicons color={color} name="notifications-outline" size={size} className="pr-2" />
                ),
            }}
          />
          <Drawer.Screen
            name="m_expense"
            options={{
              drawerItemStyle: {
                borderRadius: 5
              },
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
                  <Ionicons color={color} name="wallet" size={size} className="pr-2" />
                ) : (
                  <Ionicons color={color} name="wallet-outline" size={size} className="pr-2" />
                ),
            }}
          />
          <Drawer.Screen
            name="changepassword"
            options={{
              drawerItemStyle: {
                borderRadius: 5
              },
              drawerLabel: "Change Password",
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
                  <MaterialIcons color={color} name="password" size={size} className="pr-2" />
                ) : (
                  <MaterialIcons color={color} name="password" size={size} className="pr-2" />
                ),
            }}
          />
          <Drawer.Screen
            name="about"
            options={{
              drawerItemStyle: {
                borderRadius: 5
              },
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
                  <Ionicons color={color} name="information-circle" size={size} className="pr-2" />
                ) : (
                  <Ionicons color={color} name="information-circle-outline" size={size} className="pr-2" />
                ),
            }}
          />
          {/* <Drawer.Screen
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
                  <Ionicons name="notifications" size={size} className="pr-2" />
                ) : (
                  <Ionicons name="notifications-outline" size={size} className="pr-2" />
                ),
            }}
          /> */}
        </Drawer>
      </GestureHandlerRootView>
      <PortalHost />
    </ThemeProvider>
  );
}
