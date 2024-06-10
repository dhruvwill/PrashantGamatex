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
import { Label } from '~/components/ui/label';
import { RadioGroup, RadioGroupItem } from '~/components/ui/radio-group';

const m_newfollowup = () => {
  const Items = ["Items-1", "Items-2", "Items-3", "Items-4", "Items-5"];
  const Ratings = ["Banking and land process", "Banking process pending", "Building is yet not ready", "Project is going slow due", "Project is initial stage. Will", "Project is slow due to low", "Project is very slow moving", "Project postponed"]
  const Closed = ["Close", "Hold", "Lost", "Received"]
  const [form, setForm] = useState({
    company: "",
    category: "",
    documentNo: "",
    documentDate: new Date(),
    refNo: "",
    refDate: new Date(),
    partyname: "",
    communicationperson: "",
    followupstartdatetime: new Date(),
    followupenddatetime: new Date(),
    communicationwith: "",
    followupdetails: "",
    modeofcommumication: "Personally",
    followupstatus: "Not Now",
    rating: "",
    nextcommunicationwith: "",
    nextcommunicationby: "",
    attentionon: "",
    ordergoesto: "",
    closereason: "",
    detaileddescription: "",
  });
  const onLabelPressMode = (label: string) => {
    return () => {
      setForm({ ...form, modeofcommumication: label });
    };
  }
  const onLabelPressStatus = (label: string) => {
    return () => {
      setForm({ ...form, followupstatus: label });
    };
  }
  const RadioGroupItemWithLabel = ({
    value,
    onLabelPress,
  }: {
    value: string;
    onLabelPress: () => void;
  }) => {
    return (
      <View className={'flex-row gap-2 items-center'}>
        <RadioGroupItem aria-labelledby={`label-for-${value}`} value={value} />
        <Label nativeID={`label-for-${value}`} onPress={onLabelPress}>
          {value}
        </Label>
      </View>
    );
  }
  const [phone, setPhone] = useState("");

  const [isDocDateVisible, setDocDateVisible] = useState(false);
  const [isRefDateVisible, setRefDateVisible] = useState(false);
  const [isFollowUpStartDateTimeVisible, setFollowUpStartDateTimeVisible] = useState(false);
  const [isFollowUpEndDateTimeVisible, setFollowUpEndDateTimeVisible] = useState(false);
  const [isNextVisitOn, setNextVisitOn] = useState(false);
  const router = useRouter();

  const handleSubmit = () => {
    Alert.alert("value", [{ ...form }].join(""));
  };
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
          <View className="mb-4">
            <Text className="color-[#222] dark:text-gray-300 mb-2 text-lg font-acumin">
              Company
            </Text>
            <CustomDropdown title="Company" itemsList={Items} />
          </View>
          <View className="mb-4">
            <Text className="color-[#222] dark:text-gray-300 mb-2 text-lg font-acumin">
              Category
            </Text>
            <CustomDropdown title="Category" itemsList={Items} />
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
                className="h-11 bg-[#f1f5f9] dark:bg-gray-800 px-4 rounded-lg text-base font-medium text-[#222] dark:text-gray-100"
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
                className="bg-[#f1f5f9] dark:bg-gray-800 h-11 w-full px-4 rounded-lg flex-row items-center"
              >
                <Ionicons
                  name="calendar-clear-outline"
                  color={"#222222"}
                  size={20}
                />
                <Text className="text-lg text-[#222] dark:text-gray-100 font-acumin ml-2">
                  {form.documentDate.toLocaleDateString()}
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
                className="h-11 bg-[#f1f5f9] dark:bg-gray-800 px-4 rounded-lg text-base font-medium text-[#222] dark:text-gray-100"
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
                className="bg-[#f1f5f9] dark:bg-gray-800 h-11 w-full px-4 rounded-lg flex-row items-center"
              >
                <Ionicons
                  name="calendar-clear-outline"
                  color={"#222222"}
                  size={20}
                />
                <Text className="text-lg text-[#222] dark:text-gray-100 font-acumin ml-2">
                  {form.refDate.toLocaleDateString()}
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
              Party name
            </Text>
            <TextInput
              autoCorrect={false}
              clearButtonMode="while-editing"
              onChangeText={(partyname) => setForm({ ...form, partyname })}
              placeholder="Enter Party Name"
              placeholderTextColor="#6b7280"
              className="h-11 bg-[#f1f5f9] dark:bg-gray-800 px-4 rounded-lg text-base font-medium text-[#222] dark:text-gray-100"
              value={form.partyname}
            />
          </View>
          <View className="mb-4">
            <Text className="color-[#222] dark:text-gray-300 mb-2 text-lg font-acumin">
              Communication By
            </Text>
            <TextInput
              autoCorrect={false}
              clearButtonMode="while-editing"
              onChangeText={(communicationperson) =>
                setForm({ ...form, communicationperson })
              }
              placeholder="Enter Communication By"
              placeholderTextColor="#6b7280"
              className="h-11 bg-[#f1f5f9] dark:bg-gray-800 px-4 rounded-lg text-base font-medium text-[#222] dark:text-gray-100"
              value={form.communicationperson}
            />
          </View>
          <Text className="text-xl font-acumin_bold" >
            Additional Follow Up Details
          </Text>
          <Separator className="my-4 bg-gray-500" orientation="horizontal" />
          <View className="my-5">
            <Text className="color-[#222] dark:text-gray-300 mb-2 text-lg font-acumin">
              Follow Up Start Date Time
            </Text>
            <Pressable
              onPress={() => {
                setFollowUpStartDateTimeVisible(true);
              }}
              className="bg-[#f1f5f9] dark:bg-gray-800 h-11 w-full px-4 rounded-lg flex-row items-center"
            >
              <Ionicons
                name="calendar-clear-outline"
                color={"#222222"}
                size={20}
              />
              <Text className="text-lg text-[#222] dark:text-gray-100 font-acumin ml-2">
                {form.followupstartdatetime.toLocaleDateString() + " " + form.followupstartdatetime.toLocaleTimeString()}
              </Text>
              {isFollowUpStartDateTimeVisible && (
                <DateTimePicker
                  mode="datetime"
                  value={form.followupstartdatetime}
                  display="default"
                  onChange={(event, newDate) => {
                    setForm({
                      ...form,
                      followupstartdatetime: newDate ? newDate : new Date(),
                    });
                    setFollowUpStartDateTimeVisible(false);
                  }}
                />
              )}
            </Pressable>
          </View>
          <View className="mb-4">
            <Text className="color-[#222] dark:text-gray-300 mb-2 text-lg font-acumin">
              Follow Up End Date Time
            </Text>
            <Pressable
              onPress={() => {
                setFollowUpEndDateTimeVisible(true);
              }}
              className="bg-[#f1f5f9] dark:bg-gray-800 h-11 w-full px-4 rounded-lg flex-row items-center"
            >
              <Ionicons
                name="calendar-clear-outline"
                color={"#222222"}
                size={20}
              />
              <Text className="text-lg text-[#222] dark:text-gray-100 font-acumin ml-2">
                {form.followupenddatetime.toLocaleDateString() + " " + form.followupenddatetime.toLocaleTimeString()}
              </Text>
              {isFollowUpEndDateTimeVisible && (
                <DateTimePicker
                  mode="datetime"
                  value={form.followupenddatetime}
                  display="default"
                  onChange={(event, newDate) => {
                    setForm({
                      ...form,
                      followupenddatetime: newDate ? newDate : new Date(),
                    });
                    setFollowUpEndDateTimeVisible(false);
                  }}
                />
              )}
            </Pressable>
          </View>
          <View className="mb-4">
            <Text className="color-[#222] dark:text-gray-300 mb-2 text-lg font-acumin">
              Communication With
            </Text>
            <TextInput
              autoCorrect={false}
              clearButtonMode="while-editing"
              onChangeText={(communicationwith) =>
                setForm({ ...form, communicationwith })
              }
              placeholder="Enter Communication With"
              placeholderTextColor="#6b7280"
              className="h-11 bg-[#f1f5f9] dark:bg-gray-800 px-4 rounded-lg text-base font-medium text-[#222] dark:text-gray-100"
              value={form.communicationwith}
            />
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
              onChangeText={(followupdetails) => setForm({ ...form, followupdetails })}
              placeholder="Enter Follow Up Details"
              placeholderTextColor="#6b7280"
              className="bg-[#f1f5f9] h-11 dark:bg-gray-800 px-4 rounded-lg text-base font-medium text-[#222] dark:text-gray-100"
              value={form.followupdetails}
            />
          </View>
          <View className="mb-4">
            <Text className="color-[#222] dark:text-gray-300 mb-2 text-lg font-acumin">
              Mode Of Communication
            </Text>
            <View className=''>
              <RadioGroup value={form.modeofcommumication} onValueChange={(modeofcommumication) => setForm({ ...form, modeofcommumication })} className='flex flex-row gap-3'>
                <RadioGroupItemWithLabel value='Personally' onLabelPress={onLabelPressMode('Personally')} />
                {/* Expense Form */}
                <RadioGroupItemWithLabel value='Phone' onLabelPress={onLabelPressMode('Phone')} />
                <RadioGroupItemWithLabel value='By Mail' onLabelPress={onLabelPressMode('By Mail')} />
              </RadioGroup>
            </View>
          </View>
          <View className="mb-4">
            <Text className="color-[#222] dark:text-gray-300 mb-2 text-lg font-acumin">
              Follow Up Status
            </Text>
            <View className="flex flex-col">
              <View className='mb-2'>
                <RadioGroup value={form.followupstatus} onValueChange={(followupstatus) => setForm({ ...form, followupstatus })} className='flex flex-row gap-3'>
                  <RadioGroupItemWithLabel value='Not Now' onLabelPress={onLabelPressStatus('Not Now')} />
                  <RadioGroupItemWithLabel value='Fix in New Visit' onLabelPress={onLabelPressStatus('Fix in New Visit')} />
                  <RadioGroupItemWithLabel value='Close' onLabelPress={onLabelPressStatus('Close')} />
                </RadioGroup>
              </View>
              {form.followupstatus === 'Not Now' &&
                (<View className="">
                  <Text className="color-[#222] dark:text-gray-300 mb-2 text-lg font-acumin">
                    Rating
                  </Text>
                  <CustomDropdown title="Ratings" itemsList={Ratings} />
                </View>)
              }
              {form.followupstatus === 'Fix in New Visit' &&
                (<View className="border-2 border-[#000]">
                  <Text className="color-[#222] dark:text-gray-300 mb-2 text-lg font-acumin_bold">
                    Next Visit Detail
                  </Text>
                  <View className="mb-4">
                    <Text className="color-[#222] dark:text-gray-300 mb-2 text-lg font-acumin flex-1">
                      Next Visit On
                    </Text>
                    <Pressable
                      onPress={() => {
                        setNextVisitOn(true);
                      }}
                      className="bg-[#f1f5f9] dark:bg-gray-800 h-11 w-full px-4 rounded-lg flex-row items-center flex-1"
                    >
                      <Ionicons
                        name="calendar-clear-outline"
                        color={"#222222"}
                        size={20}
                      />
                      <Text className="text-lg text-[#222] dark:text-gray-100 font-acumin ml-2">
                        {form.followupenddatetime.toLocaleDateString() + " " + form.followupenddatetime.toLocaleTimeString()}
                      </Text>
                      {isNextVisitOn && (
                        <DateTimePicker
                          mode="datetime"
                          value={form.followupenddatetime}
                          display="default"
                          onChange={(event, newDate) => {
                            setForm({
                              ...form,
                              followupenddatetime: newDate ? newDate : new Date(),
                            });
                            setNextVisitOn(false);
                          }}
                        />
                      )}
                    </Pressable>
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
                      onChangeText={(nextcommunicationwith) => setForm({ ...form, nextcommunicationwith })}
                      placeholder="Next Communication With"
                      placeholderTextColor="#6b7280"
                      className="bg-[#f1f5f9] h-11 dark:bg-gray-800 px-4 rounded-lg text-base font-medium text-[#222] dark:text-gray-100"
                      value={form.nextcommunicationwith}
                    />
                  </View>
                  <View className="mb-4">
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
                      onChangeText={(nextcommunicationby) => setForm({ ...form, nextcommunicationby })}
                      placeholder="Next Communication By"
                      placeholderTextColor="#6b7280"
                      className="bg-[#f1f5f9] h-11 dark:bg-gray-800 px-4 rounded-lg text-base font-medium text-[#222] dark:text-gray-100"
                      value={form.nextcommunicationby}
                    />
                  </View>
                  <View className="">
                    <Text className="color-[#222] dark:text-gray-300 mb-2 text-lg font-acumin">
                      Attention On
                    </Text>
                    <TextInput
                      editable
                      multiline
                      numberOfLines={4}
                      maxLength={40}
                      autoCorrect={false}
                      clearButtonMode="while-editing"
                      onChangeText={(attentionon) => setForm({ ...form, attentionon })}
                      placeholder="Attention On"
                      placeholderTextColor="#6b7280"
                      className="bg-[#f1f5f9] h-11 dark:bg-gray-800 px-4 rounded-lg text-base font-medium text-[#222] dark:text-gray-100"
                      value={form.attentionon}
                    />
                  </View>
                </View>)
              }
              {form.followupstatus === 'Close' &&
                (<View className="">
                  <Text className="color-[#222] dark:text-gray-300 mb-2 text-xl font-acumin_bold">
                    Close
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
                      onChangeText={(ordergoesto) => setForm({ ...form, ordergoesto })}
                      placeholder="Order Goes To"
                      placeholderTextColor="#6b7280"
                      className="bg-[#f1f5f9] h-11 dark:bg-gray-800 px-4 rounded-lg text-base font-medium text-[#222] dark:text-gray-100"
                      value={form.ordergoesto}
                    />
                  </View>
                  <View className="mb-4">
                    <Text className="color-[#222] dark:text-gray-300 mb-2 text-lg font-acumin flex-1">
                      Reason
                    </Text>
                    <CustomDropdown title="Close" itemsList={Closed} />
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
                      onChangeText={(detaileddescription) => setForm({ ...form, detaileddescription })}
                      placeholder="Detailed Description"
                      placeholderTextColor="#6b7280"
                      className="bg-[#f1f5f9] h-11 dark:bg-gray-800 px-4 rounded-lg text-base font-medium text-[#222] dark:text-gray-100"
                      value={form.detaileddescription}
                    />
                  </View>
                </View>)
              }
            </View>
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
}

export default m_newfollowup