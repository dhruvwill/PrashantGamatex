import { View, Text, Button, Image } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, Link } from "expo-router";

const about = () => {
  const navigation = useNavigation();
  const toggletoHome = () => {
    navigation.navigate("homepage" as never);
  };
  return (
    <SafeAreaView>
      <View
        className="p-3 rounded-b-3xl"
        style={{ backgroundColor: "#0267B1dd" }}
      >
        <View className="flex flex-row items-center">
          <Ionicons name="chevron-back-outline" size={18} />
          <Text
            onPress={() => toggletoHome()}
            className="text-xl font-semibold"
          >
            Home
          </Text>
        </View>
        <View className="flex items-center mt-5 gap-8">
          <View className="w-[250px] h-[250px] overflow-hidden rounded-[40px]">
            <Image
              style={{ width: "100%", height: "100%" }}
              source={require("~/assets/images/logo.png")}
            />
          </View>
          <View className="flex flex-row gap-10">
            <Link href="#">
              <Ionicons name="logo-instagram" size={40} />
            </Link>
            <Link href="#">
              <Ionicons name="logo-linkedin" size={40} />
            </Link>
            <Link href="#">
              <Ionicons name="logo-facebook" size={40} />
            </Link>
            <Link href="#">
              <Ionicons name="logo-twitter" size={40} />
            </Link>
          </View>
        </View>
      </View>
      <View className="m-5 flex gap-3">
        <View>
          <Text className="text-5xl">About Us</Text>
        </View>
        <View>
          <Text>
            PRASHANT GROUP, established in 1975, is one of India's prominent and
            fast growing Textile Machine manufacturing companies. The Group has
            co-operations with leading European and American textile machine
            manufacturing companies which bring an edge in updated technology
            and enhancement in product profile.
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default about;
