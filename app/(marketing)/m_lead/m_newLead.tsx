import {
  View,
  TouchableOpacity,
  TextInput,
  Text,
  ScrollView,
  Alert,
  Pressable,
  KeyboardAvoidingView,
} from "react-native";
import React, { useState } from "react";
import { useRouter } from "expo-router";
import CustomDropdown from "~/components/CustomDropdown";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Separator } from "~/components/ui/separator";
import { Ionicons } from "@expo/vector-icons";
import { useInsertLead } from "~/hooks/leads";
import { Category, LeadSource, Currency, TimeFrame } from "~/constants/dropdowns";

const m_newLead = () => {
  const [form, setForm] = useState({
    company: "",
    category: "",
    documentNo: "",
    documentDate: new Date(),
    currency: "",
    customerCompanyName: "",
    contactPerson: "",
    designation: "",
    mobileNo: "",
    emailId: "",
    product: "",
    leadSource: "",
    competition: "",
    timeFrame: "",
    leadNote: "",
    leadRemindDate: new Date(),
    customerApplication: "",
    customerExistingMachine: "",
  });

  const [isDocDateVisible, setDocDateVisible] = useState(false);
  const [isLeadRemindDate, setLeadRemindDate] = useState(false);
  const router = useRouter();
  const leadSubmit = useInsertLead();

  const handleSubmit = () => {
    leadSubmit.mutate({
      category: form.category,
      currency: form.currency,
      customerCompanyName: form.customerCompanyName,
      contactPerson: form.contactPerson,
      designation: form.designation,
      mobileNo: form.designation,
      emailId: form.emailId,
      product: form.product,
      leadSource: form.leadSource,
      competition: form.competition,
      timeFrame: form.timeFrame,
      leadRemindDate: form.leadRemindDate,
      customerApplication: form.customerApplication,
      customerExistingMachine: form.customerExistingMachine,
      leadNote: form.leadNote
    })
  };
  return (
    <KeyboardAvoidingView behavior="padding">
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
                Category
              </Text>
              <CustomDropdown title="Category" itemsList={Category} onValueChange={(value) => setForm({ ...form, category: value })} />
            </View>
            <View className="mb-4 flex flex-row gap-2">
              <View className="flex-1">
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
            <View className="mb-4">
              <Text className="color-[#222] dark:text-gray-300 mb-2 text-lg font-acumin">
                Currency
              </Text>
              <CustomDropdown title="Currency" itemsList={Currency} onValueChange={(value) => setForm({ ...form, currency: value })} />
            </View>
            <View className="mb-4">
              <Text className="color-[#222] dark:text-gray-300 mb-2 text-lg font-acumin">
                Customer Company name
              </Text>
              <TextInput
                autoCorrect={false}
                clearButtonMode="while-editing"
                onChangeText={(customerCompanyName) =>
                  setForm({ ...form, customerCompanyName })
                }
                placeholder="Enter Customer Company Name"
                placeholderTextColor="#6b7280"
                className="h-10 native:h-12 border dark:bg-gray-800 px-4 rounded-lg text-base font-medium text-[#222] dark:text-gray-100"
                value={form.customerCompanyName}
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
                keyboardType="phone-pad"
                autoCorrect={false}
                clearButtonMode="while-editing"
                onChangeText={(mobileNo) => setForm({ ...form, mobileNo })}
                placeholder="Phone"
                placeholderTextColor="#6b7280"
                className="h-10 native:h-12 border dark:bg-gray-800 px-4 rounded-lg text-base font-medium text-[#222] dark:text-gray-100"
                value={form.mobileNo}
              />
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
              <CustomDropdown title="Lead Source" itemsList={LeadSource} onValueChange={(value) => setForm({ ...form, leadSource: value })} />
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
            <View className="mb-4">
              <Text className="color-[#222] dark:text-gray-300 mb-2 text-lg font-acumin">
                Time Frame
              </Text>
              <CustomDropdown title="Time Frame" itemsList={TimeFrame} onValueChange={(value) => setForm({ ...form, timeFrame: value })} />
            </View>
            <View className="flex-1 flex flex-col mb-4">
              <Text className="color-[#222] dark:text-gray-300 mb-2 text-lg font-acumin">
                Lead Remind Date
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
                  {form.leadRemindDate.toLocaleDateString("en-GB")}
                </Text>
                {isLeadRemindDate && (
                  <DateTimePicker
                    mode="date"
                    value={form.leadRemindDate}
                    display="default"
                    onChange={(event, newDate) => {
                      setForm({
                        ...form,
                        leadRemindDate: newDate ? newDate : new Date(),
                      });
                      setLeadRemindDate(false);
                    }}
                  />
                )}
              </Pressable>
            </View>
            <View className="mb-4">
              <Text className="color-[#222] dark:text-gray-300 mb-2 text-lg font-acumin">
                Customer Application
              </Text>
              <TextInput
                autoCorrect={false}
                clearButtonMode="while-editing"
                onChangeText={(customerApplication) =>
                  setForm({ ...form, customerApplication })
                }
                placeholder="Enter Customer Application"
                placeholderTextColor="#6b7280"
                className="h-10 native:h-12 border dark:bg-gray-800 px-4 rounded-lg text-base font-medium text-[#222] dark:text-gray-100"
                value={form.customerApplication}
              />
            </View>
            <View className="mb-4">
              <Text className="color-[#222] dark:text-gray-300 mb-2 text-lg font-acumin">
                Customer Existing Machine
              </Text>
              <TextInput
                autoCorrect={false}
                clearButtonMode="while-editing"
                onChangeText={(customerExistingMachine) =>
                  setForm({ ...form, customerExistingMachine })
                }
                placeholder="Enter Customer Existing Machine"
                placeholderTextColor="#6b7280"
                className="h-10 native:h-12 border dark:bg-gray-800 px-4 rounded-lg text-base font-medium text-[#222] dark:text-gray-100"
                value={form.customerExistingMachine}
              />
            </View>
            <View className="mb-4">
              <Text className="color-[#222] dark:text-gray-300 mb-2 text-lg font-acumin">
                Lead Note
              </Text>
              <TextInput
                autoCorrect={false}
                clearButtonMode="while-editing"
                onChangeText={(leadNote) => setForm({ ...form, leadNote })}
                placeholder="Enter Lead Notes"
                placeholderTextColor="#6b7280"
                className="h-10 native:h-12 border dark:bg-gray-800 px-4 rounded-lg text-base font-medium text-[#222] dark:text-gray-100"
                value={form.leadNote}
              />
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
    </KeyboardAvoidingView>
  );
};

export default m_newLead;
