import {
  View,
  Text,
  ScrollView,
  Pressable,
  TextInput,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  ActivityIndicator,
} from "react-native";
import React, { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { Separator } from "~/components/ui/separator";
import CustomDropdownV2 from "~/components/CustomDropdownV2";
import * as ImagePicker from "expo-image-picker";
import { ExpenseForm, ExpenseItem } from "~/types/expense";
import { useExpenseInsert } from "~/hooks/expense";
import { useConstants } from "~/hooks/const";

const M_ExpenseForm: React.FC = () => {
  const expense = useExpenseInsert();
  const constants = useConstants();

  const [form, setForm] = useState<ExpenseForm>({
    customerCompany: "",
    visitDate: new Date(),
    expenseItems: [
      {
        type: "",
        amount: "",
        description: "",
        attachment: null,
      },
    ],
  });
  const [isVisitDate, setVisitDate] = useState<boolean>(false);

  const expenseTypes: { value: string; label: string }[] = [
    { value: "fare", label: "Fare" },
    { value: "conveyance", label: "Conveyance" },
    { value: "lodging", label: "Lodging" },
    { value: "other", label: "Other" },
  ];

  const handleSubmit = async () => {
    try {
      const formData: any = new FormData();

      // Add basic form fields
      formData.append("customerCompany", form.customerCompany);
      formData.append("visitDate", form.visitDate.toISOString());

      // Add expense items
      form.expenseItems.forEach((item, index) => {
        formData.append(`expenseItems[${index}][type]`, item.type);
        formData.append(`expenseItems[${index}][amount]`, item.amount);
        formData.append(
          `expenseItems[${index}][description]`,
          item.description
        );
        if (item.attachment) {
          formData.append(`expenseItems[${index}][attachment]`, {
            uri: item.attachment.uri,
            type: item.attachment.mimeType || "image/jpeg",
            name: `attachment_${index}.jpg`,
          });
        }
      });

      console.log("FormData created:", formData);

      await expense.mutateAsync(formData);

      if (!expense.isError) {
        clearForm();
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const clearForm = (): void => {
    setForm({
      customerCompany: "",
      visitDate: new Date(),
      expenseItems: [
        {
          type: "",
          amount: "",
          description: "",
          attachment: null,
        },
      ],
    });
  };

  const handleAddExpenseItem = (): void => {
    if (form.expenseItems.length < 25) {
      setForm({
        ...form,
        expenseItems: [
          ...form.expenseItems,
          { type: "", amount: "", description: "", attachment: null },
        ],
      });
    }
  };

  const handleRemoveExpenseItem = (index: number): void => {
    const newExpenseItems = [...form.expenseItems];
    newExpenseItems.splice(index, 1);
    setForm({ ...form, expenseItems: newExpenseItems });
  };

  const handleExpenseItemChange = (
    index: number,
    field: keyof ExpenseItem,
    value: string | ImagePicker.ImagePickerAsset | null
  ): void => {
    const newExpenseItems = [...form.expenseItems];
    newExpenseItems[index][field] = value as never; // Type assertion here
    setForm({ ...form, expenseItems: newExpenseItems });
  };

  const pickImage = async (index: number): Promise<void> => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      handleExpenseItemChange(index, "attachment", result.assets[0]);
    }
  };

  return (
    <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
      <View
        className={`${
          expense.isPending ? "" : "hidden"
        } z-50 bg-blue-100/40 absolute spinner h-screen w-screen flex justify-center items-center overflow-hidden`}
      >
        <ActivityIndicator size="large" />
      </View>
      <ScrollView keyboardShouldPersistTaps="handled">
        <View className="flex h-full mx-3 my-5">
          <View className="px-3">
            <Text className="text-3xl font-acumin_bold">Expense Form</Text>
            <Text className="text-muted text-sm text-gray-500 font-acumin">
              Add Your Expense Details
            </Text>
            <Separator className="my-5 bg-gray-500" orientation="horizontal" />
          </View>
          <View className="px-3">
            <View className="mb-4">
              <Text className="color-[#222] dark:text-gray-300 mb-2 text-lg font-acumin">
                Customer Company
              </Text>
              <TextInput
                autoCorrect={false}
                clearButtonMode="while-editing"
                onChangeText={(customerCompany) =>
                  setForm({ ...form, customerCompany })
                }
                placeholder="Enter Customer Company Name"
                placeholderTextColor="#6b7280"
                className="h-10 native:h-12 border dark:bg-gray-800 px-4 rounded-lg text-base font-medium text-[#222] dark:text-gray-100"
                value={form.customerCompany}
              />
            </View>
            <View className="mb-4">
              <Text className="color-[#222] dark:text-gray-300 mb-2 text-lg font-acumin flex-1">
                Date Of Visit
              </Text>
              <Pressable
                onPress={() => {
                  setVisitDate(true);
                }}
                className="h-10 native:h-12 border dark:bg-gray-800 w-full px-4 rounded-lg flex-row items-center"
              >
                <Ionicons
                  name="calendar-clear-outline"
                  color={"#222222"}
                  size={20}
                />
                <Text className="text-lg text-[#222] dark:text-gray-100 font-acumin ml-2">
                  {form.visitDate.toLocaleDateString("en-GB")}
                </Text>
                {isVisitDate && (
                  <DateTimePicker
                    mode="date"
                    value={form.visitDate}
                    display="default"
                    onChange={(event: DateTimePickerEvent, newDate?: Date) => {
                      setForm({
                        ...form,
                        visitDate: newDate ? newDate : new Date(),
                      });
                      setVisitDate(false);
                    }}
                  />
                )}
              </Pressable>
            </View>
            <Text className="color-[#222] dark:text-gray-300 mb-2 text-lg font-acumin flex-1">
              Expense List
            </Text>
            {form.expenseItems.map((item, index) => (
              <View
                key={index}
                className="mb-4 p-4 border rounded-lg bg-gray-50"
              >
                <View className="mb-2">
                  <Text className="color-[#222] dark:text-gray-300 mb-2 text-lg font-acumin">
                    Expense Type
                  </Text>
                  {/* <CustomDropdownV2
                    options={expenseTypes}
                    placeholder="Select Expense Type"
                    onChange={(value: string) =>
                      handleExpenseItemChange(index, "type", value)
                    }
                  /> */}
                  {constants.isLoading ? (
                    <View className="flex-row items-center justify-start gap-2 h-10 native:h-12 border dark:bg-gray-800 px-4 rounded-md text-base font-medium text-[#222] dark:text-gray-100">
                      <ActivityIndicator />
                      <Text>Fetching</Text>
                    </View>
                  ) : (
                    <>
                      <CustomDropdownV2
                        options={
                          constants.data?.ExpenseOutput.split(",").map(
                            (expense) => ({
                              value: expense,
                              label: expense,
                            })
                          ) || []
                        }
                        placeholder="Select Expense Type"
                        onChange={(value: string) =>
                          handleExpenseItemChange(index, "type", value)
                        }
                      />
                    </>
                  )}
                </View>
                <View className="mb-2">
                  <Text className="color-[#222] dark:text-gray-300 mb-2 text-lg font-acumin">
                    Amount
                  </Text>
                  <TextInput
                    keyboardType="numeric"
                    autoCorrect={false}
                    clearButtonMode="while-editing"
                    onChangeText={(value) =>
                      handleExpenseItemChange(index, "amount", value)
                    }
                    placeholder="₹ 0.00"
                    placeholderTextColor="#6b7280"
                    className="h-10 native:h-12 border dark:bg-gray-800 px-4 rounded-lg text-base font-medium text-[#222] dark:text-gray-100"
                    value={item.amount}
                  />
                </View>
                <View className="mb-2">
                  <Text className="color-[#222] dark:text-gray-300 mb-2 text-lg font-acumin">
                    Description
                  </Text>
                  <TextInput
                    multiline
                    numberOfLines={3}
                    autoCorrect={false}
                    clearButtonMode="while-editing"
                    onChangeText={(value) =>
                      handleExpenseItemChange(index, "description", value)
                    }
                    placeholder="Enter description"
                    placeholderTextColor="#6b7280"
                    className="h-20 native:h-24 border dark:bg-gray-800 px-4 py-2 rounded-lg text-base font-medium text-[#222] dark:text-gray-100"
                    value={item.description}
                  />
                </View>
                <View className="mb-2">
                  <Text className="color-[#222] dark:text-gray-300 mb-2 text-lg font-acumin">
                    Attachment
                  </Text>
                  {item.attachment && (
                    <Image
                      source={{ uri: item.attachment.uri }}
                      style={{ width: 100, height: 100, marginBottom: 10 }}
                    />
                  )}
                  <TouchableOpacity onPress={() => pickImage(index)}>
                    <View className="h-10 native:h-12 border dark:bg-gray-800 px-4 rounded-lg flex-row items-center">
                      <Ionicons name="document" size={24} color="#007aff" />
                      <Text className="text-blue-500 text-base font-medium ml-2">
                        {item.attachment
                          ? "Change Attachment"
                          : "Add Attachment"}
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
                {form.expenseItems.length > 1 && (
                  <TouchableOpacity
                    onPress={() => handleRemoveExpenseItem(index)}
                    className="mt-2"
                  >
                    <View className="flex-row items-center justify-center rounded-lg py-2 px-4 border border-red-500">
                      <Text className="text-red-500 text-base font-medium">
                        Remove
                      </Text>
                    </View>
                  </TouchableOpacity>
                )}
              </View>
            ))}
            {form.expenseItems.length < 25 && (
              <TouchableOpacity onPress={handleAddExpenseItem} className="mb-4">
                <View className="flex-row items-center justify-center rounded-lg py-2 px-4 border border-[#007aff]">
                  <Text className="text-[#007aff] text-base font-medium">
                    Add Expense Item
                  </Text>
                </View>
              </TouchableOpacity>
            )}
            <Separator className="my-5 bg-gray-500" orientation="horizontal" />
            <View>
              <TouchableOpacity onPress={handleSubmit}>
                <View className="flex-row items-center justify-center rounded-lg py-2 px-4 border border-[#007aff] bg-[#007aff]">
                  <Text className="text-lg font-semibold text-white">
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

export default M_ExpenseForm;
