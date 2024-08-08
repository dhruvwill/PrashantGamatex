import client from "~/api/client";
import { useUserStore } from "~/store";
import { ExpenseForm, ExpenseObject } from "~/types/expense";
import { ErrorResponse } from "~/types/query";

export const getAllExpenses = async (): Promise<ExpenseObject> => {
  try {
    const response = await client.get("/user/expense/get", {
      headers: {
        Authorization: "Bearer " + useUserStore.getState().user?.token,
      },
    });
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.data) {
      throw { errorMessage: error.response.data.error } as ErrorResponse;
    } else {
      // throw { errorMessage: "An unexpected error occurred" } as ErrorResponse;
      throw { errorMessage: error.message } as ErrorResponse;
    }
  }
};

export const insertExpense = async (data: FormData): Promise<any> => {
  try {
    const response = await client.post("/user/expense/insert", data, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: "Bearer " + useUserStore.getState().user?.token,
      },
      transformRequest: (data, headers) => {
        return data;
      },
    });
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.data) {
      throw { errorMessage: error.response.data.error } as ErrorResponse;
    } else {
      // throw { errorMessage: "An unexpected error occurred" } as ErrorResponse;
      throw { errorMessage: error.message } as ErrorResponse;
    }
  }
};
