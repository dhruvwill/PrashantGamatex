import {
  View,
  TouchableOpacity,
  TextInput,
  Text,
  ScrollView,
  Pressable,
  KeyboardAvoidingView,
  ActivityIndicator,
  Image,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import CustomDropdown from "~/components/CustomDropdown";
import { Textarea } from "~/components/ui/textarea";
import CustomDropdownV2 from "~/components/CustomDropdownV2";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Separator } from "~/components/ui/separator";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useDocumentNo, useInsertLead } from "~/hooks/leads";
import Toast from "react-native-toast-message";
import client from "~/api/client";
import { z } from "zod";
import { useUserStore } from "~/store";
import { useConstants } from "~/hooks/const";
import { useQueryClient } from "@tanstack/react-query";
import { Contact } from "~/types/contacts";
import ContactPickerModal from "~/components/ContactPickerModal";
import * as ImagePicker from "expo-image-picker";
import { LeadInsertData } from "~/types/lead";

const m_newLead = () => {
  const constants = useConstants();
  const queryClient = useQueryClient();
  const router = useRouter();
  const leadFormSchema = z.object({
    currency: z.string().min(1, "Currency is required"),
    documentDate: z.date(),
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
    attachments: z.array(z.any()).optional(),
  });

  const [form, setForm] = useState({
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
    attachments: [],
  });

  const clearForm = () => {
    setForm({
      ...form,
      documentDate: new Date(),
      customerCompanyName: "",
      contactPerson: "",
      designation: "",
      mobileNo: "",
      emailId: "",
      competition: "",
      leadNote: "",
      leadRemindDate: new Date(),
      customerApplication: "",
      customerExistingMachine: "",
      attachments: [],
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
      const formData: any = new FormData();
      (Object.keys(form) as Array<keyof LeadInsertData>).forEach((key) => {
        if (key !== "attachments") {
          formData.append(key, form[key].toString());
        }
      });

      form.attachments.forEach((file: any, index: number) => {
        formData.append("attachments", {
          uri: file.uri,
          type: file.mimeType,
          name: `attachment_${index}.jpg`,
        });
      });

      console.log("Form: ", formData);
      await leadSubmit.mutateAsync(formData);
      if (!leadSubmit.isError) {
        clearForm();
      }
    } catch (error: z.ZodError | any) {
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
        console.log("Validation Errors: ", newErrors);
        setErrors(newErrors);
      } else {
        Toast.show({
          type: "error",
          text1: "Error",
          text2: error.message,
        });
      }
    }
  };

  // const doc = useDocumentNo(form.category);
  // useEffect(() => {
  //   if (doc.data) {
  //     setForm((prevForm) => ({
  //       ...prevForm,
  //       documentNo: doc.data.DocumentNo || "",
  //     }));
  //   }
  // }, [doc.data]);

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

  const pickImages = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsMultipleSelection: true,
        quality: 1,
      });

      if (!result.canceled) {
        setForm(
          (prevForm) =>
            ({
              ...prevForm,
              attachments: [...prevForm.attachments, ...result.assets],
            } as any)
        );
      }
    } catch (err) {
      console.error("Error picking images:", err);
    }
  };
  const removeImage = (index: number) => {
    setForm(
      (prevForm) =>
        ({
          ...prevForm,
          attachments: prevForm.attachments.filter((_, i) => i !== index),
        } as any)
    );
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
            {/* <View className="mb-4">
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
            </View> */}
            <View className="mb-4 flex flex-row gap-2">
              {/* <View className="flex-1">
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
              </View> */}
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
                {errors.documentDate && (
                  <Text className="text-red-500 mt-1">
                    {errors.documentDate}
                  </Text>
                )}
              </View>
            </View>
            <View className="mb-4">
              <View className="flex flex-row">
                <Text className="color-[#222] dark:text-gray-300 mb-2 text-lg font-acumin">
                  Currency
                </Text>
                <Text className="text-red-500">*</Text>
              </View>
              {constants.isLoading ? (
                <View className="flex-row items-center justify-start gap-2 h-10 native:h-12 border dark:bg-gray-800 px-4 rounded-md text-base font-medium text-[#222] dark:text-gray-100">
                  <ActivityIndicator />
                  <Text>Fetching</Text>
                </View>
              ) : (
                <>
                  <CustomDropdownV2
                    options={
                      constants.data?.CurrencyOutput.split(",").map(
                        (currency) => ({
                          value: currency,
                          label: currency,
                        })
                      ) || []
                    }
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
              <View className="flex flex-row">
                <Text className="color-[#222] dark:text-gray-300 mb-2 text-lg font-acumin">
                  Customer Company name
                </Text>
                <Text className="text-red-500">*</Text>
              </View>
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
              <View className="flex flex-row">
                <Text className="color-[#222] dark:text-gray-300 mb-2 text-lg font-acumin">
                  Contact person
                </Text>
                <Text className="text-red-500">*</Text>
              </View>
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
              <View className="flex flex-row">
                <Text className="color-[#222] dark:text-gray-300 mb-2 text-lg font-acumin">
                  Designation
                </Text>
                <Text className="text-red-500">*</Text>
              </View>
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
              <View className="flex flex-row">
                <Text className="color-[#222] dark:text-gray-300 mb-2 text-lg font-acumin">
                  Mobile No.
                </Text>
                <Text className="text-red-500">*</Text>
              </View>
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
              <View className="flex flex-row">
                <Text className="color-[#222] dark:text-gray-300 mb-2 text-lg font-acumin">
                  Email Id
                </Text>
                <Text className="text-red-500">*</Text>
              </View>
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
              <View className="flex flex-row">
                <Text className="color-[#222] dark:text-gray-300 mb-2 text-lg font-acumin">
                  Product
                </Text>
                <Text className="text-red-500">*</Text>
              </View>
              {constants.isLoading ? (
                <View className="flex-row items-center justify-start gap-2 h-10 native:h-12 border dark:bg-gray-800 px-4 rounded-md text-base font-medium text-[#222] dark:text-gray-100">
                  <ActivityIndicator />
                  <Text>Fetching</Text>
                </View>
              ) : (
                <>
                  <CustomDropdownV2
                    options={
                      constants.data?.ProductOutput.split(",").map(
                        (product) => ({
                          value: product,
                          label: product,
                        })
                      ) || []
                    }
                    placeholder="Products"
                    onChange={(value) => {
                      setForm({ ...form, product: value });
                    }}
                  />
                </>
              )}
              {/* sdkfh */}
              {errors.product && (
                <Text className="text-red-500 mt-1">{errors.product}</Text>
              )}
            </View>
            <View className="mb-4">
              <View className="flex flex-row">
                <Text className="color-[#222] dark:text-gray-300 mb-2 text-lg font-acumin">
                  Lead Source
                </Text>
                <Text className="text-red-500">*</Text>
              </View>
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
              <View className="flex flex-row">
                <Text className="color-[#222] dark:text-gray-300 mb-2 text-lg font-acumin">
                  Time Frame
                </Text>
                <Text className="text-red-500">*</Text>
              </View>
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
              <View className="flex flex-row">
                <Text className="color-[#222] dark:text-gray-300 mb-2 text-lg font-acumin">
                  Lead Remind Date
                </Text>
                <Text className="text-red-500">*</Text>
              </View>
              <Pressable
                onPress={() => {
                  setLeadRemindDate(true);
                }}
                className={`h-10 native:h-12 border dark:bg-gray-800 w-full px-4 rounded-lg flex-row items-center ${
                  errors.leadRemindDate ? "border-red-500" : ""
                }`}
              >
                {/*  */}
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
              <View className="flex flex-row">
                <Text className="color-[#222] dark:text-gray-300 mb-2 text-lg font-acumin">
                  Customer Application
                </Text>
              </View>
              {constants.isLoading ? (
                <View className="flex-row items-center justify-start gap-2 h-10 native:h-12 border dark:bg-gray-800 px-4 rounded-md text-base font-medium text-[#222] dark:text-gray-100">
                  <ActivityIndicator />
                  <Text>Fetching</Text>
                </View>
              ) : (
                <>
                  <CustomDropdownV2
                    options={
                      constants.data?.ApplicationOutput.split(",").map(
                        (application) => ({
                          value: application,
                          label: application,
                        })
                      ) || []
                    }
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
              <Textarea
                autoCorrect={false}
                clearButtonMode="while-editing"
                placeholder="Enter Lead Notes.."
                className={`native:text-base rounded-lg dark:bg-gray-800 text-base font-medium text-[#222] dark:text-gray-100 ${
                  errors.leadNote ? "border border-red-500" : ""
                }`}
                placeholderClassName="text-base text-muted"
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
              <TouchableOpacity onPress={pickImages}>
                <View className="h-10 native:h-12 border dark:bg-gray-800 px-4 rounded-lg flex-row items-center">
                  <Ionicons name="document" size={24} color="#007aff" />
                  <Text className="text-blue-500 text-base font-medium ml-2">
                    Select Images
                  </Text>
                </View>
              </TouchableOpacity>
              {form.attachments.length > 0 && (
                <ScrollView horizontal className="mt-4">
                  {form.attachments.map(
                    (file: { uri: string }, index: number) => (
                      <View key={index} className="mr-4 relative">
                        <Image
                          source={{ uri: file.uri }}
                          className="w-20 h-20 rounded-md"
                        />
                        <View className="absolute top-1 right-1 bg-red-500 rounded-full p-1">
                          <TouchableOpacity onPress={() => removeImage(index)}>
                            <Ionicons name="close" size={16} color="white" />
                          </TouchableOpacity>
                        </View>
                      </View>
                    )
                  )}
                </ScrollView>
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
