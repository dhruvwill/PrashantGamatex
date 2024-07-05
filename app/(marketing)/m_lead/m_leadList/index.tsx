import { useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  ScrollView,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import LeadCard from "~/components/LeadCard";
import { Separator } from "~/components/ui/separator";
import { useLeads } from "~/hooks/leads";

const m_leadList = () => {
  const [refreshing, setRefreshing] = useState(false);
  const allLeads = useLeads();
  const queryClient = useQueryClient();

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
        {allLeads.data?.length === 0 ? (
          <View className="flex-1 justify-center px-3 my-3">
            <Text className="text-lg text-gray-500 font-semibold">
              No Leads Found
            </Text>
            <Text className="text-md text-gray-500">
              No leads found, Please add some leads to view them here.
            </Text>
          </View>
        ) : null}
        <View className="px-3 flex-col gap-2">
          {allLeads.data?.map((lead: any, index: any) => (
            <LeadCard
              key={lead.ReferenceTransaction_2361Id}
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
