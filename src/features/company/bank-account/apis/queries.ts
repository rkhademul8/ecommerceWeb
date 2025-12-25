import { useQuery } from "@tanstack/react-query";
import apiClient from "@/utils/axios";

const apiUrl = "company/bank-accounts";

export const useGetBankAccountsQuery = (filters?: { name?: string }) => {
  const { data, error, isLoading, isPending, isFetching, isError } = useQuery({
    queryKey: ["bank-account"],
    queryFn: async () =>
      (
        await apiClient.get<any>(apiUrl, {
          params: filters,
        })
      ).data,
  });
  return { data, error, isError, isLoading, isPending, isFetching };
};

export const useGetBankAccountChargeQuery = () => {
  const { data, error, isLoading, isPending, isFetching, isError } = useQuery({
    queryKey: ["bank-account-charge"],
    queryFn: async () => (await apiClient.get<any>(`${apiUrl}/charge`)).data,
  });

  return { data, error, isError, isLoading, isPending, isFetching };
};
