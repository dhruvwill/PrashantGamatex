import { View, Text, Pressable } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const LeadCard = ({
  leadId,
  companyName,
  productList,
  timeFrame,
  docDate,
}: {
  leadId: string;
  companyName: string;
  productList: string;
  timeFrame: string;
  docDate: Date;
}) => {
  const router = useRouter();
  return (
    <Pressable
      className="w-full bg-white shadow-md rounded-lg overflow-hidden mb-4 border"
      onPress={() => {
        router.push({
          pathname: "/(marketing)/m_lead/m_leadList/[leadId]",
          params: { leadId: leadId },
        });
      }}
    >
      <View className="p-4">
        <View className="flex-row justify-between items-center mb-2">
          <Text className="text-xs text-gray-500 font-semibold">#{leadId}</Text>
          <Text className="text-xs text-gray-500">
            {docDate.toLocaleDateString("en-GB")}
          </Text>
        </View>
        <Text className="text-lg font-bold text-gray-800 mb-2">
          {companyName}
        </Text>
        <View className="flex-row items-center mb-2">
          <Ionicons name="cube-outline" size={16} color="#4B5563" />
          <Text className="text-md text-gray-700 ml-2">{productList}</Text>
        </View>
        <View className="flex-row items-center">
          <Ionicons name="time-outline" size={16} color="#4B5563" />
          <Text className="text-sm text-gray-600 ml-2">{timeFrame}</Text>
        </View>
      </View>
      <View className="bg-gray-100 p-3 flex-row justify-between items-center">
        <Text className="text-sm text-blue-600 font-semibold">View / Edit</Text>
        <View className="flex-row">
          <Text className="text-sm text-blue-600 font-semibold">
            Lead Details
          </Text>
          <Ionicons name="chevron-forward" size={20} color="#2563EB" />
        </View>
      </View>
    </Pressable>
  );
};

export default LeadCard;
