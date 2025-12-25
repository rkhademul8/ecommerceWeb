import apiClient from "@/utils/axios";

const apiUrl = "/agent/bank-accounts";

export const getUserBankAccounts = async (params?: any) => {
  return apiClient.get(apiUrl, { params });
};

export const getUserBankAccount = async (id: number) => {
  return apiClient.get(`${apiUrl}/${id}`);
};

export const createUserBankAccount = async (data: any) => {
  return apiClient.post(apiUrl, data);
};

export const updateUserBankAccount = async (data: any) => {
  return apiClient.patch(`${apiUrl}/${data.id}`, data);
};

export const deleteUserBankAccount = async (id: number) => {
  return apiClient.delete(`${apiUrl}/${id}`);
};
