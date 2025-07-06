import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getAllLeads,
  getDocumentNo,
  getLeadFilters,
  insertLead,
  updateLead,
  getLeadUpdates,
  insertLeadUpdate,
  updateLeadUpdate,
} from "~/services/lead";
import { ErrorResponse } from "~/types/query";
import Toast from "react-native-toast-message";
import { LeadInsertData, LeadData, LeadUpdateData, LeadFilterData, LeadUpdate } from "~/types/lead";
import { useUserStore } from "~/store";
import { router } from "expo-router";

export const useLeads = () => {
  return useQuery<any, ErrorResponse, LeadData[]>({
    queryKey: ["getAllLeads"],
    queryFn: getAllLeads,
  });
};

export const useInsertLead = () => {
  const queryClient = useQueryClient();
  return useMutation<unknown, ErrorResponse, LeadInsertData & FormData>({
    mutationFn: insertLead,
    mutationKey: ["insertLead"],
    onSuccess: () => {
      queryClient.invalidateQueries({
        // queries: [
        //   { queryKey: ["getAllLeads"] },
        //   { queryKey: ["getLeadDocumentNo"] },
        // ],
        predicate: (query) =>
          query.queryKey.every((key) =>
            ["getAllLeads", "getLeadDocumentNo"].includes(key as string)
          ),
      }); 
      Toast.show({
        type: "success",
        text1: "Success",
        text2: "Lead Added Successfully",
        visibilityTime: 3000,
      });
      router.navigate("/(marketing)/m_lead/m_leadList/");
    },
    onError: (error) => {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: error.errorMessage,
        text2Style: {
          fontSize: 12,
        },
        visibilityTime: 3000,
      });
    },
  });
};

export const useUpdateLead = () => {
  const queryClient = useQueryClient();
  return useMutation<
    unknown,
    ErrorResponse,
    LeadUpdateData & {
      RecordId: number;
      category: string;
    }
  >({
    mutationFn: updateLead,
    mutationKey: ["updateLead"],
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["getAllLeads"],
      });
      Toast.show({
        type: "success",
        text1: "Success",
        text2: "Leadp Updated Successfully",
        visibilityTime: 3000,
      });
      router.navigate("/(marketing)/m_lead/m_leadList/");
    },
    onError: (error) => {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: error.errorMessage,
        text2Style: {
          fontSize: 12,
        },
        visibilityTime: 3000,
      });
    },
  });
};

export const useDocumentNo = (categoryName: string) => {
  const token = useUserStore((state:any) => state.user?.token);

  return useQuery({
    queryKey: ["getLeadDocumentNo"],
    queryFn: () => getDocumentNo(token, categoryName),
    enabled: !!token && !!categoryName,
  });
};

export const useLeadFilters = () => {
  const token = useUserStore((state:any) => state.user?.token);

  return useQuery<any, ErrorResponse, LeadFilterData[]>({
    queryKey: ["getLeadFilters"],
    queryFn: () => getLeadFilters(token),
    enabled: !!token,
  });
};

export const useLeadUpdates = (leadId: number) => {
  return useQuery<any, ErrorResponse, LeadUpdate[]>({
    queryKey: ["getLeadUpdates", leadId],
    queryFn: () => getLeadUpdates(leadId),
    enabled: !!leadId,
  });
};

export const useInsertLeadUpdate = () => {
  const queryClient = useQueryClient();
  return useMutation<unknown, ErrorResponse, any>({
    mutationFn: insertLeadUpdate,
    mutationKey: ["insertLeadUpdate"],
    onSuccess: () => {
      queryClient.invalidateQueries({
        predicate: (query) =>
          query.queryKey.every((key) =>
            ["getLeadUpdates"].includes(key as string)
          ),
      });
      Toast.show({
        type: "success",
        text1: "Success",
        text2: "Lead Update Added Successfully",
        visibilityTime: 3000,
      });
      router.navigate("/(marketing)/m_lead/m_leadList/");
    },
    onError: (error) => {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: error.errorMessage,
        text2Style: {
          fontSize: 12,
        },
        visibilityTime: 3000,
      });
    },
  });
};

export const useUpdateLeadUpdate = () => {
  const queryClient = useQueryClient();
  return useMutation<unknown, ErrorResponse, any>({
    mutationFn: updateLeadUpdate,
    mutationKey: ["updateLeadUpdate"],
    onSuccess: () => {
      queryClient.invalidateQueries({
        predicate: (query) =>
          query.queryKey.every((key) =>
            ["getLeadUpdates"].includes(key as string)
          ),
      });
      Toast.show({
        type: "success",
        text1: "Success",
        text2: "Lead Update Modified Successfully",
        visibilityTime: 3000,
      });
      router.navigate("/(marketing)/m_lead/m_leadList/");
    },
    onError: (error) => {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: error.errorMessage,
        text2Style: {
          fontSize: 12,
        },
        visibilityTime: 3000,
      });
    },
  });
};
