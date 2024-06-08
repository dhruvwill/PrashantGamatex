import Animated, { FadeIn } from "react-native-reanimated";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import React, { useState } from "react";
import { Separator } from "./ui/separator";

interface CustomDropdownProps {
  title: string;
  itemsList: string[];
}

const CustomDropdown: React.FC<CustomDropdownProps> = ({
  title,
  itemsList,
}) => {
  const insets = useSafeAreaInsets();
  const contentInsets = {
    top: insets.top,
    bottom: insets.bottom,
    // left: 20,
    // right: 20,
  };
  return (
    <Select defaultValue={{ value: title, label: title }}>
      <SelectTrigger className="w-full">
        <SelectValue
          className="text-foreground text-sm native:text-lg"
          placeholder={`Select ${title}`}
        />
      </SelectTrigger>
      <SelectContent
        insets={contentInsets}
        className="bg-white dark:bg-black outline-none border-0 my-1 min-w-96"
      >
        <SelectGroup>
          <SelectLabel>{title}</SelectLabel>
          {itemsList.map((item: string, index) => (
            <SelectItem key={index} label={item} value={item}>
              {item}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default CustomDropdown;
