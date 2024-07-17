import { useEffect } from "react";
import { View } from "react-native";
import { ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
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
    if (defaultValue && onChange) {
      onChange(defaultValue.value);
    }
  }, []);
  return (
    <ScrollView className="max-h-[80px]">
      <Select
        defaultValue={
          defaultValue
            ? { value: defaultValue.value, label: defaultValue.label }
            : options[0]
        }
        onValueChange={(option) => {
          if (onChange) {
            onChange(option!.value);
          }
        }}
      >
        <SelectTrigger className="w-full">
          <SelectValue
            className="text-foreground text-sm native:text-lg"
            placeholder={placeholder}
          />
        </SelectTrigger>
        <SelectContent
          insets={contentInsets}
          className="bg-white dark:bg-black border-0 my-1 w-full mx-3"
        >
          <ScrollView className="max-h-32">
            <SelectGroup>
              {optionLabel && <SelectLabel>{optionLabel}</SelectLabel>}
              {/* <SelectItem label="Apple" value="apple">
              Apple
            </SelectItem>
            <SelectItem label="Banana" value="banana">
              Banana
            </SelectItem>
            <SelectItem label="Blueberry" value="blueberry">
              Blueberry
            </SelectItem>
            <SelectItem label="Grapes" value="grapes">
              Grapes
            </SelectItem>
            <SelectItem label="Pineapple" value="pineapple">
              Pineapple
            </SelectItem> */}
              {options.map((option) => (
                <SelectItem
                  key={option.value}
                  label={option.label}
                  value={option.value}
                >
                  {option.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </ScrollView>
        </SelectContent>
      </Select>
    </ScrollView>
  );
}
