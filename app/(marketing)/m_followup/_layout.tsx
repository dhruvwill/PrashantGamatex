import { View, Text } from "react-native";
import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons"; // Import the FontAwesome component from the '@expo/vector-icons' package

const _layout = () => {
  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          height: 65,
          paddingBottom: 10,
          paddingTop: 10,
          marginBottom: 5,
        },
        tabBarActiveTintColor: "#000000",
      }}
    >
      <Tabs.Screen
        name="m_newFollowUp"
        options={{
          title: "New Follow-Up",
          tabBarIcon: ({ color, focused, size }) =>
            focused ? (
              <Ionicons name="add-circle" size={size} />
            ) : (
              <Ionicons name="add-circle-outline" size={size} />
            ),
          headerShown: false,
          tabBarIconStyle: { marginBottom: 5 },
        }}
      />
      <Tabs.Screen
        name="m_followUpList"
        options={{
          title: "Follow-Up List",
          tabBarIcon: ({ color, focused, size }) =>
            focused ? (
              <Ionicons name="list" size={size} />
            ) : (
              <Ionicons name="list-outline" size={size} />
            ),
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="m_report"
        options={{
          title: "Report",
          tabBarIcon: ({ color, focused, size }) =>
            focused ? (
              <Ionicons name="document-text" size={size} />
            ) : (
              <Ionicons name="document-text-outline" size={size} />
            ),
          headerShown: false,
        }}
      />
    </Tabs>
  );
};

export default _layout;
