import apiClient from "@/utils/axios";

export const getBanners = async (params?: any) => {
  return apiClient.get(`/company/banners`, { params });
};
