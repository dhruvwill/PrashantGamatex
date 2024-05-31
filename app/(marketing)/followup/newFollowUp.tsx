import { View, Text } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'

const newfollowup = () => {
  return (
    <SafeAreaView className="h-full">
      <View className='flex items-center justify-center h-full'>
        <Text className='text-black dark:text-white' >Follow Up Form</Text>
      </View>
    </SafeAreaView>

  )
}

export default newfollowup