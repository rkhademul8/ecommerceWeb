import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/utils/axios";

const apiUrl = "agent/staff";

export const useGetStaffsQuery = (params?: any) => {
  const { data, error, isLoading, isPending, isFetching, isError } = useQuery({
    queryKey: ["staff"],
    queryFn: async () => (await apiClient.get<any>(apiUrl, { params })).data,
    enabled: false,
  });
  return { data, error, isError, isLoading, isPending, isFetching };
};

export const useGetStaffQuery = (id: number | string) => {
  const { data, error, isLoading, isPending, isFetching, isError } = useQuery({
    queryKey: ["staff", id],
    enabled: !!id,
    queryFn: async () => (await apiClient.get<any>(`${apiUrl}/${id}`)).data,
  });

  return { data, error, isError, isLoading, isPending, isFetching };
};

export const useCreateStaffMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["add-staff"],
    mutationFn: async (body: any) => (await apiClient.post(apiUrl, body)).data,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["staff"] });
    },
    onError: (error) => {
      console.error("Error creating staff:", error);
    },
  });
};

export const useUpdateStaffMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["update-staff"],
    mutationFn: async ({ id, ...patch }: any) =>
      (await apiClient.put(`${apiUrl}/${id}`, patch)).data,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["staff"] });
    },
    onError: (error) => {
      console.error("Error updating staff:", error);
    },
  });
};

export const useDeleteStaffMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["delete-staff"],
    mutationFn: async (id: string | number) =>
      (await apiClient.delete(`${apiUrl}/${id}`))?.data,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["staff"] });
    },
    onError: (error) => {
      console.error("Error deleting staff:", error);
    },
  });
};
