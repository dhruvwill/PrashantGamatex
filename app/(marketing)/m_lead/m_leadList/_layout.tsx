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
      <Stack.Screen name="[leadId]" options={{
        statusBarHidden: true,
        headerBackButtonDisplayMode: 'minimal'
      }} />
    </Stack>
  );
};

export default _layout;
