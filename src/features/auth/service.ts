import apiClient from "@/utils/axios";
import secureLocalStorage from "react-secure-storage";

export function getJWT() {
  return secureLocalStorage.getItem("accessToken");
}

export function getUserLocal() {
  return secureLocalStorage.getItem("user");
}

export function setUserLocal(user: any) {
  return secureLocalStorage.setItem("user", user);
}

export const isTokenValid = () => {
  const expiresAt = secureLocalStorage.getItem("expiresAt");
  if (!expiresAt) return false;

  const exp = Number(expiresAt);
  const currentTime = Math.floor(Date.now() / 1000);
  return exp > currentTime;
};

export const login = async (data: any) => {
  const result = await apiClient.post("/agent/auth/login", data);

  if (result.data?.payload) {
    const { user, expires_in, expires_at, access_token, refresh_token } =
      result.data.payload;

    secureLocalStorage.setItem("user", user);
    secureLocalStorage.setItem("expiresIn", expires_in);
    secureLocalStorage.setItem("expiresAt", expires_at);
    secureLocalStorage.setItem("accessToken", access_token);
    secureLocalStorage.setItem("refreshToken", refresh_token);
  }

  return result;
};

export const logout = async () => {
  const result = await apiClient.delete("/agent/auth/logout");

  secureLocalStorage.removeItem("user");
  secureLocalStorage.removeItem("expiresIn");
  secureLocalStorage.removeItem("expiresAt");
  secureLocalStorage.removeItem("accessToken");
  secureLocalStorage.removeItem("refreshToken");

  return result;
};

export const register = async (data: any) => {
  return apiClient.post("/agent/auth/minimal-registration", data);
};

export const sendOtpEmail = async (data: any) => {
  return apiClient.post("/agent/auth/send-otp-email", data);
};

export const sendPublicOtp = async (data: any) => {
  return apiClient.post(`/agent/auth/send-otp`, data);
};

export const verifyOtpEmail = async (data: any) => {
  return apiClient.post("/agent/auth/verify-otp-email", data);
};

export const forgotPassword = async (data: any) => {
  return apiClient.post("/agent/auth/forgot-password", data);
};

export const resetPassword = async (data: any) => {
  return apiClient.post("/agent/auth/reset-password", data);
};

export const generateDeviceId = async (data: any) => {
  return apiClient.post("/agent/auth/generate-deviceid", data);
};
