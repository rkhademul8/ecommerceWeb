import apiClient from "@/utils/axios";

const apiUrl = "/transactions";

export const getTransactions = async (params: any) => {
  return apiClient.get(apiUrl, { params });
};

export const getTransaction = async (id: number) => {
  return apiClient.get(`${apiUrl}/${id}`);
};

export const updateTransaction = async (paymentId: any, data: any) => {
  return apiClient.patch(`${apiUrl}/${paymentId}`, data);
};
