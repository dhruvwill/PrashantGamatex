import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, Pressable, Modal } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { useUserStore } from "~/store";
import { API_URL } from "~/constants/api";
import { Separator } from "~/components/ui/separator";
import { Image } from "expo-image";
import { TouchableOpacity } from "react-native";
import { usePreventScreenCapture } from "expo-screen-capture";
import { useLeadUpdates, useLeads } from "~/hooks/leads";
import { LeadData, LeadUpdate } from "~/types/lead";

const LeadFollowupTimeline = () => {
  usePreventScreenCapture();
  
  const router = useRouter();
  const userToken = useUserStore((state: any) => state.user?.token);

  const { leadId } = useLocalSearchParams<{ leadId: string }>();
  const parsedLeadId = parseInt(leadId || "0");

  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const {
    data: leadUpdates,
    isLoading,
    isError,
    error,
  } = useLeadUpdates(parsedLeadId);

  const { top, bottom } = useSafeAreaInsets();

  const getImageUri = (imageName: string) => {
    return {
      uri: `${API_URL}/user/images/${imageName}`,
      headers: { Authorization: `Bearer ${userToken}` },
    };
  };

  // Get lead data from the leads list
  const { data: allLeads } = useLeads();
  const leadData = allLeads?.find((lead: LeadData) => lead.ReferenceTransaction_2361Id === parsedLeadId);

  return (
    <ScrollView className={`flex-1 bg-gray-100 px-4 py-6`}>
      <View>
        <Text className="text-2xl font-bold text-gray-800">
          {leadData?.UDF_CompanyName_2361 || "Loading..."}
        </Text>
        <Text className="text-sm text-gray-600">
          #{leadData?.DocumentNo || "..."}
        </Text>
        <Text className="text-sm text-gray-600">
          {leadData?.UDF_Product_2361 || "Loading..."}
        </Text>
      </View>
      <Separator className="my-5 bg-gray-500" orientation="horizontal" />
      {/* <View>
        <View className="flex flex-row justify-between gap-2 mb-4 px-3 py-2 w-full rounded-lg bg-gray-200 relative">
          <Pressable
            className={`${
              tab == "timeline" && "bg-gray-800"
            } px-4 py-2 rounded-md flex-1 items-center`}
            onPress={() => setTab("timeline")}
          >
            <Text
              className={`${tab == "timeline" ? "text-white" : "text-black"}`}
            >
              Timeline
            </Text>
          </Pressable>
          <Pressable
            className={`${
              tab == "edit" && "bg-gray-800"
            } px-4 py-2 rounded-md flex-1 items-center`}
            onPress={() => setTab("edit")}
          >
            <Text
              className={`${tab == "edit" ? "text-white" : "text-black"} `}
            >
              Edit Lead
            </Text>
          </Pressable>
        </View>
      </View> */}

      {isLoading ? (
        <View className="flex-1 justify-center items-center">
          <Text>Loading...</Text>
        </View>
      ) : isError ? (
        <View className="flex-1 justify-center items-center">
          <Text>Failed to load data</Text>
          <Text>{error.errorMessage}</Text>
        </View>
      ) : (
        <View className={`relative`}>
          <View className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-300" />
            {leadUpdates?.map((update: LeadUpdate, index: number) => (
              <View key={index} className="mb-8 flex-row">
                <View className="absolute left-[12px] top-1 w-2 h-2 rounded-full bg-blue-500" />
                <View className="ml-10 flex-1">
                  <View className="flex flex-row">
                    <Text className="text-sm font-semibold text-gray-600 mb-2">
                      {new Date(update.FollowupDateTime).toLocaleDateString(
                        "en-IN",
                        {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        }
                      )}
                      ,{" "}
                    </Text>
                    <Text className="text-sm text-gray-600">
                      {new Date(update.FollowupDateTime).toLocaleTimeString(
                        "en-IN",
                        {
                          hour: "numeric",
                          minute: "numeric",
                        }
                      )}
                    </Text>
                  </View>
                  <View>
                    <Text className="text-lg font-bold text-gray-800 mb-2">
                      {update.ModeofContact}
                    </Text>
                    <Text className="text-base text-gray-700 mb-3">
                      {update.FollowupDetails}
                    </Text>
                    <View className="flex-row items-center mb-1">
                      <Ionicons
                        name="person-outline"
                        size={16}
                        color="#4B5563"
                      />
                      <Text className="text-sm text-gray-600 ml-2">
                        {update.VisitTo}
                      </Text>
                    </View>
                    <View className="flex-row items-center mb-3">
                      <Ionicons name="documents" size={16} color="#4B5563" />
                      <Text className="text-sm text-gray-600 ml-2">
                        Documents
                      </Text>
                    </View>
                    {update.FollowupStatus && (
                      <View className="mt-3 pt-3 border-t border-gray-200 flex flex-row gap-1">
                        <Text className="text-sm">Status:</Text>
                        <Text className="text-sm font-semibold text-gray-700">
                          {update.FollowupStatus}
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
              pathname: "/(marketing)/m_lead/m_leadList/newLeadFollowup",
              params: {
                leadId: leadId,
                lastFollowupData: JSON.stringify(
                  leadUpdates?.[leadUpdates.length - 1]
                ),
              },
            });
          }}
        >
          <Text className="text-white font-semibold">Add New Lead Update</Text>
        </Pressable>
      </View>

      <Modal
        visible={!!selectedImage}
        animationType="fade"
      >
        <View className="flex-1 w-full bg-black bg-opacity-90 justify-center items-center">
          {selectedImage && (
            <Image
              source={getImageUri(selectedImage)}
              style={{ width: 350, height: 500 }}
              contentFit="contain"
            />
          )}
          <TouchableOpacity
            className="absolute top-10 right-10 z-10 self-end"
            onPress={() => setSelectedImage(null)}
          >
            <Ionicons name="close" size={30} color="white" />
          </TouchableOpacity>
        </View>
      </Modal>
    </ScrollView>
  );
};

export default LeadFollowupTimeline; 