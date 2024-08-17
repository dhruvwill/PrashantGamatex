import React, { useCallback } from "react";
import { Alert, View, Text, TouchableOpacity, Button } from "react-native";
import testIDs from "./testIDs";

interface ItemProps {
  item: any;
}

const AgendaItem = (props: ItemProps) => {
  const { item } = props;

  const buttonPressed = useCallback(() => {
    Alert.alert("Show me more");
  }, []);

  const itemPressed = useCallback(() => {
    Alert.alert(item.title);
  }, []);

  const isItemEmpty = (obj: any) => {
    return Object.keys(obj).length === 0;
  };

  if (isItemEmpty(item)) {
    return (
      <View className="pl-5 h-13 justify-center border-b border-gray-300">
        <Text className="text-gray-300 text-sm">No Events Planned Today</Text>
      </View>
    );
  }

  return (
    <TouchableOpacity onPress={itemPressed} testID={testIDs.agenda.ITEM}>
      <View className="bg-white border-b border-gray-300 flex flex-row gap-3 py-2">
        <View className="flex items-center">
          <Text className="text-black">{item.hour}</Text>
          <Text className="text-gray-500 text-xs mt-1 ml-1">
            {item.duration}
          </Text>
        </View>
        <Text className="text-black ml-4 font-bold text-base">
          {item.title}
        </Text>
        {/* <View className="flex-1 items-end">
          <Button color="grey" title="Info" onPress={buttonPressed} />
        </View> */}
      </View>
    </TouchableOpacity>
  );
};

export default AgendaItem;
// export default React.memo(AgendaItem);
