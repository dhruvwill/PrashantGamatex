import { View, Text } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

const m_leadList = () => {
    return (
        <SafeAreaView className="h-full">
            <View className='flex items-center justify-center h-full'>
                <Text className='text-black dark:text-white'>List of Pending Leads</Text>
            </View>
        </SafeAreaView>
    )
}

export default m_leadList