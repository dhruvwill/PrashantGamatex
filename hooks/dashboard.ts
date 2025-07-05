import { getDashboard } from "./../services/dashboard";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ErrorResponse } from "~/types/query";
import { useAppStore, useUserStore } from "~/store/store";
import { LeadReminderData } from "~/types/lead";
import { QuotationReminderData } from "~/types/followup";

export const useDashboard = () => {
  const token = useUserStore((state:any) => state.user?.token);
  const timeframe = useAppStore((state:any) => state.timeframe);
  return useQuery<
    {
      dashboard: {
        pending_lead: number;
        total_lead: number;
        pending_quotation: number;
        total_quotation: number;
      }[];
      leadReminders: LeadReminderData[];
      quotationReminders: QuotationReminderData[];
    },
    ErrorResponse,
    any
  >({
    queryKey: ["getDashboard"],
    queryFn: () => getDashboard(token, timeframe),
    enabled: !!token,
  });
};
