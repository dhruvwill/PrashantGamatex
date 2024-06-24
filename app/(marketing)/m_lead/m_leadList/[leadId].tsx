import { View, Text } from "react-native";
import React, { useEffect } from "react";
import { useLocalSearchParams, useNavigation } from "expo-router";

const index = () => {
  const { leadId } = useLocalSearchParams<{ leadId: string | string[] }>();
  const navigation = useNavigation();
  useEffect(() => {
    navigation.setOptions({
      headerTitle: "Edit Lead #" + leadId,
      headerTitleStyle: {
        fontFamily: "acumin",
      },
      headerTitleAlign: "center",
      headerStyle: {
        backgroundColor: "steelblue",
      },
    });
  }, [leadId]);

  return (
    <View>
      <Text>{leadId}</Text>
    </View>
  );
};

export default index;
