import { useMutation, useQueryClient } from "@tanstack/react-query";
import { insertLead } from "~/services/lead";
import { ErrorResponse } from "~/types/auth";

export const useInsertLead = () => {
  const queryClient = useQueryClient();
  return useMutation<unknown, ErrorResponse, LeadInsertData>({
    mutationFn: insertLead,
    mutationKey: ["insertLead"],
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["getLeads"],
      });
    },
  });
};
