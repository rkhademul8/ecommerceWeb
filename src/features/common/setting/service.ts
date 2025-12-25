import apiClient from "@/utils/axios";

const apiUrl = "/setting";

export const getEnvironmentMode = async () => {
  return apiClient.get(`${apiUrl}/environment-mode`);
};

export const getEnvironmentMsg = async () => {
  return apiClient.get(`${apiUrl}/environment-msg`);
};

export const getSiteLogo = async () => {
  return apiClient.get(`${apiUrl}/site-logo`);
};
