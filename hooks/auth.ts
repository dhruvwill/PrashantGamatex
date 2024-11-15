import { useMutation, useQueryClient } from "@tanstack/react-query";
import { changePassword, login } from "~/services/auth";
import { useUserStore } from "~/store";
import { useState, useEffect } from "react";
import { router, useRouter } from "expo-router";
import { AuthResponse, LoginData } from "~/types/auth";
import { ErrorResponse } from "~/types/query";
import Toast from "react-native-toast-message";

export const useLogin = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const setUser = useUserStore((state) => state.setUser);

  return useMutation<AuthResponse, ErrorResponse, LoginData>({
    mutationFn: login,
    mutationKey: undefined,
    onSuccess: (data) => {
      setUser({
        data: {
          uid: data.payload.uid,
          username: data.payload.username,
          name: data.payload.name,
          company: data.payload.company,
        },
        token: data.token,
      });
      router.replace("/m_homepage");
      queryClient.invalidateQueries({
        queryKey: ["auth"],
      });
    },
  });
};

export const useLogout = () => {
  const clearUser = useUserStore((state) => state.clearUser);
  const clearToken = useUserStore((state) => state.clearToken);
  const router = useRouter();
  const queryClient = useQueryClient();
  queryClient.invalidateQueries({
    queryKey: ["auth"],
  });

  const logout = () => {
    clearUser();
    clearToken();
    router.replace("/signin");
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
      router.replace("/signin");
    }
  }, [user]);

  return { isAuthenticated, user };
};

export const useChangePassword = () => {
  return useMutation<unknown, ErrorResponse, any>({
    mutationKey: ["changePassword"],
    mutationFn: changePassword,
    onSuccess: () => {
      Toast.show({
        type: "success",
        text1: "Success",
        text2: "Password changed successfully",
      });
      router.replace("/(marketing)/m_homepage");
    },
    onError: (error) => {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: error.errorMessage,
      });
    },
  });
}
