import apiClient from "@/utils/axios";

const apiUrl = "/roles";

export const getRoles = async (params?: any) => {
  return apiClient.get(apiUrl, { params });
};

export const getRole = async (id: number) => {
  return apiClient.get(`${apiUrl}/${id}`);
};

export const createRole = async (data: any) => {
  return apiClient.post(apiUrl, data);
};

export const updateRole = async (data: any) => {
  return apiClient.patch(`${apiUrl}/${data.id}`, data);
};

export const deleteRole = async (id: number) => {
  return apiClient.delete(`${apiUrl}/${id}`);
};
