import client from "~/api/client";
import { useUserStore } from "~/store";
import { AuthResponse, ChangePasswordData, LoginData } from "~/types/auth";
import { ErrorResponse } from "~/types/query";

export const login = async (data: LoginData, pushToken?: string): Promise<AuthResponse> => {
  try {
    const user = {
      username: data.username,
      password: data.password,
      company: data.company,
      deviceName: data.DeviceName,
      pushToken: pushToken,
    };
    
    console.log("login: ",user);
    
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

export const changePassword = async (data: ChangePasswordData): Promise<any> => {
  try {
    const response = await client.patch("/user/password", data, {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + useUserStore.getState().user?.token,
      },
    });
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.data) {
      throw { errorMessage: error.response.data.error } as ErrorResponse;
    } else {
      throw { errorMessage: error.name } as ErrorResponse;
    }
  }
}
