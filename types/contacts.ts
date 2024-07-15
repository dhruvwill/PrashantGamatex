import * as Contacts from "expo-contacts";

export type Contact = Contacts.Contact & {
  id: string;
  firstName?: string;
  lastName?: string;
  phoneNumbers?: Contacts.PhoneNumber[];
};

export type ContactPickerModalProps = {
  isVisible: boolean;
  onClose: () => void;
  onSelectContact: (contact: Contact) => void;
};
