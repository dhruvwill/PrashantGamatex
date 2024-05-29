import { useNavigation } from "expo-router"
import { DrawerActions } from "@react-navigation/native"
import FontAwesome6 from "@expo/vector-icons/FontAwesome6"
import React from "react"  
import { View } from "react-native"
const MenuIcon = () => {
    const navigation = useNavigation()
    const toggle = () => {
        navigation.dispatch(DrawerActions.toggleDrawer())
    }
    return (
        <View>
            <FontAwesome6 size={20} color={"#0776f5"} name="bars" onPress={toggle} className="ml-8"/>
        </View>
    )
}

export default MenuIcon