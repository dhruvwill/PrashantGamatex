import {
  View,
  TouchableOpacity,
  TextInput,
  Text,
  ScrollView,
  Alert,
  Pressable,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { set, z } from "zod";
import RNDateTimePicker from "@react-native-community/datetimepicker";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Separator } from "~/components/ui/separator";
import { Ionicons } from "@expo/vector-icons";
import { Label } from "~/components/ui/label";
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group";
import { LeadUpdateInsert } from "~/types/lead";
import { useUserStore } from "~/store";
import Toast from "react-native-toast-message";
import { useInsertLeadUpdate } from "~/hooks/leads";
import { useQueryClient } from "@tanstack/react-query";
import CheckboxWithLabel from "~/components/CheckboxWithLabel";
import Checkbox from "expo-checkbox";
import { Textarea } from "~/components/ui/textarea";
import CustomDropdownV2 from "~/components/CustomDropdownV2";

const NewLeadFollowup = () => {
  const store = useUserStore();
  const router = useRouter();
  const queryClient = useQueryClient();

  const { leadId, lastFollowupData } = useLocalSearchParams<{
    leadId: string;
    lastFollowupData: string;
  }>();

  const parsedLeadId = parseInt(leadId || "0");
  const parsedLastFollowupData: any = JSON.parse(lastFollowupData || "{}");

  const leadUpdateInsert = useInsertLeadUpdate();

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

  const leadUpdateFormSchema = z.object({
    ReferenceTransactionId: z.number().min(1, "Lead ID is required"),
    NextVisitDateTime: z.date(),
    FollowupStatus: z.string().min(1, "Followup Status is required"),
    FollowupDetails: z.string().min(1, "Followup Details is required"),
    FollowupDateTime: z.date(),
    CloseReason: z.string(),
    ModeOfContact: z.string().min(1, "Mode of Contact is required"),
    DetailDescription: z.string(),
    VisitTo: z.string().min(1, "Visit To is required"),
    VisitorPerson: z.string().min(1, "Visitor Person is required"),
  });

  const [form, setForm] = useState<LeadUpdateInsert>({
    ReferenceTransactionId: parsedLeadId,
    NextVisitDateTime: new Date(),
    FollowupStatus: "Fix in New Visit",
    FollowupDetails: "",
    FollowupDateTime: new Date(Date.now()),
    CloseReason: "",
    ModeOfContact: "Phone",
    DetailDescription: "",
    VisitTo: "",
    VisitorPerson: store?.user?.data.name || "",
  });

  const [errors, setErrors] = useState<any>({});

  const handleSubmit = async () => {
    try {
      const validatedForm = leadUpdateFormSchema.parse(form);
      leadUpdateInsert.mutateAsync(validatedForm);
      setErrors({});
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        const formattedErrors: any = {};
        error.errors.forEach((err) => {
          if (err.path) {
            formattedErrors[err.path[0]] = err.message;
          }
        });
        console.log(formattedErrors);
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

  const [isFollowUpDateVisible, setFollowUpDateVisible] = useState(false);
  const [isFollowUpTimeVisible, setFollowUpTimeVisible] = useState(false);

  const [isNextDateVisible, setNextDateVisible] = useState(false);
  const [isNextTimeVisible, setNextTimeVisible] = useState(false);

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
    >
      <ScrollView 
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="flex h-full mx-3 my-5">
        <View className="px-3">
          <Text className="text-3xl font-acumin_bold">New Lead Follow Up</Text>
          <Text className="text-gray-900 text-sm font-acumin">
            Add a New Lead Follow Up
          </Text>
          <Separator className="my-5 bg-gray-500" orientation="horizontal" />
        </View>
        <View className="px-3">
          {/* Followup Date & Time */}
          <View className="mb-4">
            <Text className="color-[#222] dark:text-gray-300 mb-2 text-lg font-acumin">
              Follow Up Date & Time
            </Text>
            <View className="flex-row justify-around gap-2">
              <Pressable
                onPress={() => {
                  setFollowUpDateVisible(true);
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
                  setFollowUpTimeVisible(true);
                }}
                className="flex-1 h-10 native:h-12 border dark:bg-gray-800 px-4 rounded-md flex-row items-center"
              >
                <Ionicons name="time-outline" color={"#222222"} size={20} />
                <Text className="text-lg text-[#222] dark:text-gray-100 font-acumin ml-2">
                  {form.FollowupDateTime.toLocaleTimeString()}
                </Text>
              </Pressable>
            </View>
            {isFollowUpDateVisible && (
              <RNDateTimePicker
                mode="date"
                value={form.FollowupDateTime}
                display="default"
                onChange={(event, newDate) => {
                  setFollowUpDateVisible(false);
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
            {isFollowUpTimeVisible && (
              <RNDateTimePicker
                mode="time"
                value={form.FollowupDateTime}
                display="default"
                onChange={(event, newTime) => {
                  setFollowUpTimeVisible(false);
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
            {errors.FollowupDateTime && (
              <Text className="text-red-500 text-sm mt-1">
                {errors.FollowupDateTime}
              </Text>
            )}
          </View>
          {/* Visit To */}
          <View className="mb-4">
            <Text className="color-[#222] dark:text-gray-300 mb-2 text-lg font-acumin">
              Communication With
            </Text>
            <TextInput
              autoCorrect={false}
              clearButtonMode="while-editing"
              onChangeText={(text) => setForm({ ...form, VisitTo: text })}
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

          {/* Followup Details */}
          <View className="mb-4">
            <Text className="color-[#222] dark:text-gray-300 mb-2 text-lg font-acumin">
              Follow Up Details
            </Text>
            <Textarea
              autoCorrect={false}
              editable
              multiline
              numberOfLines={4}
              clearButtonMode="while-editing"
              placeholder="Enter Follow Up Details"
              className={`native:text-base rounded-lg dark:bg-gray-800 text-base font-medium text-[#222] dark:text-gray-100 ${
                errors.FollowupDetails ? "border border-red-500" : ""
              }`}
              placeholderClassName="text-base text-muted"
              value={form.FollowupDetails}
              onChangeText={(text) =>
                setForm({ ...form, FollowupDetails: text })
              }
              aria-labelledby="followup details"
            />
            {errors.FollowupDetails && (
              <Text className="text-red-500 text-sm mt-1">
                {errors.FollowupDetails}
              </Text>
            )}
          </View>

          {/* Mode of Contact */}
          <View className="mb-4">
            <Text className="color-[#222] dark:text-gray-300 mb-2 text-lg font-acumin">
              Mode Of Communication
            </Text>
            <View className="">
              <RadioGroup
                value={form.ModeOfContact}
                onValueChange={(value) =>
                  setForm({ ...form, ModeOfContact: value })
                }
                className="flex flex-row gap-3 font-acumin font-semibold"
              >
                <RadioGroupItemWithLabel
                  value="Visit"
                  onLabelPress={onLabelPressMode("Visit")}
                />
                <RadioGroupItemWithLabel
                  value="Phone"
                  onLabelPress={onLabelPressMode("Phone")}
                />
                <RadioGroupItemWithLabel
                  value="Email"
                  onLabelPress={onLabelPressMode("Email")}
                />
                <RadioGroupItemWithLabel
                  value="WhatsApp"
                  onLabelPress={onLabelPressMode("WhatsApp")}
                />
              </RadioGroup>
            </View>
          </View>

          {/* Followup Status */}
          <View className="mb-4">
            <Text className="color-[#222] dark:text-gray-300 mb-2 text-lg font-acumin">
              Follow Up Status
            </Text>
            <View className="flex flex-col">
              <View className="mb-2">
                <RadioGroup
                  value={form.FollowupStatus}
                  onValueChange={(value) =>
                    setForm({ ...form, FollowupStatus: value })
                  }
                  className="flex flex-row gap-3"
                >
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
              {form.FollowupStatus === "Fix in New Visit" && (
                <View className="mt-2">
                  <Text className="color-[#222] dark:text-gray-300 mb-2 text-lg font-acumin_bold">
                    Next Visit Details
                  </Text>
                  <View>
                    <Text className="color-[#222] dark:text-gray-300 mb-2 text-lg font-acumin flex-1">
                      Next Visit On
                    </Text>
                    <View className="flex-row justify-around gap-2 mb-4">
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
                </View>
              )}
              {form.FollowupStatus === "Close" && (
                <View className="mt-2">
                  <Text className="color-[#222] dark:text-gray-300 mb-2 text-lg font-acumin_bold">
                    Close Details
                  </Text>
                  <View className="mb-4">
                    <Text className="color-[#222] dark:text-gray-300 mb-2 text-lg font-acumin flex-1">
                      Reason
                    </Text>
                    <CustomDropdownV2
                      options={Closed.map((close) => ({
                        value: close,
                        label: close,
                      }))}
                      placeholder="Close"
                      onChange={(value: any) => {
                        setForm({ ...form, CloseReason: value });
                      }}
                    />
                  </View>
                </View>
              )}
            </View>
          </View>

          <View className="mb-4">
            <Text className="color-[#222] dark:text-gray-300 mb-2 text-lg font-acumin">
              Detailed Description
            </Text>
            <Textarea
              autoCorrect={false}
              editable
              multiline
              numberOfLines={4}
              clearButtonMode="while-editing"
              placeholder="Enter Detailed Description"
              className={`native:text-base rounded-lg dark:bg-gray-800 text-base font-medium text-[#222] dark:text-gray-100 ${
                errors.DetailDescription ? "border border-red-500" : ""
              }`}
              placeholderClassName="text-base text-muted"
              value={form.DetailDescription}
              onChangeText={(text) =>
                setForm({ ...form, DetailDescription: text })
              }
              aria-labelledby="detailed description"
            />
          </View>

          {/* Visitor Person */}
          <View className="mb-4">
            <Text className="color-[#222] dark:text-gray-300 mb-2 text-lg font-acumin">
              Communication By
            </Text>
            <TextInput
              autoCorrect={false}
              clearButtonMode="while-editing"
              onChangeText={(text) => setForm({ ...form, VisitorPerson: text })}
              placeholder="Enter Communication By"
              placeholderTextColor="#6b7280"
              className={`h-10 native:h-12 border dark:bg-gray-800 px-4 rounded-md text-base font-medium text-[#222] dark:text-gray-100 ${
                errors.VisitorPerson ? "border-red-500" : ""
              }`}
              value={form.VisitorPerson}
            />
            {errors.VisitorPerson && (
              <Text className="text-red-500 text-sm mt-1">
                {errors.VisitorPerson}
              </Text>
            )}
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
    </KeyboardAvoidingView>
  );
};

export default NewLeadFollowup; 