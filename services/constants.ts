import client from "~/api/client";
import { ErrorResponse } from "~/types/query";

export const getConstants = async (token: string | undefined): Promise<any> => {
  try {
    const response = await client.get("/const/get", {
      headers: {
        Authorization: token ? `Bearer ${token}` : undefined,
      },
    });
    return response.data[0];
  } catch (error: any) {
    if (error.response && error.response.data) {
      throw { errorMessage: error.response.data.error } as ErrorResponse;
    } else {
      throw { errorMessage: error.message } as ErrorResponse;
    }
  }
};
