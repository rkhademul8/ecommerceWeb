import apiClient from "@/utils/axios";

const apiUrl = "/agent/deposit-request";

export const getDepositRequests = async (params: any) => {
  return apiClient.get(apiUrl, { params });
};

export const getDepositRequest = async (id: number) => {
  return apiClient.get(`${apiUrl}/${id}`);
};

export const createDepositRequest = async (data: any) => {
  return apiClient.post(apiUrl, data);
};

export const uploadPayslipDeposit = async (id: number, formData: any) => {
  return apiClient.post(`${apiUrl}/upload-payslip/${id}`, formData);
};

export const updateDepositRequest = async (data: any) => {
  return apiClient.patch(`${apiUrl}/${data.id}`, data);
};

export const deleteDepositRequest = async (id: number) => {
  return apiClient.delete(`${apiUrl}/${id}`);
};