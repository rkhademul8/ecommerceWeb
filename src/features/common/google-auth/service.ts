import apiClient from "@/utils/axios";

export const generateGoogleAuthQR = async () => {
  return apiClient.post("/2fa/ga-generate-qr", null, {
    responseType: "blob",
  });
};

export const turnOnGoogleAuth = async (data: any) => {
  return apiClient.post("/2fa/ga-turn-on-qr", data);
};

export const verifyGoogleAuth = async (data: any) => {
  return apiClient.post("/2fa/ga-verify", data);
};


export const publicVerifyGoogleAuth = async (data: any) => {
  return apiClient.post("/2fa/public-ga-verify", data);
};