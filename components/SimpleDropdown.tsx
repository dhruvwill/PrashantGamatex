import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Modal,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface Option {
  value: string;
  label: string;
}

interface SimpleDropdownProps {
  options: Option[];
  placeholder: string;
  value?: string;
  onChange: (value: string) => void;
}

const SimpleDropdown: React.FC<SimpleDropdownProps> = ({
  options,
  placeholder,
  value,
  onChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const selectedOption = options.find(option => option.value === value);

  const handleSelect = (selectedValue: string) => {
    onChange(selectedValue);
    setIsOpen(false);
  };

  return (
    <View>
      {/* Trigger */}
      <TouchableOpacity
        onPress={() => setIsOpen(true)}
        className="h-12 border border-gray-300 rounded-lg px-4 bg-gray-50 flex-row items-center justify-between"
      >
        <Text className={`font-acumin ${selectedOption ? 'text-black' : 'text-gray-600'}`}>
          {selectedOption ? selectedOption.label : placeholder}
        </Text>
        <Ionicons 
          name={isOpen ? "chevron-up-outline" : "chevron-down-outline"} 
          size={20} 
          color="#666666" 
        />
      </TouchableOpacity>

      {/* Dropdown Modal */}
      <Modal
        visible={isOpen}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsOpen(false)}
      >
        <TouchableOpacity
          style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' }}
          activeOpacity={1}
          onPress={() => setIsOpen(false)}
        >
          <View className="flex-1 justify-center items-center px-4">
            <View className="bg-white rounded-lg max-w-sm w-full max-h-96 shadow-lg">
              {/* Header */}
              <View className="p-4 border-b border-gray-200 flex-row items-center justify-between">
                <Text className="text-lg font-acumin_bold">Select Option</Text>
                <TouchableOpacity onPress={() => setIsOpen(false)}>
                  <Ionicons name="close" size={24} color="black" />
                </TouchableOpacity>
              </View>

              {/* Options */}
              <ScrollView className="max-h-64">
                {options.map((option) => (
                  <TouchableOpacity
                    key={option.value}
                    onPress={() => handleSelect(option.value)}
                    className={`p-4 border-b border-gray-100 flex-row items-center justify-between ${
                      value === option.value ? 'bg-blue-50' : ''
                    }`}
                  >
                    <Text className={`font-acumin ${
                      value === option.value ? 'text-blue-600 font-acumin_bold' : 'text-gray-800'
                    }`}>
                      {option.label}
                    </Text>
                    {value === option.value && (
                      <Ionicons name="checkmark" size={20} color="#3b82f6" />
                    )}
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

export default SimpleDropdown; 