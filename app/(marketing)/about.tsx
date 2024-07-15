import React from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  Pressable,
  Linking,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const AboutPage = () => {
  const openLink = (url: string) => {
    Linking.openURL(url);
  };

  return (
    <ScrollView className="flex-1 bg-gray-50">
      <View className="py-12 px-6">
        <View className="items-center mb-8">
          <Image
            source={require("assets/images/logo.png")}
            className="w-32 h-32 rounded-full"
          />
          <Text className="text-3xl font-bold mt-4 text-gray-800">
            Our Company
          </Text>
          <Text className="text-lg text-gray-600 mt-2">
            Innovating for a better tomorrow
          </Text>
        </View>

        <View className="bg-white rounded-lg shadow-md p-6 mb-8">
          <Text className="text-xl font-semibold mb-4 text-gray-800">
            Our Mission
          </Text>
          <Text className="text-gray-600 leading-relaxed">
            We strive to create innovative solutions that improve people's lives
            and contribute to a sustainable future. Our team is dedicated to
            pushing the boundaries of technology while maintaining the highest
            standards of quality and ethics.
          </Text>
        </View>

        <View className="bg-white rounded-lg shadow-md p-6 mb-8">
          <Text className="text-xl font-semibold mb-4 text-gray-800">
            Our Values
          </Text>
          <View className="space-y-4">
            {["Innovation", "Integrity", "Collaboration", "Excellence"].map(
              (value, index) => (
                <View key={index} className="flex-row items-center">
                  <Ionicons name="checkmark-circle" size={24} color="#4F46E5" />
                  <Text className="text-gray-700 ml-2 text-lg">{value}</Text>
                </View>
              )
            )}
          </View>
        </View>

        <View className="bg-white rounded-lg shadow-md p-6 mb-8">
          <Text className="text-xl font-semibold mb-4 text-gray-800">
            Connect With Us
          </Text>
          <View className="flex-row justify-around">
            <Pressable
              onPress={() => openLink("https://twitter.com/ourcompany")}
            >
              <Ionicons name={"logo-twitter"} size={32} color="#4F46E5" />
            </Pressable>
            <Pressable
              onPress={() => openLink("https://twitter.com/ourcompany")}
            >
              <Ionicons name={"logo-linkedin"} size={32} color="#4F46E5" />
            </Pressable>
            <Pressable
              onPress={() => openLink("https://twitter.com/ourcompany")}
            >
              <Ionicons name={"logo-instagram"} size={32} color="#4F46E5" />
            </Pressable>
          </View>
        </View>

        <Pressable
          className="bg-indigo-600 py-3 px-6 rounded-full self-center"
          onPress={() => openLink("https://ourcompany.com/contact")}
        >
          <Text className="text-white font-semibold text-lg">Contact Us</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
};

export default AboutPage;
