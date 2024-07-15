// ContactPickerModal.tsx
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Modal,
  FlatList,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  SafeAreaView,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Contacts from "expo-contacts";
import { Contact, ContactPickerModalProps } from "~/types/contacts";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

const ContactPickerModal: React.FC<ContactPickerModalProps> = ({
  isVisible,
  onClose,
  onSelectContact,
}) => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [filteredContacts, setFilteredContacts] = useState<Contact[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadContacts();
  }, []);

  const loadContacts = async () => {
    const { status } = await Contacts.requestPermissionsAsync();
    if (status === "granted") {
      const { data } = await Contacts.getContactsAsync();
      data.sort((a, b) => a.name.localeCompare(b.name));
      setContacts(data as Contact[]);
      setFilteredContacts(data as Contact[]);
      setIsLoading(false);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    const filtered = contacts.filter((contact) =>
      `${contact.name} ${contact.phoneNumbers?.[0]?.number}`
        .toLowerCase()
        .includes(query.toLowerCase())
    );
    setFilteredContacts(filtered);
  };

  const renderContactItem = ({ item }: { item: Contact }) => (
    <TouchableOpacity
      onPress={() => onSelectContact(item)}
      className="m-4 bg-red-500"
    >
      <View className={"flex-row items-center p-4 border-b border-gray-200"}>
        {item.imageAvailable ? (
          <Image
            src={item.image?.uri}
            className="w-12 h-12 rounded-full mr-4"
          />
        ) : (
          <Image
            source={require("~/assets/contactPlaceholder.png")}
            className="w-12 h-12 rounded-full mr-4"
          />
        )}
        <View className={"flex-1"}>
          <Text className={"text-lg font-acumin text-background"}>
            {item.name}
          </Text>
          {item.phoneNumbers && item.phoneNumbers[0] && (
            <Text className={"text-gray-400"}>
              {item.phoneNumbers[0].number}
            </Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <Modal visible={isVisible} animationType="slide">
      <SafeAreaView className="flex-1 bg-white">
        <View className="flex-row items-center justify-between p-4 border-b border-gray-200">
          <Text className="text-xl font-acumin_bold">Select Contact</Text>
          <TouchableOpacity onPress={onClose}>
            <Ionicons name="close" size={24} color="black" />
          </TouchableOpacity>
        </View>
        <View className="p-4 border-b border-gray-200">
          <TextInput
            className="h-10 px-4 border border-gray-300 rounded-md"
            placeholder="Search contacts..."
            value={searchQuery}
            onChangeText={handleSearch}
          />
        </View>
        {isLoading ? (
          <View className="flex-1 justify-center items-center">
            <ActivityIndicator size="large" color="#0000ff" />
          </View>
        ) : (
          <FlatList
            data={filteredContacts}
            renderItem={renderContactItem}
            keyExtractor={(item) => item.id}
          />
        )}
      </SafeAreaView>
    </Modal>
  );
};

export default ContactPickerModal;
