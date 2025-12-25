import apiClient from "@/utils/axios";

const apiUrl = "/agent/credit-request";

export const getCreditRequests = async (params: any) => {
  return apiClient.get(apiUrl, { params });
};

export const getCreditRequest = async (id: number) => {
  return apiClient.get(`${apiUrl}/${id}`);
};

export const createCreditRequest = async (data: any) => {
  return apiClient.post(apiUrl, data);
};

export const settleCreditRequest = async (data: any) => {
  return apiClient.post(`${apiUrl}/settle`, data);
};

export const updateCreditRequest = async (id: number, data: any) => {
  return apiClient.patch(`${apiUrl}/${id}`, data);
};
