import Axios from "axios";
import { ApiError } from "../api-utils";
import { getJWT, getUserLocal } from "@/features/auth/service";
import { publicEndpoints } from "@/constants/public-endpoint";
import Cookies from "js-cookie";

const apiClient = Axios.create({
  baseURL: "/api",
  timeout: 120000,
  withCredentials: true,
});

apiClient.interceptors.request.use(
  async (config) => {
    if (
      config.url &&
      !publicEndpoints.find((endpoint) => config.url?.includes(endpoint))
    ) {
      const token = getJWT();
      if (token) config.headers.Authorization = `Bearer ${token}`;
    }

    if (config.url?.includes("/agent/auth/login")) {
      const email = config.data?.email;
      const emailPrefix = email.split("@")[0];
      const deviceId = Cookies.get(emailPrefix) || null;
      config.headers["DeviceIdentificationId"] = deviceId;
    }

    if (config.url?.includes("/agent/auth/logout")) {
      const user: any = getUserLocal();
      const email = user?.email;
      const emailPrefix = email.split("@")[0];
      const deviceId = Cookies.get(emailPrefix) || null;      
      config.headers["DeviceIdentificationId"] = deviceId;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (res) => res,
  (error) => {
    const { data, status } = error.response || {};    
    const message =  data?.error?.message || data?.message || error.message || "Something went wrong";
    const code = data?.statusCode || status || error.code || 500;
    
    return Promise.reject(new ApiError(message, code));
  }
);

export default apiClient;
