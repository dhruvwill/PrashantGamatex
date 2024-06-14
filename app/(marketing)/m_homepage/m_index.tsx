import { View } from "react-native";
import React from "react";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { ThemeToggle } from "~/components/ThemeToggle";
import { SafeAreaView } from "react-native-safe-area-context";
import { useUserStore } from "~/store";

const index = () => {
  const store = useUserStore((state) => state.user);
  return (
    // tabs
    <SafeAreaView className="h-full bg-background">
      <View className="flex items-center justify-center h-full">
        <Text className="text-foreground">Dashboard</Text>
      </View>
    </SafeAreaView>
  );
};

export default index;
