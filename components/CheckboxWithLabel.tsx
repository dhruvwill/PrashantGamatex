import React from "react";
import { View } from "react-native";
import { Label } from "~/components/ui/label";
import Checkbox from "expo-checkbox";
type Props = {
  value: string;
  checked: boolean;
  onValueChange: (checked: boolean) => void;
  onLabelPress: (value: string) => void;
};

const CheckboxWithLabel = ({
  value,
  onLabelPress,
  checked,
  onValueChange,
}: Props) => {
  return (
    <View className={"flex-row gap-2 items-center"}>
      <Checkbox
        value={checked}
        onValueChange={(newValue) => {
          onValueChange(newValue);
        }}
        color={"#000000"}
      />
      <Label
        nativeID={`label-for-${value}`}
        onPress={() => {
          onLabelPress(value);
        }}
      >
        {value}
      </Label>
    </View>
  );
};

export default CheckboxWithLabel;
