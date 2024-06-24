// dynamic route for one lead

import React from "react";
import { View, Text, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";

const index = () => {
  const { leadId } = useLocalSearchParams();
  return (
    <View>
      <Text>Lead Details : {leadId}</Text>
    </View>
  );
};

export default index;
