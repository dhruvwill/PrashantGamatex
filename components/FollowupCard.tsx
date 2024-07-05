import { View, Text, Pressable } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const FollowupCard = ({
  partyName,
  itemName,
  docNo,
  docDate,
  quantity,
}: {
  partyName: string;
  itemName: string;
  docNo: number;
  docDate: Date;
  quantity: number;
}) => {
  const router = useRouter();
  return (
    <View className="w-full bg-white shadow-md rounded-lg overflow-hidden border">
      <View className="p-4">
        <View className="flex-row justify-between items-center mb-2">
          <Text className="text-xs text-gray-500 font-semibold">#{docNo}</Text>
          <Text className="text-xs text-gray-500">
            {docDate.toLocaleDateString("en-GB")}
          </Text>
        </View>
        <Text className="text-lg font-bold text-gray-800 mb-2">
          {partyName}
        </Text>
        <Text className="text-md text-gray-700 mb-2">{itemName}</Text>
        <View className="flex-row items-center">
          <Ionicons name="cube-outline" size={16} color="#4B5563" />
          <Text className="text-sm text-gray-600 ml-1">
            Quantity: {quantity}
          </Text>
        </View>
      </View>
      <View className="bg-gray-100 p-3 flex-row justify-between items-center">
        <Text className="text-sm text-blue-600 font-semibold">View / Edit</Text>
        <View className="flex-row">
          <Text className="text-sm text-blue-600 font-semibold">
            Followup Details
          </Text>
          <Ionicons name="chevron-forward" size={20} color="#2563EB" />
        </View>
      </View>
    </View>
  );
};

export default FollowupCard;
