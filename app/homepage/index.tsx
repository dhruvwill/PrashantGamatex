import { View } from "react-native";
import React from "react";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { ThemeToggle } from "~/components/ThemeToggle";
import { SafeAreaView } from "react-native-safe-area-context";

const index = () => {
  return (
    // tabs
    <SafeAreaView className="h-full">
      <View className="flex items-center justify-center h-full">
        <Text className="text-black dark:text-white">Dashboard</Text>
      </View>
    </SafeAreaView>
  );
};

export default index;
