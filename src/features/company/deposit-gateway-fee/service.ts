import apiClient from "@/utils/axios";

const apiUrl = "agent/deposit-gateway-fee";

export const getGatewayFeeSlot = async (data: any) => {
  return apiClient.get(`${apiUrl}/check-fee`, { params: data });
};
