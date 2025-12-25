import { useQuery } from '@tanstack/react-query';
import apiClient from '@/utils/axios';

export const useGetEnvModeQuery = () => {
  const { data, error, isLoading, isPending, isFetching, isError } = useQuery({
    queryKey: ['env-mode'],
    queryFn: async () =>
      (await apiClient.get('/setting/environment-mode')).data,
  });
  return { data, error, isError, isLoading, isPending, isFetching };
};
