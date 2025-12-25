import apiClient from "@/utils/axios";

const apiUrl = "/orders";

export const getOrders = async (params?: any) => {
  return apiClient.get(`${apiUrl}`, { params });
};

export const getOrder = async (id?: any) => {
  return apiClient.get(`${apiUrl}/${id}`);
};

export const getOrderSearch = async (params?: any) => {
  return apiClient.get(`${apiUrl}/by-search`, { params });
};

export const createOrder = async (data: any) => {
  return apiClient.post(`${apiUrl}/remote`, data);
};

export const createOrderDeposit = async (data: any) => {
  return apiClient.post(`${apiUrl}/deposit`, data);
};

export const updateOrder = async (data: any) => {
  return apiClient.patch(`${apiUrl}/${data.id}`, data);
};

export const payOrderDue = async (OrderCode: string, data: any) => {
  return apiClient.patch(`${apiUrl}/pay-order-due/${OrderCode}`, data);
};

export const payOrder = async (OrderCode: string, data: any) => {
  return apiClient.patch(`${apiUrl}/pay-order/${OrderCode}`, data);
};

export const payOrders = async (data: any) => {
  return apiClient.patch(`${apiUrl}/pay-orders`, data);
};

export const getPartialDueSummary = async () => {
  return apiClient.patch(`${apiUrl}/partial-due-summary`);
};

export const getOrderBySearch = async (value: any) => {
  return apiClient.get(`${apiUrl}/by-search`, {
    params: { searchInput: value || "" },
  });
};
