import { useEffect, useState } from "react";
import {
  FlatList,
  Pressable,
  ScrollView,
  KeyboardAvoidingView,
  TextInput,
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
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  const [list, setList] = useState("inquiry");
  const [searchQuery, setSearchQuery] = useState("");

  const inquiryFollowups = useInquiryFollowup();
  const quotationFollowups = useQuotationFollowup();
  const queryClient = useQueryClient();

  const filterData = (data: any | undefined) => {
    if (!data) return [];
    return data.filter((item:any) => {
      const searchTerm = searchQuery.toLowerCase();
      return (
        item.PartyName.toLowerCase().includes(searchTerm) ||
        item.MachineName.toLowerCase().includes(searchTerm) ||
        item.DocumentNo.toString().includes(searchTerm)
      );
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
            <Text className="text-muted text-sm font-acumin">
              Add a Follow up
            </Text>
            <Separator className="my-5 bg-gray-500" orientation="horizontal" />
          </View>

          {/* Search Bar */}
          <View className="px-3 mb-4">
            <View className="flex flex-row items-center px-4 py-2 bg-gray-100 rounded-lg border border-gray-200">
              <Search size={20} color="#666666" />
              <TextInput
                className="flex-1 ml-2 text-base font-acumin"
                placeholder="Search by party, machine or document no..."
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholderTextColor="#666666"
              />
            </View>
          </View>

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
                      {searchQuery
                        ? "No matches found for your search. Try different keywords."
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
                      {searchQuery
                        ? "No matches found for your search. Try different keywords."
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
    </KeyboardAvoidingView>
  );
};

export default m_followUpList;
