import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import CustomDropdownV2 from "./CustomDropdownV2";
import { useLeadFilters } from "~/hooks/leads";

export interface FilterOptions {
  selectedFilter?: string;
}

interface FilterSheetProps {
  isVisible: boolean;
  onClose: () => void;
  onApplyFilter: (filters: FilterOptions) => void;
  onClearFilter: () => void;
  currentFilters: FilterOptions;
}

const FilterSheet: React.FC<FilterSheetProps> = ({
  isVisible,
  onClose,
  onApplyFilter,
  onClearFilter,
  currentFilters,
}) => {
  const leadFilters = useLeadFilters();
  const [filters, setFilters] = useState<FilterOptions>(currentFilters);
  const [key, setKey] = useState(0); // For forcing re-render of dropdown

  useEffect(() => {
    setFilters(currentFilters);
    setKey(prev => prev + 1); // Force re-render of dropdown when filters change
  }, [currentFilters]);

  const handleApplyFilter = () => {
    onApplyFilter(filters);
    onClose();
  };

  const handleClearFilter = () => {
    const emptyFilters: FilterOptions = {};
    setFilters(emptyFilters);
    setKey(prev => prev + 1); // Force re-render to clear dropdown
    onClearFilter();
    onClose();
  };

  const hasActiveFilters = () => {
    return Object.values(filters).some(value => value !== undefined && value !== null && value !== "");
  };

  return (
    <Modal visible={isVisible} animationType="slide" presentationStyle="pageSheet">
      <SafeAreaView className="flex-1 bg-white">
        {/* Header */}
        <View className="flex-row items-center justify-between p-4 border-b border-gray-200">
          <Text className="text-xl font-acumin_bold">Filter Leads</Text>
          <TouchableOpacity onPress={onClose}>
            <Ionicons name="close" size={24} color="black" />
          </TouchableOpacity>
        </View>

        <ScrollView className="flex-1 p-4">
          {leadFilters.isLoading ? (
            <View className="flex-1 justify-center items-center py-8">
              <ActivityIndicator size="large" color="#007aff" />
              <Text className="text-gray-500 mt-2 font-acumin">Loading filter options...</Text>
            </View>
          ) : leadFilters.error ? (
            <View className="flex-1 justify-center items-center py-8">
              <Text className="text-red-500 text-center font-acumin">
                Error loading filters: {(leadFilters.error as any)?.errorMessage || "Failed to load filter options"}
              </Text>
            </View>
          ) : (
            <View className="mb-4">
              <Text className="text-lg font-acumin mb-2 text-gray-700">Filter by</Text>
              <CustomDropdownV2
                key={`filter-${key}`}
                options={
                  leadFilters.data?.map((item: any) => ({
                    value: item.UserIdentification || item.UserCode,
                    label: item.UserIdentification || item.UserCode,
                  })) || []
                }
                placeholder="Select Filter"
                defaultValue={filters.selectedFilter ? { 
                  value: filters.selectedFilter, 
                  label: filters.selectedFilter 
                } : undefined}
                onChange={(value) => {
                  setFilters(prev => ({ ...prev, selectedFilter: value }));
                }}
              />
            </View>
          )}
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
              {Object.values(filters).filter(v => v !== undefined && v !== null && v !== "").length} filter(s) active
            </Text>
          )}
        </View>
      </SafeAreaView>
    </Modal>
  );
};

export default FilterSheet; 