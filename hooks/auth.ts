import { useMutation, useQueryClient } from "@tanstack/react-query";
import { login, register } from "~/services/auth";
import { useUserStore } from "~/store";
import { useState, useEffect } from "react";
import { useRouter } from "expo-router";

interface LoginData {
  username: string;
  password: string;
}

interface RegisterData {
  name: string;
  username: string;
  password: string;
}

interface AuthResponse {
  username: string;
  usercode: string;
  token: string;
}

export const useLogin = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const setToken = useUserStore((state) => state.setToken);
  const setUser = useUserStore((state) => state.setUser);

  return useMutation<AuthResponse, unknown, LoginData>({
    mutationFn: login,
    onSuccess: (data) => {
      setUser({
        username: data.username,
        usercode: data.usercode,
        token: data.token,
      });
      queryClient.invalidateQueries({
        queryKey: ["auth"],
      });
      router.replace("m_homepage");
    },
  });
};

export const useRegister = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation<AuthResponse, unknown, RegisterData>({
    mutationFn: register,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["auth"],
      });
      router.replace("signin");
    },
  });
};

export const useLogout = () => {
  const clearUser = useUserStore((state) => state.clearUser);
  const clearToken = useUserStore((state) => state.clearToken);
  const router = useRouter();

  const logout = () => {
    clearUser();
    clearToken();
    router.replace("signin");
  };

  return logout;
};

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const user = useUserStore((state) => state.user);
  const router = useRouter();

  useEffect(() => {
    if (user && user.token) {
      setIsAuthenticated(true);
    } else {
      router.replace("signin");
    }
  }, [user]);

  return { isAuthenticated };
};
