import {
  View,
  TouchableOpacity,
  TextInput,
  Text,
  ScrollView,
  Pressable,
  KeyboardAvoidingView,
  ActivityIndicator,
  Modal,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Separator } from "~/components/ui/separator";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useUpdateLead, useLeads } from "~/hooks/leads";
import { LeadSource, TimeFrame } from "~/constants/dropdowns";
import CustomDropdownV2 from "~/components/CustomDropdownV2";
import { LeadData, LeadUpdateData } from "~/types/lead";
import Toast from "react-native-toast-message";
import { z } from "zod";
import { useConstants } from "~/hooks/const";
import { Contact } from "~/types/contacts";
import ContactPickerModal from "~/components/ContactPickerModal";
import { Textarea } from "~/components/ui/textarea";
import { API_URL } from "~/constants/api";
import { useUserStore } from "~/store";
import { Image } from "expo-image";
import { Header, HeaderBackButton } from "@react-navigation/elements";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

const m_editLead = () => {

  const userToken = useUserStore((state: any) => state.user?.token);
  const constants = useConstants();
  const { leadId } = useLocalSearchParams<{ leadId: string }>();
  const navigation = useNavigation();
  const { bottom } = useSafeAreaInsets();
  const allLeads = useLeads();
  const router = useRouter();
  const leadUpdate = useUpdateLead();

  // Initialize form with empty values first

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLeadRemindDate, setLeadRemindDate] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isContactPickerVisible, setIsContactPickerVisible] = useState(false);

  // Helper function to check if value is string
  function isString(value: unknown): value is string {
    return typeof value === "string";
  }

  // Find current lead based on leadId
  const currentLead: LeadData | undefined = allLeads.data?.find((lead) => {
    if (isString(leadId)) {
      return lead.ReferenceTransaction_2361Id === parseInt(leadId);
    } else if (Array.isArray(leadId)) {
      return lead.ReferenceTransaction_2361Id === parseInt(leadId[0]);
    }
    return false;
  });

  const [form, setForm] = useState<LeadUpdateData>({
    currency: currentLead?.CurrencyName || "",
    customerCompanyName: currentLead?.UDF_CompanyName_2361 || "",
    contactPerson: currentLead?.UDF_ContactPerson_2361 || "",
    designation: currentLead?.UDF_Designation_2361 || "",
    mobileNo: currentLead?.UDF_MobileNo_2361 || "",
    address: currentLead?.UDF_CustomerAdd_2361 || "",
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
  // Get lead image URI
  const getLeadImageUri = (imageName: string) => {
    return {
      uri: `${API_URL}/user/lead/images/${imageName}`,
      headers: { Authorization: `Bearer ${userToken}` },
    };
  };

  // Form validation schema
  const leadFormSchema = z
    .object({
      currency: z.string().min(1, "Currency is required"),
      customerCompanyName: z
        .string()
        .min(1, "Customer Company Name is required"),
      contactPerson: z.string().min(1, "Contact Person is required"),
      designation: z.string().min(1, "Designation is required"),
      mobileNo: z
        .string()
        .trim()
        .optional()
        .refine(
          (value) => !value || value.length >= 10,
          "Mobile number must be at least 10 digits"
        ),
      address: z.string().optional(),
      emailId: z
        .string()
        .trim()
        .optional()
        .refine(
          (value) => !value || z.string().email().safeParse(value).success,
          "Invalid email address"
        ),
      product: z.string().min(1, "Product is required"),
      leadSource: z.string().min(1, "Lead Source is required"),
      competition: z.string().optional(),
      timeFrame: z.string().min(1, "Time Frame is required"),
      leadRemindDate: z.date(),
      customerApplication: z.string().optional(),
      customerExistingMachine: z.string().optional(),
      leadNote: z.string().optional(),
    })
    .superRefine((data, ctx) => {
      if (!data.mobileNo?.trim() && !data.emailId?.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Either Mobile No. or Email is required",
          path: ["mobileNo"],
        });
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Either Mobile No. or Email is required",
          path: ["emailId"],
        });
      }
    });

  // Handle contact selection
  const handleSelectContact = (contact: Contact) => {
    if (contact.phoneNumbers && contact.phoneNumbers.length > 0) {
      setForm((prev) => ({
        ...prev,
        mobileNo: contact.phoneNumbers![0].number || "",
        contactPerson: `${contact.name}`.trim(),
      }));
    }
    setIsContactPickerVisible(false);
  };

  // Handle form submission
  const handleSubmit = async () => {
    try {
      const validatedForm = leadFormSchema.parse(form);
      setErrors({});

      if (!currentLead) {
        Toast.show({
          type: "error",
          text1: "Error",
          text2: "Lead data not found",
        });
        return;
      }

      await leadUpdate.mutateAsync({
        RecordId: currentLead.ReferenceTransaction_2361Id || 0,
        category: currentLead.CategoryName || "",
        currency: form.currency,
        customerCompanyName: form.customerCompanyName,
        contactPerson: form.contactPerson,
        designation: form.designation,
        mobileNo: form.mobileNo,
        address: form.address,
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
        const newErrors: Record<string, string> = {};
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
        Toast.show({
          type: "error",
          text1: "Error",
          text2: "An unexpected error occurred",
        });
      }
    }
  };

  // Set up navigation header
  useEffect(() => {
    console.log("leadId", leadId);
    navigation.setOptions({
      header: ({ options }: any) => (
        <Header {...options} title={options.title || "Edit Lead #" + leadId} />
      ),
      headerLeft: () => (
        <HeaderBackButton tintColor="white" onPress={() => router.back()} />
      ),
      headerTitleStyle: {
        fontFamily: "acumin",
      },
      headerTitleAlign: "center",
      headerStyle: {
        backgroundColor: "steelblue",
      },
    });
  }, [leadId, navigation, router]);

  // 🔥 This useEffect will run when currentLead data becomes available
  useEffect(() => {
    if (currentLead) {
      console.log("Populating form with lead data:", currentLead);
      setForm({
        currency: currentLead.CurrencyName || "",
        customerCompanyName: currentLead.UDF_CompanyName_2361 || "",
        contactPerson: currentLead.UDF_ContactPerson_2361 || "",
        designation: currentLead.UDF_Designation_2361 || "",
        mobileNo: currentLead.UDF_MobileNo_2361 || "",
        address: currentLead.UDF_CustomerAdd_2361 || "",
        emailId: currentLead.UDF_EmailId_2361 || "",
        product: currentLead.UDF_Product_2361 || "",
        leadSource: currentLead.UDF_LeadSource_2361 || "",
        competition: currentLead.UDF_CompetitionWith_2361 || "",
        timeFrame: currentLead.UDF_TimeFrame_2361 || "",
        leadRemindDate: currentLead.UDF_LeadRemindDate_2361
          ? new Date(currentLead.UDF_LeadRemindDate_2361)
          : new Date(),
        customerApplication: currentLead.UDF_CustomerApplication_2361 || "",
        customerExistingMachine:
          currentLead.UDF_CustomerExistingMachine_2361 || "",
        leadNote: currentLead.UDF_LeadNotes_2361 || "",
      });
    }
  }, [currentLead]); // Runs when currentLead changes from undefined to actual data

  // Add debugging to see the timing
  useEffect(() => {
    console.log("leadId:", leadId);
    console.log("allLeads.isLoading:", allLeads.isLoading);
    console.log("currentLead:", currentLead ? "Found" : "Not found");
  }, [leadId, allLeads.isLoading, currentLead]);

  // Show loading state while waiting for data
  if (!leadId || allLeads.isLoading || !currentLead) {
    return (
      <SafeAreaView className="flex-1" edges={["bottom"]}>
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" />
          <Text className="mt-2 text-lg font-acumin">Loading lead data...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1" edges={["bottom"]}>
      <KeyboardAvoidingView behavior="padding">
        <View
          className={`${
            leadUpdate.isPending ? "" : "hidden"
          } z-50 bg-blue-100/40 absolute spinner h-screen w-screen flex justify-center items-center overflow-hidden`}
        >
          <ActivityIndicator size="large" />
        </View>
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentInset={{ bottom: bottom }}
        >
          <View className="flex h-full mx-3 my-5">
            <View className="px-3">
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
                    className="h-10 native:h-12 border dark:bg-gray-800 px-4 rounded-md  font-medium text-[#222] dark:text-gray-100"
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
                {constants.isLoading ? (
                  <View className="flex-row items-center justify-start gap-2 h-10 native:h-12 border dark:bg-gray-800 px-4 rounded-md  font-medium text-[#222] dark:text-gray-100">
                    <ActivityIndicator />
                    <Text>Fetching</Text>
                  </View>
                ) : (
                  <>
                    <CustomDropdownV2
                      key={`currency-${form.currency}`}
                      options={
                        constants.data?.CurrencyOutput.split(",").map(
                          (currency: any) => ({
                            value: currency,
                            label: currency,
                          })
                        ) || []
                      }
                      defaultValue={{
                        value: form.currency,
                        label: form.currency,
                      }}
                      placeholder="Currency"
                      onChange={(value) => {
                        setForm({ ...form, currency: value });
                      }}
                    />
                  </>
                )}
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
                  className={`h-10 native:h-12 border dark:bg-gray-800 px-4 rounded-lg font-medium text-[#222] dark:text-gray-100 ${
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
                <View className="flex-row items-center justify-between gap-2">
                  <TextInput
                    autoCorrect={false}
                    clearButtonMode="while-editing"
                    onChangeText={(contactPerson) =>
                      setForm({ ...form, contactPerson })
                    }
                    placeholder="Contact Person Name"
                    placeholderTextColor="#6b7280"
                    className={`flex-grow h-10 native:h-12 border rounded-lg px-4  font-medium ${
                      errors.contactPerson ? "border-red-500" : ""
                    } dark:bg-gray-800 text-[#222] dark:text-gray-100`}
                    value={form.contactPerson}
                  />
                  <Pressable
                    onPress={() => setIsContactPickerVisible(true)}
                    className="border p-2 px-3 rounded-lg flex items-center justify-center"
                  >
                    <MaterialIcons name="contacts" size={24} color="black" />
                  </Pressable>
                </View>
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
                  className={`h-10 native:h-12 border dark:bg-gray-800 px-4 rounded-lg font-medium text-[#222] dark:text-gray-100 ${
                    errors.designation ? "border-red-500" : ""
                  }`}
                  value={form.designation}
                />
                {errors.designation && (
                  <Text className="text-red-500 mt-1">
                    {errors.designation}
                  </Text>
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
                  className={`h-10 native:h-12 border dark:bg-gray-800 px-4 rounded-lg font-medium text-[#222] dark:text-gray-100 ${
                    errors.mobileNo ? "border-red-500" : ""
                  }`}
                  value={form.mobileNo}
                />
                {errors.mobileNo && (
                  <Text className="text-red-500 mt-1">{errors.mobileNo}</Text>
                )}
              </View>
              <View className="mb-4">
                <View className="flex flex-row">
                  <Text className="color-[#222] dark:text-gray-300 mb-2 text-lg font-acumin">
                    Address
                  </Text>
                </View>
                <Textarea
                  autoCorrect={false}
                  editable
                  multiline
                  numberOfLines={4}
                  clearButtonMode="while-editing"
                  placeholder="Enter Address"
                  className={`native: rounded-lg dark:bg-gray-800  font-medium text-[#222] dark:text-gray-100 ${
                    errors.address ? "border border-red-500" : ""
                  }`}
                  placeholderClassName=" text-muted"
                  value={form.address}
                  onChangeText={(value) => setForm({ ...form, address: value })}
                  aria-labelledby="followup details"
                />
                {errors.address && (
                  <Text className="text-red-500 text-sm mt-1">
                    {errors.address}
                  </Text>
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
                  className={`h-10 native:h-12 border dark:bg-gray-800 px-4 rounded-lg font-medium text-[#222] dark:text-gray-100 ${
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
                {constants.isLoading ? (
                  <View className="flex-row items-center justify-start gap-2 h-10 native:h-12 border dark:bg-gray-800 px-4 rounded-md  font-medium text-[#222] dark:text-gray-100">
                    <ActivityIndicator />
                    <Text>Fetching</Text>
                  </View>
                ) : (
                  <>
                    <CustomDropdownV2
                      key={`product-${form.product}`}
                      options={
                        constants.data?.ProductOutput.split(",").map(
                          (product: any) => ({
                            value: product,
                            label: product,
                          })
                        ) || []
                      }
                      defaultValue={{
                        value: form.product,
                        label: form.product,
                      }}
                      placeholder="Products"
                      onChange={(value) => {
                        setForm({ ...form, product: value });
                      }}
                    />
                  </>
                )}
                {errors.product && (
                  <Text className="text-red-500 mt-1">{errors.product}</Text>
                )}
              </View>
              <View className="mb-4">
                <Text className="color-[#222] dark:text-gray-300 mb-2 text-lg font-acumin">
                  Lead Source
                </Text>
                <CustomDropdownV2
                  key={`leadSource-${form.leadSource}`}
                  options={LeadSource.map((source) => ({
                    value: source,
                    label: source,
                  }))}
                  defaultValue={{
                    value: form.leadSource,
                    label: form.leadSource,
                  }}
                  placeholder="Lead Source"
                  onChange={(value) => setForm({ ...form, leadSource: value })}
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
                  className={`h-10 native:h-12 border dark:bg-gray-800 px-4 rounded-lg font-medium text-[#222] dark:text-gray-100 ${
                    errors.competition ? "border-red-500" : ""
                  }`}
                  value={form.competition}
                />
                {errors.competition && (
                  <Text className="text-red-500 mt-1">
                    {errors.competition}
                  </Text>
                )}
              </View>
              <View className="mb-4">
                <Text className="color-[#222] dark:text-gray-300 mb-2 text-lg font-acumin">
                  Time Frame
                </Text>
                <CustomDropdownV2
                  key={`timeFrame-${form.timeFrame}`}
                  options={TimeFrame.map((timeFrame) => ({
                    value: timeFrame,
                    label: timeFrame,
                  }))}
                  defaultValue={{
                    value: form.timeFrame,
                    label: form.timeFrame,
                  }}
                  placeholder="Time Frame"
                  onChange={(value) => setForm({ ...form, timeFrame: value })}
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
                {constants.isLoading ? (
                  <View className="flex-row items-center justify-start gap-2 h-10 native:h-12 border dark:bg-gray-800 px-4 rounded-md  font-medium text-[#222] dark:text-gray-100">
                    <ActivityIndicator />
                    <Text>Fetching</Text>
                  </View>
                ) : (
                  <>
                    <CustomDropdownV2
                      key={`customerApplication-${form.customerApplication}`}
                      options={
                        constants.data?.ApplicationOutput.split(",").map(
                          (application: any) => ({
                            value: application,
                            label: application,
                          })
                        ) || []
                      }
                      defaultValue={{
                        value: form.customerApplication,
                        label: form.customerApplication,
                      }}
                      placeholder="Applications"
                      onChange={(value) => {
                        setForm({ ...form, customerApplication: value });
                      }}
                    />
                  </>
                )}
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
                  className={`h-10 native:h-12 border dark:bg-gray-800 px-4 rounded-lg font-medium text-[#222] dark:text-gray-100 ${
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
                <Textarea
                  autoCorrect={false}
                  clearButtonMode="while-editing"
                  placeholder="Enter Lead Notes.."
                  className={`native: rounded-lg dark:bg-gray-800  font-medium text-[#222] dark:text-gray-100 ${
                    errors.leadNote ? "border border-red-500" : ""
                  }`}
                  placeholderClassName=" text-muted"
                  value={form.leadNote}
                  onChangeText={(leadNote) => setForm({ ...form, leadNote })}
                  aria-labelledby="textareaLabel"
                />
                {errors.leadNote && (
                  <Text className="text-red-500 mt-1">{errors.leadNote}</Text>
                )}
              </View>
              <View className="mb-4">
                <Text className="color-[#222] dark:text-gray-300 mb-2 text-lg font-acumin">
                  Attachments
                </Text>
                {currentLead?.ImageName &&
                currentLead.ImageName.split(",").length > 0 ? (
                  <ScrollView horizontal className="mt-4">
                    {currentLead.ImageName.split(",").map(
                      (image: string, index: number) => (
                        <TouchableOpacity
                          key={index}
                          onPress={() => setSelectedImage(image)}
                        >
                          <View className="mr-2 rounded-md">
                            <Image
                              source={getLeadImageUri(image)}
                              className="w-20 h-20 rounded-md"
                              style={{ width: 80, height: 80 }}
                            />
                          </View>
                        </TouchableOpacity>
                      )
                    )}
                  </ScrollView>
                ) : (
                  <Text className="text-gray-500 italic">No attachments</Text>
                )}
              </View>
              <Separator
                className="my-5 bg-gray-500"
                orientation="horizontal"
              />
              <View>
                <TouchableOpacity onPress={handleSubmit}>
                  <View className="flex-row items-center justify-center rounded-lg py-2 px-4 border border-[#007aff] bg-[#007aff]">
                    <Text className=" text-lg font-semibold text-white">
                      Submit
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </View>
          <Modal visible={!!selectedImage} animationType="fade">
            <View className="flex-1 w-full bg-black bg-opacity-90 justify-center items-center">
              {selectedImage && (
                <Image
                  source={getLeadImageUri(selectedImage)}
                  style={{ width: 350, height: 500 }}
                  contentFit="contain"
                />
              )}
              <TouchableOpacity
                className="absolute top-10 right-10 z-10 self-end"
                onPress={() => setSelectedImage(null)}
              >
                <Ionicons name="close" size={30} color="white" />
              </TouchableOpacity>
            </View>
          </Modal>
        </ScrollView>
        <ContactPickerModal
          isVisible={isContactPickerVisible}
          onClose={() => setIsContactPickerVisible(false)}
          onSelectContact={handleSelectContact}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default m_editLead;
