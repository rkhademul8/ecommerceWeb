import { useQuery } from "@tanstack/react-query";
import apiClient from "@/utils/axios";

const apiUrl = "/user-account-ledger";

export const useGetUserAccountLedgersQuery = (params?: any) => {
  const { data, error, isLoading, isPending, isFetching, isError } = useQuery({
    queryKey: ["user-account-ledger"],
    queryFn: async () => (await apiClient.get<any>(apiUrl, { params })).data,
  });
  return { data, error, isError, isLoading, isPending, isFetching };
};

export const useGetUserAccountLedgerQuery = (id: number) => {
  const { data, error, isLoading, isPending, isFetching, isError } = useQuery({
    queryKey: ["user-account-ledger", id],
    enabled: !!id,
    queryFn: async () => (await apiClient.get<any>(`${apiUrl}/${id}`)).data,
  });

  return { data, error, isError, isLoading, isPending, isFetching };
};
 