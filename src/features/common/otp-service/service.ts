import apiClient from "@/utils/axios";

const apiUrl = "/otp-service";

export const getOtpServices = async (params?: any) => {
  return apiClient.get(apiUrl, { params });
};

export const getOtpServiceByType = async (serviceType: any) => {
  return apiClient.get(`${apiUrl}/${serviceType}`);
};

export const createOtpService = async (data: any) => {
  return apiClient.post(apiUrl, data);
};

export const sendOtp = async (data: any) => {
  return apiClient.post(`${apiUrl}/send-otp`, data);
};

export const verifyOtp = async (data: any) => {
  return apiClient.post(`${apiUrl}/verify-otp`, data);
};

export const publicVerifyOtp = async (data: any) => {
  return apiClient.post(`${apiUrl}/public-verify-otp`, data);
};

export const updateOtpService = async (data: any) => {
  return apiClient.patch(`${apiUrl}/${data.id}`, data);
};
