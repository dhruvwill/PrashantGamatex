import {
  View,
  TouchableOpacity,
  TextInput,
  Text,
  ScrollView,
  Alert,
  Pressable,
} from "react-native";
import React, { useState } from "react";
import { useRouter } from "expo-router";
import CustomDropdown from "~/components/CustomDropdown";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Separator } from "~/components/ui/separator";
import { Ionicons } from "@expo/vector-icons";

const m_newLead = () => {
  const Items = ["Items-1", "Items-2", "Items-3", "Items-4", "Items-5"];
  const [form, setForm] = useState({
    company: "",
    branch: "",
    division: "",
    category: "",
    documentNo: "",
    documentDate: new Date(),
    refNo: "",
    refDate: new Date(),
    serialNo: "",
    companyName: "",
    contactPerson: "",
    designation: "",
    emailId: "",
    product: "",
    leadSource: "",
    competition: "",
    timeFrame: "",
  });
  const [phone, setPhone] = useState("");

  const [isDocDateVisible, setDocDateVisible] = useState(false);
  const [isRefDateVisible, setRefDateVisible] = useState(false);
  const router = useRouter();

  const handleSubmit = () => {
    Alert.alert("value", [{ ...form }].join(""));
  };
  return (
    <ScrollView keyboardShouldPersistTaps="handled">
      <View className="flex h-full mx-3 my-5">
        <View className="px-3">
          <Text className="text-3xl font-acumin_bold">New Lead</Text>
          <Text className="text-muted text-sm text-gray-500 font-acumin">
            Add a New Lead
          </Text>
          <Separator className="my-5 bg-gray-500" orientation="horizontal" />
        </View>
        <View className="px-3">
          <View className="mb-4">
            <Text className="color-[#222] dark:text-gray-300 mb-2 text-lg font-acumin">
              Company
            </Text>
            <CustomDropdown title="Company" itemsList={Items} />
          </View>
          <View className="mb-4">
            <Text className="color-[#222] dark:text-gray-300 mb-2 text-lg font-acumin ">
              Branch
            </Text>
            <CustomDropdown title="Branch" itemsList={Items} />
          </View>
          <View className="mb-4">
            <Text className="color-[#222] dark:text-gray-300 mb-2 text-lg font-acumin">
              Division
            </Text>
            <CustomDropdown title="Division" itemsList={Items} />
          </View>
          <View className="mb-4">
            <Text className="color-[#222] dark:text-gray-300 mb-2 text-lg font-acumin">
              Category
            </Text>
            <CustomDropdown title="Category" itemsList={Items} />
          </View>
          <View className="mb-4 flex flex-row gap-2">
            <View className="flex-1">
              {/* <Text className="color-[#222] dark:text-gray-300 font-semibold mb-2 text-lg">
                Doc. No.
              </Text> */}
              <Text className="color-[#222] dark:text-gray-300 mb-2 text-lg font-acumin">
                Doc No.
              </Text>
              <TextInput
                keyboardType="numeric"
                autoCorrect={false}
                clearButtonMode="while-editing"
                onChangeText={(documentNo) => setForm({ ...form, documentNo })}
                placeholder="0"
                placeholderTextColor="#6b7280"
                className="h-10 native:h-12 border dark:bg-gray-800 px-4 rounded-md text-base font-medium text-[#222] dark:text-gray-100"
                value={form.documentNo}
              />
            </View>
            <View className="flex-1 flex flex-col">
              <Text className="color-[#222] dark:text-gray-300 mb-2 text-lg font-acumin">
                Doc. Date
              </Text>
              <Pressable
                onPress={() => {
                  setDocDateVisible(true);
                }}
                className="h-10 native:h-12 border dark:bg-gray-800 w-full px-4 rounded-lg flex-row items-center"
              >
                <Ionicons
                  name="calendar-clear-outline"
                  color={"#222222"}
                  size={20}
                />
                <Text className="text-lg text-[#222] dark:text-gray-100 font-acumin ml-2">
                  {form.documentDate.toLocaleDateString("en-GB")}
                </Text>
                {isDocDateVisible && (
                  <DateTimePicker
                    mode="date"
                    value={form.documentDate}
                    display="default"
                    onChange={(event, newDate) => {
                      setForm({
                        ...form,
                        documentDate: newDate ? newDate : new Date(),
                      });
                      setDocDateVisible(false);
                    }}
                  />
                )}
              </Pressable>
            </View>
          </View>
          <View className="mb-4 flex flex-row gap-2">
            <View className="flex-1">
              <Text className="color-[#222] dark:text-gray-300 mb-2 text-lg font-acumin">
                Ref No.
              </Text>
              <TextInput
                keyboardType="numeric"
                autoCorrect={false}
                clearButtonMode="while-editing"
                onChangeText={(refNo) => setForm({ ...form, refNo })}
                placeholder="0"
                placeholderTextColor="#6b7280"
                className="h-10 native:h-12 border dark:bg-gray-800 px-4 rounded-lg text-base font-medium text-[#222] dark:text-gray-100"
                value={form.refNo}
              />
            </View>
            <View className="flex-1 flex flex-col">
              <Text className="color-[#222] dark:text-gray-300 mb-2 text-lg font-acumin">
                Ref. Date
              </Text>
              <Pressable
                onPress={() => {
                  setRefDateVisible(true);
                }}
                className="h-10 native:h-12 border dark:bg-gray-800 w-full px-4 rounded-lg flex-row items-center"
              >
                <Ionicons
                  name="calendar-clear-outline"
                  color={"#222222"}
                  size={20}
                />
                <Text className="text-lg text-[#222] dark:text-gray-100 font-acumin ml-2">
                  {form.refDate.toLocaleDateString("en-GB")}
                </Text>
                {isRefDateVisible && (
                  <DateTimePicker
                    mode="date"
                    value={form.refDate}
                    display="default"
                    onChange={(event, newDate) => {
                      setForm({
                        ...form,
                        refDate: newDate ? newDate : new Date(),
                      });
                      setRefDateVisible(false);
                    }}
                  />
                )}
              </Pressable>
            </View>
          </View>
          <View className="mb-4">
            <Text className="color-[#222] dark:text-gray-300 mb-2 text-lg font-acumin">
              Serial No.
            </Text>
            <TextInput
              keyboardType="numeric"
              autoCorrect={false}
              clearButtonMode="while-editing"
              onChangeText={(serialNo) => setForm({ ...form, serialNo })}
              placeholder="0"
              placeholderTextColor="#6b7280"
              className="h-10 native:h-12 border dark:bg-gray-800 px-4 rounded-lg text-base font-medium text-[#222] dark:text-gray-100"
              value={form.serialNo}
            />
          </View>
          <View className="mb-4">
            <Text className="color-[#222] dark:text-gray-300 mb-2 text-lg font-acumin">
              Currency
            </Text>
            <CustomDropdown title="Currency" itemsList={Items} />
          </View>
          <View className="mb-4">
            <Text className="color-[#222] dark:text-gray-300 mb-2 text-lg font-acumin">
              Company name
            </Text>
            <TextInput
              autoCorrect={false}
              clearButtonMode="while-editing"
              onChangeText={(companyName) => setForm({ ...form, companyName })}
              placeholder="Enter Company Name"
              placeholderTextColor="#6b7280"
              className="h-10 native:h-12 border dark:bg-gray-800 px-4 rounded-lg text-base font-medium text-[#222] dark:text-gray-100"
              value={form.companyName}
            />
          </View>
          <View className="mb-4">
            <Text className="color-[#222] dark:text-gray-300 mb-2 text-lg font-acumin">
              Contact person
            </Text>
            <TextInput
              autoCorrect={false}
              clearButtonMode="while-editing"
              onChangeText={(contactPerson) =>
                setForm({ ...form, contactPerson })
              }
              placeholder="Contact Person Name"
              placeholderTextColor="#6b7280"
              keyboardType="phone-pad"
              className="h-10 native:h-12 border dark:bg-gray-800 px-4 rounded-lg text-base font-medium text-[#222] dark:text-gray-100"
              value={form.contactPerson}
            />
          </View>
          <View className="mb-4">
            <Text className="color-[#222] dark:text-gray-300 mb-2 text-lg font-acumin">
              Designation
            </Text>
            <TextInput
              autoCorrect={false}
              clearButtonMode="while-editing"
              onChangeText={(designation) => setForm({ ...form, designation })}
              placeholder="Designation"
              placeholderTextColor="#6b7280"
              className="h-10 native:h-12 border dark:bg-gray-800 px-4 rounded-lg text-base font-medium text-[#222] dark:text-gray-100"
              value={form.designation}
            />
          </View>
          <View className="mb-4">
            <Text className="color-[#222] dark:text-gray-300 mb-2 text-lg font-acumin">
              Mobile No.
            </Text>
            <TextInput
              keyboardType="numeric"
              autoCorrect={false}
              clearButtonMode="while-editing"
              onChangeText={(phone) => setPhone(phone)}
              placeholder="phone"
              placeholderTextColor="#6b7280"
              className="h-10 native:h-12 border dark:bg-gray-800 px-4 rounded-lg text-base font-medium text-[#222] dark:text-gray-100"
              value={phone}
            />
            {/* <PhoneInput
                defaultCountry="US"
                value={phone}
                onChange={setPhone}
              /> */}
          </View>
          <View className="mb-4">
            <Text className="color-[#222] dark:text-gray-300 mb-2 text-lg font-acumin">
              Email Id
            </Text>
            <TextInput
              autoCorrect={false}
              clearButtonMode="while-editing"
              onChangeText={(emailId) => setForm({ ...form, emailId })}
              placeholder="Email"
              placeholderTextColor="#6b7280"
              className="h-10 native:h-12 border dark:bg-gray-800 px-4 rounded-lg text-base font-medium text-[#222] dark:text-gray-100"
              value={form.emailId}
            />
          </View>
          <View className="mb-4">
            <Text className="color-[#222] dark:text-gray-300 mb-2 text-lg font-acumin">
              Product
            </Text>
            <TextInput
              autoCorrect={false}
              clearButtonMode="while-editing"
              onChangeText={(product) => setForm({ ...form, product })}
              placeholder="Product"
              placeholderTextColor="#6b7280"
              className="h-10 native:h-12 border dark:bg-gray-800 px-4 rounded-lg text-base font-medium text-[#222] dark:text-gray-100"
              value={form.product}
            />
          </View>
          <View className="mb-4">
            <Text className="color-[#222] dark:text-gray-300 mb-2 text-lg font-acumin">
              Lead Source
            </Text>
            <CustomDropdown title="Lead Source" itemsList={Items} />
          </View>
          <View className="mb-4">
            <Text className="color-[#222] dark:text-gray-300 mb-2 text-lg font-acumin">
              Competition with
            </Text>
            <TextInput
              autoCorrect={false}
              clearButtonMode="while-editing"
              onChangeText={(competition) => setForm({ ...form, competition })}
              placeholder="Competition"
              placeholderTextColor="#6b7280"
              className="h-10 native:h-12 border dark:bg-gray-800 px-4 rounded-lg text-base font-medium text-[#222] dark:text-gray-100"
              value={form.competition}
            />
          </View>
          <View>
            <Text className="color-[#222] dark:text-gray-300 mb-2 text-lg font-acumin">
              Time Frame
            </Text>
            <CustomDropdown title="Time" itemsList={Items} />
          </View>
          <Separator className="my-5 bg-gray-500" orientation="horizontal" />
          <View>
            <TouchableOpacity
              onPress={() => {
                // router.replace("homepage");
                handleSubmit();
              }}
            >
              <View className="flex-row items-center justify-center rounded-lg py-2 px-4 border border-[#007aff] bg-[#007aff]">
                <Text className=" text-lg font-semibold text-white">
                  Submit
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default m_newLead;
