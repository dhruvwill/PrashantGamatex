import client from "~/api/client";
import { AuthResponse, LoginData } from "~/types/auth";
import { ErrorResponse } from "~/types/query";

export const login = async (data: LoginData): Promise<AuthResponse> => {
  try {
    const user = {
      username: data.username,
      password: data.password,
      company: data.company,
    };
    const response = await client.post("/auth/login", {
      user,
    });
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.data) {
      throw { errorMessage: error.response.data.error } as ErrorResponse;
    } else {
      throw { errorMessage: error.name } as ErrorResponse;
    }
  }
};
