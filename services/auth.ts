import client from "~/api/client";
import { AuthResponse, LoginData, ErrorResponse } from "~/types/auth";

export const login = async (data: LoginData): Promise<AuthResponse> => {
  try {
    const response = await client.post("/auth/login", data);
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.data) {
      throw { errorMessage: error.response.data.error } as ErrorResponse;
    } else {
      throw { errorMessage: "An unexpected error occurred" } as ErrorResponse;
    }
  }
};
