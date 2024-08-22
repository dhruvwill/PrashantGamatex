import { getDashboard } from './../services/dashboard';
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ErrorResponse } from "~/types/query";
import { useUserStore } from "~/store/store";

export const useDashboard = () => {
  const queryClient = useQueryClient();
  const token = useUserStore((state) => state.user?.token);

  return useQuery<any, ErrorResponse, DashboardData>({
    queryKey: ["getDashboard"],
    queryFn: () => getDashboard(token),
    enabled: !!token,
  });
};
