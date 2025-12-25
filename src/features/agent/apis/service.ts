import apiClient from "@/utils/axios";
import secureLocalStorage from "react-secure-storage";

const apiUrl = "agent";

export const agentLoginWithToken = async (data: any) => {
  const result = await apiClient.post(`${apiUrl}/auth/login-with-token`, data);

  if (result.data?.payload) {
    const { user, expires_in, expires_at, access_token, refresh_token } = result.data.payload;

    secureLocalStorage.setItem("user", user);
    secureLocalStorage.setItem("expiresIn", expires_in);
    secureLocalStorage.setItem("expiresAt", expires_at);
    secureLocalStorage.setItem("accessToken", access_token);
    secureLocalStorage.setItem("refreshToken", refresh_token);
  }

  return result;
};

export const uploadLogo = async (data: any) => {
  return apiClient.post(`${apiUrl}/upload-company-logo`, data);
};

export const uploadNid = async (data: any) => {
  return apiClient.post(`${apiUrl}/upload-nid-copy`, data);
};

export const uploadAddressProof = async (data: any) => {
  return apiClient.post(`${apiUrl}/upload-address-proof`, data);
};

export const uploadTradeLicense = async (data: any) => {
  return apiClient.post(`${apiUrl}/upload-trade-license`, data);
};

export const uploalCivilAviationCertificate = async (data: any) => {
  return apiClient.post(`${apiUrl}/upload-civil-aviation-cert`, data);
};

export const uploadAdditionaldocs = async (data: any) => {
  return apiClient.post(`${apiUrl}/upload-additional-docs`, data);
};

export const getMeAgent = async () => {
  return apiClient.get(`${apiUrl}/find-me`);
};

export const getMeWallet = async () => {
  return apiClient.get(`${apiUrl}/wallet-me`);
};

export const updateMeAgent = async (data: any) => {
  return apiClient.patch(`${apiUrl}/update-me`, data);
};
