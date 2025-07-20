import { router, Stack } from "expo-router";
import { Header, HeaderBackButton } from "@react-navigation/elements";

export default function LeadIdLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: "Edit Lead", headerTintColor: "white" }} />
      <Stack.Screen
        name="timeline"
        options={{
          header: ({ options }) => (
            <Header
              {...options}
              headerTintColor="white"
              title={options.title || "Lead Follow-Up Timeline"}
            />
          ),
          headerLeft: () => (
            <HeaderBackButton tintColor="white" onPress={() => router.back()} />
          ),
          headerTitleStyle: {
            fontFamily: "acumin",
          },
          headerTitleAlign: "center",
          headerStyle: {
            backgroundColor: "steelblue",
          },
        }}
      />
    </Stack>
  );
} 