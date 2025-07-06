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

  const Items = ["Items-1", "Items-2", "Items-3", "Items-4", "Items-5"];
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
    LeadId: z.number().min(1, "Lead ID is required"),
    FollowupDateTime: z.date(),
    FollowupEndDateTime: z.date(),
    VisitTo: z.string().min(1, "Visit To is required"),
    FollowupDetails: z.string().min(1, "Followup Details is required"),
    ModeOfContact: z.string().min(1, "Mode of Contact is required"),
    documentSent: z.object({
      offer: z.boolean(),
      layout: z.boolean(),
      pi: z.boolean(),
    }),
    FollowupStatus: z.string().min(1, "Followup Status is required"),
    VisitorPerson: z.string().min(1, "Visitor Person is required"),
    NextVisitDateTime: z.date(),
    NextVisitPerson: z.string().optional(),
    NextVisitorPerson: z.string().optional(),
    AttentionDetails: z.string().optional(),
    OrderGoesParty: z.string().optional(),
    CloseReason: z.string().optional(),
    DetailDescription: z.string().optional(),
    Rating: z.string().optional(),
  });

  const [form, setForm] = useState<LeadUpdateInsert>({
    LeadId: parsedLeadId,
    FollowupDateTime: new Date(),
    FollowupEndDateTime: new Date(),
    VisitTo: parsedLastFollowupData.VisitTo || "",
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
    NextVisitorPerson: "",
    AttentionDetails: "",
    OrderGoesParty: "",
    CloseReason: "",
    DetailDescription: "",
    Rating: "",
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

  const [isFollowupDateTimeVisible, setFollowupDateTimeVisible] = useState(false);
  const [isFollowupEndDateTimeVisible, setFollowupEndDateTimeVisible] = useState(false);
  const [isNextVisitDateTimeVisible, setNextVisitDateTimeVisible] = useState(false);

  return (
    <ScrollView className="flex-1 bg-gray-100">
      <View className="p-4">
        <Text className="text-2xl font-bold text-gray-800 mb-6">
          New Lead Update
        </Text>

        {/* Followup Date & Time */}
        <View className="mb-4">
          <Label nativeID="followupDateTime" className="text-sm font-medium text-gray-700 mb-2">
            Followup Date & Time *
          </Label>
          <Pressable
            onPress={() => setFollowupDateTimeVisible(true)}
            className="bg-white border border-gray-300 rounded-md p-3"
          >
            <Text className="text-gray-900">
              {form.FollowupDateTime.toLocaleString()}
            </Text>
          </Pressable>
          {isFollowupDateTimeVisible && (
            <DateTimePicker
              value={form.FollowupDateTime}
              mode="datetime"
              onChange={(event, selectedDate) => {
                setFollowupDateTimeVisible(false);
                if (selectedDate) {
                  setForm({ ...form, FollowupDateTime: selectedDate });
                }
              }}
            />
          )}
        </View>

        {/* Followup End Date & Time */}
        <View className="mb-4">
          <Label nativeID="followupEndDateTime" className="text-sm font-medium text-gray-700 mb-2">
            Followup End Date & Time *
          </Label>
          <Pressable
            onPress={() => setFollowupEndDateTimeVisible(true)}
            className="bg-white border border-gray-300 rounded-md p-3"
          >
            <Text className="text-gray-900">
              {form.FollowupEndDateTime.toLocaleString()}
            </Text>
          </Pressable>
          {isFollowupEndDateTimeVisible && (
            <DateTimePicker
              value={form.FollowupEndDateTime}
              mode="datetime"
              onChange={(event, selectedDate) => {
                setFollowupEndDateTimeVisible(false);
                if (selectedDate) {
                  setForm({ ...form, FollowupEndDateTime: selectedDate });
                }
              }}
            />
          )}
        </View>

        {/* Visit To */}
        <View className="mb-4">
          <Label nativeID="visitTo" className="text-sm font-medium text-gray-700 mb-2">
            Visit To *
          </Label>
          <TextInput
            className="bg-white border border-gray-300 rounded-md p-3"
            value={form.VisitTo}
            onChangeText={(text) => setForm({ ...form, VisitTo: text })}
            placeholder="Enter visit to"
          />
          {errors.VisitTo && (
            <Text className="text-red-500 text-sm mt-1">{errors.VisitTo}</Text>
          )}
        </View>

        {/* Followup Details */}
        <View className="mb-4">
          <Label nativeID="followupDetails" className="text-sm font-medium text-gray-700 mb-2">
            Followup Details *
          </Label>
          <Textarea
            className="bg-white border border-gray-300 rounded-md p-3"
            value={form.FollowupDetails}
            onChangeText={(text) => setForm({ ...form, FollowupDetails: text })}
            placeholder="Enter followup details"
            numberOfLines={4}
          />
          {errors.FollowupDetails && (
            <Text className="text-red-500 text-sm mt-1">{errors.FollowupDetails}</Text>
          )}
        </View>

        {/* Mode of Contact */}
        <View className="mb-4">
          <Label nativeID="modeOfContact" className="text-sm font-medium text-gray-700 mb-2">
            Mode of Contact *
          </Label>
          <RadioGroup
            value={form.ModeOfContact}
            onValueChange={(value) => setForm({ ...form, ModeOfContact: value })}
          >
            <View className="flex-row items-center space-x-2">
              <RadioGroupItem value="Phone" id="phone" aria-labelledby="phone-label" />
              <Label nativeID="phone-label">Phone</Label>
            </View>
            <View className="flex-row items-center space-x-2">
              <RadioGroupItem value="Email" id="email" aria-labelledby="email-label" />
              <Label nativeID="email-label">Email</Label>
            </View>
            <View className="flex-row items-center space-x-2">
              <RadioGroupItem value="Visit" id="visit" aria-labelledby="visit-label" />
              <Label nativeID="visit-label">Visit</Label>
            </View>
            <View className="flex-row items-center space-x-2">
              <RadioGroupItem value="WhatsApp" id="whatsapp" aria-labelledby="whatsapp-label" />
              <Label nativeID="whatsapp-label">WhatsApp</Label>
            </View>
          </RadioGroup>
        </View>

        {/* Documents Sent */}
        <View className="mb-4">
          <Label nativeID="documentsSent" className="text-sm font-medium text-gray-700 mb-2">
            Documents Sent
          </Label>
          <View className="bg-white border border-gray-300 rounded-md p-3">
            <CheckboxWithLabel
              value="Offer"
              checked={form.documentSent.offer}
              onValueChange={(checked) =>
                setForm({
                  ...form,
                  documentSent: { ...form.documentSent, offer: checked },
                })
              }
              onLabelPress={() => {
                setForm({
                  ...form,
                  documentSent: { ...form.documentSent, layout: !form.documentSent.layout },
                });
              }}
            />
            <CheckboxWithLabel
              value="Layout"
              checked={form.documentSent.layout}
              onValueChange={(checked) =>
                setForm({
                  ...form,
                  documentSent: { ...form.documentSent, layout: checked },
                })
              }
              onLabelPress={() => {
                setForm({
                  ...form,
                  documentSent: { ...form.documentSent, offer: !form.documentSent.offer },
                });
              }}
            />
            <CheckboxWithLabel
              value="PI"
              checked={form.documentSent.pi}
              onValueChange={(checked) =>
                setForm({
                  ...form,
                  documentSent: { ...form.documentSent, pi: checked },
                })
              }
              onLabelPress={() => {
                setForm({
                  ...form,
                  documentSent: { ...form.documentSent, pi: !form.documentSent.pi },
                });
              }}
            />
          </View>
        </View>

        {/* Followup Status */}
        <View className="mb-4">
          <Label nativeID="followupStatus" className="text-sm font-medium text-gray-700 mb-2">
            Followup Status *
          </Label>
          <CustomDropdownV2
            options={Closed.map((item) => ({ value: item, label: item }))}
            optionLabel="label"
            defaultValue={{ value: form.FollowupStatus, label: form.FollowupStatus }}
            onChange={(value) => setForm({ ...form, FollowupStatus: value })}
            placeholder="Select status"
          />
        </View>

        {/* Visitor Person */}
        <View className="mb-4">
          <Label nativeID="visitorPerson" className="text-sm font-medium text-gray-700 mb-2">
            Visitor Person *
          </Label>
          <TextInput
            className="bg-white border border-gray-300 rounded-md p-3"
            value={form.VisitorPerson}
            onChangeText={(text) => setForm({ ...form, VisitorPerson: text })}
            placeholder="Enter visitor person"
          />
          {errors.VisitorPerson && (
            <Text className="text-red-500 text-sm mt-1">{errors.VisitorPerson}</Text>
          )}
        </View>

        {/* Next Visit Date & Time */}
        <View className="mb-4">
          <Label nativeID="nextVisitDateTime" className="text-sm font-medium text-gray-700 mb-2">
            Next Visit Date & Time *
          </Label>
          <Pressable
            onPress={() => setNextVisitDateTimeVisible(true)}
            className="bg-white border border-gray-300 rounded-md p-3"
          >
            <Text className="text-gray-900">
              {form.NextVisitDateTime.toLocaleString()}
            </Text>
          </Pressable>
          {isNextVisitDateTimeVisible && (
            <DateTimePicker
              value={form.NextVisitDateTime}
              mode="datetime"
              onChange={(event, selectedDate) => {
                setNextVisitDateTimeVisible(false);
                if (selectedDate) {
                  setForm({ ...form, NextVisitDateTime: selectedDate });
                }
              }}
            />
          )}
        </View>

        {/* Next Visit Person */}
        <View className="mb-4">
          <Label nativeID="nextVisitPerson" className="text-sm font-medium text-gray-700 mb-2">
            Next Visit Person
          </Label>
          <TextInput
            className="bg-white border border-gray-300 rounded-md p-3"
            value={form.NextVisitPerson}
            onChangeText={(text) => setForm({ ...form, NextVisitPerson: text })}
            placeholder="Enter next visit person"
          />
        </View>

        {/* Next Visitor Person */}
        <View className="mb-4">
          <Label nativeID="nextVisitorPerson" className="text-sm font-medium text-gray-700 mb-2">
            Next Visitor Person
          </Label>
          <TextInput
            className="bg-white border border-gray-300 rounded-md p-3"
            value={form.NextVisitorPerson}
            onChangeText={(text) => setForm({ ...form, NextVisitorPerson: text })}
            placeholder="Enter next visitor person"
          />
        </View>

        {/* Attention Details */}
        <View className="mb-4">
          <Label nativeID="attentionDetails" className="text-sm font-medium text-gray-700 mb-2">
            Attention Details
          </Label>
          <Textarea
            className="bg-white border border-gray-300 rounded-md p-3"
            value={form.AttentionDetails}
            onChangeText={(text) => setForm({ ...form, AttentionDetails: text })}
            placeholder="Enter attention details"
            numberOfLines={3}
          />
        </View>

        {/* Order Goes Party */}
        <View className="mb-4">
          <Label nativeID="orderGoesParty" className="text-sm font-medium text-gray-700 mb-2">
            Order Goes Party
          </Label>
          <TextInput
            className="bg-white border border-gray-300 rounded-md p-3"
            value={form.OrderGoesParty}
            onChangeText={(text) => setForm({ ...form, OrderGoesParty: text })}
            placeholder="Enter order goes party"
          />
        </View>

        {/* Close Reason */}
        <View className="mb-4">
          <Label nativeID="closeReason" className="text-sm font-medium text-gray-700 mb-2">
            Close Reason
          </Label>
          <TextInput
            className="bg-white border border-gray-300 rounded-md p-3"
            value={form.CloseReason}
            onChangeText={(text) => setForm({ ...form, CloseReason: text })}
            placeholder="Enter close reason"
          />
        </View>

        {/* Detail Description */}
        <View className="mb-4">
          <Label nativeID="detailDescription" className="text-sm font-medium text-gray-700 mb-2">
            Detail Description
          </Label>
          <Textarea
            className="bg-white border border-gray-300 rounded-md p-3"
            value={form.DetailDescription}
            onChangeText={(text) => setForm({ ...form, DetailDescription: text })}
            placeholder="Enter detail description"
            numberOfLines={3}
          />
        </View>

        {/* Rating */}
        <View className="mb-6">
          <Label nativeID="rating" className="text-sm font-medium text-gray-700 mb-2">
            Rating
          </Label>
          <CustomDropdownV2
            options={Ratings.map((item) => ({ value: item, label: item }))  }
            optionLabel="label"
            defaultValue={{ value: form.Rating, label: form.Rating }}
            onChange={(value) => setForm({ ...form, Rating: value })}
            placeholder="Select rating"
          />
        </View>

        {/* Submit Button */}
        <Pressable
          className="bg-blue-500 py-3 px-4 rounded-lg items-center"
          onPress={handleSubmit}
          disabled={leadUpdateInsert.isPending}
        >
          {leadUpdateInsert.isPending ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white font-semibold">Submit Lead Update</Text>
          )}
        </Pressable>
      </View>
    </ScrollView>
  );
};

export default NewLeadFollowup; 