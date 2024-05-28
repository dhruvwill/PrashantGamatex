import { View, Text } from 'react-native'
import React from 'react'
import { Tabs } from 'expo-router'
import FontAwesome from "@expo/vector-icons/FontAwesome";

const _layout = () => {
    return (
        <Tabs screenOptions={{ tabBarActiveTintColor: "red" }}>
            <Tabs.Screen
                name='newLead'
                options={
                    {
                        title: 'New Lead',
                        tabBarIcon: ({ color }) => (
                            <FontAwesome size={28} name='plus' color={color} />
                        ),
                        headerShown: false
                    }
                }
            />
            <Tabs.Screen
                name='leadList'
                options={
                    {
                        title: 'Lead List',
                        tabBarIcon: ({ color }) => (
                            <FontAwesome size={28} name='list' color={color} />
                        ),
                        headerShown: false
                    }
                }
            />
            <Tabs.Screen 
                name='report'
                options={
                    {
                        title: 'Report',
                        tabBarIcon: ({ color }) => (
                            <FontAwesome size={28} name='file' color={color} />
                        ),
                        headerShown: false
                    }
                }
            />
        </Tabs>
    )
}

export default _layout