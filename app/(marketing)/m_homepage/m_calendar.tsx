import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Calendar, DateData } from "react-native-calendars";
import { Badge } from "~/components/ui/badge";
import { useCalendar } from "~/hooks/calendar";

interface EventsData {
  [date: string]: Event[];
}

const SimplifiedCalendar: React.FC = () => {
  const calendar = useCalendar();
  const [selectedDate, setSelectedDate] = useState<string>("");

  const onDayPress = useCallback((day: DateData) => {
    setSelectedDate(day.dateString);
  }, []);

  const renderEvents = () => {
    const dayEvents = calendar.data[selectedDate] || [];

    if (dayEvents.length === 0) {
      return (
        <View className="py-5 items-center">
          <Text className="text-gray-500 text-base">
            No events planned for this day
          </Text>
        </View>
      );
    }

    return dayEvents.map((event: any, index: number) => (
      <TouchableOpacity key={index}>
        <View className="bg-white p-4 mb-3 rounded-lg shadow flex gap-1">
          <View className="flex flex-row justify-between">
            <Text className="text-gray-500 text-sm">{event.time}</Text>
            {event.machineName == "Lead Reminder" ? (
              // <Badge variant="default">
              //   <Text>Lead</Text>
              // </Badge>
              <Text className="text-blue-500 font-semibold text-sm">Lead</Text>
            ) : (
              // <Badge variant="secondary">
              //   <Text>Followup</Text>
              // </Badge>
              <>
                <Text className="text-green-500 font-semibold text-sm">
                  Followup
                </Text>
              </>
            )}
          </View>
          <Text className="text-black font-medium text-base mt-1">
            {event.partyName}
          </Text>
          <Text className="text-sm text-gray-500">{event.machineName}</Text>
        </View>
      </TouchableOpacity>
    ));
  };

  return (
    <ScrollView className="flex-1 bg-gray-100">
      <View className="px-5 py-6">
        <Text className="text-3xl font-bold">Calendar</Text>
        <Text className="text-gray-500 text-sm mt-1">List of All Events</Text>
      </View>

      {calendar.isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#007AFF" />
          <Text className="text-gray-500 text-base">Loading...</Text>
        </View>
      ) : (
        <>
          <Calendar
            onDayPress={onDayPress}
            markedDates={{
              [selectedDate]: { selected: true, selectedColor: "#007AFF" },
              ...Object.keys(calendar.data).reduce(
                (
                  acc: { [key: string]: { marked: boolean; dotColor: string } },
                  date: string
                ) => {
                  acc[date] = { marked: true, dotColor: "#007AFF" };
                  return acc;
                },
                {}
              ),
            }}
            theme={{
              backgroundColor: "#ffffff",
              calendarBackground: "#ffffff",
              textSectionTitleColor: "#b6c1cd",
              selectedDayBackgroundColor: "#007AFF",
              selectedDayTextColor: "#ffffff",
              todayTextColor: "#007AFF",
              dayTextColor: "#2d4150",
              textDisabledColor: "#d9e1e8",
              dotColor: "#007AFF",
              selectedDotColor: "#ffffff",
              arrowColor: "#007AFF",
              monthTextColor: "#2d4150",
              indicatorColor: "#007AFF",
              textDayFontWeight: "300",
              textMonthFontWeight: "bold",
              textDayHeaderFontWeight: "300",
              textDayFontSize: 16,
              textMonthFontSize: 16,
              textDayHeaderFontSize: 16,
            }}
          />

          <View className="px-5 py-6">
            <Text className="text-xl font-semibold mb-4">
              Events for {selectedDate}
            </Text>
            {renderEvents()}
          </View>
        </>
      )}
    </ScrollView>
  );
};

export default SimplifiedCalendar;
