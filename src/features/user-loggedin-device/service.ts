import apiClient from "@/utils/axios";

const apiUrl = "/user-loggedin-device";

export const getByDeviceId = async (deviceId: string) => {
  return apiClient.get(`${apiUrl}/deviceId/${deviceId}`);
};
