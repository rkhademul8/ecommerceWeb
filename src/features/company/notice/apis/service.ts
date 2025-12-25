import apiClient from "@/utils/axios";

export const getNotices = async (params?: any) => {
  return apiClient.get(`/company/notices`, { params });
};

export const getPublicNotices = async (params?: any) => {
  return apiClient.get(`/company/notices/public`, { params });
};
