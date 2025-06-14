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
import SimpleDropdown from "./SimpleDropdown";
import { useConstants } from "~/hooks/const";
import { useLeadFilters } from "~/hooks/leads";
import { Person } from "~/types/user";

export interface LeadFilterOptions {
  person?: Person;
  leadSource?: string;
  timeFrame?: string;
  currency?: string;
  fromDate?: Date;
  toDate?: Date;
  customerApplication?: string;
}

interface LeadFilterSheetProps {
  isVisible: boolean;
  onClose: () => void;
  onApplyFilter: (filters: LeadFilterOptions) => void;
  onClearFilter: () => void;
  currentFilters: LeadFilterOptions;
  title?: string;
}

const LeadFilterSheet: React.FC<LeadFilterSheetProps> = ({
  isVisible,
  onClose,
  onApplyFilter,
  onClearFilter,
  currentFilters,
  title = "Filter Leads",
}) => {
  const [filters, setFilters] = useState<LeadFilterOptions>(currentFilters);
  const [showFromDatePicker, setShowFromDatePicker] = useState(false);
  const [showToDatePicker, setShowToDatePicker] = useState(false);
  
  const constants = useConstants();
  const associatedUsers = useLeadFilters();

  // Generate dropdown options from constants

  const associatedUsersOptions = associatedUsers.data?.map((user: any) => ({
    value: user.UserCode,
    label: user.UserIdentification,
  })) || [];

  const leadSourceOptions = constants.data?.LeadSourceOutput?.split(",").map((source: string) => ({
    value: source.trim(),
    label: source.trim(),
  })) || [];

  const timeFrameOptions = constants.data?.TimeFrameOutput?.split(",").map((timeFrame: string) => ({
    value: timeFrame.trim(),
    label: timeFrame.trim(),
  })) || [];

  const currencyOptions = constants.data?.CurrencyOutput?.split(",").map((currency: string) => ({
    value: currency.trim(),
    label: currency.trim(),
  })) || [];

  const customerApplicationOptions = constants.data?.ApplicationOutput?.split(",").map((application: string) => ({
    value: application.trim(),
    label: application.trim(),
  })) || [];

  useEffect(() => {
    setFilters(currentFilters);
  }, [currentFilters]);

  const handleApplyFilter = () => {
    onApplyFilter(filters);
    onClose();
  };

  const handleClearFilter = () => {
    const emptyFilters: LeadFilterOptions = {};
    setFilters(emptyFilters);
    onClearFilter();
    onClose();
  };

  const hasActiveFilters = () => {
    return Object.values(filters).some(
      (value) => value !== undefined && value !== null && value !== ""
    );
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString();
  };

  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <SafeAreaView className="flex-1 bg-white">
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

            </>
          )}

          {constants.isLoading ? (
            <View className="flex-1 justify-center items-center py-8">
              <ActivityIndicator size="large" color="#007aff" />
              <Text className="text-gray-500 mt-2 font-acumin">Loading filter options...</Text>
            </View>
          ) : constants.error ? (
            <View className="flex-1 justify-center items-center py-8">
              <Text className="text-red-500 text-center font-acumin">
                Error loading filters: {(constants.error as any)?.errorMessage || "Failed to load filter options"}
              </Text>
            </View>
          ) : (
            <>
              {/* Lead Source Filter */}
              <View className="mb-4">
                <Text className="text-lg font-acumin mb-2 text-gray-700">
                  Lead Source
                </Text>
                <SimpleDropdown
                  options={leadSourceOptions}
                  placeholder="Select lead source"
                  value={filters.leadSource}
                  onChange={(value) => {
                    setFilters((prev) => ({ ...prev, leadSource: value }));
                  }}
                />
              </View>

              {/* Time Frame Filter */}
              <View className="mb-4">
                <Text className="text-lg font-acumin mb-2 text-gray-700">
                  Time Frame
                </Text>
                <SimpleDropdown
                  options={timeFrameOptions}
                  placeholder="Select time frame"
                  value={filters.timeFrame}
                  onChange={(value) => {
                    setFilters((prev) => ({ ...prev, timeFrame: value }));
                  }}
                />
              </View>

              {/* Currency Filter */}
              <View className="mb-4">
                <Text className="text-lg font-acumin mb-2 text-gray-700">
                  Currency
                </Text>
                <SimpleDropdown
                  options={currencyOptions}
                  placeholder="Select currency"
                  value={filters.currency}
                  onChange={(value) => {
                    setFilters((prev) => ({ ...prev, currency: value }));
                  }}
                />
              </View>

              {/* Customer Application Filter */}
              <View className="mb-4">
                <Text className="text-lg font-acumin mb-2 text-gray-700">
                  Customer Application
                </Text>
                <SimpleDropdown
                  options={customerApplicationOptions}
                  placeholder="Select customer application"
                  value={filters.customerApplication}
                  onChange={(value) => {
                    setFilters((prev) => ({ ...prev, customerApplication: value }));
                  }}
                />
              </View>

              {/* Date Range Filter */}
              <View className="mb-4">
                <Text className="text-lg font-acumin mb-2 text-gray-700">
                  Document Date Range
                </Text>

                {/* From Date */}
                <TouchableOpacity
                  onPress={() => setShowFromDatePicker(true)}
                  className="h-12 border border-gray-300 rounded-lg px-4 bg-gray-50 flex-row items-center justify-between mb-2"
                >
                  <Text
                    className={`font-acumin ${
                      filters.fromDate ? "text-black" : "text-gray-600"
                    }`}
                  >
                    {filters.fromDate
                      ? `From: ${formatDate(filters.fromDate)}`
                      : "Select from date"}
                  </Text>
                  <Ionicons name="calendar-outline" size={20} color="#666666" />
                </TouchableOpacity>

                {/* To Date */}
                <TouchableOpacity
                  onPress={() => setShowToDatePicker(true)}
                  className="h-12 border border-gray-300 rounded-lg px-4 bg-gray-50 flex-row items-center justify-between"
                >
                  <Text
                    className={`font-acumin ${
                      filters.toDate ? "text-black" : "text-gray-600"
                    }`}
                  >
                    {filters.toDate
                      ? `To: ${formatDate(filters.toDate)}`
                      : "Select to date"}
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
                        setFilters((prev) => ({ ...prev, fromDate: selectedDate }));
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
                        setFilters((prev) => ({ ...prev, toDate: selectedDate }));
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
              <Text
                className={`text-base font-acumin ${
                  hasActiveFilters() ? "text-gray-700" : "text-gray-400"
                }`}
              >
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
              {
                Object.values(filters).filter(
                  (v) => v !== undefined && v !== null && v !== ""
                ).length
              }{" "}
              filter(s) active
            </Text>
          )}
        </View>
      </SafeAreaView>
    </Modal>
  );
};

export default LeadFilterSheet;
