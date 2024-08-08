import {
  View,
  TouchableOpacity,
  TextInput,
  Text,
  ScrollView,
  Alert,
  Pressable,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { z } from "zod";
import CustomDropdown from "~/components/CustomDropdown";
import RNDateTimePicker, {
  DateTimePickerAndroid,
} from "@react-native-community/datetimepicker";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Separator } from "~/components/ui/separator";
import { Ionicons } from "@expo/vector-icons";
import { Label } from "~/components/ui/label";
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group";
import { SalesFollowupInsert, SalesInquiryFollowup } from "~/types/followup";
import { useUserStore } from "~/store";
import Toast from "react-native-toast-message";
import {
  useCategoryList,
  useDocumentNo,
  useInsertInquiryFollowup,
} from "~/hooks/followup";
import { useConstants } from "~/hooks/const";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import client from "~/api/client";
import { ErrorResponse } from "~/types/query";
import CheckboxWithLabel from "~/components/CheckboxWithLabel";

const m_newfollowup = () => {
  const store = useUserStore();
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data } = useLocalSearchParams<{ data: string }>();
  const parsedData: SalesInquiryFollowup | undefined = JSON.parse(data || "{}");

  const followupInsert = useInsertInquiryFollowup();

  const Ratings = [
    "Banking and land process",
    "Banking process pending",
    "Building is yet not ready",
    "Project is going slow due",
    "Project is initial stage.",
    "Project is slow due to low",
    "Project is very slow moving",
    "Project postponed",
  ];
  const Closed = ["Close", "Hold", "Lost", "Received"];

  const followupFormSchema = z.object({
    // DocumentNo: z.number(),
    DocumentDate: z.date(),
    // CategoryName: z.string().min(1, "Category is required"),
    SalesInquiryId: z.number(),
    SalesInquiryDetailsId: z.number(),
    SalesQuotationId: z.number(),
    SalesQuotationDetailsId: z.number(),
    FollowupDateTime: z.date(),
    FollowupEndDateTime: z.date(),
    VisitTo: z.string().min(1, "Communication With is required"),
    FollowupDetails: z.string().min(1, "Follow Up Details are required"),
    ModeOfContact: z
      .string()
      .min(1, "Mode of Contact is required to be selected"),
    documentSent: z.object({
      offer: z.boolean(),
      layout: z.boolean(),
      pi: z.boolean(),
    }),
    FollowupStatus: z
      .string()
      .min(1, "Follow Up Status is required to be selected"),
    VisitorPerson: z.string().min(1, "Communication By is required"),
    NextVisitDateTime: z.date(),
    NextVisitPerson: z.string(),
    NextVisitorPerson: z.string(),
    AttentionDetails: z.string(),
    OrderGoesParty: z.string(),
    CloseReason: z.string(),
    DetailDescription: z.string(),
    Rating: z.string(),
  });

  const [form, setForm] = useState<SalesFollowupInsert>({
    // DocumentNo: 0,
    DocumentDate: new Date(),
    // CategoryName: "",
    SalesInquiryId: parsedData?.SalesInquiryId || 0,
    SalesInquiryDetailsId: parsedData?.SalesInquiryDetailsId || 0,
    SalesQuotationId: 0,
    SalesQuotationDetailsId: parsedData?.SalesQuotationDetailsId || 0,
    FollowupDateTime: new Date(),
    FollowupEndDateTime: new Date(),
    VisitTo: "",
    FollowupDetails: "",
    ModeOfContact: "Phone",
    documentSent: {
      offer: false,
      layout: false,
      pi: false,
    },
    FollowupStatus: "Not Now",
    VisitorPerson: store?.user?.data.name || "",
    NextVisitDateTime: new Date(),
    NextVisitPerson: "",
    NextVisitorPerson: store?.user?.data.name || "",
    AttentionDetails: "",
    OrderGoesParty: "",
    CloseReason: "",
    DetailDescription: "",
    Rating: "",
  });

  // const doc = useDocumentNo(form.CategoryName);
  // useEffect(() => {
  //   if (doc.data) {
  //     setForm((prevForm) => ({
  //       ...prevForm,
  //       DocumentNo: Number(doc.data.DocumentNo) || 0,
  //     }));
  //   }
  // }, [doc.data]);

  const [errors, setErrors] = useState<any>({});

  const handleSubmit = async () => {
    try {
      const validatedForm = followupFormSchema.parse(form);
      followupInsert.mutateAsync(validatedForm);
      setErrors({});
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        const formattedErrors: any = {};
        error.errors.forEach((err) => {
          if (err.path) {
            formattedErrors[err.path[0]] = err.message;
          }
        });
        Toast.show({
          type: "error",
          text1: "Error",
          text2: "Please fill all the required fields",
        });
        setErrors(formattedErrors);
      } else {
        Toast.show({
          type: "error",
          text1: "Error",
          text2: "An unexpected error occurred",
        });
      }
    }
  };

  const onLabelPressMode = (label: string) => {
    return () => {
      setForm({ ...form, ModeOfContact: label });
    };
  };
  const onLabelPressStatus = (label: string) => {
    return () => {
      setForm({ ...form, FollowupStatus: label });
    };
  };
  const RadioGroupItemWithLabel = ({
    value,
    onLabelPress,
  }: {
    value: string;
    onLabelPress: () => void;
  }) => {
    return (
      <View className={"flex-row gap-2 items-center"}>
        <RadioGroupItem aria-labelledby={`label-for-${value}`} value={value} />
        <Label nativeID={`label-for-${value}`} onPress={onLabelPress}>
          {value}
        </Label>
      </View>
    );
  };

  const [isDocumentDateVisible, setDocumentDateVisible] = useState(false);

  const [isFollowUpStartDateVisible, setFollowUpStartDateVisible] =
    useState(false);
  const [isFollowUpStartTimeVisible, setFollowUpStartTimeVisible] =
    useState(false);

  const [isFollowUpEndDateVisible, setFollowUpEndDateVisible] = useState(false);
  const [isFollowUpEndTimeVisible, setFollowUpEndTimeVisible] = useState(false);

  const [isNextDateVisible, setNextDateVisible] = useState(false);
  const [isNextTimeVisible, setNextTimeVisible] = useState(false);

  // const category = useCategoryList();

  return (
    <ScrollView keyboardShouldPersistTaps="handled">
      <View className="flex h-full mx-3 my-5">
        <View className="px-3">
          <Text className="text-3xl font-acumin_bold">New Follow Up</Text>
          <Text className="text-muted text-sm text-gray-500 font-acumin">
            Add a New Follow Up
          </Text>
          <Separator className="my-5 bg-gray-500" orientation="horizontal" />
        </View>
        <View className="px-3">
          {/* <View className="mb-4">
            <Text className="color-[#222] dark:text-gray-300 mb-2 text-lg font-acumin">
              Category
            </Text>
            {category.isError && (
              <Text className="text-red-500 text-sm mt-1">
                {category.error?.errorMessage}
              </Text>
            )}
            {category.isLoading && !category.isError ? (
              <View className="flex-row items-center justify-start gap-2 h-10 native:h-12 border dark:bg-gray-800 px-4 rounded-md text-base font-medium text-[#222] dark:text-gray-100">
                <ActivityIndicator />
                <Text>Fetching</Text>
              </View>
            ) : (
              <CustomDropdown
                title="Category"
                itemsList={category.data.CategoryName.split(",")}
                onValueChange={(value) => {
                  setForm((prevForm) => ({
                    ...prevForm,
                    CategoryName: value,
                  }));
                  queryClient.invalidateQueries({
                    queryKey: ["getFollowupDocumentNo"],
                  });
                }}
              />
            )}
          </View> */}
          <View className="mb-4 flex flex-row gap-2">
            {/* <View className="flex-1">
              <Text className="color-[#222] dark:text-gray-300 mb-2 text-lg font-acumin">
                Doc No.
              </Text>
              <View className="h-10 native:h-12 border dark:bg-gray-800 px-4 rounded-md text-base font-medium text-[#222] dark:text-gray-100 flex justify-center">
                <Text>{form.DocumentNo}</Text>
              </View>
            </View> */}
            <View className="flex-1 flex flex-col">
              <Text className="color-[#222] dark:text-gray-300 mb-2 text-lg font-acumin">
                Followup Date
              </Text>
              <Pressable
                onPress={() => {
                  setDocumentDateVisible(true);
                }}
                className="flex-1 h-10 native:h-12 border dark:bg-gray-800 px-4 rounded-md flex-row items-center"
              >
                <Ionicons
                  name="calendar-clear-outline"
                  color={"#222222"}
                  size={20}
                />
                <Text className="text-lg text-[#222] dark:text-gray-100 font-acumin ml-2">
                  {form.DocumentDate.toLocaleDateString()}
                </Text>
              </Pressable>
              {isDocumentDateVisible && (
                <DateTimePicker
                  mode="date"
                  value={form.DocumentDate}
                  display="default"
                  onChange={(event, newDate) => {
                    setForm({
                      ...form,
                      DocumentDate: newDate ? newDate : new Date(),
                    });
                    setDocumentDateVisible(false);
                  }}
                />
              )}
            </View>
          </View>
          {/* <View className="mb-4 flex flex-row gap-2">
            <View className="flex-1">
              <Text className="color-[#222] dark:text-gray-300 mb-2 text-lg font-acumin">
                Ref No.
              </Text>
              <View className="h-10 native:h-12 border dark:bg-gray-800 px-4 rounded-md text-base font-medium text-[#222] dark:text-gray-100 flex justify-center">
                <Text>{parsedData?.ReferenceNo}</Text>
              </View>
            </View>
            <View className="flex-1 flex flex-col">
              <Text className="color-[#222] dark:text-gray-300 mb-2 text-lg font-acumin">
                Ref. Date
              </Text>
              <View className="h-10 native:h-12 border dark:bg-gray-800 px-4 rounded-md flex-row items-center">
                <Ionicons
                  name="calendar-clear-outline"
                  color={"#222222"}
                  size={20}
                />
                <Text className="text-lg text-[#222] dark:text-gray-100 font-acumin ml-2">
                  {new Date(parsedData?.ReferenceDate || 0).toLocaleDateString(
                    "en-GB"
                  )}
                </Text>
              </View>
            </View>
          </View> */}
          <View className="mb-4">
            <Text className="color-[#222] dark:text-gray-300 mb-2 text-lg font-acumin">
              Machine name
            </Text>
            <View className="h-10 native:h-12 border dark:bg-gray-800 px-4 rounded-md text-base font-medium text-[#222] dark:text-gray-100 flex justify-center">
              <Text>{parsedData?.MachineName}</Text>
            </View>
          </View>
          <View className="mb-4">
            <Text className="color-[#222] dark:text-gray-300 mb-2 text-lg font-acumin">
              Party name
            </Text>
            <View className="h-10 native:h-12 border dark:bg-gray-800 px-4 rounded-md text-base font-medium text-[#222] dark:text-gray-100 flex justify-center">
              <Text>{parsedData?.PartyName}</Text>
            </View>
          </View>
          {/* <View className="mb-4">
            <Text className="color-[#222] dark:text-gray-300 mb-2 text-lg font-acumin">
              Communication By
            </Text>
            <View className="h-10 native:h-12 border dark:bg-gray-800 px-4 rounded-md text-base font-medium text-[#222] dark:text-gray-100 flex justify-center">
              <Text>{form.VisitorPerson}</Text>
            </View>
          </View> */}
          {/* <View className="mb-4">
            <Text className="color-[#222] dark:text-gray-300 mb-2 text-lg font-acumin">
              Follow Up Start Date Time
            </Text>
            <View className="flex-row justify-around gap-2">
              <Pressable
                onPress={() => {
                  setFollowUpStartDateVisible(true);
                }}
                className="flex-1 h-10 native:h-12 border dark:bg-gray-800 px-4 rounded-md flex-row items-center"
              >
                <Ionicons
                  name="calendar-clear-outline"
                  color={"#222222"}
                  size={20}
                />
                <Text className="text-lg text-[#222] dark:text-gray-100 font-acumin ml-2">
                  {form.FollowupDateTime.toLocaleDateString()}
                </Text>
              </Pressable>
              <Pressable
                onPress={() => {
                  setFollowUpStartTimeVisible(true);
                }}
                className="flex-1 h-10 native:h-12 border dark:bg-gray-800 px-4 rounded-md flex-row items-center"
              >
                <Ionicons name="time-outline" color={"#222222"} size={20} />
                <Text className="text-lg text-[#222] dark:text-gray-100 font-acumin ml-2">
                  {form.FollowupDateTime.toLocaleTimeString()}
                </Text>
              </Pressable>
            </View>
            {isFollowUpStartDateVisible && (
              <RNDateTimePicker
                mode="date"
                value={form.FollowupDateTime}
                display="default"
                onChange={(event, newDate) => {
                  setFollowUpStartDateVisible(false);
                  if (newDate) {
                    const updatedDateTime = new Date(form.FollowupDateTime);
                    updatedDateTime.setFullYear(
                      newDate.getFullYear(),
                      newDate.getMonth(),
                      newDate.getDate()
                    );
                    setForm({
                      ...form,
                      FollowupDateTime: updatedDateTime,
                    });
                  }
                }}
              />
            )}
            {isFollowUpStartTimeVisible && (
              <RNDateTimePicker
                mode="time"
                value={form.FollowupDateTime}
                display="default"
                onChange={(event, newTime) => {
                  setFollowUpStartTimeVisible(false);
                  if (newTime) {
                    const updatedDateTime = new Date(form.FollowupDateTime);
                    updatedDateTime.setHours(
                      newTime.getHours(),
                      newTime.getMinutes()
                    );
                    setForm({
                      ...form,
                      FollowupDateTime: updatedDateTime,
                    });
                  }
                }}
              />
            )}
          </View>
          <View className="mb-4">
            <Text className="color-[#222] dark:text-gray-300 mb-2 text-lg font-acumin">
              Follow Up End Date Time
            </Text>
            <View className="flex-row justify-around gap-2">
              <Pressable
                onPress={() => {
                  setFollowUpEndDateVisible(true);
                }}
                className="flex-1 h-10 native:h-12 border dark:bg-gray-800 px-4 rounded-md flex-row items-center"
              >
                <Ionicons
                  name="calendar-clear-outline"
                  color={"#222222"}
                  size={20}
                />
                <Text className="text-lg text-[#222] dark:text-gray-100 font-acumin ml-2">
                  {form.FollowupEndDateTime.toLocaleDateString()}
                </Text>
              </Pressable>
              <Pressable
                onPress={() => {
                  setFollowUpEndTimeVisible(true);
                }}
                className="flex-1 h-10 native:h-12 border dark:bg-gray-800 px-4 rounded-md flex-row items-center"
              >
                <Ionicons name="time-outline" color={"#222222"} size={20} />
                <Text className="text-lg text-[#222] dark:text-gray-100 font-acumin ml-2">
                  {form.FollowupEndDateTime.toLocaleTimeString()}
                </Text>
              </Pressable>
            </View>
            {isFollowUpEndDateVisible && (
              <RNDateTimePicker
                mode="date"
                value={form.FollowupEndDateTime}
                display="default"
                onChange={(event, newDate) => {
                  setFollowUpEndDateVisible(false);
                  if (newDate) {
                    const updatedDateTime = new Date(form.FollowupEndDateTime);
                    updatedDateTime.setFullYear(
                      newDate.getFullYear(),
                      newDate.getMonth(),
                      newDate.getDate()
                    );
                    setForm({
                      ...form,
                      FollowupEndDateTime: updatedDateTime,
                    });
                  }
                }}
              />
            )}
            {isFollowUpEndTimeVisible && (
              <RNDateTimePicker
                mode="time"
                value={form.FollowupEndDateTime}
                display="default"
                onChange={(event, newTime) => {
                  setFollowUpEndTimeVisible(false);
                  if (newTime) {
                    const updatedDateTime = new Date(form.FollowupEndDateTime);
                    updatedDateTime.setHours(
                      newTime.getHours(),
                      newTime.getMinutes()
                    );
                    setForm({
                      ...form,
                      FollowupEndDateTime: updatedDateTime,
                    });
                  }
                }}
              />
            )}
          </View> */}
          <View className="mb-4">
            <Text className="color-[#222] dark:text-gray-300 mb-2 text-lg font-acumin">
              Communication With
            </Text>
            <TextInput
              autoCorrect={false}
              clearButtonMode="while-editing"
              onChangeText={(communicationwith) =>
                setForm({ ...form, VisitTo: communicationwith })
              }
              placeholder="Enter Communication With"
              placeholderTextColor="#6b7280"
              className={`h-10 native:h-12 border dark:bg-gray-800 px-4 rounded-md text-base font-medium text-[#222] dark:text-gray-100 ${
                errors.VisitTo ? "border-red-500" : ""
              }`}
              value={form.VisitTo}
            />
            {errors.VisitTo && (
              <Text className="text-red-500 text-sm mt-1">
                {errors.VisitTo}
              </Text>
            )}
          </View>
          <View className="mb-4">
            <Text className="color-[#222] dark:text-gray-300 mb-2 text-lg font-acumin">
              Follow Up Details
            </Text>
            <TextInput
              editable
              multiline
              numberOfLines={4}
              maxLength={40}
              autoCorrect={false}
              clearButtonMode="while-editing"
              onChangeText={(followupdetails) =>
                setForm({ ...form, FollowupDetails: followupdetails })
              }
              placeholder="Enter Follow Up Details"
              placeholderTextColor="#6b7280"
              className={`h-10 native:h-12 border dark:bg-gray-800 px-4 rounded-md text-base font-medium text-[#222] dark:text-gray-100 ${
                errors.FollowupDetails ? "border-red-500" : ""
              }`}
              value={form.FollowupDetails}
            />
            {errors.FollowupDetails && (
              <Text className="text-red-500 text-sm mt-1">
                {errors.FollowupDetails}
              </Text>
            )}
          </View>
          <View className="mb-4">
            <Text className="color-[#222] dark:text-gray-300 mb-2 text-lg font-acumin">
              Mode Of Communication
            </Text>
            <View className="">
              <RadioGroup
                value={form.ModeOfContact}
                onValueChange={(modeofcommumication) =>
                  setForm({ ...form, ModeOfContact: modeofcommumication })
                }
                className="flex flex-row gap-3 font-acumin font-semibold"
              >
                <RadioGroupItemWithLabel
                  value="Visit"
                  onLabelPress={onLabelPressMode("Personally")}
                />
                {/* Expense Form */}
                <RadioGroupItemWithLabel
                  value="Phone"
                  onLabelPress={onLabelPressMode("Phone")}
                />
                <RadioGroupItemWithLabel
                  value="By Mail"
                  onLabelPress={onLabelPressMode("By Mail")}
                />
              </RadioGroup>
            </View>
          </View>
          <View className="mb-4">
            <Text className="color-[#222] dark:text-gray-300 mb-2 text-lg font-acumin">
              Document Sent
            </Text>
            <View className="flex-row gap-4">
              <CheckboxWithLabel
                value="Offer"
                checked={form.documentSent.offer}
                onValueChange={(checked) => {
                  setForm({
                    ...form,
                    documentSent: { ...form.documentSent, offer: checked },
                  });
                }}
                onLabelPress={() => {
                  setForm({
                    ...form,
                    documentSent: {
                      ...form.documentSent,
                      offer: !form.documentSent.offer,
                    },
                  });
                }}
              />
              <CheckboxWithLabel
                value="Layout"
                checked={form.documentSent.layout}
                onValueChange={(checked) => {
                  setForm({
                    ...form,
                    documentSent: { ...form.documentSent, layout: checked },
                  });
                }}
                onLabelPress={() => {
                  setForm({
                    ...form,
                    documentSent: {
                      ...form.documentSent,
                      layout: !form.documentSent.layout,
                    },
                  });
                }}
              />
              <CheckboxWithLabel
                value="PI"
                checked={form.documentSent.pi}
                onValueChange={(checked) => {
                  setForm({
                    ...form,
                    documentSent: { ...form.documentSent, pi: checked },
                  });
                }}
                onLabelPress={() => {
                  setForm({
                    ...form,
                    documentSent: {
                      ...form.documentSent,
                      pi: !form.documentSent.pi,
                    },
                  });
                }}
              />
            </View>
          </View>
          <View className="mb-4">
            <Text className="color-[#222] dark:text-gray-300 mb-2 text-lg font-acumin">
              Follow Up Status
            </Text>
            <View className="flex flex-col">
              <View className="mb-2">
                <RadioGroup
                  value={form.FollowupStatus}
                  onValueChange={(followupstatus) =>
                    setForm({ ...form, FollowupStatus: followupstatus })
                  }
                  className="flex flex-row gap-3"
                >
                  <RadioGroupItemWithLabel
                    value="Not Now"
                    onLabelPress={onLabelPressStatus("Not Now")}
                  />
                  <RadioGroupItemWithLabel
                    value="Fix in New Visit"
                    onLabelPress={onLabelPressStatus("Fix in New Visit")}
                  />
                  <RadioGroupItemWithLabel
                    value="Close"
                    onLabelPress={onLabelPressStatus("Close")}
                  />
                </RadioGroup>
              </View>
              {form.FollowupStatus === "Not Now" && (
                <View className="mt-2">
                  <Text className="color-[#222] dark:text-gray-300 mb-2 text-lg font-acumin">
                    Rating
                  </Text>
                  <CustomDropdown
                    title="Ratings"
                    itemsList={Ratings}
                    onValueChange={(value) => {
                      setForm({ ...form, Rating: value });
                    }}
                  />
                </View>
              )}
              {form.FollowupStatus === "Fix in New Visit" && (
                <View className="mt-2">
                  <Text className="color-[#222] dark:text-gray-300 mb-2 text-lg font-acumin_bold">
                    Next Visit Detail
                  </Text>
                  <View className="mb-4">
                    <Text className="color-[#222] dark:text-gray-300 mb-2 text-lg font-acumin flex-1">
                      Next Visit On
                    </Text>
                    <View className="flex-row justify-around gap-2">
                      <Pressable
                        onPress={() => {
                          setNextDateVisible(true);
                        }}
                        className="flex-1 h-10 native:h-12 border dark:bg-gray-800 px-4 rounded-md flex-row items-center"
                      >
                        <Ionicons
                          name="calendar-clear-outline"
                          color={"#222222"}
                          size={20}
                        />
                        <Text className="text-lg text-[#222] dark:text-gray-100 font-acumin ml-2">
                          {form.NextVisitDateTime.toLocaleDateString()}
                        </Text>
                      </Pressable>
                      <Pressable
                        onPress={() => {
                          setNextTimeVisible(true);
                        }}
                        className="flex-1 h-10 native:h-12 border dark:bg-gray-800 px-4 rounded-md flex-row items-center"
                      >
                        <Ionicons
                          name="time-outline"
                          color={"#222222"}
                          size={20}
                        />
                        <Text className="text-lg text-[#222] dark:text-gray-100 font-acumin ml-2">
                          {form.NextVisitDateTime.toLocaleTimeString()}
                        </Text>
                      </Pressable>
                    </View>
                    {isNextDateVisible && (
                      <RNDateTimePicker
                        mode="date"
                        value={form.NextVisitDateTime}
                        display="default"
                        onChange={(event, newDate) => {
                          setNextDateVisible(false);
                          if (newDate) {
                            const updatedDateTime = new Date(
                              form.NextVisitDateTime
                            );
                            updatedDateTime.setFullYear(
                              newDate.getFullYear(),
                              newDate.getMonth(),
                              newDate.getDate()
                            );
                            setForm({
                              ...form,
                              NextVisitDateTime: updatedDateTime,
                            });
                          }
                        }}
                      />
                    )}
                    {isNextTimeVisible && (
                      <RNDateTimePicker
                        mode="time"
                        value={form.NextVisitDateTime}
                        display="default"
                        onChange={(event, newTime) => {
                          setNextTimeVisible(false);
                          if (newTime) {
                            const updatedDateTime = new Date(
                              form.NextVisitDateTime
                            );
                            updatedDateTime.setHours(
                              newTime.getHours(),
                              newTime.getMinutes()
                            );
                            setForm({
                              ...form,
                              NextVisitDateTime: updatedDateTime,
                            });
                          }
                        }}
                      />
                    )}
                  </View>
                  <View className="mb-4">
                    <Text className="color-[#222] dark:text-gray-300 mb-2 text-lg font-acumin">
                      Next Communication With
                    </Text>
                    <TextInput
                      editable
                      multiline
                      numberOfLines={4}
                      maxLength={40}
                      autoCorrect={false}
                      clearButtonMode="while-editing"
                      onChangeText={(nextcommunicationwith) =>
                        setForm({
                          ...form,
                          NextVisitPerson: nextcommunicationwith,
                        })
                      }
                      placeholder="Next Communication With"
                      placeholderTextColor="#6b7280"
                      className="h-10 native:h-12 border dark:bg-gray-800 px-4 rounded-md text-base font-medium text-[#222] dark:text-gray-100"
                      value={form.NextVisitPerson}
                    />
                  </View>
                  {/* <View className="mb-4">
                    <Text className="color-[#222] dark:text-gray-300 mb-2 text-lg font-acumin">
                      Next Communication By
                    </Text>
                    <TextInput
                      editable
                      multiline
                      numberOfLines={4}
                      maxLength={40}
                      autoCorrect={false}
                      clearButtonMode="while-editing"
                      onChangeText={(nextcommunicationby) =>
                        setForm({
                          ...form,
                          NextVisitorPerson: nextcommunicationby,
                        })
                      }
                      placeholder="Next Communication By"
                      placeholderTextColor="#6b7280"
                      className="h-10 native:h-12 border dark:bg-gray-800 px-4 rounded-md text-base font-medium text-[#222] dark:text-gray-100"
                      value={form.NextVisitorPerson}
                    />
                  </View> */}
                  <View className="">
                    <Text className="color-[#222] dark:text-gray-300 mb-2 text-lg font-acumin">
                      Special Note
                    </Text>
                    <TextInput
                      editable
                      multiline
                      numberOfLines={4}
                      maxLength={40}
                      autoCorrect={false}
                      clearButtonMode="while-editing"
                      onChangeText={(attentionon) =>
                        setForm({ ...form, AttentionDetails: attentionon })
                      }
                      placeholder="Special Note"
                      placeholderTextColor="#6b7280"
                      className="h-10 native:h-12 border dark:bg-gray-800 px-4 rounded-md text-base font-medium text-[#222] dark:text-gray-100"
                      value={form.AttentionDetails}
                    />
                  </View>
                </View>
              )}
              {form.FollowupStatus === "Close" && (
                <View className="mt-2">
                  <Text className="color-[#222] dark:text-gray-300 mb-2 text-xl font-acumin_bold">
                    Close Order
                  </Text>
                  <View className="mb-4">
                    <Text className="color-[#222] dark:text-gray-300 mb-2 text-lg font-acumin">
                      Order Goes To
                    </Text>
                    <TextInput
                      editable
                      multiline
                      numberOfLines={4}
                      maxLength={40}
                      autoCorrect={false}
                      clearButtonMode="while-editing"
                      onChangeText={(ordergoesto) =>
                        setForm({ ...form, OrderGoesParty: ordergoesto })
                      }
                      placeholder="Order Goes To"
                      placeholderTextColor="#6b7280"
                      className="h-10 native:h-12 border dark:bg-gray-800 px-4 rounded-md text-base font-medium text-[#222] dark:text-gray-100"
                      value={form.OrderGoesParty}
                    />
                  </View>
                  <View className="mb-4">
                    <Text className="color-[#222] dark:text-gray-300 mb-2 text-lg font-acumin flex-1">
                      Reason
                    </Text>
                    <CustomDropdown
                      title="Close"
                      itemsList={Closed}
                      onValueChange={(value) => {
                        setForm({ ...form, CloseReason: value });
                      }}
                    />
                  </View>
                  <View className="">
                    <Text className="color-[#222] dark:text-gray-300 mb-2 text-lg font-acumin">
                      Detailed Description
                    </Text>
                    <TextInput
                      editable
                      multiline
                      numberOfLines={4}
                      maxLength={40}
                      autoCorrect={false}
                      clearButtonMode="while-editing"
                      onChangeText={(detaileddescription) =>
                        setForm({
                          ...form,
                          DetailDescription: detaileddescription,
                        })
                      }
                      placeholder="Detailed Description"
                      placeholderTextColor="#6b7280"
                      className="h-10 native:h-12 border dark:bg-gray-800 px-4 rounded-md text-base font-medium text-[#222] dark:text-gray-100"
                      value={form.DetailDescription}
                    />
                  </View>
                </View>
              )}
            </View>
          </View>
          <Separator className="my-5 bg-gray-500" orientation="horizontal" />
          <View>
            <TouchableOpacity onPress={handleSubmit}>
              <View className="flex-row items-center justify-center rounded-lg py-2 px-4 border border-[#007aff] bg-[#007aff]">
                <Text className="text-lg font-semibold text-white">Submit</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default m_newfollowup;
