import {
  View,
  TouchableOpacity,
  TextInput,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  ActivityIndicator,
} from "react-native";
import React, { useState } from "react";
import { useRouter } from "expo-router";
import { Separator } from "~/components/ui/separator";
import Toast from "react-native-toast-message";
import { z } from "zod";
import { useChangePassword } from "~/hooks/auth";
import { ErrorResponse } from "~/types/query";
import Feather from "@expo/vector-icons/Feather";

const PasswordChangePage = () => {
  const router = useRouter();

  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  const passwordChangeSchema = z
    .object({
      currentPassword: z
        .string()
        .min(8, "Password must be at least 8 characters"),
      confirmNewPassword: z
        .string()
        .min(8, "Password must be at least 8 characters"),
      newPassword: z
        .string()
        .min(8, "Password must be at least 8 characters")
        .regex(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
          "Password must contain at least one uppercase letter, one lowercase letter, one number and one special character"
        ),
    })
    .refine((data) => data.newPassword === data.confirmNewPassword, {
      message: "Passwords don't match",
      path: ["confirmNewPassword"],
    });

  const [errors, setErrors] = useState<any>({});
  const {
    mutateAsync,
    isPending: isSubmitting,
    isSuccess,
  } = useChangePassword();

  const [showPassword, setShowPassword] = useState({
    currentPassword: false,
    newPassword: false,
    confirmNewPassword: false,
  });

  const handleSubmit = async () => {
    setErrors({});
    try {
      const validatedForm = passwordChangeSchema.parse(form);
      setErrors({});
      await mutateAsync(validatedForm);
      if (isSuccess) {
        setForm({
          currentPassword: "",
          newPassword: "",
          confirmNewPassword: "",
        });
      }
    } catch (error:any) {
        if (error instanceof z.ZodError) {
            const newErrors: any = {};
            error.errors.forEach((err) => {
              newErrors[err.path[0]] = err.message;
            });
            Toast.show({
              type: "error",
              text1: "Error",
              text2: "Please check the form for errors",
            });
            setErrors(newErrors);
        } else {
            Toast.show({
            type: "error",
            text1: "Error",
            text2: error.errorMessage,
            });
        }
    }
  };

  return (
    <KeyboardAvoidingView behavior="padding">
      <View
        className={`${
          isSubmitting ? "" : "hidden"
        } z-50 bg-blue-100/40 absolute spinner h-screen w-screen flex justify-center items-center overflow-hidden`}
      >
        <ActivityIndicator size="large" />
      </View>
      <ScrollView keyboardShouldPersistTaps="handled">
        <View className="flex h-full mx-3 my-5">
          <View className="px-3">
            <Text className="text-3xl font-acumin_bold">Change Password</Text>
            <Text className="text-sm text-gray-500 font-acumin">
              Update your account password
            </Text>
            <Separator className="my-5 bg-gray-500" orientation="horizontal" />
          </View>

          <View className="px-3">
            <View className="mb-4">
              <View className="flex flex-row">
                <Text className="color-[#222] dark:text-gray-300 mb-2 text-lg font-acumin">
                  Current Password
                </Text>
                <Text className="text-red-500">*</Text>
              </View>
              <View className="flex flex-row items-center w-full h-10 native:h-12 border dark:bg-gray-800 ps-4 pr-9 rounded-lg text-base font-medium text-[#222] dark:text-gray-100">
                <TextInput
                  autoCorrect={false}
                  clearButtonMode="while-editing"
                  onChangeText={(currentPassword) =>
                    setForm({ ...form, currentPassword })
                  }
                  placeholder="Enter your Password"
                  placeholderTextColor="#6b7280"
                  className="h-10 native:h-12 w-full text-base font-medium text-[#222] dark:text-gray-100"
                  secureTextEntry={!showPassword.currentPassword}
                  value={form.currentPassword}
                />
                {showPassword.currentPassword ? (
                  <TouchableOpacity
                    onPress={() => {
                      setShowPassword({
                        ...showPassword,
                        currentPassword: false,
                      });
                    }}
                  >
                    <View className="h-10 native:h-12 flex items-center justify-center">
                      <Feather name="eye" size={20} color="gray" />
                    </View>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    onPress={() => {
                      setShowPassword({
                        ...showPassword,
                        currentPassword: true,
                      });
                    }}
                  >
                    <View className="h-10 native:h-12 flex items-center justify-center">
                      <Feather name="eye-off" size={20} color="gray" />
                    </View>
                  </TouchableOpacity>
                )}
              </View>
              {errors.currentPassword && (
                <Text className="text-red-500 mt-1">
                  {errors.currentPassword}
                </Text>
              )}
            </View>

            <View className="mb-4">
              <View className="flex flex-row">
                <Text className="color-[#222] dark:text-gray-300 mb-2 text-lg font-acumin">
                  New Password
                </Text>
                <Text className="text-red-500">*</Text>
              </View>
              <View className="flex flex-row items-center w-full h-10 native:h-12 border dark:bg-gray-800 ps-4 pr-9 rounded-lg text-base font-medium text-[#222] dark:text-gray-100">
                <TextInput
                  autoCorrect={false}
                  clearButtonMode="while-editing"
                  onChangeText={(newPassword) =>
                    setForm({ ...form, newPassword })
                  }
                  placeholder="Enter your Password"
                  placeholderTextColor="#6b7280"
                  className="h-10 native:h-12 w-full text-base font-medium text-[#222] dark:text-gray-100"
                  secureTextEntry={!showPassword.newPassword}
                  value={form.newPassword}
                />
                {showPassword.newPassword ? (
                  <TouchableOpacity
                    onPress={() => {
                      setShowPassword({
                        ...showPassword,
                        newPassword: false,
                      });
                    }}
                  >
                    <View className="h-10 native:h-12 flex items-center justify-center">
                      <Feather name="eye" size={20} color="gray" />
                    </View>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    onPress={() => {
                      setShowPassword({
                        ...showPassword,
                        newPassword: true,
                      });
                    }}
                  >
                    <View className="h-10 native:h-12 flex items-center justify-center">
                      <Feather name="eye-off" size={20} color="gray" />
                    </View>
                  </TouchableOpacity>
                )}
              </View>
              {errors.newPassword && (
                <Text className="text-red-500 mt-1">{errors.newPassword}</Text>
              )}
            </View>

            <View className="mb-4">
              <View className="flex flex-row">
                <Text className="color-[#222] dark:text-gray-300 mb-2 text-lg font-acumin">
                  Confirm New Password
                </Text>
                <Text className="text-red-500">*</Text>
              </View>
              <View className="flex flex-row items-center w-full h-10 native:h-12 border dark:bg-gray-800 ps-4 pr-9 rounded-lg text-base font-medium text-[#222] dark:text-gray-100">
                <TextInput
                  autoCorrect={false}
                  clearButtonMode="while-editing"
                  onChangeText={(confirmNewPassword) =>
                    setForm({ ...form, confirmNewPassword })
                  }
                  placeholder="Enter your Password"
                  placeholderTextColor="#6b7280"
                  className="h-10 native:h-12 w-full text-base font-medium text-[#222] dark:text-gray-100"
                  secureTextEntry={!showPassword.confirmNewPassword}
                  value={form.confirmNewPassword}
                />
                {showPassword.confirmNewPassword ? (
                  <TouchableOpacity
                    onPress={() => {
                      setShowPassword({
                        ...showPassword,
                        confirmNewPassword: false,
                      });
                    }}
                  >
                    <View className="h-10 native:h-12 flex items-center justify-center">
                      <Feather name="eye" size={20} color="gray" />
                    </View>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    onPress={() => {
                      setShowPassword({
                        ...showPassword,
                        confirmNewPassword: true,
                      });
                    }}
                  >
                    <View className="h-10 native:h-12 flex items-center justify-center">
                      <Feather name="eye-off" size={20} color="gray" />
                    </View>
                  </TouchableOpacity>
                )}
              </View>
              {errors.confirmNewPassword && (
                <Text className="text-red-500 mt-1">
                  {errors.confirmNewPassword}
                </Text>
              )}
            </View>

            <Separator className="my-5 bg-gray-500" orientation="horizontal" />

            <View>
              <TouchableOpacity onPress={handleSubmit}>
                <View className="flex-row items-center justify-center rounded-lg py-2 px-4 border border-[#007aff] bg-[#007aff]">
                  <Text className="text-lg font-semibold text-white">
                    Change Password
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default PasswordChangePage;
