import { View, Text, SafeAreaView } from "react-native";
import React from "react";

const CustomHeader = () => {
  return (
    <SafeAreaView>
      <View className="h-16 bg-red-500 flex items-center pt-5">
        <Text>Custom Header</Text>
      </View>
    </SafeAreaView>
  );
};

export default CustomHeader;
