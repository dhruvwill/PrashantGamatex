import { View, Text, Pressable } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { LeadReminderData } from "~/types/lead";
import { QuotationReminderData } from "~/types/followup";

interface ReminderCardProps {
  leadReminders: LeadReminderData[];
  followupReminders: QuotationReminderData[];
}

const ReminderCard = ({ leadReminders, followupReminders }: ReminderCardProps) => {
  const router = useRouter();

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getDaysUntil = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const reminderDate = new Date(date);
    reminderDate.setHours(0, 0, 0, 0);
    const diffTime = reminderDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Tomorrow";
    if (diffDays < 0) return `${Math.abs(diffDays)} days ago`;
    return `${diffDays} days`;
  };

  const getPriorityColor = (date: Date) => {
    const today = new Date();
    const reminderDate = new Date(date);
    const diffTime = reminderDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return "text-red-600 bg-red-50";
    if (diffDays === 0) return "text-orange-600 bg-orange-50";
    if (diffDays <= 2) return "text-yellow-600 bg-yellow-50";
    return "text-green-600 bg-green-50";
  };

  return (
    <View className="w-full">
      {/* Lead Reminders Section */}
      {leadReminders.length > 0 && (
        <View className="mb-4">
          <View className="flex-row items-center mb-3">
            <View className="w-3 h-3 bg-blue-500 rounded-full mr-2" />
            <Text className="text-lg font-bold text-gray-800">Lead Reminders</Text>
            <Text className="text-sm text-gray-500 ml-2">({leadReminders.length})</Text>
          </View>
          
          {leadReminders.map((reminder, index) => (
            <View
              key={`lead-${reminder.ReferenceTransaction_2361FollowupId}`}
              className="bg-white border-l-4 border-l-blue-500 rounded-r-lg shadow-sm mb-3 overflow-hidden"
            >
              <View className="p-4">
                <View className="flex-row justify-between items-start mb-2">
                  <View className="flex-1">
                    <Text className="text-sm font-semibold text-gray-800">
                      {reminder.CompanyName}
                    </Text>
                    <Text className="text-xs text-gray-600">
                      Visit to: {reminder.VisitTo}
                    </Text>
                  </View>
                  <View className={`px-2 py-1 rounded-full ${getPriorityColor(reminder.NextVisitDateTime)}`}>
                    <Text className="text-xs font-medium">
                      {getDaysUntil(reminder.NextVisitDateTime)}
                    </Text>
                  </View>
                </View>
                
                <View className="flex-row items-center mb-2">
                  <Ionicons name="calendar-outline" size={14} color="#6B7280" />
                  <Text className="text-xs text-gray-600 ml-1">
                    {formatDate(reminder.NextVisitDateTime)} at {formatTime(reminder.NextVisitDateTime)}
                  </Text>
                </View>
                
                {reminder.FollowupDetails && (
                  <View className="bg-gray-50 p-2 rounded">
                    <Text className="text-xs text-gray-700">
                      {reminder.FollowupDetails}
                    </Text>
                  </View>
                )}
              </View>
              
              <View className="bg-blue-50 px-4 py-2 flex-row justify-between items-center">
                <Text className="text-xs text-blue-700 font-medium">
                  Status: {reminder.FollowupStatus}
                </Text>
                <Pressable
                  onPress={() => {
                    router.push({
                      pathname: "/(marketing)/m_lead/m_leadList/leadFollowupTimeline",
                      params: { leadId: reminder.LeadId.toString() },
                    });
                  }}
                  className="flex-row items-center"
                >
                  <Text className="text-xs text-blue-600 font-medium mr-1">View Details</Text>
                  <Ionicons name="chevron-forward" size={14} color="#2563EB" />
                </Pressable>
              </View>
            </View>
          ))}
        </View>
      )}

      {/* Followup Reminders Section */}
      {followupReminders.length > 0 && (
        <View className="mb-4">
          <View className="flex-row items-center mb-3">
            <View className="w-3 h-3 bg-green-500 rounded-full mr-2" />
            <Text className="text-lg font-bold text-gray-800">Followup Reminders</Text>
            <Text className="text-sm text-gray-500 ml-2">({followupReminders.length})</Text>
          </View>
          
          {followupReminders.map((reminder, index) => (
            <View
              key={`followup-${reminder.ReferenceTransaction_2361FollowupId}`}
              className="bg-white border-l-4 border-l-green-500 rounded-r-lg shadow-sm mb-3 overflow-hidden"
            >
              <View className="p-4">
                <View className="flex-row justify-between items-start mb-2">
                  <View className="flex-1">
                    <Text className="text-sm font-semibold text-gray-800">
                      {reminder.CompanyName}
                    </Text>
                    <Text className="text-xs text-gray-600">
                      Visit to: {reminder.VisitTo}
                    </Text>
                  </View>
                  <View className={`px-2 py-1 rounded-full ${getPriorityColor(reminder.NextVisitDateTime)}`}>
                    <Text className="text-xs font-medium">
                      {getDaysUntil(reminder.NextVisitDateTime)}
                    </Text>
                  </View>
                </View>
                
                <View className="flex-row items-center mb-2">
                  <Ionicons name="calendar-outline" size={14} color="#6B7280" />
                  <Text className="text-xs text-gray-600 ml-1">
                    {formatDate(reminder.NextVisitDateTime)} at {formatTime(reminder.NextVisitDateTime)}
                  </Text>
                </View>
                
                <View className="flex-row items-center mb-2">
                  <Ionicons name="call-outline" size={14} color="#6B7280" />
                  <Text className="text-xs text-gray-600 ml-1">
                    {reminder.ModeofContact}
                  </Text>
                </View>
                
                {reminder.FollowupDetails && (
                  <View className="bg-gray-50 p-2 rounded">
                    <Text className="text-xs text-gray-700">
                      {reminder.FollowupDetails}
                    </Text>
                  </View>
                )}
              </View>
              
              <View className="bg-green-50 px-4 py-2 flex-row justify-between items-center">
                <Text className="text-xs text-green-700 font-medium">
                  Status: {reminder.FollowupStatus}
                </Text>
                <Pressable
                  onPress={() => {
                    router.push({
                      pathname: "/(marketing)/m_followup/m_followUpList",
                    });
                  }}
                  className="flex-row items-center"
                >
                  <Text className="text-xs text-green-600 font-medium mr-1">View Details</Text>
                  <Ionicons name="chevron-forward" size={14} color="#059669" />
                </Pressable>
              </View>
            </View>
          ))}
        </View>
      )}

      {/* Empty State */}
      {leadReminders.length === 0 && followupReminders.length === 0 && (
        <View className="bg-gray-50 rounded-lg p-6 items-center">
          <Ionicons name="checkmark-circle-outline" size={48} color="#9CA3AF" />
          <Text className="text-gray-500 text-center mt-2 font-medium">
            No upcoming reminders
          </Text>
          <Text className="text-gray-400 text-center text-sm mt-1">
            You're all caught up!
          </Text>
        </View>
      )}
    </View>
  );
};

export default ReminderCard; 