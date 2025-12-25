import apiClient from "@/utils/axios";

const apiUrl = "/bkash";

export const createBkashPayment = async (data: any) => {
  return apiClient.post(`${apiUrl}/create-payment`, data);
};

export const executeBkashPayment = async (data: any) => {
  return apiClient.post(`${apiUrl}/execute-payment`, data);
};

export const searchBkashTransaction = async (data: any) => {
  return apiClient.post(`${apiUrl}/search-transaction`, data);
};

export const getBkashPayment = async (paymentID: string) => {
  return apiClient.get(`${apiUrl}/query-payment/${paymentID}`);
};
