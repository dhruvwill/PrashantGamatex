import { View, Text } from "react-native";
import { Tabs } from "expo-router";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

const _layout = () => {
  const {top,bottom} = useSafeAreaInsets();
  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          height: 65,
          paddingBottom: 10,
          paddingTop:10,
          marginBottom:5,
        },
      }}
    >
      <Tabs.Screen
        name="m_newLead"
        options={{
          title: "New Lead",
          tabBarIcon: ({ focused, size }) =>
            focused ? (
              <Ionicons name="add-circle" size={size} />
            ) : (
              <Ionicons name="add-circle-outline" size={size} />
            ),
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="m_leadList"
        options={{
          title: "Lead List",
          tabBarIcon: ({ focused, size }) =>
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
          tabBarIcon: ({ focused, size }) =>
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
