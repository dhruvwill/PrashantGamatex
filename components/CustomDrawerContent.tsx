import React from "react";
import { View, Text, Image } from "react-native";
import {
  DrawerContentScrollView,
  DrawerItem,
  DrawerItemList,
} from "@react-navigation/drawer";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { FontAwesome } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useAuth } from "~/hooks/auth"; // Make sure this path is correct

const CustomDrawerContent = (props: any) => {
  const handleLogout = () => {
    router.replace("/signin");
  };
  const { top, bottom } = useSafeAreaInsets();
  const router = useRouter();
  const { user } = useAuth();

  return (
    <View className="flex-1 justify-between">
      <DrawerContentScrollView
        {...props}
        scrollEnabled={false}
        contentContainerClassName="flex h-full justify-between"
      >
        <View>
          <View className="flex justify-center px-5 pt-5 pb-10">
            <Image source={require("~/assets/images/logoWithHeading.png")} />
          </View>
          <View>
            <DrawerItemList {...props}  />
          </View>
        </View>
      </DrawerContentScrollView>
      <View style={{ paddingBottom: bottom }}>
        {/* Profile Information */}
        <View className="px-5 py-4 border-b border-gray-200 flex-row items-center">
          <View className="w-12 h-12 bg-gray-300 rounded-full justify-center items-center mr-3">
            <FontAwesome name="user" size={24} color="white" />
          </View>
          <View>
            <Text className="text-lg font-bold">{user?.data.name}</Text>
            <Text className="text-sm text-gray-600">
              {user?.data.company || "@prashant"}
            </Text>
          </View>
        </View>
        {/* Logout Button */}
        <DrawerItem
          icon={({ color, size }) => (
            <Text style={{ color: color, fontSize: size }}>
              <FontAwesome size={24} name="sign-out" color={"red"} />
            </Text>
          )}
          label={"Logout"}
          labelStyle={{ color: "red" }}
          onPress={() => handleLogout()}
        />
      </View>
    </View>
  );
};

export default CustomDrawerContent;
