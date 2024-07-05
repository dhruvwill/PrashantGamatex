import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Toast from "react-native-toast-message";
import {
  getInquiryFollowups,
  getQuotationFollowups,
  insertInquiryFollowup,
  insertQuotationFollowup,
} from "~/services/followup";
import {
  SalesFollowupInsert,
  SalesInquiryFollowup,
  SalesQuotationFollowup,
} from "~/types/followup";
import { ErrorResponse } from "~/types/query";

export const useInquiryFollowup = () => {
  return useQuery<any, ErrorResponse, SalesInquiryFollowup[]>({
    queryKey: ["getInquiryFollowups"],
    queryFn: getInquiryFollowups,
  });
};

export const useQuotationFollowup = () => {
  return useQuery<any, ErrorResponse, SalesQuotationFollowup[]>({
    queryKey: ["getQuotationFollowups"],
    queryFn: getQuotationFollowups,
  });
};

export const useInsertInquiryFollowup = () => {
  const queryClient = useQueryClient();
  return useMutation<unknown, ErrorResponse, SalesFollowupInsert>({
    mutationFn: insertInquiryFollowup,
    mutationKey: ["insertInquiryFollowup"],
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["getQuotationFollowups", "getInquiryFollowups"],
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

export const useInsertQuotationFollowup = () => {
  const queryClient = useQueryClient();
  return useMutation<unknown, ErrorResponse, SalesFollowupInsert>({
    mutationFn: insertQuotationFollowup,
    mutationKey: ["insertQuotationFollowup"],
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["getQuotationFollowups", "getInquiryFollowups"],
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
