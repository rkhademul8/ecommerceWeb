import apiClient from "@/utils/axios";

const apiUrl = "/users";

export const getMe = async () => {
  return apiClient.get(`${apiUrl}/find-me`);
};

export const updateMe = async (data: any) => {
  return apiClient.patch(`${apiUrl}/update-me`, data);
};
