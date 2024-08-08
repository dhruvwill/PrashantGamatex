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
      }}
    >
      <Tabs.Screen
        name="m_expenseForm"
        options={{
          title: "Expense Form",
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
        name="m_expenseList"
        options={{
          title: "Expense List",
          tabBarIcon: ({ color, focused, size }) =>
            focused ? (
              <Ionicons name="document-text" size={size} />
            ) : (
              <Ionicons name="document-text-outline" size={size} />
            ),
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="m_expenseReport"
        options={{
          title: "Expense Report",
          tabBarIcon: ({ color, focused, size }) =>
            focused ? (
              <Ionicons name="document-text" size={size} />
            ) : (
              <Ionicons name="document-text-outline" size={size} />
            ),
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="m_travelReport"
        options={{
          title: "Travel Report",
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
