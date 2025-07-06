import { View, Text } from "react-native";
import React from "react";
import { router, Stack } from "expo-router";
import { Header, HeaderBackButton } from "@react-navigation/elements";

const _layout = () => {
  return (
    <Stack
      screenOptions={{
        headerTintColor: "#fff",
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen name="[leadId]" options={{
        statusBarHidden: true,
        headerBackButtonDisplayMode: 'minimal'
      }} />
      <Stack.Screen
        name="leadFollowupTimeline"
        options={{
          header: ({ options }) => (
            <Header
              {...options}
              title={options.title || "Lead Follow-Up Timeline"}
            />
          ),
          headerLeft: () => <HeaderBackButton tintColor="white" onPress={() => router.back()}/>,
          headerTitleStyle: {
            fontFamily: "acumin",
          },
          headerTitleAlign: "center",
          headerStyle: {
            backgroundColor: "steelblue",
          },
        }}
      />
      <Stack.Screen
        name="newLeadFollowup"
        options={{
          header: ({ options }) => (
            <Header
              {...options}
              title={options.title || "New Lead Follow-Up"}
              headerBackButtonDisplayMode="minimal"
            />
          ),
          headerLeft: () => <HeaderBackButton tintColor="white" onPress={() => router.back()}/>,
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
};

export default _layout;
