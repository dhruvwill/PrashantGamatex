import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getAllLeads, insertLead } from "~/services/lead";
import { ErrorResponse } from "~/types/auth";

export const useLeads = () => {
  return useQuery<any, ErrorResponse, any>({
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
    },
  });
};
