import { useQuery } from "@tanstack/react-query";
import apiClient from "@/utils/axios";

export const useGetNoticesQuery = (searchInput?: string) => {
  const params = { searchInput: searchInput };
  const { data, error, isLoading, isPending, isFetching, isError } = useQuery({
    queryKey: ["banner-slider"],
    queryFn: async () =>
      (await apiClient.get("/company/notices", { params }))
        .data,
  });
  return { data, error, isError, isLoading, isPending, isFetching };
};


