import { View, Text, ScrollView, Pressable, TextInput, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from "@react-native-community/datetimepicker";
import { Separator } from "~/components/ui/separator";

const m_expenseForm = () => {
    const [form, setForm] = useState({
        customercompany: "",
        visitdate: new Date(),
        fareprice: "",
        faredescription: "",
        conveyanceprice: "",
        conveyancedescription: "",
        lodgingprice: "",
        lodgingdescription: "",
        dailyallowanceprice: "",
        dailyallowancedescription: "",
        otherprice: "",
        otherdescription: "",
    })
    const [isVisitDate, setVisitDate] = useState(false);
    const [isAddOtherExpense, setAddOtherExpense] = useState(false);
    function handleSubmit() {
        console.log(form);
    }

    const handleAdd = () => {
        setAddOtherExpense(!isAddOtherExpense);
    }
    const fields = [
        { label: 'Fare', price: 'fareprice', description: 'faredescription' },
        { label: 'Conveyance', price: 'conveyanceprice', description: 'conveyancedescription' },
        { label: 'Lodging & Boarding', price: 'lodgingprice', description: 'lodgingdescription' },
        { label: 'Daily Allowance', price: 'dailyallowanceprice', description: 'dailyallowancedescription' }
    ]
    return (
        <ScrollView keyboardShouldPersistTaps='handled'>
            <View className='flex h-full mx-3 my-5'>
                <View className="px-3">
                    <Text className="text-3xl font-acumin_bold">Expense Form</Text>
                    <Text className="text-muted text-sm text-gray-500 font-acumin">
                        Add Your Expense Details
                    </Text>
                    <Separator className="my-5 bg-gray-500" orientation="horizontal" />
                </View>
                <View className='px-3'>
                    <View className="mb-4">
                        <Text className="color-[#222] dark:text-gray-300 mb-2 text-lg font-acumin">
                            Search Customer Company
                        </Text>
                        <Pressable onPress={() => { }}
                            className="bg-[#f1f5f9] dark:bg-gray-800 h-11 w-full px-4 rounded-lg flex-row items-center flex-1 justify-between"
                        >
                            <Text className='text-lg text-[#6b6b6b] dark:text-gray-100 font-acumin'>Customer Company</Text>
                            <Ionicons
                                name='search-outline'
                                color={"#222222"}
                                size={20}
                            />
                        </Pressable>
                    </View>
                    <View className="mb-4">
                        <Text className="color-[#222] dark:text-gray-300 mb-2 text-lg font-acumin flex-1">
                            Date Of Visit
                        </Text>
                        <Pressable
                            onPress={() => {
                                setVisitDate(true);
                            }}
                            className="bg-[#f1f5f9] dark:bg-gray-800 h-11 w-full px-4 rounded-lg flex-row items-center flex-1"
                        >
                            <Ionicons
                                name="calendar-clear-outline"
                                color={"#222222"}
                                size={20}
                            />
                            <Text className="text-lg text-[#222] dark:text-gray-100 font-acumin ml-2">
                                {form.visitdate.toLocaleDateString() + " " + form.visitdate.toLocaleTimeString()}
                            </Text>
                            {isVisitDate && (
                                <DateTimePicker
                                    mode="datetime"
                                    display="default"
                                    value={form.visitdate}
                                    onChange={(event, newDate) => {
                                        setForm({
                                            ...form,
                                        });
                                        visitdate: newDate ? newDate : new Date(),
                                            setVisitDate(false);
                                    }}
                                />
                            )}
                        </Pressable>
                    </View>
                    {fields.map(({ price, label, description }, index) => (
                        <View className="mb-4" key={index}>
                            <Text className="color-[#222] dark:text-gray-300 mb-2 text-lg font-acumin">
                                {label}
                            </Text>
                            <View className='flex flex-col gap-2' style={{ borderWidth: 1, borderColor: '#313131', padding: 10, borderRadius: 5 }}>
                                <View className='flex flex-row justify-between items-center'>
                                    <TextInput
                                        editable
                                        keyboardType='numeric'
                                        autoCorrect={false}
                                        clearButtonMode="while-editing"
                                        onChangeText={(value) => setForm({ ...form, [price]: value })}
                                        placeholder="₹ 0.0.0.0.0"
                                        placeholderTextColor="#6b7280"
                                        className="bg-[#f1f5f9] h-11 flex-1 dark:bg-gray-800 px-4 rounded-lg text-base font-medium text-[#222] dark:text-gray-100"
                                        value={form[price]}
                                    />
                                    <View className='flex-1'>
                                        <Pressable style={{ marginLeft: "auto" }} >
                                            <Ionicons name='camera-outline' size={30} color={"#222222"} />
                                        </Pressable>
                                    </View>
                                </View>
                                <View>
                                    <TextInput
                                        editable
                                        multiline
                                        numberOfLines={4}
                                        maxLength={40}
                                        autoCorrect={false}
                                        clearButtonMode="while-editing"
                                        onChangeText={(value) => setForm({ ...form, [description]: value })}
                                        placeholder="Description"
                                        placeholderTextColor="#6b7280"
                                        className="bg-[#f1f5f9] h-11 flex-1 dark:bg-gray-800 px-4 rounded-lg text-base font-medium text-[#222] dark:text-gray-100"
                                        value={form[description]}
                                    />
                                </View>
                            </View>
                        </View>
                    ))}
                    {isAddOtherExpense &&
                        (
                            <View className="mb-4">
                                <Text className="color-[#222] dark:text-gray-300 mb-2 text-lg font-acumin">
                                    Other
                                </Text>
                                <View className='flex flex-col gap-2' style={{ borderWidth: 1, borderColor: '#313131', padding: 10, borderRadius: 5 }}>
                                    <View className='flex flex-row justify-between items-center'>
                                        <TextInput
                                            editable
                                            keyboardType='numeric'
                                            autoCorrect={false}
                                            clearButtonMode="while-editing"
                                            onChangeText={(otherprice) => setForm({ ...form, otherprice })}
                                            placeholder="₹ 0.0.0.0.0"
                                            placeholderTextColor="#6b7280"
                                            className="bg-[#f1f5f9] h-11 flex-1 dark:bg-gray-800 px-4 rounded-lg text-base font-medium text-[#222] dark:text-gray-100"
                                            value={form.otherprice}
                                        />
                                        <View className='flex-1'>
                                            <Pressable style={{ marginLeft: "auto" }} >
                                                <Ionicons name='camera-outline' size={30} color={"#222222"} />
                                            </Pressable>
                                        </View>
                                    </View>
                                    <View>
                                        <TextInput
                                            editable
                                            multiline
                                            numberOfLines={4}
                                            maxLength={40}
                                            autoCorrect={false}
                                            clearButtonMode="while-editing"
                                            onChangeText={(otherdescription) => setForm({ ...form, otherdescription })}
                                            placeholder="Description"
                                            placeholderTextColor="#6b7280"
                                            className="bg-[#f1f5f9] h-11 flex-1 dark:bg-gray-800 px-4 rounded-lg text-base font-medium text-[#222] dark:text-gray-100"
                                            value={form.otherdescription}
                                        />
                                    </View>
                                </View>
                            </View>
                        )
                    }
                    <View className='mb-4'>
                        <Pressable style={{ marginHorizontal: "auto" }} onPress={handleAdd}>
                            <Ionicons name='add-circle' size={50} color={"#222222"} />
                        </Pressable>
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
    )
}

export default m_expenseForm