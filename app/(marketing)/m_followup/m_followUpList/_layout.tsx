import { View, Text } from "react-native";
import { Header } from "@react-navigation/elements";
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
        name="newInquiryFollowup"
        options={{
          headerTitle: "Inquiry Follow-Up",
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
        name="newQuotationFollowup"
        options={{
          headerTitle: "Quotation Follow-Up",
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
        name="inquiryFollowupTimeline"
        options={{
          header: ({ options }) => (
            <Header
              {...options}
              title={options.title || "Inquiry Follow-Up Timeline"}
            />
          ),
          headerTitleStyle: {
            fontFamily: "acumin",
          },
          headerBackButtonDisplayMode: "minimal",
          headerBackButtonMenuEnabled: true,
          headerTitleAlign: "center",
          headerStyle: {
            backgroundColor: "steelblue",
          },
        }}
      />
      <Stack.Screen
        name="quotationFollowupTimeline"
        options={{
          header: ({ options }) => (
            <Header
              {...options}
              title={options.title || "Quotation Follow-Up Timeline"}
            />
          ),
          headerTitleStyle: {
            fontFamily: "acumin",
          },
          headerBackButtonDisplayMode: "minimal",
          headerBackButtonMenuEnabled: true,
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
