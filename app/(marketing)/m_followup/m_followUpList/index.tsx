import { useEffect, useState } from "react";
import {
  FlatList,
  Pressable,
  ScrollView,
  KeyboardAvoidingView,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { View } from "react-native";
import { Separator } from "~/components/ui/separator";
import { Text } from "~/components/ui/text";
import { RefreshControl } from "react-native";
import FollowupCard from "~/components/FollowupCard";
import { useRouter } from "expo-router";
import { useQueryClient } from "@tanstack/react-query";
import { useInquiryFollowup, useQuotationFollowup } from "~/hooks/followup";
import { ActivityIndicator } from "react-native";
import { Search } from "lucide-react-native";
import { usePreventScreenCapture } from "expo-screen-capture";
import { Ionicons } from "@expo/vector-icons";
import FollowupFilterSheet, { FollowupFilterOptions } from "~/components/FollowupFilterSheet";

interface FollowupItem {
  SalesInquiryId?: string;
  SalesQuotationId?: string;
  PartyName: string;
  MachineName: string;
  Quantity: number;
  DocumentNo: string;
  DocumentDate: string;
}

const m_followUpList = () => {
  usePreventScreenCapture();

  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  const [list, setList] = useState("inquiry");
  const [searchQuery, setSearchQuery] = useState("");
  const [isFilterSheetVisible, setIsFilterSheetVisible] = useState(false);
  const [activeFilters, setActiveFilters] = useState<FollowupFilterOptions>({});

  const inquiryFollowups = useInquiryFollowup();
  const quotationFollowups = useQuotationFollowup();
  const queryClient = useQueryClient();

  const filterData = (data: any | undefined) => {
    if (!data) return [];
    return data.filter((item: any) => {
      // Search filter
      const searchTerm = searchQuery.toLowerCase();
      const matchesSearch = searchQuery === "" || 
        item.PartyName.toLowerCase().includes(searchTerm) ||
        item.MachineName.toLowerCase().includes(searchTerm) ||
        item.DocumentNo.toString().includes(searchTerm);

      if (!matchesSearch) return false;

      // Party Name filter
      if (activeFilters.partyName) {
        const partyFilter = activeFilters.partyName.toLowerCase();
        if (!item.PartyName.toLowerCase().includes(partyFilter)) {
          return false;
        }
      }

      // Machine Name filter
      if (activeFilters.machineName) {
        const machineFilter = activeFilters.machineName.toLowerCase();
        if (!item.MachineName.toLowerCase().includes(machineFilter)) {
          return false;
        }
      }

      // Date range filter
      if (activeFilters.fromDate || activeFilters.toDate) {
        const itemDate = new Date(item.DocumentDate);
        
        if (activeFilters.fromDate && itemDate < activeFilters.fromDate) {
          return false;
        }
        
        if (activeFilters.toDate && itemDate > activeFilters.toDate) {
          return false;
        }
      }

      // Quantity range filter
      if (activeFilters.minQuantity !== undefined && item.Quantity < activeFilters.minQuantity) {
        return false;
      }
      
      if (activeFilters.maxQuantity !== undefined && item.Quantity > activeFilters.maxQuantity) {
        return false;
      }

      return true;
    });
  };

  const filteredInquiries = filterData(inquiryFollowups.data);
  const filteredQuotations = filterData(quotationFollowups.data);

  const onRefresh = () => {
    setRefreshing(true);
    queryClient.invalidateQueries({
      queryKey: ["getInquiryFollowups", "getQuotationFollowups"],
    });
    setRefreshing(false);
  };

  const handleApplyFilter = (filters: FollowupFilterOptions) => {
    setActiveFilters(filters);
  };

  const handleClearFilter = () => {
    setActiveFilters({});
  };

  const hasActiveFilters = () => {
    return Object.values(activeFilters).some(value => 
      value !== undefined && 
      value !== null && 
      value !== "" && 
      (typeof value !== 'number' || !isNaN(value))
    );
  };

  return (
    <KeyboardAvoidingView behavior="padding">
      <ScrollView
        keyboardShouldPersistTaps="handled"
        nestedScrollEnabled={true}
      >
        <View className="flex h-full mx-3 my-5">
          <View className="px-3">
            <Text className="text-3xl font-acumin_bold">
              List of Inquiry/Quotations
            </Text>
            <Text className="text-gray-900 text-sm font-acumin">
              Add a Follow up
            </Text>
            <Separator className="my-5 bg-gray-500" orientation="horizontal" />
          </View>

          {/* Search Bar with Filter Button */}
          <View className="px-3 mb-4 flex flex-row justify-between gap-3">
            <View className="flex flex-grow flex-row items-center px-4 py-2 bg-gray-100 rounded-lg border border-gray-200">
              <Search size={20} color="#666666" />
              <TextInput
                className="flex-1 ml-2 text-base font-acumin"
                placeholder="Search by party, machine or document no..."
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
                    {Object.values(activeFilters).filter(v => 
                      v !== undefined && 
                      v !== null && 
                      v !== "" && 
                      (typeof v !== 'number' || !isNaN(v))
                    ).length}
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
                  if (key === 'partyName') displayLabel = 'Party';
                  else if (key === 'machineName') displayLabel = 'Machine';
                  else if (key === 'fromDate') {
                    displayLabel = 'From';
                    displayValue = (value as Date).toLocaleDateString();
                  }
                  else if (key === 'toDate') {
                    displayLabel = 'To';
                    displayValue = (value as Date).toLocaleDateString();
                  }
                  else if (key === 'minQuantity') displayLabel = 'Min Qty';
                  else if (key === 'maxQuantity') displayLabel = 'Max Qty';

                  return (
                    <View key={key} className="bg-blue-100 px-3 py-1 rounded-full border border-blue-300 flex-row items-center">
                      <Text className="text-blue-700 text-sm font-acumin mr-1">
                        {displayLabel}: {displayValue}
                      </Text>
                      <TouchableOpacity
                        onPress={() => {
                          const newFilters = { ...activeFilters };
                          delete newFilters[key as keyof FollowupFilterOptions];
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

          <View className="px-3">
            <View className="flex flex-row flex-nowrap justify-between gap-2 mb-4 px-3 py-2 w-full rounded-lg bg-gray-200 relative">
              <Pressable
                className={`${
                  list == "inquiry" && "bg-gray-800"
                } px-4 py-2 rounded-md flex-1 items-center`}
                onPress={() => setList("inquiry")}
              >
                <Text
                  className={`${
                    list == "inquiry" ? "text-white" : "text-black"
                  }`}
                >
                  Inquiry
                </Text>
              </Pressable>
              <Pressable
                className={`${
                  list == "quotation" && "bg-gray-800"
                } px-4 py-2 rounded-md flex-1 items-center`}
                onPress={() => setList("quotation")}
              >
                <Text
                  className={`${
                    list == "quotation" ? "text-white" : "text-black"
                  } `}
                >
                  Quotation
                </Text>
              </Pressable>
            </View>
          </View>

          <View className="px-3 pb-10 flex-grow gap-3">
            {list == "inquiry" && (
              <>
                {inquiryFollowups.isLoading ? (
                  <View className="flex-1 justify-center items-center">
                    <ActivityIndicator size="large" color="#00ff00" />
                  </View>
                ) : null}
                {inquiryFollowups.error ? (
                  <View className="flex-1 justify-center px-3 my-3">
                    <Text className="text-lg text-red-500 font-semibold">
                      Error
                    </Text>
                    <Text className="text-md text-red-500">
                      {inquiryFollowups.error.errorMessage ||
                        "An unexpected error occurred, Please Try again later."}
                    </Text>
                  </View>
                ) : null}
                {filteredInquiries.length === 0 &&
                !inquiryFollowups.isLoading ? (
                  <View className="flex-1 justify-center px-3 my-3">
                    <Text className="text-lg text-gray-500 font-semibold">
                      No Inquiry Followups Found
                    </Text>
                    <Text className="text-md text-gray-500">
                      {searchQuery || hasActiveFilters()
                        ? "No matches found for your search or filters. Try adjusting your criteria."
                        : "No Inquiry Followups found, Please add some Followups to view them here."}
                    </Text>
                  </View>
                ) : null}
                {filteredInquiries.length > 0 && (
                  <FlatList
                    refreshControl={
                      <RefreshControl
                        refreshing={refreshing}
                        onRefresh={() => onRefresh()}
                        className="my-2"
                      />
                    }
                    scrollEnabled={false}
                    data={filteredInquiries}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item }) => (
                      <Pressable
                        onPress={() => {
                          router.push({
                            pathname:
                              "/(marketing)/m_followup/m_followUpList/inquiryFollowupTimeline",
                            params: { data: JSON.stringify(item) },
                          });
                        }}
                      >
                        <FollowupCard
                          key={item.SalesInquiryId}
                          partyName={item.PartyName}
                          itemName={item.MachineName}
                          quantity={item.Quantity}
                          docNo={item.DocumentNo}
                          docDate={new Date(item.DocumentDate)}
                          className="my-2"
                        />
                      </Pressable>
                    )}
                  />
                )}
              </>
            )}
            {list == "quotation" && (
              <>
                {quotationFollowups.isLoading ? (
                  <View className="flex-1 justify-center items-center">
                    <ActivityIndicator size="large" color="#00ff00" />
                  </View>
                ) : null}
                {quotationFollowups.error ? (
                  <View className="flex-1 justify-center px-3 my-3">
                    <Text className="text-lg text-red-500 font-semibold">
                      Error
                    </Text>
                    <Text className="text-md text-red-500">
                      {quotationFollowups.error.errorMessage ||
                        "An unexpected error occurred, Please Try again later."}
                    </Text>
                  </View>
                ) : null}
                {filteredQuotations.length === 0 &&
                !quotationFollowups.isLoading ? (
                  <View className="flex-1 justify-center px-3 my-3">
                    <Text className="text-lg text-gray-500 font-semibold">
                      No Quotation Followups Found
                    </Text>
                    <Text className="text-md text-gray-500">
                      {searchQuery || hasActiveFilters()
                        ? "No matches found for your search or filters. Try adjusting your criteria."
                        : "No Quotation Followups found, Please add some Followups to view them here."}
                    </Text>
                  </View>
                ) : null}
                {filteredQuotations.length > 0 && (
                  <FlatList
                    className="h-full"
                    refreshControl={
                      <RefreshControl
                        refreshing={refreshing}
                        onRefresh={() => onRefresh()}
                        className="my-2"
                      />
                    }
                    scrollEnabled={false}
                    data={filteredQuotations}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item }) => (
                      <Pressable
                        onPress={() => {
                          router.push({
                            pathname:
                              "/(marketing)/m_followup/m_followUpList/quotationFollowupTimeline",
                            params: { data: JSON.stringify(item) },
                          });
                        }}
                      >
                        <FollowupCard
                          key={item.SalesQuotationId}
                          partyName={item.PartyName}
                          itemName={item.MachineName}
                          quantity={item.Quantity}
                          docNo={item.DocumentNo}
                          docDate={new Date(item.DocumentDate)}
                          className="my-2"
                        />
                      </Pressable>
                    )}
                  />
                )}
              </>
            )}
          </View>
        </View>
      </ScrollView>

      <FollowupFilterSheet
        isVisible={isFilterSheetVisible}
        onClose={() => setIsFilterSheetVisible(false)}
        onApplyFilter={handleApplyFilter}
        onClearFilter={handleClearFilter}
        currentFilters={activeFilters}
        title={`Filter ${list === "inquiry" ? "Inquiry" : "Quotation"} Followups`}
      />
    </KeyboardAvoidingView>
  );
};

export default m_followUpList;
