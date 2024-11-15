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

const PasswordChangePage = () => {
  const router = useRouter();

  const [form, setForm] = useState({
    currentPassword: "",
    confirmCurrentPassword: "",
    newPassword: "",
  });

  const passwordChangeSchema = z
    .object({
      currentPassword: z
        .string()
        .min(8, "Password must be at least 8 characters"),
      confirmCurrentPassword: z
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
    .refine((data) => data.currentPassword === data.confirmCurrentPassword, {
      message: "Passwords don't match",
      path: ["confirmCurrentPassword"],
    });

  const [errors, setErrors] = useState<any>({});
  const {
    mutateAsync,
    isPending: isSubmitting,
    isSuccess,
  } = useChangePassword();

  const handleSubmit = async () => {
    setErrors({});
    try {
      const validatedForm = passwordChangeSchema.parse(form);
      setErrors({});

      await mutateAsync(validatedForm);
      if (isSuccess) {
        setForm({
          currentPassword: "",
          confirmCurrentPassword: "",
          newPassword: "",
        });
      }
      router.replace("/(marketing)/m_homepage");
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
            <Text className="text-muted text-sm text-gray-500 font-acumin">
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
              <TextInput
                secureTextEntry
                autoCorrect={false}
                clearButtonMode="while-editing"
                onChangeText={(currentPassword) =>
                  setForm({ ...form, currentPassword })
                }
                placeholder="Enter current password"
                placeholderTextColor="#6b7280"
                className={`h-10 native:h-12 border dark:bg-gray-800 px-4 rounded-lg text-base font-medium text-[#222] dark:text-gray-100 ${
                  errors.currentPassword ? "border-red-500" : ""
                }`}
                value={form.currentPassword}
              />
              {errors.currentPassword && (
                <Text className="text-red-500 mt-1">
                  {errors.currentPassword}
                </Text>
              )}
            </View>

            <View className="mb-4">
              <View className="flex flex-row">
                <Text className="color-[#222] dark:text-gray-300 mb-2 text-lg font-acumin">
                  Confirm Current Password
                </Text>
                <Text className="text-red-500">*</Text>
              </View>
              <TextInput
                secureTextEntry
                autoCorrect={false}
                clearButtonMode="while-editing"
                onChangeText={(confirmCurrentPassword) =>
                  setForm({ ...form, confirmCurrentPassword })
                }
                placeholder="Confirm current password"
                placeholderTextColor="#6b7280"
                className={`h-10 native:h-12 border dark:bg-gray-800 px-4 rounded-lg text-base font-medium text-[#222] dark:text-gray-100 ${
                  errors.confirmCurrentPassword ? "border-red-500" : ""
                }`}
                value={form.confirmCurrentPassword}
              />
              {errors.confirmCurrentPassword && (
                <Text className="text-red-500 mt-1">
                  {errors.confirmCurrentPassword}
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
              <TextInput
                secureTextEntry
                autoCorrect={false}
                clearButtonMode="while-editing"
                onChangeText={(newPassword) =>
                  setForm({ ...form, newPassword })
                }
                placeholder="Enter new password"
                placeholderTextColor="#6b7280"
                className={`h-10 native:h-12 border dark:bg-gray-800 px-4 rounded-lg text-base font-medium text-[#222] dark:text-gray-100 ${
                  errors.newPassword ? "border-red-500" : ""
                }`}
                value={form.newPassword}
              />
              {errors.newPassword && (
                <Text className="text-red-500 mt-1">{errors.newPassword}</Text>
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
