import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Toast from "react-native-toast-message";
import { getAllExpenses, insertExpense } from "~/services/expense";
import { useUserStore } from "~/store";
import { ExpenseForm, ExpenseObject } from "~/types/expense";
import { ErrorResponse } from "~/types/query";

export const useExpenseInsert = () => {
  const queryClient = useQueryClient();
  return useMutation<unknown, ErrorResponse, FormData>({
    mutationFn: insertExpense,
    mutationKey: ["insertExpense"],
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["getExpenses"],
      });
      Toast.show({
        type: "success",
        text1: "Success",
        text2: "Expense Inserted Successfully",
        visibilityTime: 3000,
      });
    },
    onError: (error) => {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: error.errorMessage,
        text2Style: {
          fontSize: 12,
        },
        visibilityTime: 3000,
      });
    },
  });
};

export const useExpenses = () => {
  return useQuery<any, ErrorResponse, ExpenseObject[]>({
    queryKey: ["getExpenses"],
    queryFn: getAllExpenses,
  });
};
