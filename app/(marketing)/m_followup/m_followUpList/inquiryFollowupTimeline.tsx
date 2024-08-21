// import { View, Text } from 'react-native'
// import { SafeAreaView } from 'react-native-safe-area-context'

// const m_report = () => {
//   return (
//     <SafeAreaView className="h-full">
//       <View className='flex items-center justify-center h-full'>
//         <Text className='text-black dark:text-white'>Follow Up Report</Text>
//       </View>
//     </SafeAreaView>
//   )
// }

// export default m_report

import React from "react";
import { View, Text, ScrollView, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SalesInquiryFollowup } from "~/types/followup";
import { useQuery } from "@tanstack/react-query";
import client from "~/api/client";
import { getFollowupList } from "~/services/followup";

const inquiryFollowupTimeline = () =>
  // { followups, inquiryDetails }
  {
    const router = useRouter();

    const { data } = useLocalSearchParams<{ data: string }>();
    const parsedData: SalesInquiryFollowup = JSON.parse(data || "{}");

    const {
      data: followupdata,
      isLoading,
      isError,
      error,
    } = useQuery({
      queryKey: ["inquiryFollowupList", parsedData.SalesInquiryDetailsId],
      queryFn: () =>
        getFollowupList(parsedData.SalesInquiryDetailsId, 0, "Inquiry"),
    });

    const { top, bottom } = useSafeAreaInsets();
    return (
      <ScrollView className={`flex-1 bg-gray-100 px-4 py-6`}>
        <View className="mb-6">
          <Text className="text-2xl font-bold text-gray-800">
            {parsedData.PartyName}
          </Text>
          <Text className="text-sm text-gray-600">
            #{parsedData.DocumentNo}
          </Text>
          <Text className="text-sm text-gray-600">
            {parsedData.MachineName}
          </Text>
        </View>

        {isLoading ? (
          <View className="flex-1 justify-center items-center">
            <Text>Loading...</Text>
          </View>
        ) : isError ? (
          <View className="flex-1 justify-center items-center">
            <Text>Failed to load data</Text>
            <Text>{error.message}</Text>
          </View>
        ) : (
          <View className={`relative`}>
            <View className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-300" />
            {followupdata?.map((followup: any, index: number) => (
              <View key={index} className="mb-8 flex-row">
                <View className="absolute left-[12px] top-1 w-2 h-2 rounded-full bg-blue-500" />
                <View className="ml-10 flex-1">
                  <Text className="text-sm font-semibold text-gray-600 mb-2">
                    {new Date(followup.FollowupDateTime).toLocaleDateString(
                      "en-IN",
                      {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      }
                    )}
                  </Text>
                  <View className="bg-white rounded-lg shadow-sm p-4">
                    <Text className="text-lg font-bold text-gray-800 mb-2">
                      {followup.ModeofContact}
                    </Text>
                    <Text className="text-base text-gray-700 mb-3">
                      {followup.FollowupDetails}
                    </Text>
                    <View className="flex-row items-center mb-1">
                      <Ionicons
                        name="person-outline"
                        size={16}
                        color="#4B5563"
                      />
                      <Text className="text-sm text-gray-600 ml-2">
                        {followup.VisitTo}
                      </Text>
                    </View>
                    <View className="flex-row items-center mb-3">
                      <Ionicons name="time-outline" size={16} color="#4B5563" />
                      <Text className="text-sm text-gray-600 ml-2">
                        {new Date(followup.FollowupDateTime).toLocaleTimeString(
                          "en-IN",
                          {
                            hour: "numeric",
                            minute: "numeric",
                          }
                        )}
                      </Text>
                    </View>
                    {followup.FollowupStatus && (
                      <View className="mt-3 pt-3 border-t border-gray-200 flex flex-row gap-1">
                        <Text className="text-sm">Status:</Text>
                        <Text className="text-sm font-semibold text-gray-700">
                          {followup.FollowupStatus}
                        </Text>
                      </View>
                    )}
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}

        <View className={`pb-[${bottom}px] my-10`}>
          <Pressable
            className={`bg-blue-500 py-3 px-4 rounded-lg items-center`}
            onPress={() => {
              router.push({
                pathname:
                  "/(marketing)/m_followup/m_followUpList/newInquiryFollowup",
                params: { data },
              });
            }}
          >
            <Text className="text-white font-semibold">Add New Followup</Text>
          </Pressable>
        </View>
      </ScrollView>
    );
  };

export default inquiryFollowupTimeline;
