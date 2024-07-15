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
import { useRouter } from "expo-router";
import CustomDropdown from "~/components/CustomDropdown";
import CustomDropdownV2 from "~/components/CustomDropdownV2";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Separator } from "~/components/ui/separator";
import { Ionicons, AntDesign, MaterialIcons } from "@expo/vector-icons";
import { useDocumentNo, useInsertLead } from "~/hooks/leads";
import { Portal } from "~/components/primitives/portal";
import Toast from "react-native-toast-message";
import client from "~/api/client";
import { z } from "zod";
import { useUserStore } from "~/store";
import { useConstants } from "~/hooks/const";
import { useQueryClient } from "@tanstack/react-query";
import { Contact } from "~/types/contacts";
import ContactPickerModal from "~/components/ContactPickerModal";
const m_newLead = () => {
  const constants = useConstants();
  const queryClient = useQueryClient();

  const leadFormSchema = z.object({
    category: z.string().min(1, "Category is required"),
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

  const clearForm = () => {
    setForm({
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
  };

  const [errors, setErrors] = useState<any>({});

  const [isDocDateVisible, setDocDateVisible] = useState(false);
  const [isLeadRemindDate, setLeadRemindDate] = useState(false);

  const leadSubmit = useInsertLead();

  const handleSubmit = async () => {
    try {
      const validatedForm = leadFormSchema.parse(form);
      setErrors({});
      await leadSubmit.mutateAsync({
        category: form.category,
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
      if (!leadSubmit.isError) {
        clearForm();
      }
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
        Toast.show({
          type: "error",
          text1: "Error",
          text2: "An unexpected error occurred",
        });
      }
    }
  };

  const doc = useDocumentNo(form.category);

  useEffect(() => {
    if (doc.data) {
      setForm((prevForm) => ({
        ...prevForm,
        documentNo: doc.data.DocumentNo || "",
      }));
    }
  }, [doc.data]);

  const [isContactPickerVisible, setIsContactPickerVisible] = useState(false);
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

  return (
    <KeyboardAvoidingView behavior="padding">
      <View
        className={`${
          leadSubmit.isPending ? "" : "hidden"
        } z-50 bg-blue-100/40 absolute spinner h-screen w-screen flex justify-center items-center overflow-hidden`}
      >
        <ActivityIndicator size="large" />
      </View>
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
              {constants.isLoading ? (
                <View className="flex-row items-center justify-start gap-2 h-10 native:h-12 border dark:bg-gray-800 px-4 rounded-md text-base font-medium text-[#222] dark:text-gray-100">
                  <ActivityIndicator />
                  <Text>Fetching</Text>
                </View>
              ) : (
                <CustomDropdown
                  title="Category"
                  // itemsList={Category}
                  itemsList={constants.data?.CategoryOutput.split(",") || []}
                  onValueChange={(value) => {
                    setForm((prevForm) => ({
                      ...prevForm,
                      category: value,
                      documentNo: "",
                    }));
                    queryClient.invalidateQueries({
                      queryKey: ["getLeadDocumentNo"],
                    });
                  }}
                />
              )}
              {errors.category && (
                <Text className="text-red-500 mt-1">{errors.category}</Text>
              )}
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
                  onChangeText={(documentNo) => {
                    setForm({ ...form, documentNo });
                  }}
                  editable={false}
                  placeholder="Document No"
                  placeholderTextColor="#6b7280"
                  className="h-10 native:h-12 border dark:bg-gray-800 px-4 rounded-md text-base font-medium text-[#222] dark:text-gray-100"
                  value={doc.data?.DocumentNo || form.documentNo}
                />
              </View>
              <View className="flex-1 flex flex-col">
                <View className="flex flex-row">
                  <Text className="color-[#222] dark:text-gray-300 mb-2 text-lg font-acumin">
                    Doc. Date
                  </Text>
                  <Text className="text-red-500">*</Text>
                </View>
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
                {/* <View className="flex-row items-center h-10 native:h-12 border dark:bg-gray-800 px-4 rounded-md text-base font-medium text-[#222] dark:text-gray-100">
                  <Text>{form.documentDate.toLocaleDateString("en-GB")}</Text>
                </View> */}
              </View>
            </View>
            <View className="mb-4">
              <Text className="color-[#222] dark:text-gray-300 mb-2 text-lg font-acumin">
                Currency
              </Text>
              {constants.isLoading ? (
                <View className="flex-row items-center justify-start gap-2 h-10 native:h-12 border dark:bg-gray-800 px-4 rounded-md text-base font-medium text-[#222] dark:text-gray-100">
                  <ActivityIndicator />
                  <Text>Fetching</Text>
                </View>
              ) : (
                <>
                  <CustomDropdown
                    title="Currency"
                    itemsList={constants.data?.CurrencyOutput.split(",") || []}
                    onValueChange={(value) =>
                      setForm({ ...form, currency: value })
                    }
                  />
                  <CustomDropdownV2
                    options={[
                      { value: "USD", label: "USD" },
                      { value: "INR", label: "INR" },
                      { value: "EUR", label: "EUR" },
                      { value: "GBP", label: "GBP" },
                      { value: "JPY", label: "JPY" },
                      { value: "AUD", label: "AUD" },
                      { value: "CAD", label: "CAD" },
                      { value: "CHF", label: "CHF" },
                      { value: "CNY", label: "CNY" },
                      { value: "SEK", label: "SEK" },
                      { value: "NZD", label: "NZD" },
                      { value: "KRW", label: "KRW" },
                    ]}
                    placeholder="Currency"
                    onChange={(value) => setForm({ ...form, currency: value })}
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
              <View className="flex-row items-center justify-between gap-2">
                <TextInput
                  autoCorrect={false}
                  clearButtonMode="while-editing"
                  onChangeText={(contactPerson) =>
                    setForm({ ...form, contactPerson })
                  }
                  placeholder="Contact Person Name"
                  placeholderTextColor="#6b7280"
                  className={`flex-grow h-10 native:h-12 border rounded-lg px-4 text-base font-medium ${
                    errors.contactPerson ? "border-red-500" : ""
                  } dark:bg-gray-800 text-[#222] dark:text-gray-100`}
                  value={form.contactPerson}
                />
                <Pressable
                  onPress={() => setIsContactPickerVisible(true)}
                  className="border p-2 px-3 rounded-lg flex items-center justify-center"
                >
                  {/* <Ionicons name="person" size={24} color="white" /> */}
                  {/* <AntDesign name="contacts" size={24} color="white" /> */}
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
              {constants.isLoading ? (
                <View className="flex-row items-center justify-start gap-2 h-10 native:h-12 border dark:bg-gray-800 px-4 rounded-md text-base font-medium text-[#222] dark:text-gray-100">
                  <ActivityIndicator />
                  <Text>Fetching</Text>
                </View>
              ) : (
                <CustomDropdown
                  title="Lead Source"
                  itemsList={constants.data?.LeadSourceOutput.split(",") || []}
                  onValueChange={(value) =>
                    setForm({ ...form, leadSource: value })
                  }
                />
              )}
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
              {constants.isLoading ? (
                <View className="flex-row items-center justify-start gap-2 h-10 native:h-12 border dark:bg-gray-800 px-4 rounded-md text-base font-medium text-[#222] dark:text-gray-100">
                  <ActivityIndicator />
                  <Text>Fetching</Text>
                </View>
              ) : (
                <CustomDropdown
                  title="Time Frame"
                  itemsList={constants.data?.TimeFrameOutput.split(",") || []}
                  onValueChange={(value) =>
                    setForm({ ...form, timeFrame: value })
                  }
                />
              )}
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
                  handleSubmit();
                }}
              >
                {/* Hello */}
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
      <ContactPickerModal
        isVisible={isContactPickerVisible}
        onClose={() => setIsContactPickerVisible(false)}
        onSelectContact={handleSelectContact}
      />
    </KeyboardAvoidingView>
  );
};

export default m_newLead;
