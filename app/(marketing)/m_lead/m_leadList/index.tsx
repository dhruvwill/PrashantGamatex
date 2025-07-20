import { useQueryClient } from "@tanstack/react-query";
import { FontAwesome, Ionicons, MaterialIcons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  ScrollView,
  RefreshControl,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { Search } from "lucide-react-native";
import LeadCard from "~/components/LeadCard";
import { Separator } from "~/components/ui/separator";
import { useLeads } from "~/hooks/leads";
import { usePreventScreenCapture } from "expo-screen-capture";
import LeadFilterSheet, { LeadFilterOptions } from "~/components/LeadFilterSheet";
import { LeadData } from "~/types/lead";
import { Person } from "~/types/user";

const m_leadList = () => {
  usePreventScreenCapture();
  
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isFilterSheetVisible, setIsFilterSheetVisible] = useState(false);
  const [activeFilters, setActiveFilters] = useState<LeadFilterOptions>({});
  const allLeads = useLeads();
  const queryClient = useQueryClient();

  const filterLeads = (leads: LeadData[] | undefined) => {
    if (!leads) return [];
    
    return leads.filter((lead: LeadData) => {
      // Search filter
      const searchTerm = searchQuery.toLowerCase();
      const matchesSearch = searchQuery === "" || 
        lead.UDF_CompanyName_2361.toLowerCase().includes(searchTerm) ||
        lead.UDF_Product_2361.toLowerCase().includes(searchTerm) ||
        lead.UDF_ContactPerson_2361.toLowerCase().includes(searchTerm);

      if (!matchesSearch) return false;

      if (activeFilters.person) {
        if (lead.UserName !== activeFilters.person.UserName) {
          return false;
        }
      }

      if (activeFilters.leadSource) {
        if (lead.UDF_LeadSource_2361 !== activeFilters.leadSource) {
          return false;
        }
      }

      // Time Frame filter
      if (activeFilters.timeFrame) {
        if (lead.UDF_TimeFrame_2361 !== activeFilters.timeFrame) {
          return false;
        }
      }

      // Currency filter
      if (activeFilters.currency) {
        if (lead.CurrencyName !== activeFilters.currency) {
          return false;
        }
      }

      // Customer Application filter
      if (activeFilters.customerApplication) {
        const appFilter = activeFilters.customerApplication.toLowerCase();
        if (!lead.UDF_CustomerApplication_2361?.toLowerCase().includes(appFilter)) {
          return false;
        }
      }

      // Date range filter
      if (activeFilters.fromDate || activeFilters.toDate) {
        const leadDate = new Date(lead.DocumentDate);
        
        if (activeFilters.fromDate && leadDate < activeFilters.fromDate) {
          return false;
        }
        
        if (activeFilters.toDate && leadDate > activeFilters.toDate) {
          return false;
        }
      }

      return true;
    });
  };

  const filteredLeads = filterLeads(allLeads.data);

  const onRefresh = () => {
    setRefreshing(true);
    queryClient.invalidateQueries({
      queryKey: ["getAllLeads"],
    });
    setRefreshing(false);
  };

  const handleApplyFilter = (filters: LeadFilterOptions) => {
    setActiveFilters(filters);
  };

  const handleClearFilter = () => {
    setActiveFilters({});
  };

  const hasActiveFilters = () => {
    return Object.values(activeFilters).some(value => value !== undefined && value !== null && value !== "");
  };
  
  return (
    <ScrollView
      keyboardShouldPersistTaps="handled"
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View className="flex mx-3 my-5">
        <View className="px-3">
          <Text className="text-3xl font-acumin_bold">Leads</Text>
          <Text className="text-gray-900 text-sm font-acumin">
            List of All Leads
          </Text>
          <Separator className="my-5 bg-gray-500" orientation="horizontal" />
        </View>

        {/* Search Bar with Filter Button */}
        <View className="px-3 mb-4 flex flex-row justify-between gap-3">
          <View className="flex flex-grow flex-row items-center px-4 py-2 bg-gray-100 rounded-lg border border-gray-200">
            <Search size={20} color="#666666" />
            <TextInput
              className="flex-1 ml-2  font-acumin"
              placeholder="company, product or contact..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor="#666666"
            />
          </View>
          
          <TouchableOpacity
            onPress={() => setIsFilterSheetVisible(true)}
            className={`flex flex-row items-center px-4 py-2 rounded-lg border border-gray-200 ${
              hasActiveFilters() ? 'bg-blue-100 border-blue-300' : 'bg-gray-100'
            }`}
          >
            <Ionicons 
              name="filter-outline" 
              size={20} 
              color={hasActiveFilters() ? "#3b82f6" : "#666666"} 
            />
            {hasActiveFilters() && (
              <View className="ml-1 bg-blue-500 rounded-full min-w-[20px] h-5 flex items-center justify-center">
                <Text className="text-white text-xs font-acumin_bold">
                  {Object.values(activeFilters).filter(v => v !== undefined && v !== null && v !== "").length}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Active filters display */}
        {hasActiveFilters() && (
          <View className="px-3 mb-4">
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row gap-2">
              {Object.entries(activeFilters).map(([key, value]) => {
                if (!value) return null;
                
                let displayValue = value;
                let displayLabel = key;

                // Format display values
                if (key === 'leadSource') displayLabel = 'Source';
                else if (key === 'timeFrame') displayLabel = 'Time Frame';
                else if (key === 'currency') displayLabel = 'Currency';
                else if (key === 'customerApplication') displayLabel = 'Application';
                else if (key === 'fromDate') {
                  displayLabel = 'From';
                  displayValue = (value as Date).toLocaleDateString();
                }
                else if (key === 'toDate') {
                  displayLabel = 'To';
                  displayValue = (value as Date).toLocaleDateString();
                }
                else if (key === 'person') {
                  displayLabel = 'Person';
                  displayValue = (value as Person).UserName;
                }

                return (
                  <View key={key} className="bg-blue-100 px-3 py-1 rounded-full border border-blue-300 flex-row items-center">
                    <Text className="text-blue-700 text-sm font-acumin mr-1">
                      {displayLabel}: {displayValue}
                    </Text>
                    <TouchableOpacity
                      onPress={() => {
                        const newFilters = { ...activeFilters };
                        delete newFilters[key as keyof LeadFilterOptions];
                        setActiveFilters(newFilters);
                      }}
                    >
                      <Ionicons name="close-circle" size={16} color="#3b82f6" />
                    </TouchableOpacity>
                  </View>
                );
              })}
            </ScrollView>
          </View>
        )}

        {allLeads.isLoading ? (
          <View className="flex-1 justify-center items-center">
            <ActivityIndicator size="large" color="#00ff00" />
          </View>
        ) : null}

        {allLeads.error ? (
          <View className="flex-1 justify-center px-3 my-3">
            <Text className="text-lg text-red-500 font-semibold">Error</Text>
            <Text className="text-md text-red-500">
              {allLeads.error.errorMessage ||
                "An unexpected error occurred, Please Try again later."}
            </Text>
          </View>
        ) : null}

        {filteredLeads.length === 0 && !allLeads.isLoading ? (
          <View className="flex-1 justify-center px-3 my-3">
            <Text className="text-lg text-gray-500 font-semibold">
              No Leads Found
            </Text>
            <Text className="text-md text-gray-500">
              {searchQuery || hasActiveFilters()
                ? "No matches found for your search or filters. Try adjusting your criteria."
                : "No leads found, Please add some leads to view them here."}
            </Text>
          </View>
        ) : null}

        <View className="px-3 flex-col gap-2">
          {filteredLeads.map((lead: LeadData, index: number) => (
            <LeadCard
              key={index}
              leadId={lead.ReferenceTransaction_2361Id.toString()}
              companyName={lead.UDF_CompanyName_2361}
              productList={lead.UDF_Product_2361}
              timeFrame={lead.UDF_TimeFrame_2361}
              docDate={new Date(lead.DocumentDate)}
              userName={lead.UserName}
            />
          ))}
        </View>
      </View>

      <LeadFilterSheet
        isVisible={isFilterSheetVisible}
        onClose={() => setIsFilterSheetVisible(false)}
        onApplyFilter={handleApplyFilter}
        onClearFilter={handleClearFilter}
        currentFilters={activeFilters}
      />
    </ScrollView>
  );
};

export default m_leadList;
