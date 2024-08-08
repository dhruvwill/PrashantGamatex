import { useRouter } from "expo-router";
import { useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { ActivityIndicator } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
  SelectGroup,
  SelectItem,
} from "~/components/ui/select";
import { useLogin } from "~/hooks/auth";
import { LoginData } from "~/types/auth";

export default function Example() {
  const [form, setForm] = useState<LoginData>({
    username: "",
    password: "",
    company: "PrashantGamatex",
  });
  const router = useRouter();
  const login = useLogin();
  const insets = useSafeAreaInsets();

  const companies = [
    {
      name: "Prashant Gamatex",
      value: "PrashantGamatex",
    },
    {
      name: "Prashant WestPoint",
      value: "WestPoint",
    },
    {
      name: "Prashant Ferber",
      value: "Ferber",
    },
  ];

  return (
    <SafeAreaView className="flex-1 ">
      <View className="p-6 flex-grow flex-shrink">
        <View className="my-9">
          <Text className="text-4xl text-neutral-900 dark:text-gray-200 font-bold mb-1.5 text-center">
            Welcome back!
          </Text>

          <Text className="text-center font-medium color-[#929292] text-base">
            Sign in to your account
          </Text>
        </View>

        <View className="mb-6">
          <View className="mb-4">
            <Text className="color-[#222] dark:text-gray-300 font-semibold mb-2 text-lg">
              Username
            </Text>

            <TextInput
              autoCapitalize="none"
              autoCorrect={false}
              clearButtonMode="while-editing"
              keyboardType="default"
              onChangeText={(username) => setForm({ ...form, username })}
              placeholder="Enter your Username"
              placeholderTextColor="#6b7280"
              className="h-10 native:h-12 border dark:bg-gray-800 w-full px-4 rounded-lg text-base font-medium text-[#222] dark:text-gray-100"
              value={form.username}
            />
          </View>

          <View className="mb-4">
            <Text className="color-[#222] dark:text-gray-300 font-semibold mb-2 text-lg">
              Password
            </Text>

            <TextInput
              autoCorrect={false}
              clearButtonMode="while-editing"
              onChangeText={(password) => setForm({ ...form, password })}
              placeholder="Enter your Password"
              placeholderTextColor="#6b7280"
              className="h-10 native:h-12 border dark:bg-gray-800 w-full px-4 rounded-lg text-base font-medium text-[#222] dark:text-gray-100"
              secureTextEntry={true}
              value={form.password}
            />
          </View>
          <View className="mb-4">
            <Text className="color-[#222] dark:text-gray-300 font-semibold mb-2 text-lg">
              Company
            </Text>
            <Select
              defaultValue={{
                value: companies[0].value,
                label: companies[0].name,
              }}
              onValueChange={(company: any) =>
                setForm({ ...form, company: company.value })
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue
                  className="text-foreground text-sm native:text-lg"
                  placeholder={`Select company`}
                />
              </SelectTrigger>
              <SelectContent
                insets={{
                  top: insets.top,
                  bottom: insets.bottom,
                  // left: 20,
                  // right: 20,
                }}
                className="bg-white dark:bg-black border-0 my-1 min-w-96"
              >
                <SelectGroup>
                  {companies.map((item) => (
                    <SelectItem
                      key={item.value}
                      label={item.name}
                      value={item.value}
                    >
                      {item.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </View>

          {login.isError && (
            <View>
              <Text className="text-red-500 font-semibold text-center">
                {login.error.errorMessage}
              </Text>
            </View>
          )}
          <View className="my-6">
            <TouchableOpacity
              onPress={() => {
                login.mutate(form);
              }}
            >
              <View className="flex-row items-center justify-center rounded-lg py-2 px-4 border border-[#007aff] bg-[#007aff]">
                <Text className=" text-lg font-semibold text-white">
                  Sign in
                </Text>
                {login.isPending && (
                  <ActivityIndicator
                    className="ml-2"
                    color="#fff"
                    size="small"
                  />
                )}
              </View>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            onPress={() => {
              // handle link
            }}
          >
            <Text className="text-base font-medium color-[#222] dark:text-gray-400 text-center">
              Don't have an account? <Text className="underline">Sign up</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
