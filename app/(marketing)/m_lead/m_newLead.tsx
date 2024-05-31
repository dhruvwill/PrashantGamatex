import {
    View,
    TouchableOpacity,
    TextInput,
    Text,
    ScrollView
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useState } from "react";
import { useRouter } from "expo-router";
import CustomDropdown from '~/components/CustomDropdown';
import DateTimePicker from '@react-native-community/datetimepicker';
import PhoneInput from 'react-phone-number-input/react-native-input'

const m_newLead = () => {
    const Items = ['Items-1', 'Items-2', 'Items-3', 'Items-4', 'Items-5']
    const [form, setForm] = useState({
        company: "",
        branch: "",
        division: "",
        category: "",
        documentNo: "",
        RefNo: "",
        serialNo: "",
        companyName: "",
        contactPerson: "",
        designation: "",
        emailId: "",
        product: "",
        leadSource: "",
        competition: "",
        timeFrame: "",
    });
    const [phone, setPhone] = useState("");
    const [date, setDate] = useState(new Date());
    const router = useRouter()
    return (
        <ScrollView keyboardShouldPersistTaps='handled'>
            <View className='flex h-full mx-3 my-5'>
                <Text className="text-4xl font-semibold mb-5">New Lead</Text>
                <View className="">
                    <View className="mb-4 mx-3">
                        <Text className="color-[#222] dark:text-gray-300 font-semibold mb-2 text-lg">
                            Company
                        </Text>
                        <CustomDropdown title="Company" itemsList={Items} />
                    </View>
                    <View className="mb-4 mx-3">
                        <Text className="color-[#222] dark:text-gray-300 font-semibold mb-2 text-lg">
                            Branch
                        </Text>
                        <CustomDropdown title="Branch" itemsList={Items} />
                    </View>
                    <View className="mb-4 mx-3">
                        <Text className="color-[#222] dark:text-gray-300 font-semibold mb-2 text-lg">
                            Division
                        </Text>
                        <CustomDropdown title="Division" itemsList={Items} />
                    </View>
                    <View className="mb-4 mx-3">
                        <Text className="color-[#222] dark:text-gray-300 font-semibold mb-2 text-lg">
                            Category
                        </Text>
                        <CustomDropdown title="Category" itemsList={Items} />
                    </View>
                    <View className="mb-4 mx-3 flex flex-row gap-2">
                        <View className="flex-1">
                            <Text className="color-[#222] dark:text-gray-300 font-semibold mb-2 text-lg">
                                Doc. No.
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
                            <Text className="color-[#222] dark:text-gray-300 font-semibold mb-2 text-lg">
                                Doc. Date
                            </Text>
                            <View className="mr-10">
                                <DateTimePicker mode="date" value={date} display="default" />
                            </View>
                        </View>
                    </View>
                    <View className="mb-4 mx-3 flex flex-row gap-2">
                        <View className="flex-1">
                            <Text className="color-[#222] dark:text-gray-300 font-semibold mb-2 text-lg">
                                Ref. No.
                            </Text>
                            <TextInput
                                keyboardType="numeric"
                                autoCorrect={false}
                                clearButtonMode="while-editing"
                                onChangeText={(RefNo) => setForm({ ...form, RefNo })}
                                placeholder="0"
                                placeholderTextColor="#6b7280"
                                className="h-11 bg-[#f1f5f9] dark:bg-gray-800 px-4 rounded-lg text-base font-medium text-[#222] dark:text-gray-100"
                                value={form.RefNo}
                            />
                        </View>
                        <View className="flex-1 flex flex-col">
                            <Text className="color-[#222] dark:text-gray-300 font-semibold mb-2 text-lg">
                                Ref. Date
                            </Text>
                            <View className="mr-10">
                                <DateTimePicker mode="date" value={date} display="default" />
                            </View>
                        </View>
                    </View>
                    <View className="mb-4 mx-3">
                        <Text className="color-[#222] dark:text-gray-300 font-semibold mb-2 text-lg">
                            Serial No.
                        </Text>
                        <TextInput
                            keyboardType="numeric"
                            autoCorrect={false}
                            clearButtonMode="while-editing"
                            onChangeText={(serialNo) => setForm({ ...form, serialNo })}
                            placeholder="0"
                            placeholderTextColor="#6b7280"
                            className="h-11 bg-[#f1f5f9] dark:bg-gray-800 px-4 rounded-lg text-base font-medium text-[#222] dark:text-gray-100"
                            value={form.serialNo}
                        />
                    </View>
                    <View className="mb-4 mx-3">
                        <Text className="color-[#222] dark:text-gray-300 font-semibold mb-2 text-lg">
                            Currency
                        </Text>
                        <CustomDropdown title="Currency" itemsList={Items} />
                    </View>
                    <View className="mb-4 mx-3">
                        <Text className="color-[#222] dark:text-gray-300 font-semibold mb-2 text-lg">
                            Company Name
                        </Text>
                        <TextInput
                            autoCorrect={false}
                            clearButtonMode="while-editing"
                            onChangeText={(companyName) => setForm({ ...form, companyName })}
                            placeholder="Enter Company Name"
                            placeholderTextColor="#6b7280"
                            className="h-11 bg-[#f1f5f9] dark:bg-gray-800 px-4 rounded-lg text-base font-medium text-[#222] dark:text-gray-100"
                            value={form.companyName}
                        />
                    </View>
                    <View className="mb-4 mx-3">
                        <Text className="color-[#222] dark:text-gray-300 font-semibold mb-2 text-lg">
                            Contact Person
                        </Text>
                        <TextInput
                            autoCorrect={false}
                            clearButtonMode="while-editing"
                            onChangeText={(contactPerson) => setForm({ ...form, contactPerson })}
                            placeholder="Contact Person Name"
                            placeholderTextColor="#6b7280"
                            className="h-11 bg-[#f1f5f9] dark:bg-gray-800 px-4 rounded-lg text-base font-medium text-[#222] dark:text-gray-100"
                            value={form.contactPerson}
                        />
                    </View>
                    <View className="mb-4 mx-3">
                        <Text className="color-[#222] dark:text-gray-300 font-semibold mb-2 text-lg">
                            Designation
                        </Text>
                        <TextInput
                            autoCorrect={false}
                            clearButtonMode="while-editing"
                            onChangeText={(designation) => setForm({ ...form, designation })}
                            placeholder="Designation"
                            placeholderTextColor="#6b7280"
                            className="h-11 bg-[#f1f5f9] dark:bg-gray-800 px-4 rounded-lg text-base font-medium text-[#222] dark:text-gray-100"
                            value={form.designation}
                        />
                    </View>
                    <View className="mb-4 mx-3">
                        <Text className="color-[#222] dark:text-gray-300 font-semibold mb-2 text-lg">
                            Mobile No.
                        </Text>
                        <TextInput
                            keyboardType="numeric"
                            autoCorrect={false}
                            clearButtonMode="while-editing"
                            onChangeText={(phone) => setPhone(phone)}
                            placeholder="phone"
                            placeholderTextColor="#6b7280"
                            className="h-11 bg-[#f1f5f9] dark:bg-gray-800 px-4 rounded-lg text-base font-medium text-[#222] dark:text-gray-100"
                            value={phone}
                        />
                        {/* <PhoneInput
                defaultCountry="US"
                value={phone}
                onChange={setPhone}
              /> */}
                    </View>
                    <View className="mb-4 mx-3">
                        <Text className="color-[#222] dark:text-gray-300 font-semibold mb-2 text-lg">
                            Email ID
                        </Text>
                        <TextInput
                            autoCorrect={false}
                            clearButtonMode="while-editing"
                            onChangeText={(emailId) => setForm({ ...form, emailId })}
                            placeholder="Email"
                            placeholderTextColor="#6b7280"
                            className="h-11 bg-[#f1f5f9] dark:bg-gray-800 px-4 rounded-lg text-base font-medium text-[#222] dark:text-gray-100"
                            value={form.emailId}
                        />
                    </View>
                    <View className="mb-4 mx-3">
                        <Text className="color-[#222] dark:text-gray-300 font-semibold mb-2 text-lg">
                            Product
                        </Text>
                        <TextInput
                            autoCorrect={false}
                            clearButtonMode="while-editing"
                            onChangeText={(product) => setForm({ ...form, product })}
                            placeholder="Product"
                            placeholderTextColor="#6b7280"
                            className="h-11 bg-[#f1f5f9] dark:bg-gray-800 px-4 rounded-lg text-base font-medium text-[#222] dark:text-gray-100"
                            value={form.product}
                        />
                    </View>
                    <View className="mb-4 mx-3">
                        <Text className="color-[#222] dark:text-gray-300 font-semibold mb-2 text-lg">
                            Lead Source
                        </Text>
                        <CustomDropdown title="Lead Source" itemsList={Items} />
                    </View>
                    <View className="mb-4 mx-3">
                        <Text className="color-[#222] dark:text-gray-300 font-semibold mb-2 text-lg">
                            Competition With
                        </Text>
                        <TextInput
                            autoCorrect={false}
                            clearButtonMode="while-editing"
                            onChangeText={(competition) => setForm({ ...form, competition })}
                            placeholder="Competition"
                            placeholderTextColor="#6b7280"
                            className="h-11 bg-[#f1f5f9] dark:bg-gray-800 px-4 rounded-lg text-base font-medium text-[#222] dark:text-gray-100"
                            value={form.competition}
                        />
                    </View>
                    <View className="mb-4 mx-3">
                        <Text className="color-[#222] dark:text-gray-300 font-semibold mb-2 text-lg">
                            Time Frame
                        </Text>
                        <CustomDropdown title="Time" itemsList={Items} />
                    </View>
                    <View className="my-6">
                        <TouchableOpacity
                            onPress={() => {
                                router.replace("homepage");
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

export default m_newLead