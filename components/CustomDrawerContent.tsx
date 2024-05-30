import { View, Text, Image } from "react-native";
import React from "react";
import {
  DrawerContentScrollView,
  DrawerItem,
  DrawerItemList,
} from "@react-navigation/drawer";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { FontAwesome } from "@expo/vector-icons";

const CustomDrawerContent = (props: any) => {
  const handleLogout = () => {
    console.log("Logout");
  };
  const { top, bottom } = useSafeAreaInsets();
  return (
    <View className="flex-1">
      <DrawerContentScrollView
        {...props}
        scrollEnabled={false}
        contentContainerClassName="flex h-full justify-between px-3"
      >
        <View>
          <View className="flex justify-center px-5 pt-5 pb-10">
            <Image source={require("~/assets/images/logoWithHeading.png")} />
          </View>
          <View>
            <DrawerItemList {...props} />
          </View>
        </View>
        <View
        style={{ paddingBottom: bottom }}
        >
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
      </DrawerContentScrollView>
    </View>
  );
};

export default CustomDrawerContent;
