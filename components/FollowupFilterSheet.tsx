import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  TextInput,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { PortalHost } from "~/components/primitives/portal";
import SimpleDropdown from "./SimpleDropdown";
import { useLeadFilters } from "~/hooks/leads";
import { Person } from "~/types/user";

export interface FollowupFilterOptions {
  person?: Person;
  partyName?: string;
  machineName?: string;
  fromDate?: Date;
  toDate?: Date;
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

  const associatedUsers = useLeadFilters();

  // Generate dropdown options from users
  const associatedUsersOptions = associatedUsers.data?.map((user: any) => ({
    value: user.UserCode,
    label: user.UserIdentification,
  })) || [];

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
        <PortalHost name="followup-filter-portal" />
        {/* Header */}
        <View className="flex-row items-center justify-between p-4 border-b border-gray-200">
          <Text className="text-xl font-acumin_bold">{title}</Text>
          <TouchableOpacity onPress={onClose}>
            <Ionicons name="close" size={24} color="black" />
          </TouchableOpacity>
        </View>

        <ScrollView className="flex-1 p-4">
          {associatedUsers.isLoading ? (
            <View className="flex-1 justify-center items-center py-8">
              <ActivityIndicator size="large" color="#007aff" />
              <Text className="text-gray-500 mt-2 font-acumin">Loading filter options...</Text>
            </View>
          ) : associatedUsers.error ? (
            <View className="flex-1 justify-center items-center py-8">
              <Text className="text-red-500 text-center font-acumin">
                Error loading filters: {(associatedUsers.error as any)?.errorMessage || "Failed to load filter options"}
              </Text>
            </View>
          ) : (
            <>
              {/* Person Filter */}
              <View className="mb-4">
                <Text className="text-lg font-acumin mb-2 text-gray-700">
                  Person
                </Text>
                <SimpleDropdown
                  options={associatedUsersOptions}
                  placeholder="Select Person"
                  value={filters.person?.UserCode}
                  onChange={(value) => {
                    const selectedUser = associatedUsers.data?.find(user => user.UserCode === value);
                    if (selectedUser) {
                      setFilters((prev) => ({ 
                        ...prev, 
                        person: { 
                          UserName: selectedUser.UserIdentification, 
                          UserCode: selectedUser.UserCode 
                        } 
                      }));
                    }
                  }}
                />
              </View>

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
            </>
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