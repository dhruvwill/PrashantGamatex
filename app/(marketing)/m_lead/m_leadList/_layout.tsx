import { View, Text } from "react-native";
import React from "react";
import { Stack } from "expo-router";

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
      <Stack.Screen
        name="[leadId]"
        options={{
          headerTitle: "Lead Details",
          headerTitleStyle: {
            fontFamily: "acumin",
          },
          headerStyle: {
          },
          headerTitleAlign: "center",
        }}
      />
    </Stack>
  );
};

export default _layout;
