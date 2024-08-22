import React, { useState } from 'react';
import { SafeAreaView, View, Text, Pressable, ScrollView, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from "@expo/vector-icons";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import DonutChart from '~/components/graphs/donut';
import { useDashboard } from '~/hooks/dashboard';

const Dashboard = () => {
  const timeframes = ['1 day', '1 week', '1 month', '1 year']
  const graphs = ['Leads', 'Inquiries', 'Quotations', 'Tasks']
  const Dashboard = useDashboard()

  const router = useRouter()

  const [timeframe, setTimeframe] = useState(timeframes[0])
  const [graph, setGraph] = useState({ value: 'Leads', label: 'Leads' })

  const insets = useSafeAreaInsets();
  const contentInsets = {
    top: insets.top,
    bottom: insets.bottom,
    left: 12,
    right: 12,
  };

  const handleTimeframeChange = (value: any) => {
    setTimeframe(value);
  };

  const handleGraphChange = (value: any) => {
    setGraph(value);
  }

  return (
    <ScrollView>
      <View className="flex-1 px-4 py-6 w-full">
        <View className="flex-row justify-between items-center mb-6">
          {/* Left Side - Dashboard Title */}
          <View className="flex-1">
            <Text className="text-4xl font-acumin_bold text-gray-900">Dashboard</Text>
          </View>

          {/* Right Side - Dropdown and Icon */}
          <View className="flex-row flex flex-1 items-center">
            {/* Dropdown */}
            <View className="w-3/4 mr-4">
              <Select
                defaultValue={{ value: timeframes[0], label: timeframes[0] }}
                onValueChange={handleTimeframeChange}
              >
                <SelectTrigger className="w-full">
                  <View className="flex-row items-center">
                    <Ionicons name="calendar-outline" size={18} color="#000" />
                    <SelectValue
                      className="text-foreground text-sm native:text-lg ml-2"
                      placeholder="Select a timeframe"
                    >
                      {timeframes[0]}
                    </SelectValue>
                  </View>
                </SelectTrigger>
                <SelectContent insets={contentInsets} className="bg-white">
                  <SelectGroup>
                    {timeframes.map((timeframe) => (
                      <SelectItem key={timeframe} label={timeframe} value={timeframe}>
                        <View className="flex-row items-center">
                          <Ionicons name="calendar-outline" size={18} color="#000" />
                          <Text className="ml-2">{timeframe}</Text>
                        </View>
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </View>

            {/* Notification Icon */}
            <View className="flex items-center">
              <Ionicons name="notifications-outline" size={25} />
            </View>
          </View>
        </View>

        <View className="p-4 rounded-lg shadow-lg mb-6 w-full bg-slate-100">
          <View className='w-full'>
            <View className='flex flex-row items-center justify-between'>
              <View className=''>
                <Text className="text-2xl font-bold text-gray-900 font-acumin_bold">Project Overview</Text>
              </View>
              <View className='w-[150px]'>
                <Select
                  defaultValue={{ value: graphs[0], label: graphs[0] }}
                  onValueChange={handleGraphChange}
                >
                  <SelectTrigger className="w-full">
                    <View className="flex-row items-center">
                      <Ionicons name="calendar-outline" size={18} color="#000" />
                      <SelectValue
                        className="text-foreground text-sm native:text-lg ml-2"
                        placeholder="Select a timeframe"
                      >
                        {graphs[0]}
                      </SelectValue>
                    </View>
                  </SelectTrigger>
                  <SelectContent insets={contentInsets} className="bg-white">
                    <SelectGroup>
                      {graphs.map((graph) => (
                        <SelectItem key={graph} label={graph} value={graph}>
                          <View className="flex-row items-center">
                            <Ionicons name="calendar-outline" size={18} color="#000" />
                            <Text className="ml-2">{graph}</Text>
                          </View>
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </View>
            </View>
            <View className='flex items-center'>
              {Dashboard.isLoading ? (
                <View className="flex-row items-center justify-start gap-2 h-10 native:h-12 border dark:bg-gray-800 px-4 rounded-md text-base font-medium text-[#222] dark:text-gray-100">
                  <ActivityIndicator />
                  <Text>Fetching</Text>
                </View>) : graph.value === 'Leads' && (
                  <Pressable
                    onPress={() => {
                      router.push({
                        pathname: "/(marketing)/m_lead/m_leadList/"
                      })
                    }}
                  >
                    <DonutChart
                      sections={[
                        { percentage: Math.round((((Dashboard.data[0]?.pending_lead) / (Dashboard.data[0]?.total_lead) * 100))), color: 'blue', label: 'Pending Lead' },
                        { percentage: Math.round(((1 - (Dashboard.data[0]?.pending_lead) / (Dashboard.data[0]?.total_lead)) * 100)), color: 'lightblue', label: 'Inquired Lead' },
                      ]}
                      radius={80}
                      strokeWidth={15}
                      textColor="black"
                    />
                  </Pressable>
                )}
              {Dashboard.isLoading ? (
                <View className="flex-row items-center justify-start gap-2 h-10 native:h-12 border dark:bg-gray-800 px-4 rounded-md text-base font-medium text-[#222] dark:text-gray-100">
                  <ActivityIndicator />
                  <Text>Fetching</Text>
                </View>) : graph.value === 'Inquiries' && (
                  <Pressable
                    onPress={() => {
                      router.push({
                        pathname: "/(marketing)/m_lead/m_leadList/"
                      })
                    }}
                  >
                    <DonutChart
                      sections={[
                        { percentage: Math.round((((Dashboard.data[1]?.pending_inquiry) / (Dashboard.data[1]?.total_inquiry) * 100))), color: 'green', label: 'Pending Inquiries' },
                        { percentage: Math.round(((1 - (Dashboard.data[1]?.pending_inquiry) / (Dashboard.data[1]?.total_inquiry)) * 100)), color: 'lightgreen', label: 'Quotation Send' },
                      ]}
                      radius={80}
                      strokeWidth={15}
                      textColor="black"
                    />
                  </Pressable>
                )}
              {Dashboard.isLoading ? (
                <View className="flex-row items-center justify-start gap-2 h-10 native:h-12 border dark:bg-gray-800 px-4 rounded-md text-base font-medium text-[#222] dark:text-gray-100">
                  <ActivityIndicator />
                  <Text>Fetching</Text>
                </View>) : graph.value === 'Quotations' && (
                  <Pressable
                    onPress={() => {
                      router.push({
                        pathname: "/(marketing)/m_lead/m_leadList/"
                      })
                    }}
                  >
                    <DonutChart
                      sections={[
                        { percentage: Math.round((((Dashboard.data[2]?.pending_quotation) / (Dashboard.data[2]?.total_quotation) * 100))), color: 'red', label: 'Pending Quotations' },
                        { percentage: Math.round(((1 - (Dashboard.data[2]?.pending_quotation) / (Dashboard.data[2]?.total_quotation)) * 100)), color: 'tomato', label: 'Order Send' },
                      ]}
                      radius={80}
                      strokeWidth={15}
                      textColor="black"
                    />
                  </Pressable>
                )}
              {graph.value === 'Tasks' && (
                <DonutChart
                  sections={[
                    { percentage: 10, color: 'yellow', label: 'A' },
                    { percentage: 90, color: 'lightyellow', label: 'B' },
                  ]}
                  radius={80}
                  strokeWidth={15}
                  textColor="black"
                />
              )}

            </View>
          </View>
        </View>

        <View className="p-4 rounded-lg shadow-lg mb-6 w-full bg-slate-100">
          <View className='w-full'>
            <Text className="text-2xl font-acumin_bold text-gray-900">Tasks Overview</Text>
            <View className="flex-col mt-6 px-4">
              <View className="flex-row w-full items-center">
                <View className="flex-1">
                  <Text className="text-lg text-blue-600 font-acumin_bold">Created</Text>
                  <Text className="text-3xl font-acumin_bold text-gray-900">10/20</Text>
                </View>
                <View className="h-16 w-[1px] bg-gray-300 mx-4"></View>
                <View className="flex-1">
                  <Text className="text-lg text-green-500 font-acumin_bold">Started</Text>
                  <Text className="text-3xl font-acumin_bold text-gray-900">10/30</Text>
                </View>
              </View>
              <View className='flex-row w-full items-center mt-5'>
                <View className='flex-1'>
                  <Text className="text-lg text-green-700 font-acumin_bold">Completed</Text>
                  <Text className="text-3xl font-acumin_bold text-gray-900">5/10</Text>
                </View>
                <View className="h-16 w-[1px] bg-gray-300 mx-4"></View>
                <View className='flex-1'>
                  <Text className="text-lg text-orange-400 font-acumin_bold">Failed</Text>
                  <Text className="text-3xl font-acumin_bold text-gray-900">9/19</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* <View className='p-4 rounded-lg mb-6 shadow-lg w-full bg-slate-100'>
          <View className='flex flex-row items-center m-4'>
            <View className='flex-1'>
              <Text className="text-lg text-gray-600 font-acumin_bold">Total Contacts</Text>
              <Text className="text-4xl font-acumin_bold text-gray-900">1000</Text>
            </View>
            <View className='flex-1'>
              <Text className="text-lg text-gray-600 font-acumin_bold">Total Companies</Text>
              <Text className="text-4xl font-acumin_bold text-gray-900">100</Text>
            </View>
          </View>
        </View> */}

        {/* <View className='p-4 rounded-lg mb-6 shadow-lg w-full bg-slate-100'>
          <Text className='font-acumin_bold text-xl text-gray-600'>Opportunities Overview</Text>
          <View><Text>Graph can be shown here</Text></View>
        </View> */}

        {/* <View className='p-4 rounded-lg mb-6 shadow-lg w-full bg-slate-100'>
          <View className='flex-col'>
            <View className='flex-row items-center justify-between'>
              <View className='flex-row items-center gap-3'>
                <Text className='text-xl font-acumin_bold text-gray-600'>
                  Contacts
                </Text>
                <View className='bg-gray-400 px-2 py-1 rounded-full'><Text className='text-white'>1000</Text></View>
              </View>
              <Pressable>
                <Text className='text-blue-600 font-acumin_bold'>View All</Text>
              </Pressable>
            </View>
            <View className='flex-col gap-5'>
              <View className='flex-row items-center border-[1px] border-gray-400 rounded-lg p-4 gap-5 mt-6'>
                <Ionicons name="person" size={20} />
                <View className='flex-col'>
                  <Text className='text-gray-600 font-acumin text-lg'>Dev Panchal</Text>
                  <Text className='text-gray-600 font-acumin text-lg'>1234567890</Text>
                </View>
              </View>
              <View className='flex-row items-center border-[1px] border-gray-400 rounded-lg p-4 gap-5'>
                <Ionicons name="person" size={20} />
                <View className='flex-col'>
                  <Text className='text-gray-600 font-acumin text-lg'>Dev Panchal</Text>
                  <Text className='text-gray-600 font-acumin text-lg'>1234567890</Text>
                </View>
              </View>
              <View className='flex-row items-center border-[1px] border-gray-400 rounded-lg p-4 gap-5'>
                <Ionicons name="person" size={20} />
                <View className='flex-col'>
                  <Text className='text-gray-600 font-acumin text-lg'>Dev Panchal</Text>
                  <Text className='text-gray-600 font-acumin text-lg'>1234567890</Text>
                </View>
              </View>
            </View>
          </View>
        </View> */}

        <View className='p-4 rounded-lg shadow-lg w-full bg-slate-100'>
          <View className='flex-col'>
            <View className='flex-row items-center justify-between'>
              <View className='flex-row items-center gap-3'>
                <Text className='text-xl font-acumin_bold text-gray-600'>
                  Companies
                </Text>
                <View className='bg-gray-400 px-2 py-1 rounded-full'><Text className='text-white'>100</Text></View>
              </View>
              <Pressable>
                <Text className='text-blue-600 font-acumin_bold'>View All</Text>
              </Pressable>
            </View>
            <View className='flex-col gap-5'>
              <View className='flex-row items-center border-[1px] border-gray-400 rounded-lg p-4 gap-5 mt-6'>
                <Ionicons name="person" size={20} />
                <View className='flex-col'>
                  <Text className='text-gray-600 font-acumin text-lg'>Prashant Group</Text>
                  <Text className='text-gray-600 font-acumin text-lg'>Ahmedabad,Gujarat</Text>
                </View>
              </View>
              <View className='flex-row items-center border-[1px] border-gray-400 rounded-lg p-4 gap-5'>
                <Ionicons name="person" size={20} />
                <View className='flex-col'>
                  <Text className='text-gray-600 font-acumin text-lg'>Prashant Group</Text>
                  <Text className='text-gray-600 font-acumin text-lg'>Ahmedabad,Gujarat</Text>
                </View>
              </View>
              <View className='flex-row items-center border-[1px] border-gray-400 rounded-lg p-4 gap-5'>
                <Ionicons name="person" size={20} />
                <View className='flex-col'>
                  <Text className='text-gray-600 font-acumin text-lg'>Prashant Group</Text>
                  <Text className='text-gray-600 font-acumin text-lg'>Ahmedabad,Gujarat</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

      </View>
    </ScrollView>
  );
};

export default Dashboard;


{/* <View className="flex-col mt-6 px-4">
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
            </View> */}