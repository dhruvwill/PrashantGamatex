import { useRouter } from "expo-router";
import { useState } from "react";
import {
    SafeAreaView,
    View,
    Text,
    TouchableOpacity,
    TextInput,
} from "react-native";
import { useUserStore } from "~/store";

const m_newLead = () => {
    const [form, setForm] = useState({
        username: "",
        password: "",
    });
    const router = useRouter();
    return (
        <SafeAreaView className="h-full">
            <View className='flex h-full mx-3'>
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
                            className="h-11 bg-[#f1f5f9] dark:bg-gray-800 px-4 rounded-lg text-base font-medium text-[#222] dark:text-gray-100"
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
                            className="h-11 bg-[#f1f5f9] dark:bg-gray-800 px-4 rounded-lg text-base font-medium text-[#222] dark:text-gray-100"
                            secureTextEntry={true}
                            value={form.password}
                        />
                    </View>

                    <View className="my-6">
                        <TouchableOpacity
                            onPress={() => {
                                router.replace("homepage");
                            }}
                        >
                            <View className="flex-row items-center justify-center rounded-lg py-2 px-4 border border-[#007aff] bg-[#007aff]">
                                <Text className=" text-lg font-semibold text-white">
                                    Sign in
                                </Text>
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
    )
}

export default m_newLead