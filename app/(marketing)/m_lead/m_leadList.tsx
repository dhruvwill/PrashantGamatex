import { View, Text } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import LeadCard from "~/components/LeadCard";
import { Separator } from "~/components/ui/separator";
const m_leadList = () => {
  const leadData = [
    {
      companyName: "Prashant Gamatex",
      productList: ["valve", "pump"],
      timeFrame: "25/08/22 - 26/04/23",
    },
    {
      companyName: "Prasad Textile",
      productList: ["valve", "pump", "motor"],
      timeFrame: "26/04/22 - 26/04/23",
    },
    {
      companyName: "Windlass Engineers",
      productList: ["valve", "pump", "motor"],
      timeFrame: "26/04/22 - 26/04/23",
    },
  ];
  return (
    <ScrollView keyboardShouldPersistTaps="handled">
      <View className="flex h-auto mx-3 my-5">
        <View className="px-3">
          <Text className="text-3xl font-acumin_bold">Leads</Text>
          <Text className="text-muted text-sm text-gray-500 font-acumin">
            List of All Leads
          </Text>
          <Separator className="my-5 bg-gray-500" orientation="horizontal" />
        </View>
        <View className="px-3 flex-col gap-2">
          {leadData.map((lead,index) => (
            <LeadCard
              key={index}
              companyName={lead.companyName}
              productList={lead.productList}
              timeFrame={lead.timeFrame}
            />
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

export default m_leadList;
