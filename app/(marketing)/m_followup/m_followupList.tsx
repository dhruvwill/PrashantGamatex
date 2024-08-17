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

const FollowupTimelineScreen = () =>
  // { followups, inquiryDetails }
  {
    const followups = [
      {
        date: "May 15, 2024",
        type: "Phone Call",
        description: "Discussed product specifications and pricing.",
        agent: "John Doe",
        time: "10:30 AM",
        nextAction: "Send detailed product catalog via email",
      },
      {
        date: "May 15, 2024",
        type: "Phone Call",
        description: "Discussed product specifications and pricing.",
        agent: "John Doe",
        time: "10:30 AM",
        nextAction: "Send detailed product catalog via email",
      },
      {
        date: "May 15, 2024",
        type: "Phone Call",
        description: "Discussed product specifications and pricing.",
        agent: "John Doe",
        time: "10:30 AM",
        nextAction: "Send detailed product catalog via email",
      },
    ];

    const inquiryDetails = {
      partyName: "Acme Corp",
      docNo: "1234",
    };
    const { top, bottom } = useSafeAreaInsets();
    return (
      <ScrollView className={`flex-1 bg-gray-100 px-4 py-6`}>
        <View className="mb-6">
          <Text className="text-2xl font-bold text-gray-800">
            Followup Timeline
          </Text>
          <Text className="text-sm text-gray-600">
            {inquiryDetails.partyName} - #{inquiryDetails.docNo}
          </Text>
        </View>

        <View className={`relative`}>
          <View className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-300" />
          {followups.map((followup, index) => (
            <View key={index} className="mb-8 flex-row">
              <View className="absolute left-[12px] top-1 w-2 h-2 rounded-full bg-blue-500" />
              <View className="ml-10 flex-1">
                <Text className="text-sm font-semibold text-gray-600 mb-2">
                  {followup.date}
                </Text>
                <View className="bg-white rounded-lg shadow-sm p-4">
                  <Text className="text-lg font-bold text-gray-800 mb-2">
                    {followup.type}
                  </Text>
                  <Text className="text-base text-gray-700 mb-3">
                    {followup.description}
                  </Text>
                  <View className="flex-row items-center mb-1">
                    <Ionicons name="person-outline" size={16} color="#4B5563" />
                    <Text className="text-sm text-gray-600 ml-2">
                      {followup.agent}
                    </Text>
                  </View>
                  <View className="flex-row items-center mb-3">
                    <Ionicons name="time-outline" size={16} color="#4B5563" />
                    <Text className="text-sm text-gray-600 ml-2">
                      {followup.time}
                    </Text>
                  </View>
                  {followup.nextAction && (
                    <View className="mt-3 pt-3 border-t border-gray-200">
                      <Text className="text-sm font-semibold text-gray-700 mb-1">
                        Next Action:
                      </Text>
                      <Text className="text-sm text-gray-600">
                        {followup.nextAction}
                      </Text>
                    </View>
                  )}
                </View>
              </View>
            </View>
          ))}
        </View>

        <View className={`pb-[${bottom}px] my-10`}>
          <Pressable
            className={`bg-blue-500 py-3 px-4 rounded-lg items-center`}
            onPress={() => {
              /* Handle new followup */
            }}
          >
            <Text className="text-white font-semibold">Add New Followup</Text>
          </Pressable>
        </View>
      </ScrollView>
    );
  };

export default FollowupTimelineScreen;
