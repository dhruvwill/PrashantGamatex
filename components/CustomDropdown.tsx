import Animated, { FadeIn } from "react-native-reanimated";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Ionicons } from "@expo/vector-icons";
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
  const [open, setOpen] = useState(false);
  const [item, setItem] = useState(title);

  const handleSelectItem = (item: string) => {
    setItem(item);
    setOpen(false);
  };
  return (
    <DropdownMenu
      className="w-full flex flex-col"
      open={open}
      onOpenChange={(newVal) => {
        setOpen(newVal);
      }}
    >
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="flex flex-row justify-between border-0 h-11 bg-[#f1f5f9] dark:bg-gray-800 px-4 rounded-md font-medium dark:text-gray-100"
        >
          <Text className="text-gray-500">{item}</Text>
          <Ionicons name="chevron-down-outline" size={25} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-slate-200 border-0 my-1 w-96">
        <Animated.View entering={FadeIn.duration(200)} className="divide-y-2">
          {itemsList.map((item: string, index) => (
            <DropdownMenuItem
              key={index}
              onPress={() => handleSelectItem(item)}
            >
              <Text className="font-acumin text-sm text-gray-900">{item}</Text>
            </DropdownMenuItem>
          ))}
        </Animated.View>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default CustomDropdown;
