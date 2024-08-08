import React, { useState } from "react";
import {
  View,
  ActivityIndicator,
  FlatList,
  RefreshControl,
  ListRenderItem,
} from "react-native";
View;
import { Text } from "~/components/ui/text";
import { useQueryClient } from "@tanstack/react-query";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import { Separator } from "~/components/ui/separator";
import { useExpenses } from "~/hooks/expense"; // Assume you have this hook
import { ExpenseObject } from "~/types/expense";
import { ErrorResponse } from "~/types/query";
import { ScrollView } from "react-native-gesture-handler";

// Define props for ExpenseCard
interface ExpenseCardProps {
  date: string;
  amount: number;
  companyName: string;
}

const ExpenseCard: React.FC<ExpenseCardProps> = ({
  date,
  amount,
  companyName,
}) => {
  // Format date using built-in Date methods
  const formattedDate = new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  // Format currency using built-in Intl.NumberFormat
  const formattedAmount = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
  }).format(amount);

  return (
    <View className="bg-white p-4 rounded-lg shadow-md mb-3 border border-gray-200">
      <View className="flex-row justify-between items-center mb-2">
        <Text className="text-lg font-semibold text-gray-800">
          {companyName}
        </Text>
        <Text className="text-lg font-bold text-green-600">
          {formattedAmount}
        </Text>
      </View>
      <View className="flex-row justify-between items-center">
        <Text className="text-sm text-gray-500">{formattedDate}</Text>
        <View className="bg-blue-100 px-2 py-1 rounded">
          <Text className="text-xs text-blue-800 font-medium">Expense</Text>
        </View>
      </View>
    </View>
  );
};

const ExpenseList: React.FC = () => {
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const { data: allExpenses, isLoading, error, refetch } = useExpenses();
  const queryClient = useQueryClient();

  const onRefresh = async (): Promise<void> => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const renderItem: ListRenderItem<ExpenseObject> = ({ item }) => (
    <ExpenseCard
      date={item.ExpDate}
      amount={item.ExpAmount}
      companyName={item.CustomerName}
    />
  );

  return (
    <ScrollView
      keyboardShouldPersistTaps="handled"
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <StatusBar style="auto" />
      <View className="flex-1 mx-3 my-5">
        <View className="px-3">
          <Text className="text-3xl font-bold">Expenses</Text>
          <Text className="text-sm text-gray-500">List of All Expenses</Text>
          <Separator className="my-5 bg-gray-500" orientation="horizontal" />
        </View>
        {isLoading ? (
          <View className="flex-1 justify-center items-center">
            <ActivityIndicator size="large" color="#0000ff" />
          </View>
        ) : error ? (
          <View className="flex-1 justify-center px-3 my-3">
            <Text className="text-lg text-red-500 font-semibold">Error</Text>
            <Text className="text-md text-red-500">
              {(error as ErrorResponse).errorMessage ||
                "An unexpected error occurred. Please try again later."}
            </Text>
          </View>
        ) : allExpenses?.length === 0 ? (
          <View className="flex-1 justify-center px-3 my-3">
            <Text className="text-lg text-gray-500 font-semibold">
              No Expenses Found
            </Text>
            <Text className="text-md text-gray-500">
              No expenses found. Please add some expenses to view them here.
            </Text>
          </View>
        ) : (
          <FlatList<ExpenseObject>
            className="px-3"
            data={allExpenses}
            renderItem={renderItem}
            keyExtractor={(item, index) => index.toString()}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          />
        )}
      </View>
    </ScrollView>
  );
};

export default ExpenseList;
