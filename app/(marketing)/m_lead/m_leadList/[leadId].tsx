import {
  View,
  TouchableOpacity,
  TextInput,
  Text,
  ScrollView,
  Pressable,
  KeyboardAvoidingView,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import CustomDropdown from "~/components/CustomDropdown";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Separator } from "~/components/ui/separator";
import { Ionicons } from "@expo/vector-icons";
import { useUpdateLead, useLeads } from "~/hooks/leads";
import {
  Category,
  LeadSource,
  Currency,
  TimeFrame,
} from "~/constants/dropdowns";
import { LeadData, LeadUpdateData } from "~/types/lead";
import { Portal } from "~/components/primitives/portal";
import Toast from "react-native-toast-message";
import { z } from "zod";
const m_editLead = () => {
  const { leadId } = useLocalSearchParams<{ leadId: string | string[] }>();
  const navigation = useNavigation();

  const allLeads = useLeads();
  const currentLead: LeadData | undefined = allLeads.data?.find((lead) => {
    if (isString(leadId)) {
      return lead.ReferenceTransaction_2361Id === parseInt(leadId);
    } else if (Array.isArray(leadId)) {
      return lead.ReferenceTransaction_2361Id === parseInt(leadId[0]);
    }
    return false;
  });

  useEffect(() => {
    navigation.setOptions({
      headerTitle: "Edit Lead #" + leadId,
      headerTitleStyle: {
        fontFamily: "acumin",
      },
      headerTitleAlign: "center",
      headerStyle: {
        backgroundColor: "steelblue",
      },
    });
  }, [leadId]);

  const leadFormSchema = z.object({
    currency: z.string().min(1, "Currency is required"),
    customerCompanyName: z.string().min(1, "Customer Company Name is required"),
    contactPerson: z.string().min(1, "Contact Person is required"),
    designation: z.string().min(1, "Designation is required"),
    mobileNo: z.string().min(10, "Mobile number must be at least 10 digits"),
    emailId: z.string().email("Invalid email address"),
    product: z.string().min(1, "Product is required"),
    leadSource: z.string().min(1, "Lead Source is required"),
    competition: z.string().optional(),
    timeFrame: z.string().min(1, "Time Frame is required"),
    leadRemindDate: z.date(),
    customerApplication: z.string().optional(),
    customerExistingMachine: z.string().optional(),
    leadNote: z.string().optional(),
  });

  const [form, setForm] = useState<LeadUpdateData>({
    currency: currentLead?.CurrencyName || "",
    customerCompanyName: currentLead?.UDF_CompanyName_2361 || "",
    contactPerson: currentLead?.UDF_ContactPerson_2361 || "",
    designation: currentLead?.UDF_Designation_2361 || "",
    mobileNo: currentLead?.UDF_MobileNo_2361 || "",
    emailId: currentLead?.UDF_EmailId_2361 || "",
    product: currentLead?.UDF_Product_2361 || "",
    leadSource: currentLead?.UDF_LeadSource_2361 || "",
    competition: currentLead?.UDF_CompetitionWith_2361 || "",
    timeFrame: currentLead?.UDF_TimeFrame_2361 || "",
    leadRemindDate: new Date(currentLead?.UDF_LeadRemindDate_2361 || ""),
    customerApplication: currentLead?.UDF_CustomerApplication_2361 || "",
    customerExistingMachine:
      currentLead?.UDF_CustomerExistingMachine_2361 || "",
    leadNote: currentLead?.UDF_LeadNotes_2361 || "",
  });

  const [errors, setErrors] = useState<any>({});

  const [isLeadRemindDate, setLeadRemindDate] = useState(false);

  const router = useRouter();
  const leadUpdate = useUpdateLead();

  function isString(value: unknown): value is string {
    return typeof value === "string";
  }

  const handleSubmit = async () => {
    try {
      const validatedForm = leadFormSchema.parse(form);
      setErrors({});
      await leadUpdate.mutateAsync({
        RecordId: currentLead?.ReferenceTransaction_2361Id || 0,
        category: currentLead?.CategoryName || "",
        currency: form.currency,
        customerCompanyName: form.customerCompanyName,
        contactPerson: form.contactPerson,
        designation: form.designation,
        mobileNo: form.mobileNo,
        emailId: form.emailId,
        product: form.product,
        leadSource: form.leadSource,
        competition: form.competition,
        timeFrame: form.timeFrame,
        leadRemindDate: form.leadRemindDate,
        customerApplication: form.customerApplication,
        customerExistingMachine: form.customerExistingMachine,
        leadNote: form.leadNote,
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        // Handle validation errors
        const newErrors: any = {};
        error.errors.forEach((err) => {
          newErrors[err.path[0]] = err.message;
        });
        Toast.show({
          type: "error",
          text1: "Error",
          text2: "Please fill all the required fields",
        });
        setErrors(newErrors);
      } else {
        console.error(error);
        Toast.show({
          type: "error",
          text1: "Error",
          text2: "An unexpected error occurred",
        });
      }
    }
  };
  return (
    <KeyboardAvoidingView behavior="padding">
      <View
        className={`${
          leadUpdate.isPending ? "" : "hidden"
        } z-50 bg-blue-100/40 absolute spinner h-screen w-screen flex justify-center items-center overflow-hidden`}
      >
        <ActivityIndicator size="large" />
      </View>
      <ScrollView keyboardShouldPersistTaps="handled">
        {/* <Spinner visible={leadUpdate.isPending} /> */}
        <View className="flex h-full mx-3 my-5">
          <View className="px-3">
            <View className="mb-4">
              <Text className="color-[#222] dark:text-gray-300 mb-2 text-lg font-acumin">
                Category
              </Text>
              <TextInput
                readOnly
                keyboardType="numeric"
                autoCorrect={false}
                clearButtonMode="while-editing"
                placeholder="0"
                placeholderTextColor="#6b7280"
                className="h-10 native:h-12 border dark:bg-gray-800 px-4 rounded-md text-base font-medium text-[#222] dark:text-gray-100"
                value={currentLead?.CategoryName || ""}
              />
            </View>
            <View className="mb-4 flex flex-row gap-2">
              <View className="flex-1">
                <Text className="color-[#222] dark:text-gray-300 mb-2 text-lg font-acumin">
                  Doc No.
                </Text>
                <TextInput
                  readOnly
                  keyboardType="numeric"
                  autoCorrect={false}
                  clearButtonMode="while-editing"
                  placeholder="0"
                  placeholderTextColor="#6b7280"
                  className="h-10 native:h-12 border dark:bg-gray-800 px-4 rounded-md text-base font-medium text-[#222] dark:text-gray-100"
                  value={currentLead?.DocumentNo.toString() || ""}
                />
              </View>
              <View className="flex-1 flex flex-col">
                <Text className="color-[#222] dark:text-gray-300 mb-2 text-lg font-acumin">
                  Doc. Date
                </Text>
                <View className="h-10 native:h-12 border dark:bg-gray-800 w-full px-4 rounded-lg flex-row items-center">
                  <Ionicons
                    name="calendar-clear-outline"
                    color={"#222222"}
                    size={20}
                  />
                  <Text className="text-lg text-[#222] dark:text-gray-100 font-acumin ml-2">
                    {currentLead?.DocumentDate.split("T")[0] || ""}
                  </Text>
                </View>
              </View>
            </View>
            <View className="mb-4">
              <Text className="color-[#222] dark:text-gray-300 mb-2 text-lg font-acumin">
                Currency
              </Text>
              <CustomDropdown
                title={currentLead?.CurrencyName || ""}
                itemsList={Currency}
                onValueChange={(value) => setForm({ ...form, currency: value })}
              />
              {errors.currency && (
                <Text className="text-red-500 mt-1">{errors.currency}</Text>
              )}
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
                className={`h-10 native:h-12 border dark:bg-gray-800 px-4 rounded-lg text-base font-medium text-[#222] dark:text-gray-100 ${
                  errors.customerCompanyName ? "border-red-500" : ""
                }`}
                value={form.customerCompanyName}
              />
              {errors.customerCompanyName && (
                <Text className="text-red-500 mt-1">
                  {errors.customerCompanyName}
                </Text>
              )}
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
                className={`h-10 native:h-12 border dark:bg-gray-800 px-4 rounded-lg text-base font-medium text-[#222] dark:text-gray-100 ${
                  errors.contactPerson ? "border-red-500" : ""
                }`}
                value={form.contactPerson}
              />
              {errors.contactPerson && (
                <Text className="text-red-500 mt-1">
                  {errors.contactPerson}
                </Text>
              )}
            </View>
            <View className="mb-4">
              <Text className="color-[#222] dark:text-gray-300 mb-2 text-lg font-acumin">
                Designation
              </Text>
              <TextInput
                autoCorrect={false}
                clearButtonMode="while-editing"
                onChangeText={(designation) =>
                  setForm({ ...form, designation })
                }
                placeholder="Designation"
                placeholderTextColor="#6b7280"
                className={`h-10 native:h-12 border dark:bg-gray-800 px-4 rounded-lg text-base font-medium text-[#222] dark:text-gray-100 ${
                  errors.designation ? "border-red-500" : ""
                }`}
                value={form.designation}
              />
              {errors.designation && (
                <Text className="text-red-500 mt-1">{errors.designation}</Text>
              )}
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
                className={`h-10 native:h-12 border dark:bg-gray-800 px-4 rounded-lg text-base font-medium text-[#222] dark:text-gray-100 ${
                  errors.mobileNo ? "border-red-500" : ""
                }`}
                value={form.mobileNo}
              />
              {errors.mobileNo && (
                <Text className="text-red-500 mt-1">{errors.mobileNo}</Text>
              )}
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
                className={`h-10 native:h-12 border dark:bg-gray-800 px-4 rounded-lg text-base font-medium text-[#222] dark:text-gray-100 ${
                  errors.emailId ? "border-red-500" : ""
                }`}
                value={form.emailId}
              />
              {errors.emailId && (
                <Text className="text-red-500 mt-1">{errors.emailId}</Text>
              )}
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
                className={`h-10 native:h-12 border dark:bg-gray-800 px-4 rounded-lg text-base font-medium text-[#222] dark:text-gray-100 ${
                  errors.product ? "border-red-500" : ""
                }`}
                value={form.product}
              />
              {errors.product && (
                <Text className="text-red-500 mt-1">{errors.product}</Text>
              )}
            </View>
            <View className="mb-4">
              <Text className="color-[#222] dark:text-gray-300 mb-2 text-lg font-acumin">
                Lead Source
              </Text>
              <CustomDropdown
                title={currentLead?.UDF_LeadSource_2361 || ""}
                itemsList={LeadSource}
                onValueChange={(value) =>
                  setForm({ ...form, leadSource: value })
                }
              />
              {errors.leadSource && (
                <Text className="text-red-500 mt-1">{errors.leadSource}</Text>
              )}
            </View>
            <View className="mb-4">
              <Text className="color-[#222] dark:text-gray-300 mb-2 text-lg font-acumin">
                Competition with
              </Text>
              <TextInput
                autoCorrect={false}
                clearButtonMode="while-editing"
                onChangeText={(competition) =>
                  setForm({ ...form, competition })
                }
                placeholder="Competition"
                placeholderTextColor="#6b7280"
                className={`h-10 native:h-12 border dark:bg-gray-800 px-4 rounded-lg text-base font-medium text-[#222] dark:text-gray-100 ${
                  errors.competition ? "border-red-500" : ""
                }`}
                value={form.competition}
              />
              {errors.competition && (
                <Text className="text-red-500 mt-1">{errors.competition}</Text>
              )}
            </View>
            <View className="mb-4">
              <Text className="color-[#222] dark:text-gray-300 mb-2 text-lg font-acumin">
                Time Frame
              </Text>
              <CustomDropdown
                title={currentLead?.UDF_TimeFrame_2361 || ""}
                itemsList={TimeFrame}
                onValueChange={(value) =>
                  setForm({ ...form, timeFrame: value })
                }
              />
              {errors.timeFrame && (
                <Text className="text-red-500 mt-1">{errors.timeFrame}</Text>
              )}
            </View>
            <View className="flex-1 flex flex-col mb-4">
              <Text className="color-[#222] dark:text-gray-300 mb-2 text-lg font-acumin">
                Lead Remind Date
              </Text>
              <Pressable
                onPress={() => {
                  setLeadRemindDate(true);
                }}
                className={`h-10 native:h-12 border dark:bg-gray-800 w-full px-4 rounded-lg flex-row items-center ${
                  errors.leadRemindDate ? "border-red-500" : ""
                }`}
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
              {errors.leadRemindDate && (
                <Text className="text-red-500 mt-1">
                  {errors.leadRemindDate}
                </Text>
              )}
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
                className={`h-10 native:h-12 border dark:bg-gray-800 px-4 rounded-lg text-base font-medium text-[#222] dark:text-gray-100 ${
                  errors.customerApplication ? "border-red-500" : ""
                }`}
                value={form.customerApplication}
              />
              {errors.customerApplication && (
                <Text className="text-red-500 mt-1">
                  {errors.customerApplication}
                </Text>
              )}
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
                className={`h-10 native:h-12 border dark:bg-gray-800 px-4 rounded-lg text-base font-medium text-[#222] dark:text-gray-100 ${
                  errors.customerExistingMachine ? "border-red-500" : ""
                }`}
                value={form.customerExistingMachine}
              />
              {errors.customerExistingMachine && (
                <Text className="text-red-500 mt-1">
                  {errors.customerExistingMachine}
                </Text>
              )}
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
                className={`h-10 native:h-12 border dark:bg-gray-800 px-4 rounded-lg text-base font-medium text-[#222] dark:text-gray-100 ${
                  errors.leadNote ? "border-red-500" : ""
                }`}
                value={form.leadNote}
              />
              {errors.leadNote && (
                <Text className="text-red-500 mt-1">{errors.leadNote}</Text>
              )}
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

export default m_editLead;
