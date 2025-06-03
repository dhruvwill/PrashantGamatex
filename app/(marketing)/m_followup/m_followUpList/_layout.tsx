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
          headerTitle: "Inquiry Follow-Up Timeline",
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
        name="quotationFollowupTimeline"
        options={{
          headerTitle: "Quotation Follow-Up Timeline",
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
