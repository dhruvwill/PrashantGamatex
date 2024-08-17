import React, { useState, useRef, useCallback } from "react";
import { View, Text, ScrollView, RefreshControl } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useQueryClient } from "@tanstack/react-query";
import { Separator } from "~/components/ui/separator";
import {
  ExpandableCalendar,
  AgendaList,
  CalendarProvider,
  WeekCalendar,
} from "react-native-calendars";

// Assuming you have these imports and functions defined elsewhere
import { agendaItems, getMarkedDates } from "~/mocks/agendaItems";
import AgendaItem from "~/mocks/AgendaItem";
import { getTheme, themeColor, lightThemeColor } from "~/mocks/theme";

const ITEMS: any[] = agendaItems;

const Calendar = () => {
  const [refreshing, setRefreshing] = useState(false);
  const [weekView, setWeekView] = useState(false);
  const queryClient = useQueryClient();
  const marked = useRef(getMarkedDates());
  const theme = useRef(getTheme());
  const todayBtnTheme = useRef({
    todayButtonTextColor: themeColor,
  });

  const onRefresh = () => {
    setRefreshing(true);
    queryClient.invalidateQueries({
      queryKey: ["getTasks"],
    });
    setRefreshing(false);
  };

  const renderItem = useCallback(({ item }: any) => {
    return <AgendaItem item={item} />;
  }, []);

  return (
    <ScrollView
      className="flex-1"
      keyboardShouldPersistTaps="handled"
      // refreshControl={
      //   <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      // }
    >
      <View className="flex mx-3 my-5">
        <View className="px-3">
          <Text className="text-3xl font-acumin_bold">Calendar</Text>
          <Text className="text-muted text-sm text-gray-500 font-acumin">
            List of All Tasks
          </Text>
        </View>
      </View>
      <View className="flex-col gap-2">
        <CalendarProvider
          date={ITEMS[1]?.title}
          showTodayButton
          theme={todayBtnTheme.current}
        >
          {weekView ? (
            <WeekCalendar firstDay={1} markedDates={marked.current} />
          ) : (
            <ExpandableCalendar
              firstDay={1}
              markedDates={marked.current}
              theme={theme.current}
            />
          )}
          <AgendaList
            sections={ITEMS}
            renderItem={renderItem}
            className="bg-gray-100 text-gray-600 capitalize"
            // sectionStyle="bg-gray-100 text-gray-600 capitalize"
          />
        </CalendarProvider>
      </View>
    </ScrollView>
  );
};

export default Calendar;
