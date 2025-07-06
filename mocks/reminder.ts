import { QuotationReminderData } from "~/types/followup";
import { LeadReminderData } from "~/types/lead";

export const leadReminder: LeadReminderData[] = [
  {
    UserIdentification: "1",
    UserCode: "1",
    ReferenceTransaction_2361FollowupId: 1,
    NextVisitDateTime: new Date(new Date().setDate(new Date().getDate() + 1)),
    FollowupStatus: "Fix in New Visit",
    FollowupDateTime: new Date(new Date().setDate(new Date().getDate() + 1)),
    FollowupDetails: "Details",
    CloseReason: "",
    ModeofContact: "Phone",
    DetailDescription: "Details",
    VisitTo: "Someone",
    LeadId: 1,
    CompanyName: "Reliance Industries",
  },
  {
    UserIdentification: "2",
    UserCode: "2",
    ReferenceTransaction_2361FollowupId: 2,
    NextVisitDateTime: new Date(new Date().setDate(new Date().getDate() + 2)),
    FollowupStatus: "Fix in New Visit",
    FollowupDateTime: new Date(new Date().setDate(new Date().getDate() + 2)),
    FollowupDetails: "Details",
    CloseReason: "",
    ModeofContact: "Phone",
    DetailDescription: "Details",
    VisitTo: "Someone",
    LeadId: 2,
    CompanyName: "Reliance Industries",
  },
];

export const followupReminder: QuotationReminderData[] = [
  {
    UserIdentification: "1",
    UserCode: "1",
    ReferenceTransaction_2361FollowupId: 1,
    NextVisitDateTime: new Date(new Date().setDate(new Date().getDate() + 1)),
    FollowupStatus: "Fix in New Visit",
    FollowupDateTime: new Date(new Date().setDate(new Date().getDate() + 1)),
    FollowupDetails: "Details",
    CloseReason: "",
    ModeofContact: "Phone",
    DetailDescription: "Details",
    VisitTo: "Someone",
    LeadId: 1,
    CompanyName: "Reliance Industries",
  },
];