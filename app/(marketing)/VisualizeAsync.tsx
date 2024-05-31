import React, { useState, useEffect } from "react";
import { View, Text, Button } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const VisualizeAsyncStorageScreen = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const keys = await AsyncStorage.getAllKeys();
        const items = await AsyncStorage.multiGet(keys);
        setData(items);
      } catch (error) {
        console.error("Error fetching data from AsyncStorage:", error);
      }
    };

    fetchData();
  }, []);

  const clearAsyncStorage = async () => {
    try {
      await AsyncStorage.clear();
      setData([]);
    } catch (error) {
      console.error("Error clearing AsyncStorage:", error);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      {data.map(([key, value]) => (
        <Text key={key}>{`${key}: ${value}`}</Text>
      ))}
      {data.length > 0 && (
        <Button title="Clear AsyncStorage" onPress={clearAsyncStorage} />
      )}
    </View>
  );
};

export default VisualizeAsyncStorageScreen;
