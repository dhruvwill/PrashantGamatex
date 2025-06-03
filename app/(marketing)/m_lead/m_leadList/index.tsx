import { useQueryClient } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  ScrollView,
  RefreshControl,
  TextInput,
} from "react-native";
import { Search } from "lucide-react-native";
import LeadCard from "~/components/LeadCard";
import { Separator } from "~/components/ui/separator";
import { useLeads } from "~/hooks/leads";
import { usePreventScreenCapture } from "expo-screen-capture";

interface Lead {
  ReferenceTransaction_2361Id: string;
  UDF_CompanyName_2361: string;
  UDF_Product_2361: string;
  UDF_TimeFrame_2361: string;
  DocumentDate: string;
}

const m_leadList = () => {
  usePreventScreenCapture();
  
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const allLeads = useLeads();
  const queryClient = useQueryClient();

  const filterLeads = (leads: any | undefined) => {
    if (!leads) return [];
    return leads.filter((lead:any) => {
      const searchTerm = searchQuery.toLowerCase();
      return (
        lead.UDF_CompanyName_2361.toLowerCase().includes(searchTerm) ||
        lead.UDF_Product_2361.toLowerCase().includes(searchTerm)
      );
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
          <Text className="text-muted text-sm text-gray-500 font-acumin">
            List of All Leads
          </Text>
          <Separator className="my-5 bg-gray-500" orientation="horizontal" />
        </View>

        {/* Search Bar */}
        <View className="px-3 mb-4">
          <View className="flex flex-row items-center px-4 py-2 bg-gray-100 rounded-lg border border-gray-200">
            <Search size={20} color="#666666" />
            <TextInput
              className="flex-1 ml-2 text-base font-acumin"
              placeholder="Search by company or product..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor="#666666"
            />
          </View>
        </View>

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
              {searchQuery
                ? "No matches found for your search. Try different keywords."
                : "No leads found, Please add some leads to view them here."}
            </Text>
          </View>
        ) : null}

        <View className="px-3 flex-col gap-2">
          {filteredLeads.map((lead: Lead, index:number) => (
            <LeadCard
              key={index}
              leadId={lead.ReferenceTransaction_2361Id}
              companyName={lead.UDF_CompanyName_2361}
              productList={lead.UDF_Product_2361}
              timeFrame={lead.UDF_TimeFrame_2361}
              docDate={new Date(lead.DocumentDate)}
            />
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

export default m_leadList;
