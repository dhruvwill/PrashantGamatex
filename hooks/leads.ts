import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getAllLeads, insertLead, updateLead } from "~/services/lead";
import { ErrorResponse } from "~/types/auth";
import Toast from "react-native-toast-message";

export const useLeads = () => {
  return useQuery<any, ErrorResponse, LeadData[]>({
    queryKey: ["getAllLeads"],
    queryFn: getAllLeads,
  });
};

export const useInsertLead = () => {
  const queryClient = useQueryClient();
  return useMutation<unknown, ErrorResponse, LeadInsertData>({
    mutationFn: insertLead,
    mutationKey: ["insertLead"],
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["getAllLeads"],
      });
      Toast.show({
        type: "success",
        text1: "Success",
        text2: "Lead Added Successfully",
        visibilityTime: 3000,
      });
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
  return useMutation<unknown, ErrorResponse, LeadUpdateData>({
    mutationFn: updateLead,
    mutationKey: ["updateLead"],
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["getAllLeads"],
      });
      Toast.show({
        type: "success",
        text1: "Success",
        text2: "Lead Updated Successfully",
        visibilityTime: 3000,
      });
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
