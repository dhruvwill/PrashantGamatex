import { useQuery } from "@tanstack/react-query";
import { getCalendar } from "~/services/calendar";
import { useUserStore } from "~/store";
import { ErrorResponse } from "~/types/query";

export const useCalendar = () => {
  const token = useUserStore((state) => state.user?.token);
  return useQuery<any, ErrorResponse, any>({
    queryKey: ["getCalendar"],
    queryFn: () => getCalendar(token),
    enabled: !!token,
  });
};
