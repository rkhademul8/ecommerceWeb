import { useQuery } from "@tanstack/react-query";
import apiClient from "@/utils/axios";

export const useGetBannerQuery = (params: any) => {
  const { data, error, isLoading, isPending, isFetching, isError } = useQuery({
    queryKey: ["banner", params],
    queryFn: async () =>
      (await apiClient.get(`/company/banners`, { params })).data,
  });
  return { data, error, isError, isLoading, isPending, isFetching };
};
