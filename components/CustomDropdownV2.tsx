import { useEffect } from "react";
import { View } from "react-native";
import { FlatList, ScrollView } from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";

type CustomDropdownProps = {
  children?: never;
  defaultValue?: { value: string; label: string };
  options: { value: string; label: string }[];
  optionLabel?: string;
  placeholder: string;
  onChange?: (value: string) => void;
};
export default function CustomDropdown({
  defaultValue,
  options,
  optionLabel,
  children,
  placeholder,
  onChange,
}: CustomDropdownProps) {
  const insets = useSafeAreaInsets();
  const contentInsets = {
    top: insets.top,
    bottom: insets.bottom,
    left: 12,
    right: 12,
  };

  useEffect(() => {
    if (defaultValue) {
      onChange?.(defaultValue.value);
    }
    return () => {};
  }, []);

  return (
    <Select
      defaultValue={defaultValue}
      onValueChange={(option) => {
        if (onChange) {
          onChange(option!.value);
        }
      }}
    >
      <SelectTrigger className="w-full border border-gray-900">
        <SelectValue
          className="text-foreground text-sm native:text-lg"
          placeholder={"Select " + placeholder}
        />
      </SelectTrigger>
      <SelectContent
        insets={contentInsets}
        className="bg-white dark:bg-black border border-input shadow-md my-1 w-full"
      >
        <SelectGroup>
          {optionLabel && <SelectLabel>{optionLabel}</SelectLabel>}
          <FlatList
            data={options}
            renderItem={({ item }) => (
              <View key={item.value}>
                <SelectItem
                  key={item.value}
                  label={item.label}
                  value={item.value}
                >
                  {item.label}
                </SelectItem>
              </View>
            )}
            keyExtractor={(item) => item.value}
            ItemSeparatorComponent={() => <SelectSeparator className="bg-gray-200" />}
            style={{ maxHeight: 240 }}
          />
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
