import React, { useState, useCallback } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { Calendar, DateData } from "react-native-calendars";

interface Event {
  title: string;
  time: string;
}

interface EventsData {
  [date: string]: Event[];
}

const SimplifiedCalendar: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [events, setEvents] = useState<EventsData>({
    "2024-08-24": [
      { title: "Meeting with client", time: "10:00 AM" },
      { title: "Meeting with client", time: "10:00 AM" },
    ],
    "2024-08-25": [{ title: "Team lunch", time: "12:30 PM" }],
  });

  const onDayPress = useCallback((day: DateData) => {
    setSelectedDate(day.dateString);
  }, []);

  const renderEvents = () => {
    const dayEvents = events[selectedDate] || [];

    if (dayEvents.length === 0) {
      return (
        <View className="py-5 items-center">
          <Text className="text-gray-500 text-base">
            No events planned for this day
          </Text>
        </View>
      );
    }

    return dayEvents.map((event: Event, index: number) => (
      <TouchableOpacity
        key={index}
        className="bg-white p-4 mb-3 rounded-lg shadow"
      >
        <Text className="text-gray-500 text-sm">{event.time}</Text>
        <Text className="text-black font-semibold text-base mt-1">
          {event.title}
        </Text>
      </TouchableOpacity>
    ));
  };

  return (
    <ScrollView className="flex-1 bg-gray-100">
      <View className="px-5 py-6">
        <Text className="text-3xl font-bold">Calendar</Text>
        <Text className="text-gray-500 text-sm mt-1">List of All Events</Text>
      </View>

      <Calendar
        onDayPress={onDayPress}
        markedDates={{
          [selectedDate]: { selected: true, selectedColor: "#007AFF" },
          ...Object.keys(events).reduce(
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
    </ScrollView>
  );
};

export default SimplifiedCalendar;
