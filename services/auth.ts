import client from "~/api/client";

export interface LoginData {
  username: string;
  password: string;
}

export interface RegisterData {
  name: string;
  username: string;
  password: string;
}

export interface AuthResponse {
  username: string;
  usercode: string;
  token: string;
}

export const login = async (data: LoginData): Promise<AuthResponse> => {
  const response = await client.post("/login", data);
  return response.data;
};

export const register = async (data: RegisterData): Promise<AuthResponse> => {
  const response = await client.post("/register", data);
  return response.data;
};
