import { getDashboard } from "./../services/dashboard";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ErrorResponse } from "~/types/query";
import { useAppStore, useUserStore } from "~/store/store";

export const useDashboard = () => {
  console.log("useDashboard hook");
  const token = useUserStore((state) => state.user?.token);
  const timeframe = useAppStore((state) => state.timeframe);
  return useQuery<any, ErrorResponse, any>({
    queryKey: ["getDashboard"],
    queryFn: () => getDashboard(token, timeframe),
    enabled: !!token,
  });
};
