import * as Contacts from "expo-contacts";
export const loadContacts = async () => {
  const { status } = await Contacts.requestPermissionsAsync();
  if (status === "granted") {
    const { data } = await Contacts.getContactsAsync();
    return data;
  } else {
    console.log("Permission Denied");
    return [];
  }
};
