import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/utils/axios";

const apiUrl = "/agent/bank-accounts";

export const useGetUserBankAccountsQuery = (params?: any) => {
  const { data, error, isLoading, isPending, isFetching, isError } = useQuery({
    queryKey: ["user-bank-account"],
    queryFn: async () => (await apiClient.get<any>(apiUrl, { params })).data,
  });
  return { data, error, isError, isLoading, isPending, isFetching };
};

export const useGetUserBankAccountQuery = (id: number) => {
  const { data, error, isLoading, isPending, isFetching, isError } = useQuery({
    queryKey: ["user-bank-account", id],
    enabled: !!id,
    queryFn: async () => (await apiClient.get<any>(`${apiUrl}/${id}`)).data,
  });

  return { data, error, isError, isLoading, isPending, isFetching };
};

export const useCreateCategoryMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["add-user-bank-account"],
    mutationFn: async (body: any) => (await apiClient.post(apiUrl, body)).data,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-bank-account"] });
    },
    onError: (error) => {
      console.error("Error creating user-bank-account:", error);
    },
  });
};

export const useUpdateUserBankAccountMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["update-user-bank-account"],
    mutationFn: async ({ id, ...patch }: any) =>
      (await apiClient.put(`${apiUrl}/${id}`, patch)).data,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-bank-account"] });
    },
    onError: (error) => {
      console.error("Error updating user-bank-account:", error);
    },
  });
};

export const useDeleteUserBankAccountMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["delete-user-bank-account"],
    mutationFn: async (id: string | number) =>
      (await apiClient.delete(`${apiUrl}/${id}`))?.data,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-bank-account"] });
    },
    onError: (error) => {
      console.error("Error deleting user-bank-account:", error);
    },
  });
};
