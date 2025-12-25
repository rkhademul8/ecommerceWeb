import apiClient from "@/utils/axios";

const apiUrl = "/agent/account-ledger";

export const getUserAccountLedgers = async (params: any) => {
  return apiClient.get(apiUrl, { params });
};

export const getUserAccountLedger = async (id: number) => {
  return apiClient.get(`${apiUrl}/${id}`);
};

export const getUserLedgerSummary = async () => {
  return apiClient.get(`${apiUrl}/summary`);
};
