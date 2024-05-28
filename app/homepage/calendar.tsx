import { View, Text } from "react-native";
import React from "react";
import { Link } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

const calendar = () => {
  return (
    <SafeAreaView className="h-full">
      <View className="flex items-center justify-center h-full">
        <Text className="text-black dark:text-white">Calendar</Text>
      </View>
    </SafeAreaView>
  );
};

export default calendar;
