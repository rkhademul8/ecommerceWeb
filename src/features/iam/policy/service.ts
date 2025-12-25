import apiClient from "@/utils/axios";

const apiUrl = "/policies";

export const getPolicies = async (params?: any) => {
  return apiClient.get(`${apiUrl} `, { params });
};
