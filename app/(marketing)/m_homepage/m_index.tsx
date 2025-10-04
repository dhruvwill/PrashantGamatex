import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  View,
  Text,
  Pressable,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import DonutChart from "~/components/graphs/donut";
import { useDashboard } from "~/hooks/dashboard";
import { useQueryClient } from "@tanstack/react-query";
import { AppStore, useAppStore } from "~/store/store";
import { Timeframe } from "~/types/dashboard";
import { Button } from "~/components/ui/button";
import ReminderCard from "~/components/ReminderCard";
import CustomDropdownV2 from "~/components/CustomDropdownV2";
// import { leadReminder, followupReminder } from "~/mocks/reminder";

const Dashboard = () => {
  const queryClient = useQueryClient();
  const timeframes: Timeframe[] = [
    {
      value: "1D",
      label: "1 Day",
    },
    {
      value: "1W",
      label: "1 Week",
    },
    {
      value: "1M",
      label: "1 Month",
    },
    {
      value: "1Y",
      label: "1 Year",
    },
  ];
  const { timeframe, setTimeframe } = useAppStore((state: AppStore) => state);

  const dashboardData = useDashboard();

  const router = useRouter();

  const insets = useSafeAreaInsets();

  useEffect(() => {
    queryClient.invalidateQueries({
      queryKey: ["getDashboard", timeframe],
    });
  }, [timeframe]);

  useEffect(() => {
    queryClient.invalidateQueries({
      queryKey: ["getDashboard", timeframe],
    });
  }, []);

  return (
    <ScrollView>
      <View className="flex-1 px-4 py-6 w-full">
        <View className="flex-row justify-between items-center mb-6">
          {/* Left Side - Dashboard Title */}
          <View className="flex-1">
            <Text className="text-3xl font-acumin_bold text-gray-900">
              Dashboard
            </Text>
          </View>

          {/* Right Side - Dropdown and Icon */}
          <View className="flex-row flex flex-1 items-center">
            {/* Dropdown */}
            <View className="flex-1">
              <CustomDropdownV2
                options={timeframes}
                placeholder="timeframe"
                defaultValue={{
                  value: timeframes[0].value,
                  label: timeframes[0].label,
                }}
                onChange={(value) => {
                  setTimeframe(timeframes.find((t) => t.value === value)!);
                }}
              />
            </View>

            {/* Notification Icon */}
            {/* <View className="flex items-center">
              <Ionicons name="notifications-outline" size={25} />
            </View> */}
          </View>
        </View>

        <View className="rounded-lg shadow-lg mb-6 w-full bg-gray-100 border border-gray-300">
          {dashboardData.isLoading && !dashboardData.isError ? (
            <View className="flex-row items-center justify-start gap-2 h-10 native:h-12 border dark:bg-gray-800 px-4 rounded-md text-base font-medium text-[#222] dark:text-gray-100">
              <ActivityIndicator />
              <Text>Fetching</Text>
            </View>
          ) : (
            <View className="flex justify-between">
              <View className="border-b border-gray-300 p-4 w-full">
                <Text className="text-xl font-bold text-gray-600">Leads</Text>
              </View>
              <DonutChart
                className="bg-gray-200"
                sections={[
                  {
                    percentage: Math.round(
                      ((dashboardData.data?.dashboard[0].pending_lead || 0) /
                        (dashboardData.data?.dashboard[0].total_lead || 1)) *
                        100
                    ),
                    color: "blue",
                    label: `Pending Lead (${
                      dashboardData.data?.dashboard[0].pending_lead || 0
                    })`,
                  },
                  {
                    percentage:
                      100 -
                      Math.round(
                        ((dashboardData.data?.dashboard?.[0]?.pending_lead ||
                          0) /
                          (dashboardData.data?.dashboard?.[0]?.total_lead ||
                            1)) *
                          100
                      ),
                    color: "lightblue",
                    label: `Inquired Lead (${
                      dashboardData.data?.dashboard[0].total_lead! -
                        dashboardData.data?.dashboard[0].pending_lead! || 0
                    })`,
                  },
                ]}
                radius={100}
                strokeWidth={15}
                textColor="black"
              />
              <View className="border-t border-gray-300 p-4 w-full">
                <Button
                  className="text-xl font-bold bg-blue-200"
                  onPress={() => {
                    router.push("/(marketing)/m_lead/m_leadList/");
                  }}
                >
                  <Text> View All Leads</Text>
                </Button>
              </View>
            </View>
          )}
        </View>

        <View className="rounded-lg shadow-lg mb-6 w-full bg-gray-100 border border-gray-300">
          {dashboardData.isLoading && !dashboardData.isError ? (
            <View className="flex-row items-center justify-start gap-2 h-10 native:h-12 border dark:bg-gray-800 px-4 rounded-md text-base font-medium text-[#222] dark:text-gray-100">
              <ActivityIndicator />
              <Text>Fetching</Text>
            </View>
          ) : (
            <View className="flex justify-between">
              <View className="border-b border-gray-300 p-4 w-full">
                <Text className="text-xl font-bold text-gray-600">
                  Quotations
                </Text>
              </View>
              <DonutChart
                className="bg-gray-200"
                sections={[
                  {
                    percentage: Math.round(
                      ((dashboardData.data?.dashboard?.[0]?.pending_quotation ||
                        0) /
                        (dashboardData.data?.dashboard?.[0]?.total_quotation ||
                          1)) *
                        100
                    ),
                    color: "lightgreen",
                    label: `Pending Quotations (${
                      dashboardData.data?.dashboard?.[0]?.pending_quotation || 0
                    })`,
                  },
                  {
                    percentage:
                      100 -
                      Math.round(
                        ((dashboardData.data?.dashboard?.[0]
                          ?.pending_quotation || 0) /
                          (dashboardData.data?.dashboard?.[0]
                            ?.total_quotation || 1)) *
                          100
                      ),
                    color: "green",
                    label: `Order Send (${
                      dashboardData.data?.dashboard?.[0]?.total_quotation! -
                        dashboardData.data?.dashboard?.[0]
                          ?.pending_quotation! || 0
                    })`,
                  },
                ]}
                radius={100}
                strokeWidth={15}
                textColor="black"
              />
              <View className="border-t border-gray-300 p-4 w-full">
                <Button
                  className="text-xl font-bold bg-green-300"
                  onPress={() => {
                    router.push("/(marketing)/m_followup/m_followUpList");
                  }}
                >
                  <Text> View All Quotations</Text>
                </Button>
              </View>
            </View>
          )}
        </View>
        <View className="rounded-lg shadow-lg mb-6 w-full bg-gray-100 border border-gray-300">
          {dashboardData.isLoading && !dashboardData.isError ? (
            <View className="flex-row items-center justify-start gap-2 h-10 native:h-12 border dark:bg-gray-800 px-4 rounded-md text-base font-medium text-[#222] dark:text-gray-100">
              <ActivityIndicator />
              <Text>Fetching</Text>
            </View>
          ) : (
            <View className="flex justify-between">
              <View className="border-b border-gray-300 p-4 w-full">
                <Text className="text-xl font-bold text-gray-600">
                  Upcoming Reminders (Next 3 days)
                </Text>
              </View>
              <View className="p-4">
                <ReminderCard
                  leadReminders={dashboardData.data?.leadReminders || []}
                  followupReminders={
                    dashboardData.data?.quotationReminders || []
                  }
                />
              </View>
              <View className="border-t border-gray-300 p-4 w-full">
                <Button
                  className="text-xl font-bold bg-gray-300"
                  onPress={() => {
                    router.push("/(marketing)/m_homepage/m_calendar");
                  }}
                >
                  <Text> View All Tasks</Text>
                </Button>
              </View>
            </View>
          )}
        </View>
      </View>
    </ScrollView>
  );
};

