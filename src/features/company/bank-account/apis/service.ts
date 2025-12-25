import apiClient from "@/utils/axios";

const apiUrl = "company/bank-accounts";

export const getBankAccounts = async () => {
  return apiClient.get(apiUrl);
};

export const getBankAccount = async (id: number) => {
  return apiClient.get(`${apiUrl}/${id}`);
};
