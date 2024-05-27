import { View } from "react-native";
import React from "react";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { ThemeToggle } from "~/components/ThemeToggle";

const index = () => {
  return (
    // tabs
    <View className="flex items-center justify-center h-full">
      <Text className="text-black dark:text-white">Dashboard</Text>
    </View>
  );
};

export default index;
