import apiClient from "@/utils/axios";

const apiUrl = "agent/staff";

export const getStaffs = async (params: any) => {
  return apiClient.get(apiUrl, { params });
};

export const getStaff = async (id: number) => {
  return apiClient.get(`${apiUrl}/${id}`);
};

export const createStaff = async (data: any) => {
  return apiClient.post(apiUrl, data);
};

export const updateStaff = async (data: any) => {
  return apiClient.patch(`${apiUrl}/${data.id}`, data);
};

export const deleteStaff = async (id: number) => {
  return apiClient.delete(`${apiUrl}/${id}`);
};
