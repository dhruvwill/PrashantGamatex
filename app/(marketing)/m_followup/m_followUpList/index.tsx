import { useState } from "react";
import { FlatList, Pressable, ScrollView } from "react-native";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Separator } from "~/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Text } from "~/components/ui/text";
import { Label } from "~/components/ui/label";
import { RefreshControl } from "react-native";
import FollowupCard from "~/components/FollowupCard";
import { TouchableOpacity } from "react-native";
import { Link, useRouter } from "expo-router";
import { useQueryClient } from "@tanstack/react-query";
import { useInquiryFollowup, useQuotationFollowup } from "~/hooks/followup";
import { ActivityIndicator } from "react-native";
import { set } from "zod";
import { SalesInquiryFollowup, SalesQuotationFollowup } from "~/types/followup";

const m_followUpList = () => {
  const router = useRouter();

  const [refreshing, setRefreshing] = useState(false);
  const [list, setList] = useState("inquiry");

  const inquiryFollowups = useInquiryFollowup();
  const quotationFollowups = useQuotationFollowup();
  const queryClient = useQueryClient();

  const onRefresh = () => {
    setRefreshing(true);
    queryClient.invalidateQueries({
      queryKey: ["getInquiryFollowups", "getQuotationFollowups"],
    });
    setRefreshing(false);
  };
  return (
    <View
    // keyboardShouldPersistTaps="handled"
    // refreshControl={
    //   <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
    // }
    >
      <View className="flex mx-3 my-5">
        <View className="px-3">
          <Text className="text-3xl font-acumin_bold">
            List of Inquiry/Quotations
          </Text>
          <Text className="text-muted text-sm font-acumin">
            Add a Follow up
          </Text>
          <Separator className="my-5 bg-gray-500" orientation="horizontal" />
        </View>
        <View className="px-3">
          <View className="flex flex-row justify-between gap-2 mb-4 px-3 py-2 w-full rounded-lg bg-gray-200 relative">
            <Pressable
              className={`${
                list == "inquiry" && "bg-gray-800"
              } px-4 py-2 rounded-md flex-1 items-center`}
              onPress={() => setList("inquiry")}
            >
              <Text
                className={`${list == "inquiry" ? "text-white" : "text-black"}`}
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
        <Tabs
          value={list}
          onValueChange={setList}
          className="w-full max-w-[400px] flex-col gap-1.5"
        >
          <TabsList className="flex-row w-full">
            <TabsTrigger value="inquiry" className="flex-1">
              <Text>Inquiry</Text>
            </TabsTrigger>
            <TabsTrigger value="quotation" className="flex-1">
              <Text>Quotation</Text>
            </TabsTrigger>
          </TabsList>
          <TabsContent value="inquiry">
            <Text> List of Inquiry Follow-ups</Text>
          </TabsContent>
          <TabsContent value="quotation">
            <Text>List of Quotation Follow-ups</Text>
          </TabsContent>
        </Tabs>
        <View className="px-3 flex gap-3">
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
              {inquiryFollowups.data?.length === 0 ? (
                <View className="flex-1 justify-center px-3 my-3">
                  <Text className="text-lg text-gray-500 font-semibold">
                    No Inquiry Followups Found
                  </Text>
                  <Text className="text-md text-gray-500">
                    No Inquiry Followups found, Please add some Followups to
                    view them here.
                  </Text>
                </View>
              ) : null}
              {inquiryFollowups.data?.length! > 0 && (
                <FlatList
                  refreshControl={
                    <RefreshControl
                      refreshing={refreshing}
                      onRefresh={onRefresh}
                      className="my-2"
                    />
                  }
                  data={inquiryFollowups.data}
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={({ item }) => (
                    <Pressable
                      onPress={() => {
                        router.push({
                          pathname:
                            "m_followup/m_followUpList/newInquiryFollowup",
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
              {/* {inquiryFollowups.data?.map((followup: any, index: any) => (
                <Pressable
                  key={index}
                  onPress={() => {
                    router.push({
                      pathname: "m_followup/m_followUpList/newInquiryFollowup",
                      params: { data: JSON.stringify(followup) },
                    });
                  }}
                >
                  <FollowupCard
                    key={followup.SalesInquiryId}
                    partyName={followup.PartyName}
                    itemName={followup.MachineName}
                    quantity={followup.Quantity}
                    docNo={followup.DocumentNo}
                    docDate={new Date(followup.DocumentDate)}
                  />
                </Pressable>
              ))} */}
            </>
          )}
        </View>
        <View className="px-3 flex gap-3">
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
              {quotationFollowups.data?.length === 0 ? (
                <View className="flex-1 justify-center px-3 my-3">
                  <Text className="text-lg text-gray-500 font-semibold">
                    No Inquiry Followups Found
                  </Text>
                  <Text className="text-md text-gray-500">
                    No Inquiry Followups found, Please add some Followups to
                    view them here.
                  </Text>
                </View>
              ) : null}
              {quotationFollowups.data?.length! > 0 && (
                <FlatList
                  refreshControl={
                    <RefreshControl
                      refreshing={refreshing}
                      onRefresh={onRefresh}
                      className="my-2"
                    />
                  }
                  data={quotationFollowups.data}
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={({ item }) => (
                    <Pressable
                      onPress={() => {
                        router.push({
                          pathname:
                            "m_followup/m_followUpList/newQuotationFollowup",
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
    </View>
  );
};

export default m_followUpList;
