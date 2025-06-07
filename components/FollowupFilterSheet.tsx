import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  TextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";

export interface FollowupFilterOptions {
  partyName?: string;
  machineName?: string;
  fromDate?: Date;
  toDate?: Date;
  minQuantity?: number;
  maxQuantity?: number;
}

interface FollowupFilterSheetProps {
  isVisible: boolean;
  onClose: () => void;
  onApplyFilter: (filters: FollowupFilterOptions) => void;
  onClearFilter: () => void;
  currentFilters: FollowupFilterOptions;
  title?: string;
}

const FollowupFilterSheet: React.FC<FollowupFilterSheetProps> = ({
  isVisible,
  onClose,
  onApplyFilter,
  onClearFilter,
  currentFilters,
  title = "Filter Followups",
}) => {
  const [filters, setFilters] = useState<FollowupFilterOptions>(currentFilters);
  const [showFromDatePicker, setShowFromDatePicker] = useState(false);
  const [showToDatePicker, setShowToDatePicker] = useState(false);

  useEffect(() => {
    setFilters(currentFilters);
  }, [currentFilters]);

  const handleApplyFilter = () => {
    onApplyFilter(filters);
    onClose();
  };

  const handleClearFilter = () => {
    const emptyFilters: FollowupFilterOptions = {};
    setFilters(emptyFilters);
    onClearFilter();
    onClose();
  };

  const hasActiveFilters = () => {
    return Object.values(filters).some(value => 
      value !== undefined && 
      value !== null && 
      value !== "" && 
      (typeof value !== 'number' || !isNaN(value))
    );
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString();
  };

  return (
    <Modal visible={isVisible} animationType="slide" presentationStyle="pageSheet">
      <SafeAreaView className="flex-1 bg-white">
        {/* Header */}
        <View className="flex-row items-center justify-between p-4 border-b border-gray-200">
          <Text className="text-xl font-acumin_bold">{title}</Text>
          <TouchableOpacity onPress={onClose}>
            <Ionicons name="close" size={24} color="black" />
          </TouchableOpacity>
        </View>

        <ScrollView className="flex-1 p-4">
          {/* Party Name Filter */}
          <View className="mb-4">
            <Text className="text-lg font-acumin mb-2 text-gray-700">Party Name</Text>
            <TextInput
              className="h-12 border border-gray-300 rounded-lg px-4 bg-gray-50 font-acumin"
              placeholder="Enter party name..."
              value={filters.partyName || ""}
              onChangeText={(text) => setFilters(prev => ({ ...prev, partyName: text }))}
              placeholderTextColor="#666666"
            />
          </View>

          {/* Machine Name Filter */}
          <View className="mb-4">
            <Text className="text-lg font-acumin mb-2 text-gray-700">Machine Name</Text>
            <TextInput
              className="h-12 border border-gray-300 rounded-lg px-4 bg-gray-50 font-acumin"
              placeholder="Enter machine name..."
              value={filters.machineName || ""}
              onChangeText={(text) => setFilters(prev => ({ ...prev, machineName: text }))}
              placeholderTextColor="#666666"
            />
          </View>

          {/* Date Range Filter */}
          <View className="mb-4">
            <Text className="text-lg font-acumin mb-2 text-gray-700">Document Date Range</Text>
            
            {/* From Date */}
            <TouchableOpacity
              onPress={() => setShowFromDatePicker(true)}
              className="h-12 border border-gray-300 rounded-lg px-4 bg-gray-50 flex-row items-center justify-between mb-2"
            >
              <Text className={`font-acumin ${filters.fromDate ? 'text-black' : 'text-gray-600'}`}>
                {filters.fromDate ? `From: ${formatDate(filters.fromDate)}` : "Select from date"}
              </Text>
              <Ionicons name="calendar-outline" size={20} color="#666666" />
            </TouchableOpacity>

            {/* To Date */}
            <TouchableOpacity
              onPress={() => setShowToDatePicker(true)}
              className="h-12 border border-gray-300 rounded-lg px-4 bg-gray-50 flex-row items-center justify-between"
            >
              <Text className={`font-acumin ${filters.toDate ? 'text-black' : 'text-gray-600'}`}>
                {filters.toDate ? `To: ${formatDate(filters.toDate)}` : "Select to date"}
              </Text>
              <Ionicons name="calendar-outline" size={20} color="#666666" />
            </TouchableOpacity>

            {/* Date Pickers */}
            {showFromDatePicker && (
              <DateTimePicker
                value={filters.fromDate || new Date()}
                mode="date"
                display="default"
                onChange={(event, selectedDate) => {
                  setShowFromDatePicker(false);
                  if (selectedDate) {
                    setFilters(prev => ({ ...prev, fromDate: selectedDate }));
                  }
                }}
              />
            )}

            {showToDatePicker && (
              <DateTimePicker
                value={filters.toDate || new Date()}
                mode="date"
                display="default"
                onChange={(event, selectedDate) => {
                  setShowToDatePicker(false);
                  if (selectedDate) {
                    setFilters(prev => ({ ...prev, toDate: selectedDate }));
                  }
                }}
              />
            )}
          </View>

          {/* Quantity Range Filter */}
          <View className="mb-4">
            <Text className="text-lg font-acumin mb-2 text-gray-700">Quantity Range</Text>
            
            <View className="flex-row gap-2">
              <View className="flex-1">
                <TextInput
                  className="h-12 border border-gray-300 rounded-lg px-4 bg-gray-50 font-acumin"
                  placeholder="Min quantity"
                  value={filters.minQuantity?.toString() || ""}
                  onChangeText={(text) => {
                    const num = parseInt(text);
                    setFilters(prev => ({ 
                      ...prev, 
                      minQuantity: isNaN(num) ? undefined : num 
                    }));
                  }}
                  keyboardType="numeric"
                  placeholderTextColor="#666666"
                />
              </View>
              
              <View className="flex-1">
                <TextInput
                  className="h-12 border border-gray-300 rounded-lg px-4 bg-gray-50 font-acumin"
                  placeholder="Max quantity"
                  value={filters.maxQuantity?.toString() || ""}
                  onChangeText={(text) => {
                    const num = parseInt(text);
                    setFilters(prev => ({ 
                      ...prev, 
                      maxQuantity: isNaN(num) ? undefined : num 
                    }));
                  }}
                  keyboardType="numeric"
                  placeholderTextColor="#666666"
                />
              </View>
            </View>
          </View>
        </ScrollView>

        {/* Action Buttons */}
        <View className="p-4 border-t border-gray-200">
          <View className="flex-row gap-3">
            <TouchableOpacity
              onPress={handleClearFilter}
              className="flex-1 h-12 border border-gray-300 rounded-lg flex-row items-center justify-center"
              disabled={!hasActiveFilters()}
            >
              <Text className={`text-base font-acumin ${hasActiveFilters() ? 'text-gray-700' : 'text-gray-400'}`}>
                Clear All
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleApplyFilter}
              className="flex-1 h-12 bg-blue-500 rounded-lg flex-row items-center justify-center"
            >
              <Text className="text-white text-base font-acumin_bold">
                Apply Filter
              </Text>
            </TouchableOpacity>
          </View>

          {/* Active filters count */}
          {hasActiveFilters() && (
            <Text className="text-center text-sm text-gray-500 mt-2 font-acumin">
              {Object.values(filters).filter(v => 
                v !== undefined && 
                v !== null && 
                v !== "" && 
                (typeof v !== 'number' || !isNaN(v))
              ).length} filter(s) active
            </Text>
          )}
        </View>
      </SafeAreaView>
    </Modal>
  );
};

export default FollowupFilterSheet; 