export default Dashboard;

{
  /* <View className="flex-col mt-6 px-4">
              <View className="flex-row w-full items-center">
                <View className="flex-1">
                  <Pressable
                    onPress={() => {
                      router.push({
                        pathname: "/(marketing)/m_lead/m_leadList/"
                      })
                    }}
                  >
                    <Text className="text-lg text-green-600 font-acumin_bold">Leads</Text>
                    <Text className="text-3xl font-acumin_bold text-gray-900">10/20</Text>
                  </Pressable>
                </View>
                <View className="h-16 w-[1px] bg-gray-300 mx-4"></View>
                <View className="flex-1">
                  <Pressable
                    onPress={() => {
                      router.push({
                        pathname: "/(marketing)/m_followup/m_followUpList/"
                      })
                    }}
                  >
                    <Text className="text-lg text-blue-600 font-acumin_bold">Inquiry</Text>
                    <Text className="text-3xl font-acumin_bold text-gray-900">10/30</Text>
                  </Pressable>
                </View>
              </View>
              <View className='flex-row w-full items-center mt-5'>
                <View className='flex-1'>
                  <Pressable
                    onPress={() => {
                      router.push({
                        pathname: "/(marketing)/m_followup/m_followUpList/"
                      })
                    }}
                  >
                    <Text className="text-lg text-orange-400 font-acumin_bold">Quotation</Text>
                    <Text className="text-3xl font-acumin_bold text-gray-900">5/10</Text>
                  </Pressable>
                </View>
                <View className="h-16 w-[1px] bg-gray-300 mx-4"></View>
                <View className='flex-1'>
                  <Pressable
                    onPress={() => {
                      router.push({
                        pathname: "/(marketing)/m_homepage/m_calendar"
                      })
                    }}
                  >
                    <Text className="text-lg text-yellow-500 font-acumin_bold">Tasks</Text>
                    <Text className="text-3xl font-acumin_bold text-gray-900">9/19</Text>
                  </Pressable>
                </View>
              </View>
            </View> */
}
