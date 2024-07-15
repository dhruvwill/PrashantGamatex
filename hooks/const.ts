import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getConstants } from "~/services/constants";
import { ErrorResponse } from "~/types/query";
import { useUserStore } from "~/store/store";

export const useConstants = () => {
  const queryClient = useQueryClient();
  const token = useUserStore((state) => state.user?.token);

  return useQuery<any, ErrorResponse, ConstData>({
    queryKey: ["getConstants"],
    queryFn: () => getConstants(token),
    enabled: !!token,
  });
};
