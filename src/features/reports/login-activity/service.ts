import apiClient from "@/utils/axios";

const apiUrl = "/user-loggedin-activity";

export const getLoginActivities = async (params?: any) => {
  return apiClient.get(apiUrl, { params });
};
 