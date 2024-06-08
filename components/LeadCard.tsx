import { View, Text, Pressable } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const LeadCard = ({
  companyName,
  productList,
  timeFrame,
}: {
  companyName: string;
  productList: string[];
  timeFrame: string;
}) => {
  const router = useRouter();
  return (
    <Pressable
      className="flex-row justify-between w-full border border-gray-300 p-3 font-acumin rounded-sm"
      onPress={() => {
        router.push("m_leadList");
      }}
    >
      <View>
        <Text className="text-lg font-medium">{companyName}</Text>
        <Text className="text-md my-1">{productList.join(", ")}</Text>
        <Text className="text-sm text-gray-500">{timeFrame}</Text>
      </View>
      <View className="flex items-center justify-center">
        <Ionicons name="chevron-forward" size={20} />
      </View>
    </Pressable>
  );
};

export default LeadCard;
